-- Test-only seed for the CleanFlow UK demo Supabase project.
-- Run manually after the two Auth users have been provisioned through Supabase Auth.
-- Passwords are intentionally not stored in this public repository.
-- This script does not create or delete Auth users.

do $$
declare
  v_owner_id uuid;
  v_cleaner_id uuid;
  v_company_id uuid;
  v_staff_id uuid;
  v_company_count integer;
  v_rows integer;
begin
  select id into v_owner_id
  from auth.users
  where lower(email) = 'dono@teste.com';

  if v_owner_id is null then
    raise exception 'Missing Auth user dono@teste.com; create it using Supabase Auth Admin first.';
  end if;

  select id into v_cleaner_id
  from auth.users
  where lower(email) = 'cleaner@teste.com';

  if v_cleaner_id is null then
    raise exception 'Missing Auth user cleaner@teste.com; create it using Supabase Auth Admin first.';
  end if;

  if not exists (
    select 1 from auth.identities
    where user_id = v_owner_id and provider = 'email'
  ) or not exists (
    select 1 from auth.identities
    where user_id = v_cleaner_id and provider = 'email'
  ) then
    raise exception 'Both test users must have an email identity before running this seed.';
  end if;

  select count(*) into v_company_count
  from public.companies
  where name = 'CleanFlow UK Demo';

  if v_company_count <> 1 then
    raise exception 'Expected exactly one CleanFlow UK Demo company; found %.', v_company_count;
  end if;

  select id into v_company_id
  from public.companies
  where name = 'CleanFlow UK Demo';

  -- Confirmation is per test account; this does not change global Auth settings.
  update auth.users
  set email_confirmed_at = coalesce(email_confirmed_at, now()),
      updated_at = now()
  where id in (v_owner_id, v_cleaner_id);

  -- Do not take ownership away from an unrelated account.
  update public.companies
  set owner_user_id = v_owner_id
  where id = v_company_id
    and (owner_user_id is null or owner_user_id = v_owner_id);

  get diagnostics v_rows = row_count;
  if v_rows <> 1 then
    raise exception 'Demo company is already assigned to a different owner.';
  end if;

  insert into public.profiles (id, company_id, role, full_name, is_active)
  values
    (v_owner_id, v_company_id, 'owner', 'Test Owner', true),
    (v_cleaner_id, v_company_id, 'cleaner', 'Test Cleaner', true)
  on conflict (id) do update
  set company_id = excluded.company_id,
      role = excluded.role,
      full_name = excluded.full_name,
      is_active = true;

  select id into v_staff_id
  from public.staff
  where profile_id = v_cleaner_id
  limit 1;

  if v_staff_id is null then
    select id into v_staff_id
    from public.staff
    where lower(coalesce(email, '')) = 'cleaner@teste.com'
       or (name = 'Test Joao' and (company_id is null or company_id = v_company_id))
    order by created_at
    limit 1;
  end if;

  if v_staff_id is null then
    insert into public.staff (name, email, role, company_id, profile_id, is_active)
    values ('Test Joao', 'cleaner@teste.com', 'Cleaner', v_company_id, v_cleaner_id, true);
  else
    update public.staff
    set company_id = v_company_id,
        profile_id = v_cleaner_id,
        email = 'cleaner@teste.com',
        is_active = true
    where id = v_staff_id;
  end if;
end;
$$;
