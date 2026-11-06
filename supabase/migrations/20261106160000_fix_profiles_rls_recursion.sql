-- Remove recursive RLS policy dependencies around profiles.
-- Helper functions run with the migration owner and a locked search_path so
-- they can safely inspect membership rows without re-entering table policies.

begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.get_my_company_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.company_id
  from public.profiles as p
  where p.id = (select auth.uid())
    and p.is_active
  limit 1;
$$;

create or replace function private.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_company_id is not null
    and private.get_my_company_id() = target_company_id;
$$;

create or replace function private.is_company_owner(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.companies as c
    where c.id = target_company_id
      and c.owner_user_id = (select auth.uid())
  );
$$;

create or replace function private.is_company_cleaner(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.id = (select auth.uid())
      and p.company_id = target_company_id
      and p.role = 'cleaner'
      and p.is_active
  );
$$;

create or replace function private.is_company_cleaner_user(
  target_company_id uuid,
  target_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.id = target_user_id
      and p.company_id = target_company_id
      and p.role = 'cleaner'
      and p.is_active
  );
$$;

create or replace function private.is_assigned_staff(
  target_staff_id uuid,
  target_company_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff as s
    join public.profiles as p
      on p.id = s.profile_id
     and p.company_id = s.company_id
    where s.id = target_staff_id
      and s.company_id = target_company_id
      and s.profile_id = (select auth.uid())
      and s.is_active
      and p.role = 'cleaner'
      and p.is_active
  );
$$;

create or replace function private.get_company_owner_id(target_company_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select c.owner_user_id
  from public.companies as c
  where c.id = target_company_id
  limit 1;
$$;

revoke all on function private.get_my_company_id() from public, anon;
revoke all on function private.is_company_member(uuid) from public, anon;
revoke all on function private.is_company_owner(uuid) from public, anon;
revoke all on function private.is_company_cleaner(uuid) from public, anon;
revoke all on function private.is_company_cleaner_user(uuid, uuid) from public, anon;
revoke all on function private.is_assigned_staff(uuid, uuid) from public, anon;
revoke all on function private.get_company_owner_id(uuid) from public, anon;

grant execute on function private.get_my_company_id() to authenticated;
grant execute on function private.is_company_member(uuid) to authenticated;
grant execute on function private.is_company_owner(uuid) to authenticated;
grant execute on function private.is_company_cleaner(uuid) to authenticated;
grant execute on function private.is_company_cleaner_user(uuid, uuid) to authenticated;
grant execute on function private.is_assigned_staff(uuid, uuid) to authenticated;
grant execute on function private.get_company_owner_id(uuid) to authenticated;

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.messages enable row level security;
alter table public.staff enable row level security;

-- Drop all existing policies on these tables first, including legacy broad or
-- recursive policies whose names differ between environments.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('companies', 'profiles', 'jobs', 'messages', 'staff')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  end loop;
end;
$$;

-- Companies: owner manages their company; active company members may read it.
create policy companies_select_member_or_owner
  on public.companies for select to authenticated
  using (
    private.is_company_owner(id)
    or private.is_company_member(id)
  );

create policy companies_owner_insert
  on public.companies for insert to authenticated
  with check (owner_user_id = (select auth.uid()));

create policy companies_owner_update
  on public.companies for update to authenticated
  using (private.is_company_owner(id))
  with check (
    private.is_company_owner(id)
    and owner_user_id = (select auth.uid())
  );

-- Profiles: a user reads their own profile; owners read/manage cleaner profiles
-- belonging to their company. No policy queries profiles directly.
create policy profiles_select_self_or_company_owner
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (role = 'cleaner' and private.is_company_owner(company_id))
  );

create policy profiles_insert_owner_or_self_owner
  on public.profiles for insert to authenticated
  with check (
    (
      id = (select auth.uid())
      and role = 'owner'
      and private.is_company_owner(company_id)
    )
    or (
      role = 'cleaner'
      and private.is_company_owner(company_id)
    )
  );

create policy profiles_owner_update_cleaners
  on public.profiles for update to authenticated
  using (
    role = 'cleaner'
    and private.is_company_owner(company_id)
  )
  with check (
    role = 'cleaner'
    and private.is_company_owner(company_id)
  );

-- Jobs: owners manage their company's jobs; cleaners read/update only jobs
-- assigned to their active staff/profile link (status and GPS update trigger
-- constraints remain in place).
create policy jobs_owner_all
  on public.jobs for all to authenticated
  using (private.is_company_owner(company_id))
  with check (private.is_company_owner(company_id));

create policy jobs_cleaner_select_assigned
  on public.jobs for select to authenticated
  using (private.is_assigned_staff(staff_id, company_id));

create policy jobs_cleaner_update_assigned
  on public.jobs for update to authenticated
  using (private.is_assigned_staff(staff_id, company_id))
  with check (private.is_assigned_staff(staff_id, company_id));

-- Messages: owners read the company's conversation and may send to its cleaners;
-- cleaners read their own conversation and may reply only to their company owner.
create policy messages_owner_all
  on public.messages for all to authenticated
  using (private.is_company_owner(company_id))
  with check (private.is_company_owner(company_id));

create policy messages_cleaner_select_own
  on public.messages for select to authenticated
  using (
    private.is_company_cleaner(company_id)
    and (
      recipient_id = (select auth.uid())
      or sender_id = (select auth.uid())
    )
  );

create policy messages_owner_insert_to_cleaner
  on public.messages for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and private.is_company_owner(company_id)
    and private.is_company_cleaner_user(company_id, recipient_id)
  );

create policy messages_cleaner_insert_to_owner
  on public.messages for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and private.is_company_cleaner(company_id)
    and recipient_id = private.get_company_owner_id(company_id)
  );

-- Staff: owners manage the company's staff; cleaners can read only their own
-- staff row, keyed by the authenticated profile id.
create policy staff_owner_all
  on public.staff for all to authenticated
  using (private.is_company_owner(company_id))
  with check (private.is_company_owner(company_id));

create policy staff_cleaner_select_self
  on public.staff for select to authenticated
  using (
    profile_id = (select auth.uid())
    and private.is_company_cleaner(company_id)
  );

commit;
