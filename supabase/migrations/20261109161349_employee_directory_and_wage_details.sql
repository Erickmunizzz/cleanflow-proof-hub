create sequence public.staff_employee_number_seq;
create function private.next_employee_number() returns text
language sql volatile set search_path = '' as $$
  select 'E' || case when n < 10 then '0' else '' end || n::text
  from (select nextval('public.staff_employee_number_seq') as n) number;
$$;
revoke all on function private.next_employee_number() from public, anon;
grant execute on function private.next_employee_number() to authenticated, service_role;
alter table public.staff
  add column employee_no text,
  add column weekly_hours numeric(5,2) check (weekly_hours between 0 and 168);
alter table public.staff alter column employee_no set default
  private.next_employee_number();
-- Keep the identifier stable once assigned, including for existing employees.
update public.staff set employee_no = default where employee_no is null;
alter table public.staff alter column employee_no set not null;
create unique index staff_company_employee_no_idx on public.staff(company_id, employee_no);
grant usage on sequence public.staff_employee_number_seq to authenticated, service_role;

create table public.job_wage_details (
  company_id uuid not null,
  job_id uuid not null,
  work_type text check (work_type in (
    'General cleaning','Window cleaning','Deep cleaning','Office cleaning','Hospital cleaning',
    'Kitchen cleaning','Bathroom sanitization','Floor polishing','Carpet cleaning','Waste disposal'
  )),
  is_excluded boolean not null default false,
  periodic numeric(10,2) not null default 0 check (periodic >= 0),
  overtime numeric(10,2) not null default 0 check (overtime >= 0),
  personal numeric(10,2) not null default 0 check (personal >= 0),
  special numeric(10,2) not null default 0 check (special >= 0),
  primary key (company_id, job_id),
  constraint job_wage_details_job_company_fkey foreign key (company_id, job_id)
    references public.jobs(company_id, id) on delete cascade
);
alter table public.job_wage_details enable row level security;
revoke all on public.job_wage_details from public, anon, authenticated;
grant select, insert, update on public.job_wage_details to authenticated;
create policy job_wage_details_owner on public.job_wage_details for all to authenticated
  using (private.is_company_owner(company_id)) with check (private.is_company_owner(company_id));

create function public.wage_listing(target_company uuid, period_start date, period_end date, include_cancelled boolean)
returns table(job_id uuid, staff_id uuid, client_id uuid, workplace text, title text, status text,
  hours numeric, work_type text, is_excluded boolean, periodic numeric, overtime numeric, personal numeric, special numeric)
language sql stable security invoker set search_path = '' as $$
  with bounds as (
    select period_start::timestamp at time zone 'Europe/London' as starts,
      (period_end + 1)::timestamp at time zone 'Europe/London' as ends
  )
  select j.id, j.staff_id, j.client_id, c.name, j.title, j.status,
    case when j.status = 'completed' then
      extract(epoch from (least(j.check_out_at, b.ends) - greatest(j.check_in_at, b.starts))) / 3600
      else 0 end,
    d.work_type, coalesce(d.is_excluded, false),
    case when j.status = 'completed' and j.check_out_at <= b.ends then coalesce(d.periodic, 0) else 0 end,
    case when j.status = 'completed' and j.check_out_at <= b.ends then coalesce(d.overtime, 0) else 0 end,
    case when j.status = 'completed' and j.check_out_at <= b.ends then coalesce(d.personal, 0) else 0 end,
    case when j.status = 'completed' and j.check_out_at <= b.ends then coalesce(d.special, 0) else 0 end
  from public.jobs j
  cross join bounds b
  left join public.clients c on c.company_id = j.company_id and c.id = j.client_id
  left join public.job_wage_details d on d.company_id = j.company_id and d.job_id = j.id
  where j.company_id = target_company and private.is_company_owner(target_company)
    and j.staff_id is not null and period_start <= period_end
    and (
      (j.status = 'completed' and j.check_out_at > j.check_in_at and j.check_in_at < b.ends and j.check_out_at > b.starts)
      or (include_cancelled and j.status in ('cancelled','canceled') and j.scheduled_date >= b.starts and j.scheduled_date < b.ends)
    );
$$;
revoke all on function public.wage_listing(uuid,date,date,boolean) from public, anon;
grant execute on function public.wage_listing(uuid,date,date,boolean) to authenticated;
alter publication supabase_realtime add table public.job_wage_details;
