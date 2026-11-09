-- The scoped UNIQUE indexes already existed with *_uidx names.
-- Remove only the redundant helper indexes added by the Keys/Safety migration.
drop index if exists public.clients_company_id_id_key;
drop index if exists public.staff_company_id_id_key;
