ALTER TABLE public.notifications DROP CONSTRAINT notifications_source_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_source_type_check CHECK(source_type IN ('incident','report','job_reminder'));
CREATE TABLE private.reminder_credentials(id boolean PRIMARY KEY DEFAULT true CHECK(id),token_hash text NOT NULL);
REVOKE ALL ON private.reminder_credentials FROM PUBLIC,anon,authenticated;
ALTER TABLE private.reminder_credentials ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.dispatch_daily_cleaner_reminders(secret text) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE inserted integer; local_now timestamp := now() AT TIME ZONE 'Europe/London'; BEGIN
 IF secret IS NULL OR NOT EXISTS(SELECT 1 FROM private.reminder_credentials WHERE token_hash=encode(extensions.digest(secret,'sha256'),'hex')) THEN RAISE EXCEPTION 'Unauthorized scheduler' USING ERRCODE='42501'; END IF;
 IF extract(hour from local_now)<>7 THEN RETURN 0; END IF;
 INSERT INTO public.notifications(company_id,user_id,title,message,source_type,source_id)
 SELECT j.company_id,s.profile_id,'Today’s assigned job',j.title||' · '||to_char(j.scheduled_date AT TIME ZONE 'Europe/London','HH24:MI'), 'job_reminder',j.id
 FROM public.jobs j JOIN public.staff s ON s.id=j.staff_id AND s.company_id=j.company_id AND s.is_active
 JOIN public.profiles p ON p.id=s.profile_id AND p.company_id=j.company_id AND p.role='cleaner' AND p.is_active
 WHERE j.scheduled_date >= local_now::date AT TIME ZONE 'Europe/London' AND j.scheduled_date < (local_now::date+1) AT TIME ZONE 'Europe/London' AND j.status='scheduled'
 ON CONFLICT(user_id,source_type,source_id) DO NOTHING;
 GET DIAGNOSTICS inserted=ROW_COUNT; RETURN inserted;
END $$;
REVOKE ALL ON FUNCTION public.dispatch_daily_cleaner_reminders(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dispatch_daily_cleaner_reminders(text) TO anon,authenticated;
