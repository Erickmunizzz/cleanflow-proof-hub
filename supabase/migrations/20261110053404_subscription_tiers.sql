-- Atomic usage counters are seeded while writes are locked. Existing records are preserved.
lock table public.staff, public.jobs in share row exclusive mode;
alter table public.companies drop constraint companies_plan_check;
alter table public.companies add constraint companies_plan_check check (plan in ('trial','starter','growth','scale'));

create function private.plan_allows(target_company uuid, feature text)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select case
    when feature in ('payments','integrations') then c.plan = 'scale'
    when feature in ('payroll','recurring','reports') then c.plan in ('growth','scale')
    else false end from public.companies c where c.id = target_company),false);
$$;
revoke all on function private.plan_allows(uuid,text) from public,anon,authenticated;
grant execute on function private.plan_allows(uuid,text) to authenticated;

create table private.subscription_usage (
  company_id uuid not null references public.companies(id) on delete cascade,
  resource text not null check (resource in ('staff','jobs')),
  month date not null,
  used integer not null check (used >= 0),
  primary key(company_id,resource,month)
);
alter table private.subscription_usage enable row level security;
revoke all on private.subscription_usage from public,anon,authenticated;
insert into private.subscription_usage
select company_id,'staff','0001-01-01'::date,count(*) from public.staff where is_active group by company_id;
insert into private.subscription_usage
select company_id,'jobs',date_trunc('month',coalesce(scheduled_date,created_at) at time zone 'Europe/London')::date,count(*)
from public.jobs group by company_id,3;

create function private.change_subscription_usage(target_company uuid, resource_name text, usage_month date, delta integer)
returns void language plpgsql security definer set search_path = '' as $$
declare current_plan text; maximum integer; total integer;
begin
  -- Plan changes wait for active quota operations to finish.
  select plan into current_plan from public.companies where id=target_company for share;
  if not found then return; end if; -- Parent cascade deletion.
  maximum := case when resource_name='staff' then case current_plan when 'scale' then 20 when 'growth' then 12 else 5 end
    else case current_plan when 'scale' then 1000 when 'growth' then 570 else 230 end end;
  insert into private.subscription_usage(company_id,resource,month,used)
    values(target_company,resource_name,usage_month,greatest(delta,0))
  on conflict(company_id,resource,month) do update
    set used=private.subscription_usage.used+delta
    where delta < 0 or private.subscription_usage.used+delta <= maximum
  returning used into total;
  if total is null or (delta > 0 and total > maximum) then
    raise exception using errcode='P0001', message='PLAN_LIMIT: Você atingiu o limite do seu plano atual. Faça o upgrade para continuar cadastrando.',
      detail=format('%s limit %s for %s (%s)',resource_name,maximum,current_plan,usage_month);
  end if;
end;
$$;
revoke all on function private.change_subscription_usage(uuid,text,date,integer) from public,anon,authenticated;

create function private.track_subscription_usage() returns trigger
language plpgsql security definer set search_path = '' as $$
declare old_company uuid; new_company uuid; old_month date; new_month date;
begin
  if tg_op <> 'INSERT' then
    if tg_table_name='staff' then
      if old.is_active then old_company:=old.company_id; old_month:='0001-01-01'; end if;
    else
      old_company:=old.company_id;
      old_month:=date_trunc('month',coalesce(old.scheduled_date,old.created_at) at time zone 'Europe/London')::date;
    end if;
  end if;
  if tg_op <> 'DELETE' then
    if tg_table_name='staff' then
      if new.is_active then new_company:=new.company_id; new_month:='0001-01-01'; end if;
    else
      new_company:=new.company_id;
      new_month:=date_trunc('month',coalesce(new.scheduled_date,new.created_at) at time zone 'Europe/London')::date;
    end if;
  end if;
  if old_company is not distinct from new_company and old_month is not distinct from new_month then return null; end if;
  if old_company is not null then perform private.change_subscription_usage(old_company,tg_table_name,old_month,-1); end if;
  if new_company is not null then perform private.change_subscription_usage(new_company,tg_table_name,new_month,1); end if;
  return null;
end;
$$;
revoke all on function private.track_subscription_usage() from public,anon,authenticated;
create trigger subscription_staff_usage after insert or update or delete on public.staff for each row execute function private.track_subscription_usage();
create trigger subscription_jobs_usage after insert or update or delete on public.jobs for each row execute function private.track_subscription_usage();
revoke truncate on public.staff,public.jobs from anon,authenticated;

