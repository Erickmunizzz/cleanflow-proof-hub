-- Preserve existing quota functions and RLS; align their existing plan source.
CREATE FUNCTION private.sync_subscription_plan() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NEW.status IN ('active','trialing') THEN
 UPDATE public.companies SET plan=NEW.plan WHERE id=NEW.company_id AND plan IS DISTINCT FROM NEW.plan;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION private.sync_subscription_plan() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER subscription_plan_limits AFTER INSERT OR UPDATE OF plan,status ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION private.sync_subscription_plan();
UPDATE public.companies c SET plan=s.plan FROM public.subscriptions s WHERE c.id=s.company_id AND s.status IN ('active','trialing') AND c.plan IS DISTINCT FROM s.plan;
