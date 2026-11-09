-- CleanFlow UK: Keys and Safety & Compliance modules.
-- Keep company-scoped foreign keys enforceable, including for legacy tables.
create unique index if not exists clients_company_id_id_key on public.clients(company_id, id);
create unique index if not exists staff_company_id_id_key on public.staff(company_id, id);
create unique index if not exists jobs_company_id_id_key on public.jobs(company_id, id);

create table if not exists public.key_registers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  customer_id uuid not null,
  staff_id uuid,
  key_code text not null check (length(trim(key_code)) > 0),
  status text not null default 'with_office'
    check (status in ('with_staff', 'with_office', 'returned')),
  picked_up_at timestamptz,
  returned_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  constraint key_registers_customer_same_company_fkey
    foreign key (company_id, customer_id)
    references public.clients(company_id, id) on delete restrict,
  constraint key_registers_staff_same_company_fkey
    foreign key (company_id, staff_id)
    references public.staff(company_id, id) on delete restrict
);

create index if not exists key_registers_company_created_idx
  on public.key_registers(company_id, created_at desc, id);
create index if not exists key_registers_company_customer_idx
  on public.key_registers(company_id, customer_id);
create index if not exists key_registers_company_status_idx
  on public.key_registers(company_id, status);
create index if not exists key_registers_company_staff_idx
  on public.key_registers(company_id, staff_id);

alter table public.key_registers enable row level security;
drop policy if exists key_registers_owner_all on public.key_registers;
create policy key_registers_owner_all on public.key_registers
  for all to authenticated
  using (private.is_company_owner(company_id))
  with check (private.is_company_owner(company_id));
drop policy if exists key_registers_cleaner_select_assigned on public.key_registers;
create policy key_registers_cleaner_select_assigned on public.key_registers
  for select to authenticated
  using (private.is_assigned_staff(staff_id, company_id));
drop policy if exists key_registers_cleaner_update_assigned on public.key_registers;
create policy key_registers_cleaner_update_assigned on public.key_registers
  for update to authenticated
  using (private.is_assigned_staff(staff_id, company_id))
  with check (private.is_assigned_staff(staff_id, company_id));
grant select, insert, update, delete on public.key_registers to authenticated;

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  job_id uuid not null,
  type text not null check (length(trim(type)) > 0),
  description text not null check (length(trim(description)) > 0),
  reported_by uuid not null,
  created_at timestamptz not null default now(),
  constraint incidents_job_same_company_fkey
    foreign key (company_id, job_id)
    references public.jobs(company_id, id) on delete restrict,
  constraint incidents_reporter_same_company_fkey
    foreign key (company_id, reported_by)
    references public.profiles(company_id, id) on delete restrict
);

create index if not exists incidents_company_created_idx
  on public.incidents(company_id, created_at desc, id);
create index if not exists incidents_company_job_idx
  on public.incidents(company_id, job_id);
create index if not exists incidents_company_reporter_idx
  on public.incidents(company_id, reported_by);

alter table public.incidents enable row level security;
drop policy if exists incidents_owner_all on public.incidents;
create policy incidents_owner_all on public.incidents
  for all to authenticated
  using (private.is_company_owner(company_id))
  with check (private.is_company_owner(company_id));
drop policy if exists incidents_company_cleaner_select on public.incidents;
create policy incidents_company_cleaner_select on public.incidents
  for select to authenticated
  using (private.is_company_cleaner(company_id));
drop policy if exists incidents_assigned_cleaner_insert on public.incidents;
create policy incidents_assigned_cleaner_insert on public.incidents
  for insert to authenticated
  with check (
    private.is_company_cleaner(company_id)
    and reported_by = (select auth.uid())
    and exists (
      select 1 from public.jobs j
      where j.id = incidents.job_id
        and j.company_id = incidents.company_id
        and private.is_assigned_staff(j.staff_id, j.company_id)
    )
  );
grant select, insert, update, delete on public.incidents to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'key_registers'
  ) then
    alter publication supabase_realtime add table public.key_registers;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'incidents'
  ) then
    alter publication supabase_realtime add table public.incidents;
  end if;
end $$;
