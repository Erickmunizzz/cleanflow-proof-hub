-- Keep extension-owned objects in their existing schema; restrict direct network access.
REVOKE USAGE ON SCHEMA net FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA net FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA net FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA net TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA net TO service_role;
-- Only replace the application's former brand, never arbitrary customer names.
UPDATE public.companies SET name='CleanMa' WHERE lower(trim(name)) IN ('cleanflow uk','cleanflow','cleanma uk','cleanmaap','cleanmaapp');
UPDATE public.company_settings SET company_name='CleanMa' WHERE lower(trim(company_name)) IN ('cleanflow uk','cleanflow','cleanma uk','cleanmaap','cleanmaapp');
