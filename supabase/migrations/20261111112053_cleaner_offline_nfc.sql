-- Idempotent offline checklist writes; existing RLS and job guard remain authoritative.
CREATE FUNCTION public.cleaner_set_task(target_job uuid, task_index integer, expected_item jsonb, desired_done boolean)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE j public.jobs; BEGIN
 SELECT * INTO j FROM public.jobs WHERE id=target_job FOR UPDATE;
 IF j.id IS NULL OR NOT private.is_assigned_staff(j.staff_id,j.company_id) OR j.status<>'in_progress' THEN RAISE EXCEPTION 'This assigned job is no longer in progress'; END IF;
 IF task_index<0 OR task_index>=jsonb_array_length(j.checklist) OR (j.checklist->task_index-'done') IS DISTINCT FROM (expected_item-'done') THEN RAISE EXCEPTION 'Checklist changed. Review this task before syncing'; END IF;
 IF (j.checklist->task_index->>'done')::boolean IS NOT DISTINCT FROM desired_done THEN RETURN; END IF;
 UPDATE public.jobs SET checklist=jsonb_set(checklist,ARRAY[task_index::text,'done'],to_jsonb(desired_done)) WHERE id=target_job;
END $$;
REVOKE ALL ON FUNCTION public.cleaner_set_task(uuid,integer,jsonb,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cleaner_set_task(uuid,integer,jsonb,boolean) TO authenticated;
CREATE FUNCTION public.cleaner_nfc_attendance(target_job uuid, tag text, action text, latitude double precision, longitude double precision)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE j public.jobs; tag_id uuid; BEGIN
 SELECT * INTO j FROM public.jobs WHERE id=target_job FOR UPDATE;
 IF j.id IS NULL OR NOT private.is_assigned_staff(j.staff_id,j.company_id) THEN RAISE EXCEPTION 'Assigned employee required' USING ERRCODE='42501'; END IF;
 IF latitude IS NULL OR longitude IS NULL OR latitude NOT BETWEEN -90 AND 90 OR longitude NOT BETWEEN -180 AND 180 THEN RAISE EXCEPTION 'Valid GPS coordinates required'; END IF;
 SELECT id INTO tag_id FROM public.nfc_tags WHERE company_id=j.company_id AND tag_code=tag AND is_active AND (job_id=j.id OR (job_id IS NULL AND client_id=j.client_id)) LIMIT 1;
 IF tag_id IS NULL THEN RAISE EXCEPTION 'Tag does not match this assigned location'; END IF;
 IF action='in_progress' AND j.status='scheduled' THEN
 UPDATE public.jobs SET status='in_progress',check_in_latitude=latitude,check_in_longitude=longitude WHERE id=j.id;
 ELSIF action='completed' AND j.status='in_progress' THEN
 UPDATE public.jobs SET status='completed',check_out_latitude=latitude,check_out_longitude=longitude WHERE id=j.id;
 ELSE RAISE EXCEPTION 'Invalid attendance transition'; END IF;
 UPDATE public.nfc_tags SET last_scanned_at=now() WHERE id=tag_id;
END $$;
REVOKE ALL ON FUNCTION public.cleaner_nfc_attendance(uuid,text,text,double precision,double precision) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cleaner_nfc_attendance(uuid,text,text,double precision,double precision) TO authenticated;
ALTER POLICY notifications_recipient_select ON public.notifications USING(user_id=auth.uid() AND (private.is_company_owner(company_id) OR private.is_company_cleaner(company_id)));
ALTER POLICY notifications_recipient_read ON public.notifications USING(user_id=auth.uid() AND (private.is_company_owner(company_id) OR private.is_company_cleaner(company_id))) WITH CHECK(user_id=auth.uid() AND (private.is_company_owner(company_id) OR private.is_company_cleaner(company_id)));
