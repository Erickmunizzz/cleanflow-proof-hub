CREATE OR REPLACE FUNCTION public.cleaner_quick_alert(issue text,note text DEFAULT '') RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE p public.profiles; event_id uuid:=gen_random_uuid();
BEGIN
 SELECT * INTO p FROM public.profiles WHERE id=auth.uid() AND role='cleaner' AND is_active;
 IF p.id IS NULL OR NOT EXISTS(SELECT 1 FROM public.staff WHERE profile_id=p.id AND company_id=p.company_id AND is_active) THEN RAISE EXCEPTION 'Active employee access required' USING ERRCODE='42501'; END IF;
 IF issue IS NULL OR issue NOT IN ('Client absent','Problem at site','Missing materials') OR length(coalesce(note,''))>2000 THEN RAISE EXCEPTION 'Invalid report'; END IF;
 INSERT INTO public.notifications(company_id,user_id,title,message,created_by,source_type,source_id)
 SELECT p.company_id,id,'Employee alert: '||issue,coalesce(p.full_name,'Employee')||': '||issue||CASE WHEN coalesce(note,'')='' THEN '' ELSE E'\n'||note END,p.id,'report',event_id
 FROM public.profiles WHERE company_id=p.company_id AND role='owner' AND is_active;
 IF NOT FOUND THEN RAISE EXCEPTION 'No active manager available'; END IF;
 RETURN event_id;
END $$;
REVOKE ALL ON FUNCTION public.cleaner_quick_alert(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cleaner_quick_alert(text,text) TO authenticated;
