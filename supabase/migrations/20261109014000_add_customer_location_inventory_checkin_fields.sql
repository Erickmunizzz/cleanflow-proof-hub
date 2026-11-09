alter table public.clients
  add column if not exists customer_no text,
  add column if not exists city text,
  add column if not exists contact_person text,
  add column if not exists contact_language text,
  add column if not exists is_archived boolean not null default false;

create index if not exists clients_company_customer_no_idx on public.clients (company_id, customer_no) where customer_no is not null;
create index if not exists clients_company_archive_name_idx on public.clients (company_id, is_archived, name);

create table if not exists public.client_locations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  customer_id uuid not null,
  location_no text,
  label text not null,
  address text,
  city text,
  postcode text,
  is_main boolean not null default false,
  created_at timestamptz not null default now(),
  constraint client_locations_customer_same_company_fkey foreign key (company_id, customer_id)
    references public.clients(company_id, id) on delete cascade
);
create index if not exists client_locations_company_customer_idx on public.client_locations (company_id, customer_id, is_main desc);
create index if not exists client_locations_company_address_idx on public.client_locations (company_id, city, postcode);
alter table public.client_locations enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='client_locations' and policyname='client_locations_owner_select') then
    create policy client_locations_owner_select on public.client_locations for select to authenticated using (private.is_company_owner(company_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='client_locations' and policyname='client_locations_owner_insert') then
    create policy client_locations_owner_insert on public.client_locations for insert to authenticated with check (private.is_company_owner(company_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='client_locations' and policyname='client_locations_owner_update') then
    create policy client_locations_owner_update on public.client_locations for update to authenticated using (private.is_company_owner(company_id)) with check (private.is_company_owner(company_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='client_locations' and policyname='client_locations_owner_delete') then
    create policy client_locations_owner_delete on public.client_locations for delete to authenticated using (private.is_company_owner(company_id));
  end if;
end $$;
grant select, insert, update, delete on public.client_locations to authenticated;

alter table public.jobs add column if not exists priority text not null default 'medium', add column if not exists duration_minutes integer;
do $$
begin
  if not exists (select 1 from pg_constraint where conrelid='public.jobs'::regclass and conname='jobs_priority_check') then
    alter table public.jobs add constraint jobs_priority_check check (priority in ('low','medium','high'));
  end if;
  if not exists (select 1 from pg_constraint where conrelid='public.jobs'::regclass and conname='jobs_duration_minutes_check') then
    alter table public.jobs add constraint jobs_duration_minutes_check check (duration_minutes is null or duration_minutes between 1 and 1440);
  end if;
end $$;
create index if not exists jobs_company_status_scheduled_idx on public.jobs (company_id, status, scheduled_date);

alter table public.materials
  add column if not exists product_no text,
  add column if not exists category text,
  add column if not exists storage_location text,
  add column if not exists minimum_quantity numeric not null default 0,
  add column if not exists is_archived boolean not null default false;
create unique index if not exists materials_company_product_no_unique on public.materials (company_id, product_no) where product_no is not null;
create index if not exists materials_company_archive_name_idx on public.materials (company_id, is_archived, name);

do $$
begin
  if exists (select 1 from pg_publication where pubname='supabase_realtime') and not exists (
    select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='client_locations'
  ) then
    alter publication supabase_realtime add table public.client_locations;
  end if;
end $$;