create table public.upgrade_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  requested_by uuid not null references auth.users(id),
  requested_plan text not null check (requested_plan in ('starter','growth','scale','support')),
  status text not null default 'pending' check (status in ('pending','approved','declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index upgrade_requests_one_pending on public.upgrade_requests(company_id) where status='pending';
alter table public.upgrade_requests enable row level security;
revoke all on public.upgrade_requests from public,anon,authenticated;
grant select on public.upgrade_requests to authenticated;
create policy upgrade_requests_owner_read on public.upgrade_requests for select to authenticated using(private.is_company_owner(company_id));

create function public.request_plan_upgrade(target_company uuid, requested_plan text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare current_plan text; request_id uuid;
begin
  if auth.uid() is null or not private.is_company_owner(target_company) then raise exception 'Owner access required' using errcode='42501'; end if;
  select plan into current_plan from public.companies where id=target_company for share;
  if requested_plan is null or not (case current_plan
    when 'trial' then requested_plan in ('starter','growth','scale')
    when 'starter' then requested_plan in ('growth','scale')
    when 'growth' then requested_plan='scale'
    when 'scale' then requested_plan='support' else false end) then
    raise exception 'Choose an available upgrade.' using errcode='22023';
  end if;
  insert into public.upgrade_requests(company_id,requested_by,requested_plan)
    values(target_company,auth.uid(),requested_plan)
  on conflict(company_id) where status='pending' do update
    set requested_plan=excluded.requested_plan,requested_by=excluded.requested_by,updated_at=now()
  returning id into request_id;
  return request_id;
end;
$$;
revoke all on function public.request_plan_upgrade(uuid,text) from public,anon,authenticated;
grant execute on function public.request_plan_upgrade(uuid,text) to authenticated;

create function public.subscription_status(target_company uuid, target_month date default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare current_plan text; usage_month date; staff_count integer; job_count integer;
begin
  if auth.uid() is null or not private.is_company_owner(target_company) then raise exception 'Owner access required' using errcode='42501'; end if;
  select plan into current_plan from public.companies where id=target_company;
  usage_month:=date_trunc('month',coalesce(target_month,(now() at time zone 'Europe/London')::date))::date;
  select used into staff_count from private.subscription_usage where company_id=target_company and resource='staff' and month='0001-01-01';
  select used into job_count from private.subscription_usage where company_id=target_company and resource='jobs' and month=usage_month;
  return jsonb_build_object('plan',current_plan,'month',usage_month,'staffUsed',coalesce(staff_count,0),'jobsUsed',coalesce(job_count,0),
    'staffLimit',case current_plan when 'scale' then 20 when 'growth' then 12 else 5 end,
    'jobsLimit',case current_plan when 'scale' then 1000 when 'growth' then 570 else 230 end,
    'pendingPlan',(select requested_plan from public.upgrade_requests where company_id=target_company and status='pending'));
end;
$$;
revoke all on function public.subscription_status(uuid,date) from public,anon,authenticated;
grant execute on function public.subscription_status(uuid,date) to authenticated;

-- Restrictive policies compose with existing owner/company policies.
do $$
declare table_name text;
begin
  foreach table_name in array array['staff_wages','job_wage_details','company_wage_preferences'] loop
    execute format('create policy subscription_payroll on public.%I as restrictive for all to authenticated using(private.plan_allows(company_id,''payroll'')) with check(private.plan_allows(company_id,''payroll''))',table_name);
  end loop;
end;
$$;
create policy subscription_recurring on public.recurring_invoice_customers as restrictive for all to authenticated
using(private.plan_allows(company_id,'recurring')) with check(private.plan_allows(company_id,'recurring'));
create policy subscription_invoice_preferences on public.company_invoice_preferences as restrictive for all to authenticated
using(true) with check(not auto_generate or private.plan_allows(company_id,'recurring'));
create policy subscription_integrations on public.company_integration_preferences as restrictive for all to authenticated
using(private.plan_allows(company_id,'integrations')) with check(private.plan_allows(company_id,'integrations'));
create policy subscription_reports on public.reports as restrictive for all to authenticated
using(private.plan_allows(company_id,'reports')) with check(private.plan_allows(company_id,'reports'));

-- Guard plan writes even when an authenticated caller reaches a SECURITY DEFINER function.
create or replace function private.guard_company_plan() returns trigger
language plpgsql set search_path = '' as $$
begin
  if current_user in ('authenticated','anon') or current_setting('role',true) in ('authenticated','anon') then
    if (tg_op='INSERT' and new.plan <> 'trial') or (tg_op='UPDATE' and new.plan is distinct from old.plan) then
      raise exception 'Company plans are managed by billing administrators.' using errcode='42501';
    end if;
  end if;
  return new;
end;
$$;

create or replace function private.generate_due_invoices(issue_day date)
returns bigint language sql set search_path = '' as $$
  with created as (
    insert into public.invoices(company_id, customer_id, invoice_number, amount, status, due_date, auto_issue_date)
    select r.company_id, r.customer_id, 'AUTO-' || to_char(issue_day, 'YYYYMMDD') || '-' || r.customer_id::text,
      r.amount, 'draft', issue_day + r.payment_terms_days, issue_day
    from public.recurring_invoice_customers r
    join public.company_invoice_preferences p using(company_id)
    join public.clients c on c.company_id = r.company_id and c.id = r.customer_id
    where private.plan_allows(r.company_id, 'recurring') and p.auto_generate and not c.is_archived and private.invoice_due_on(p, issue_day)
    on conflict do nothing returning id
  )
  select count(*) from created;
$$;

create or replace function private.slack_event_enabled(settings public.company_integration_preferences, event_kind text)
returns boolean language sql stable set search_path = '' as $$
  select private.plan_allows(settings.company_id,'integrations') and case event_kind
    when 'incident' then settings.slack_incident_events
    when 'invoice' then settings.slack_invoice_events
    when 'checkin' then settings.slack_checkin_events
    when 'cancellation' then settings.slack_cancellation_events
    else false end;
$$;


create or replace function public.wage_listing(target_company uuid, period_start date, period_end date, include_cancelled boolean)
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
  where j.company_id = target_company and private.is_company_owner(target_company) and private.plan_allows(target_company,'payroll')
    and j.staff_id is not null and period_start <= period_end
    and (
      (j.status = 'completed' and j.check_out_at > j.check_in_at and j.check_in_at < b.ends and j.check_out_at > b.starts)
      or (include_cancelled and j.status in ('cancelled','canceled') and j.scheduled_date >= b.starts and j.scheduled_date < b.ends)
    );
$$;

create or replace function public.wage_rule_premiums(target_company uuid, period_start date, period_end date)
returns table(job_id uuid, premium_hours numeric, overtime_premium_hours numeric)
language sql stable security invoker set search_path = '' as $$
  with bounds as (
    select period_start::timestamp at time zone 'Europe/London' as report_start,
      (period_end + 1)::timestamp at time zone 'Europe/London' as report_end,
      date_trunc('week', period_start::timestamp) at time zone 'Europe/London' as first_week
    where period_end >= period_start and period_end - period_start <= 366
      and private.is_company_owner(target_company) and private.plan_allows(target_company,'payroll')
  ), ranges as (
    select j.id, j.staff_id, greatest(j.check_in_at,b.first_week) as starts,
      least(j.check_out_at,b.report_end) as ends, b.report_start
    from public.jobs j cross join bounds b
    where j.company_id = target_company and j.staff_id is not null and j.status = 'completed'
      and j.check_out_at > j.check_in_at and j.check_in_at < b.report_end and j.check_out_at > b.first_week
  ), cuts as (
    select r.id, r.staff_id, r.report_start, boundary
    from ranges r cross join lateral (
      select r.starts as boundary union select r.ends
      union select (d + hour_offset * interval '1 hour') at time zone 'Europe/London'
      from generate_series(
        date_trunc('day',r.starts at time zone 'Europe/London'),
        date_trunc('day',r.ends at time zone 'Europe/London'),interval '1 day'
      ) d cross join (values(0),(6),(22)) offsets(hour_offset)
      where (d + hour_offset * interval '1 hour') at time zone 'Europe/London' between r.starts and r.ends
    ) t
  ), segments as (
    select *, lead(boundary) over(partition by id order by boundary) as next_boundary,
      boundary at time zone 'Europe/London' as local_start
    from cuts
  ), hours as (
    select *, extract(epoch from next_boundary-boundary)/3600 as hours
    from segments where next_boundary > boundary
  ), weekly as (
    select *, coalesce(sum(hours) over(partition by staff_id,date_trunc('week',local_start)
      order by boundary,id rows between unbounded preceding and 1 preceding),0) as prior
    from hours
  ), rates as (
    select w.*, greatest(
      case when extract(hour from local_start) < 6 or extract(hour from local_start) >= 22
        then coalesce(p.night_multiplier,1.5) else 1 end,
      case when extract(isodow from local_start) >= 6 then coalesce(p.weekend_multiplier,1.5) else 1 end,
      case when h.holiday_date is not null then coalesce(p.holiday_multiplier,2) else 1 end
      ) as shift_multiplier,
      coalesce(p.overtime_40_multiplier,1.5) as ot40, coalesce(p.overtime_48_multiplier,2) as ot48,
      least(hours,greatest(48-prior,0))-least(hours,greatest(40-prior,0)) as mid_hours,
      hours-least(hours,greatest(48-prior,0)) as high_hours
    from weekly w left join public.company_wage_preferences p on p.company_id = target_company
    left join public.uk_bank_holiday_dates h on h.region = coalesce(p.holiday_region,'england-and-wales')
      and h.holiday_date = w.local_start::date
    where w.boundary >= w.report_start
  )
  select id, sum(hours*(shift_multiplier-1)),
    sum(mid_hours*greatest(ot40-shift_multiplier,0)+high_hours*greatest(ot48-shift_multiplier,0))
  from rates group by id;
$$;

create or replace function public.get_wage_hours(target_company uuid,start_date date,end_date date)
returns table(staff_id uuid,staff_name text,total_hours numeric)
language sql stable security invoker set search_path='' as $$
 select s.id,s.name,private.payroll_hours(target_company,s.id,start_date,end_date)
 from public.staff s where s.company_id=target_company and private.is_company_owner(target_company) and private.plan_allows(target_company,'payroll')
 and start_date<=end_date order by s.name,s.id;
$$;
