create table public.reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  title text not null check (length(btrim(title)) between 1 and 200),
  description text not null check (length(btrim(description)) between 1 and 10000),
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now()
);
create index reports_company_created_idx on public.reports (company_id, created_at desc, id desc);
create index reports_created_by_idx on public.reports (created_by);
alter table public.reports enable row level security;
revoke all on public.reports from anon, authenticated;
grant select, insert on public.reports to authenticated;
create policy reports_owner_select on public.reports for select to authenticated
  using (private.is_company_owner(company_id));
create policy reports_owner_insert on public.reports for insert to authenticated
  with check (private.is_company_owner(company_id) and created_by = (select auth.uid()));
alter publication supabase_realtime add table public.reports;
