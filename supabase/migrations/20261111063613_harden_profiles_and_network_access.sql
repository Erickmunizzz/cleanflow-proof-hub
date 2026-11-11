-- Both profile foreign keys are already covered:
-- profiles_pkey(id) and profiles_company_id_id_key(company_id,id).
-- Keep the constraint-backed index and remove its redundant standalone copy.
DROP INDEX IF EXISTS public.profiles_company_id_id_uidx;
-- pg_net objects belong to supabase_admin. Permission changes must be applied
-- by the platform administrator; postgres cannot revoke those grants here.
