CREATE OR REPLACE FUNCTION private.audit_operation() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE old_row jsonb; new_row jsonb; tenant uuid; fields text[];
BEGIN
 if TG_OP <> 'INSERT' then old_row=to_jsonb(OLD); end if;
 if TG_OP <> 'DELETE' then new_row=to_jsonb(NEW); end if;
 tenant=nullif(coalesce(new_row,old_row)->>'company_id','')::uuid;
 if tenant is null then return coalesce(NEW,OLD); end if;
 if TG_OP='UPDATE' then
 select array_agg(key order by key) into fields from jsonb_object_keys(new_row) key where (new_row->key) is distinct from (old_row->key);
 if fields is null then return NEW; end if;
 end if;
 if not exists(select 1 from public.companies where id=tenant) then return coalesce(NEW,OLD); end if;
 insert into public.activity_events(company_id,actor_id,entity,record_id,action,changed_fields) values(tenant,auth.uid(),TG_TABLE_NAME,coalesce(new_row,old_row)->>'id',lower(TG_OP),coalesce(fields,'{}'));
 return coalesce(NEW,OLD);
END $$;
