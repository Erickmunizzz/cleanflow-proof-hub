CREATE TABLE IF NOT EXISTS public.subscriptions(company_id uuid PRIMARY KEY REFERENCES public.companies(id),plan text NOT NULL DEFAULT 'starter' CHECK(plan IN ('starter','growth','scale')),status text NOT NULL DEFAULT 'inactive' CHECK(status IN ('active','inactive','trialing','past_due','cancelled')),current_period_end timestamptz,trial_ends_at timestamptz,updated_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.subscriptions TO authenticated;
REVOKE INSERT,UPDATE,DELETE ON public.subscriptions FROM authenticated,anon;
CREATE POLICY subscriptions_member_read ON public.subscriptions FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=auth.uid() AND p.company_id=subscriptions.company_id AND p.is_active));
CREATE TABLE IF NOT EXISTS public.staff_invites(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),company_id uuid NOT NULL REFERENCES public.companies(id),email text NOT NULL,token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(32),'hex'),expires_at timestamptz NOT NULL DEFAULT now()+interval '7 days',accepted_at timestamptz,created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id));
ALTER TABLE public.staff_invites ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT ON public.staff_invites TO authenticated;
CREATE POLICY staff_invites_owner_read ON public.staff_invites FOR SELECT TO authenticated USING(private.is_company_owner(company_id));
CREATE POLICY staff_invites_owner_insert ON public.staff_invites FOR INSERT TO authenticated WITH CHECK(created_by=auth.uid() AND private.is_company_owner(company_id) AND EXISTS(SELECT 1 FROM public.subscriptions s WHERE s.company_id=staff_invites.company_id AND (s.status='active' AND (s.current_period_end IS NULL OR s.current_period_end>now()) OR s.status='trialing' AND s.trial_ends_at>now())));
INSERT INTO public.subscriptions(company_id,plan,status) SELECT p.company_id,'scale','active' FROM public.profiles p JOIN auth.users u ON u.id=p.id WHERE lower(u.email)='royyallstore@gmail.com' AND p.role='owner' AND p.is_active ON CONFLICT(company_id) DO NOTHING;
CREATE FUNCTION public.accept_staff_invite(invite_token text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE i public.staff_invites; account_email text;
BEGIN
 SELECT email INTO account_email FROM auth.users WHERE id=auth.uid();
 IF account_email IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
 SELECT * INTO i FROM public.staff_invites WHERE token=invite_token AND accepted_at IS NULL AND expires_at>now() FOR UPDATE;
 IF i.id IS NULL OR lower(account_email) IS DISTINCT FROM lower(i.email) THEN RAISE EXCEPTION 'Invalid or expired invitation'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.subscriptions WHERE company_id=i.company_id AND (status='active' AND (current_period_end IS NULL OR current_period_end>now()) OR status='trialing' AND trial_ends_at>now())) THEN RAISE EXCEPTION 'Company subscription is not active'; END IF;
 IF EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid()) THEN RAISE EXCEPTION 'Account already belongs to a workspace'; END IF;
 INSERT INTO public.profiles(id,company_id,role,is_active,full_name) VALUES(auth.uid(),i.company_id,'cleaner',true,split_part(account_email,'@',1));
 INSERT INTO public.staff(company_id,profile_id,name,is_active) VALUES(i.company_id,auth.uid(),split_part(account_email,'@',1),true);
 UPDATE public.staff_invites SET accepted_at=now() WHERE id=i.id;
END $$;
REVOKE ALL ON FUNCTION public.accept_staff_invite(text) FROM PUBLIC,anon;GRANT EXECUTE ON FUNCTION public.accept_staff_invite(text) TO authenticated;
