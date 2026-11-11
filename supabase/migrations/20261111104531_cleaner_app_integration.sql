CREATE FUNCTION public.cleaner_workspace() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE p public.profiles; s public.staff;
BEGIN
 select * into p from public.profiles where id=auth.uid() and role='cleaner' and is_active;
 if p.id is null then raise exception 'An active cleaner profile is required' using errcode='42501'; end if;
 select * into s from public.staff where profile_id=p.id and company_id=p.company_id and is_active;
 if s.id is null then raise exception 'Ask your manager to link your active employee record' using errcode='42501'; end if;
 return jsonb_build_object('profile',jsonb_build_object('id',p.id,'name',p.full_name,'company_id',p.company_id),'staff',jsonb_build_object('id',s.id,'name',s.name,'role',s.role,'weekly_hours',s.weekly_hours),
 'managers',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',full_name)),'[]') from public.profiles where company_id=p.company_id and role='owner' and is_active),
 'jobs',(select coalesce(jsonb_agg(jsonb_build_object('id',j.id,'title',j.title,'company_id',j.company_id,'status',j.status,'scheduled_date',j.scheduled_date,'duration_minutes',j.duration_minutes,'checklist',j.checklist,'notes',j.notes,'check_in_at',j.check_in_at,'check_out_at',j.check_out_at,'customer',c.name,'address',concat_ws(', ',c.address,c.city),'contact_name',c.contact_person,'contact_phone',c.phone) order by j.scheduled_date),'[]') from public.jobs j left join public.clients c on c.id=j.client_id and c.company_id=j.company_id where j.staff_id=s.id and j.company_id=p.company_id));
END $$;
REVOKE ALL ON FUNCTION public.cleaner_workspace() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cleaner_workspace() TO authenticated;
-- Permit done flags only; job definitions, labels and assignments remain owner-only.
DO $$ DECLARE definition text; BEGIN
 definition=pg_get_functiondef('private.guard_cleaner_job_update()'::regprocedure);
 definition=replace(definition,'''status'', ''check_in_at''','''checklist'', ''status'', ''check_in_at''');
 definition=replace(definition,'  if old.status = ''scheduled''', E'  if new.checklist is distinct from old.checklist then\n    if old.status <> ''in_progress'' or new.status <> old.status or jsonb_typeof(new.checklist) <> ''array'' or jsonb_array_length(new.checklist) <> jsonb_array_length(old.checklist) then raise exception ''Invalid checklist update''; end if;\n    if exists(select 1 from jsonb_array_elements(new.checklist) with ordinality a(v,i) join jsonb_array_elements(old.checklist) with ordinality b(v,i) using(i) where (a.v-''done'') is distinct from (b.v-''done'') or jsonb_typeof(a.v->''done'') is distinct from ''boolean'') then raise exception ''Only checklist completion can be changed''; end if;\n    if (to_jsonb(new)-array[''checklist'',''updated_at'']) is distinct from (to_jsonb(old)-array[''checklist'',''updated_at'']) then raise exception ''Checklist changes must be separate from attendance''; end if;\n    new.updated_at=now(); return new;\n  end if;\n  if old.status = ''scheduled''');
 execute definition;
END $$;
-- Lookup avoids hiding owners behind profile RLS without exposing their profiles.
CREATE FUNCTION private.is_active_owner_user(tenant uuid,target uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$ select exists(select 1 from public.profiles where id=target and company_id=tenant and role='owner' and is_active) $$;
REVOKE ALL ON FUNCTION private.is_active_owner_user(uuid,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_active_owner_user(uuid,uuid) TO authenticated;
ALTER POLICY messages_cleaner_insert_to_owner ON public.messages WITH CHECK(sender_id=auth.uid() and private.is_company_cleaner(company_id) and private.is_active_owner_user(company_id,recipient_id));
ALTER POLICY incidents_company_cleaner_select ON public.incidents USING(private.is_company_cleaner(company_id) and reported_by=auth.uid());
CREATE POLICY cleaner_photo_read ON public.job_photo_documentation FOR SELECT TO authenticated USING(exists(select 1 from public.jobs j where j.id=job_id and j.company_id=job_photo_documentation.company_id and private.is_assigned_staff(j.staff_id,j.company_id)));
CREATE POLICY cleaner_photo_insert ON public.job_photo_documentation FOR INSERT TO authenticated WITH CHECK(created_by=auth.uid() and photo_url like 'cleaner-proofs/'||company_id::text||'/'||job_id::text||'/'||auth.uid()::text||'/%' and exists(select 1 from public.jobs j where j.id=job_id and j.company_id=job_photo_documentation.company_id and j.status='in_progress' and private.is_assigned_staff(j.staff_id,j.company_id)));
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES('cleaner-proofs','cleaner-proofs',false,10485760,ARRAY['image/jpeg','image/png','image/webp']) ON CONFLICT(id) DO NOTHING;
CREATE FUNCTION private.can_access_proof(path text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
select exists(select 1 from public.jobs j where j.company_id::text=split_part(path,'/',1) and j.id::text=split_part(path,'/',2) and (private.is_company_owner(j.company_id) or (private.is_assigned_staff(j.staff_id,j.company_id) and split_part(path,'/',3)=auth.uid()::text)))
$$;
REVOKE ALL ON FUNCTION private.can_access_proof(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.can_access_proof(text) TO authenticated;
CREATE POLICY proof_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='cleaner-proofs' and private.can_access_proof(name));
CREATE POLICY proof_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='cleaner-proofs' and private.can_access_proof(name));
CREATE POLICY proof_delete ON storage.objects FOR DELETE TO authenticated USING(bucket_id='cleaner-proofs' and private.can_access_proof(name));
CREATE POLICY cleaner_absences_read ON public.staff_absences FOR SELECT TO authenticated USING(private.is_assigned_staff(staff_id,company_id));
CREATE POLICY cleaner_absences_request ON public.staff_absences FOR INSERT TO authenticated WITH CHECK(private.is_assigned_staff(staff_id,company_id) and status='pending');
