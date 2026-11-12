-- Additive cleaner-only subscription enforcement; existing policies remain intact.
CREATE FUNCTION private.cleaner_subscription_allowed() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
SELECT CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role='cleaner') THEN coalesce((public.current_subscription_access()->>'active')::boolean,false) ELSE true END $$;
REVOKE ALL ON FUNCTION private.cleaner_subscription_allowed() FROM PUBLIC,anon;GRANT EXECUTE ON FUNCTION private.cleaner_subscription_allowed() TO authenticated;
DO $$ DECLARE d text;BEGIN
 d:=pg_get_functiondef('public.cleaner_workspace()'::regprocedure);
 IF position('return jsonb_build_object' IN d)=0 THEN RAISE EXCEPTION 'Unexpected workspace definition';END IF;
 d:=replace(d,'return jsonb_build_object',E'IF NOT private.cleaner_subscription_allowed() THEN RAISE EXCEPTION ''Workspace subscription expired or cancelled'' USING ERRCODE=''42501''; END IF;\n return jsonb_build_object');EXECUTE d;
END $$;
CREATE POLICY cleaner_subscription_required ON public.jobs AS RESTRICTIVE FOR ALL TO authenticated USING(private.cleaner_subscription_allowed()) WITH CHECK(private.cleaner_subscription_allowed());
CREATE POLICY cleaner_subscription_required ON public.messages AS RESTRICTIVE FOR ALL TO authenticated USING(private.cleaner_subscription_allowed()) WITH CHECK(private.cleaner_subscription_allowed());
CREATE POLICY cleaner_subscription_required ON public.notifications AS RESTRICTIVE FOR ALL TO authenticated USING(private.cleaner_subscription_allowed()) WITH CHECK(private.cleaner_subscription_allowed());
CREATE POLICY cleaner_subscription_required ON public.job_photo_documentation AS RESTRICTIVE FOR ALL TO authenticated USING(private.cleaner_subscription_allowed()) WITH CHECK(private.cleaner_subscription_allowed());
CREATE POLICY cleaner_subscription_required ON public.staff_absences AS RESTRICTIVE FOR ALL TO authenticated USING(private.cleaner_subscription_allowed()) WITH CHECK(private.cleaner_subscription_allowed());
CREATE POLICY cleaner_subscription_required ON public.incidents AS RESTRICTIVE FOR ALL TO authenticated USING(private.cleaner_subscription_allowed()) WITH CHECK(private.cleaner_subscription_allowed());
CREATE POLICY cleaner_subscription_required ON storage.objects AS RESTRICTIVE FOR ALL TO authenticated USING(bucket_id<>'cleaner-proofs' OR private.cleaner_subscription_allowed()) WITH CHECK(bucket_id<>'cleaner-proofs' OR private.cleaner_subscription_allowed());
CREATE FUNCTION private.guard_cleaner_subscription_write() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ BEGIN
IF NOT private.cleaner_subscription_allowed() THEN RAISE EXCEPTION 'Workspace subscription expired or cancelled' USING ERRCODE='42501';END IF;RETURN NEW;END $$;
REVOKE ALL ON FUNCTION private.guard_cleaner_subscription_write() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER cleaner_subscription_guard BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION private.guard_cleaner_subscription_write();
