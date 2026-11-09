create table public.customer_areas (
  company_id uuid not null references public.companies(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  name text not null check (name = btrim(name) and length(name) between 1 and 120),
  main_area boolean not null default false,
  primary key (company_id, id),
  unique (company_id, name) deferrable initially deferred
);

create table public.employee_groups (
  company_id uuid not null references public.companies(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  group_name text not null check (group_name = btrim(group_name) and length(group_name) between 1 and 120),
  name text not null check (name = btrim(name) and length(name) between 1 and 120),
  primary key (company_id, id),
  unique (company_id, group_name, name) deferrable initially deferred
);

create table public.employee_titles (
  company_id uuid not null references public.companies(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  title_no text not null check (title_no = btrim(title_no) and length(title_no) between 1 and 30),
  name text not null check (name = btrim(name) and length(name) between 1 and 120),
  primary key (company_id, id),
  unique (company_id, title_no) deferrable initially deferred
);

alter table public.customer_areas enable row level security;
alter table public.employee_groups enable row level security;
alter table public.employee_titles enable row level security;
revoke all on public.customer_areas, public.employee_groups, public.employee_titles from public, anon, authenticated;
grant select on public.customer_areas, public.employee_groups, public.employee_titles to authenticated;
create policy customer_areas_owner_read on public.customer_areas for select to authenticated
  using (private.is_company_owner(company_id));
create policy employee_groups_owner_read on public.employee_groups for select to authenticated
  using (private.is_company_owner(company_id));
create policy employee_titles_owner_read on public.employee_titles for select to authenticated
  using (private.is_company_owner(company_id));

create function private.seed_company_structure(target_company uuid) returns void
language sql set search_path = '' as $$
  insert into public.customer_areas (company_id, name)
  select target_company, v.name
  from (values ('North London'), ('East London'), ('Central'), ('Canary Wharf'), ('South East')) v(name)
  where not exists (select 1 from public.customer_areas where company_id = target_company);

  insert into public.employee_groups (company_id, group_name, name)
  select target_company, v.group_name, v.name
  from (values ('Cleaning Team A', 'North Ops'), ('Cleaning Team B', 'Central Ops'), ('Supervisors', 'Quality')) v(group_name, name)
  where not exists (select 1 from public.employee_groups where company_id = target_company);

  insert into public.employee_titles (company_id, title_no, name)
  select target_company, v.title_no, v.name
  from (values ('T01', 'Service Assistant'), ('T02', 'Supervisor'), ('T03', 'Area Manager'), ('T04', 'Quality Auditor')) v(title_no, name)
  where not exists (select 1 from public.employee_titles where company_id = target_company);
$$;

select private.seed_company_structure(id) from public.companies;

create function private.seed_new_company_structure() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform private.seed_company_structure(new.id);
  return new;
end;
$$;

create trigger company_structure_defaults after insert on public.companies
for each row execute function private.seed_new_company_structure();
revoke all on function private.seed_company_structure(uuid), private.seed_new_company_structure() from public, anon, authenticated;

create function public.get_company_structure(target_company uuid) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'areas', coalesce((select jsonb_agg(to_jsonb(a) - 'company_id' order by a.name, a.id)
      from public.customer_areas a where a.company_id = target_company), '[]'::jsonb),
    'groups', coalesce((select jsonb_agg(to_jsonb(g) - 'company_id' order by g.group_name, g.name, g.id)
      from public.employee_groups g where g.company_id = target_company), '[]'::jsonb),
    'titles', coalesce((select jsonb_agg(to_jsonb(t) - 'company_id' order by t.title_no, t.id)
      from public.employee_titles t where t.company_id = target_company), '[]'::jsonb)
  );
$$;

-- Writes go through one transaction so a failed edit cannot partially save the page.
create function public.save_company_structure(target_company uuid, expected jsonb, changes jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not coalesce(private.is_company_owner(target_company), false) then
    raise exception 'Only the company owner can save the company structure.' using errcode = '42501';
  end if;
  if jsonb_typeof(changes->'areas') is distinct from 'array'
    or jsonb_typeof(changes->'groups') is distinct from 'array'
    or jsonb_typeof(changes->'titles') is distinct from 'array' then
    raise exception 'Provide all three company structure lists.' using errcode = '22023';
  end if;

  perform 1 from public.companies where id = target_company for update;
  if public.get_company_structure(target_company) is distinct from expected then
    raise exception 'The company structure changed in another session. Reload it before saving again.' using errcode = '40001';
  end if;

  delete from public.customer_areas a where a.company_id = target_company
    and not exists (select 1 from jsonb_to_recordset(changes->'areas') as v(id uuid) where v.id = a.id);
  insert into public.customer_areas (company_id, id, name, main_area)
  select target_company, v.id, btrim(v.name), v.main_area
  from jsonb_to_recordset(changes->'areas') as v(id uuid, name text, main_area boolean)
  on conflict (company_id, id) do update set name = excluded.name, main_area = excluded.main_area;

  delete from public.employee_groups g where g.company_id = target_company
    and not exists (select 1 from jsonb_to_recordset(changes->'groups') as v(id uuid) where v.id = g.id);
  insert into public.employee_groups (company_id, id, group_name, name)
  select target_company, v.id, btrim(v.group_name), btrim(v.name)
  from jsonb_to_recordset(changes->'groups') as v(id uuid, group_name text, name text)
  on conflict (company_id, id) do update set group_name = excluded.group_name, name = excluded.name;

  delete from public.employee_titles t where t.company_id = target_company
    and not exists (select 1 from jsonb_to_recordset(changes->'titles') as v(id uuid) where v.id = t.id);
  insert into public.employee_titles (company_id, id, title_no, name)
  select target_company, v.id, btrim(v.title_no), btrim(v.name)
  from jsonb_to_recordset(changes->'titles') as v(id uuid, title_no text, name text)
  on conflict (company_id, id) do update set title_no = excluded.title_no, name = excluded.name;

  return public.get_company_structure(target_company);
end;
$$;

revoke all on function public.get_company_structure(uuid), public.save_company_structure(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.get_company_structure(uuid), public.save_company_structure(uuid, jsonb, jsonb) to authenticated;
