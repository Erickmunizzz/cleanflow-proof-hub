create table if not exists public.company_settings (
  company_id uuid primary key references public.companies(id) on delete cascade,
  company_name text not null,
  timezone text not null default 'Europe/London',
  language text not null default 'en-GB',
  welcome_sms_template text not null default '',
  welcome_email_template text not null default '',
  updated_at timestamptz not null default now(),
  settings_data jsonb not null default '{}'::jsonb
);

create or replace function public.set_company_settings_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;
revoke all on function public.set_company_settings_updated_at() from public, anon, authenticated;
drop trigger if exists company_settings_set_updated_at on public.company_settings;
create trigger company_settings_set_updated_at
  before update on public.company_settings
  for each row execute function public.set_company_settings_updated_at();

alter table public.company_settings enable row level security;
drop policy if exists company_settings_owner_select on public.company_settings;
create policy company_settings_owner_select on public.company_settings
  for select to authenticated using (private.is_company_owner(company_id));
drop policy if exists company_settings_owner_insert on public.company_settings;
create policy company_settings_owner_insert on public.company_settings
  for insert to authenticated with check (private.is_company_owner(company_id));
drop policy if exists company_settings_owner_update on public.company_settings;
create policy company_settings_owner_update on public.company_settings
  for update to authenticated
  using (private.is_company_owner(company_id))
  with check (private.is_company_owner(company_id));

revoke all on public.company_settings from public, anon;
grant select, insert, update on public.company_settings to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'company_settings'
  ) then
    alter publication supabase_realtime add table public.company_settings;
  end if;
end $$;
