-- Additive change: existing RLS and Auth are unchanged.
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS sender_name text;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS sender_name text;
CREATE OR REPLACE FUNCTION private.manager_display_name(person uuid,tenant uuid) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT 'Manager - '||coalesce(nullif(btrim(p.full_name),''),upper(left(split_part(u.email,'@',1),1))||substring(split_part(u.email,'@',1) from 2))
 FROM public.profiles p JOIN auth.users u ON u.id=p.id WHERE p.company_id=tenant AND p.role='owner' AND p.is_active
 ORDER BY (p.id=person) DESC,p.id LIMIT 1 $$;
REVOKE ALL ON FUNCTION private.manager_display_name(uuid,uuid) FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION private.persist_manager_identity() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF TG_OP='UPDATE' THEN NEW.sender_name:=OLD.sender_name;RETURN NEW;END IF;
 IF TG_TABLE_NAME='messages' THEN
  IF EXISTS(SELECT 1 FROM public.profiles WHERE id=NEW.sender_id AND company_id=NEW.company_id AND role='owner') THEN NEW.sender_name:=private.manager_display_name(NEW.sender_id,NEW.company_id);
  ELSE SELECT full_name INTO NEW.sender_name FROM public.profiles WHERE id=NEW.sender_id AND company_id=NEW.company_id;END IF;
 ELSE NEW.sender_name:=private.manager_display_name(NEW.created_by,NEW.company_id); END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION private.persist_manager_identity() FROM PUBLIC,anon,authenticated;
UPDATE public.messages m SET sender_name=private.manager_display_name(m.sender_id,m.company_id) WHERE sender_name IS NULL AND EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=m.sender_id AND p.role='owner' AND p.company_id=m.company_id);
UPDATE public.notifications n SET sender_name=private.manager_display_name(n.created_by,n.company_id) WHERE sender_name IS NULL;
CREATE TRIGGER persist_message_manager BEFORE INSERT OR UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION private.persist_manager_identity();
CREATE TRIGGER persist_notification_manager BEFORE INSERT OR UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION private.persist_manager_identity();
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS trial_started_at timestamptz;
UPDATE public.subscriptions SET trial_started_at=coalesce(trial_ends_at-interval '14 days',updated_at),trial_ends_at=least(coalesce(trial_ends_at,updated_at+interval '14 days'),updated_at+interval '14 days'),plan='growth' WHERE status='trialing';
ALTER TABLE public.subscriptions ADD CONSTRAINT growth_trial_fourteen_days CHECK(status<>'trialing' OR (plan='growth' AND trial_started_at IS NOT NULL AND trial_ends_at IS NOT NULL AND trial_ends_at=trial_started_at+interval '14 days'));
CREATE FUNCTION private.provision_growth_trial() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 INSERT INTO public.subscriptions(company_id,plan,status,trial_started_at,trial_ends_at) VALUES(NEW.id,'growth','trialing',NEW.created_at,NEW.created_at+interval '14 days') ON CONFLICT(company_id) DO NOTHING;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION private.provision_growth_trial() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER company_growth_trial AFTER INSERT ON public.companies FOR EACH ROW EXECUTE FUNCTION private.provision_growth_trial();
-- Existing companies without subscriptions do not receive a new trial on each login.
INSERT INTO public.subscriptions(company_id,plan,status,trial_started_at,trial_ends_at) SELECT id,'growth','trialing',created_at,created_at+interval '14 days' FROM public.companies ON CONFLICT(company_id) DO NOTHING;
CREATE FUNCTION public.current_subscription_access() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('role',p.role,'plan',CASE WHEN p.id='66665614-7860-4e68-aaf9-3884a0513734' THEN 'scale' ELSE s.plan END,'active',
 p.id IN ('66665614-7860-4e68-aaf9-3884a0513734','5b5737e3-cb3c-4f1e-9f42-1bb791251ef7') OR coalesce((s.status='active' AND (s.current_period_end IS NULL OR s.current_period_end>now())) OR (s.status='trialing' AND s.plan='growth' AND s.trial_ends_at>now()),false),'trialEndsAt',s.trial_ends_at)
 FROM public.profiles p LEFT JOIN public.subscriptions s ON s.company_id=p.company_id WHERE p.id=auth.uid() AND p.is_active $$;
REVOKE ALL ON FUNCTION public.current_subscription_access() FROM PUBLIC,anon;GRANT EXECUTE ON FUNCTION public.current_subscription_access() TO authenticated;
