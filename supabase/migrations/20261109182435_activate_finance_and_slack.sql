create extension if not exists pg_cron;
create extension if not exists pg_net;
-- Outbound requests can contain webhook credentials. Only the database worker needs pg_net access.
revoke all on schema net from public, anon, authenticated;
revoke all on all tables in schema net from public, anon, authenticated;
revoke execute on all functions in schema net from public, anon, authenticated;

create table public.recurring_invoice_customers (
  company_id uuid not null,
  customer_id uuid not null,
  amount numeric(12,2) not null check (amount > 0 and amount <> 'NaN'::numeric),
  payment_terms_days integer not null default 30 check (payment_terms_days between 0 and 365),
  primary key (company_id, customer_id),
  foreign key (company_id, customer_id) references public.clients(company_id,id) on delete cascade
);
alter table public.recurring_invoice_customers enable row level security;
revoke all on public.recurring_invoice_customers from public, anon, authenticated;
grant select, insert, update, delete on public.recurring_invoice_customers to authenticated;
create policy recurring_invoice_customers_owner on public.recurring_invoice_customers for all to authenticated
  using (private.is_company_owner(company_id)) with check (private.is_company_owner(company_id));

alter table public.invoices add column auto_issue_date date;
create unique index invoices_one_auto_issue_per_customer
  on public.invoices(company_id,customer_id,auto_issue_date) where auto_issue_date is not null;

create function private.invoice_due_on(rule public.company_invoice_preferences, issue_day date)
returns boolean language sql immutable set search_path = '' as $$
  select issue_day >= rule.cycle_anchor and case
    when rule.custom_cycle is not null then issue_day > rule.cycle_anchor
      and (issue_day - rule.cycle_anchor) % rule.custom_cycle = 0
    when rule.default_interval = 'monthly' then extract(day from issue_day) = least(
      rule.invoice_month_day, extract(day from (date_trunc('month', issue_day::timestamp) + interval '1 month - 1 day')))
    when rule.default_interval = 'weekly' then extract(dow from issue_day) = rule.invoice_weekday
    else (issue_day - (rule.cycle_anchor + ((rule.invoice_weekday - extract(dow from rule.cycle_anchor)::integer + 7) % 7))) % 14 = 0
  end;
$$;

create function private.generate_due_invoices(issue_day date)
returns bigint language sql set search_path = '' as $$
  with created as (
    insert into public.invoices(company_id, customer_id, invoice_number, amount, status, due_date, auto_issue_date)
    select r.company_id, r.customer_id, 'AUTO-' || to_char(issue_day, 'YYYYMMDD') || '-' || r.customer_id::text,
      r.amount, 'draft', issue_day + r.payment_terms_days, issue_day
    from public.recurring_invoice_customers r
    join public.company_invoice_preferences p using(company_id)
    join public.clients c on c.company_id = r.company_id and c.id = r.customer_id
    where p.auto_generate and not c.is_archived and private.invoice_due_on(p, issue_day)
    on conflict do nothing returning id
  )
  select count(*) from created;
$$;
revoke all on function private.invoice_due_on(public.company_invoice_preferences,date), private.generate_due_invoices(date) from public, anon, authenticated;

create or replace function public.preview_invoice_amount(target_company uuid)
returns numeric language sql stable security invoker set search_path = '' as $$
  select coalesce(sum(r.amount), 0)
  from public.recurring_invoice_customers r
  join public.clients c on c.company_id = r.company_id and c.id = r.customer_id
  where r.company_id = target_company and not c.is_archived and private.is_company_owner(target_company);
$$;

alter table public.company_integration_preferences add column slack_incident_events boolean not null default false;

create function private.slack_event_enabled(settings public.company_integration_preferences, event_kind text)
returns boolean language sql immutable set search_path = '' as $$
  select case event_kind
    when 'incident' then settings.slack_incident_events
    when 'invoice' then settings.slack_invoice_events
    when 'checkin' then settings.slack_checkin_events
    when 'cancellation' then settings.slack_cancellation_events
    else false end;
$$;

create table private.slack_outbox (
  id bigint generated always as identity primary key,
  company_id uuid not null references public.companies(id) on delete cascade,
  event_kind text not null,
  message text not null,
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  request_id bigint,
  queued_at timestamptz,
  finished_at timestamptz,
  outcome text
);
create index slack_outbox_pending_idx on private.slack_outbox(next_attempt_at,id) where finished_at is null;
revoke all on private.slack_outbox from public, anon, authenticated;

create function private.enqueue_slack_event() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  kind text;
  message text;
begin
  if tg_table_name = 'incidents' then
    kind := 'incident'; message := 'New incident reported in CleanFlow UK.';
  elsif tg_table_name = 'invoices' then
    kind := 'invoice'; message := 'New invoice created in CleanFlow UK.';
  elsif tg_table_name = 'jobs' then
    if old.status is distinct from new.status and new.status in ('cancelled','canceled') then
      kind := 'cancellation'; message := 'A job was cancelled in CleanFlow UK.';
    elsif old.check_in_at is null and new.check_in_at is not null then
      kind := 'checkin'; message := 'A team member checked in to a job in CleanFlow UK.';
    end if;
  end if;
  if kind is not null then
    insert into private.slack_outbox(company_id,event_kind,message)
    select p.company_id, kind, message
    from public.company_integration_preferences p
    where p.company_id = new.company_id and p.slack_webhook_url is not null and private.slack_event_enabled(p,kind);
  end if;
  return new;
end;
$$;
create trigger slack_incident_created after insert on public.incidents
for each row execute function private.enqueue_slack_event();
create trigger slack_invoice_created after insert on public.invoices
for each row execute function private.enqueue_slack_event();
create trigger slack_job_activity after update of status, check_in_at on public.jobs
for each row execute function private.enqueue_slack_event();

revoke all on function private.slack_event_enabled(public.company_integration_preferences,text),
  private.enqueue_slack_event() from public, anon, authenticated;

create table public.uk_bank_holiday_dates (
  region text not null check(region in ('england-and-wales','scotland','northern-ireland')),
  holiday_date date not null,
  primary key (region, holiday_date)
);
alter table public.uk_bank_holiday_dates enable row level security;
revoke all on public.uk_bank_holiday_dates from public, anon, authenticated;
grant select on public.uk_bank_holiday_dates to authenticated;
create policy uk_bank_holiday_read on public.uk_bank_holiday_dates for select to authenticated using (true);

-- Initial dates from https://www.gov.uk/bank-holidays.json. The scheduled refresh keeps them current.
insert into public.uk_bank_holiday_dates(region,holiday_date)
select source.region, day::date from (values
  ('england-and-wales', '2019-01-01,2019-04-19,2019-04-22,2019-05-06,2019-05-27,2019-08-26,2019-12-25,2019-12-26,2020-01-01,2020-04-10,2020-04-13,2020-05-08,2020-05-25,2020-08-31,2020-12-25,2020-12-28,2021-01-01,2021-04-02,2021-04-05,2021-05-03,2021-05-31,2021-08-30,2021-12-27,2021-12-28,2022-01-03,2022-04-15,2022-04-18,2022-05-02,2022-06-02,2022-06-03,2022-08-29,2022-09-19,2022-12-26,2022-12-27,2023-01-02,2023-04-07,2023-04-10,2023-05-01,2023-05-08,2023-05-29,2023-08-28,2023-12-25,2023-12-26,2024-01-01,2024-03-29,2024-04-01,2024-05-06,2024-05-27,2024-08-26,2024-12-25,2024-12-26,2025-01-01,2025-04-18,2025-04-21,2025-05-05,2025-05-26,2025-08-25,2025-12-25,2025-12-26,2026-01-01,2026-04-03,2026-04-06,2026-05-04,2026-05-25,2026-08-31,2026-12-25,2026-12-28,2027-01-01,2027-03-26,2027-03-29,2027-05-03,2027-05-31,2027-08-30,2027-12-27,2027-12-28,2028-01-03,2028-04-14,2028-04-17,2028-05-01,2028-05-29,2028-08-28,2028-12-25,2028-12-26'),
  ('scotland', '2019-01-01,2019-01-02,2019-04-19,2019-05-06,2019-05-27,2019-08-05,2019-12-02,2019-12-25,2019-12-26,2020-01-01,2020-01-02,2020-04-10,2020-05-08,2020-05-25,2020-08-03,2020-11-30,2020-12-25,2020-12-28,2021-01-01,2021-01-04,2021-04-02,2021-05-03,2021-05-31,2021-08-02,2021-11-30,2021-12-27,2021-12-28,2022-01-03,2022-01-04,2022-04-15,2022-05-02,2022-06-02,2022-06-03,2022-08-01,2022-09-19,2022-11-30,2022-12-26,2022-12-27,2023-01-02,2023-01-03,2023-04-07,2023-05-01,2023-05-08,2023-05-29,2023-08-07,2023-11-30,2023-12-25,2023-12-26,2024-01-01,2024-01-02,2024-03-29,2024-05-06,2024-05-27,2024-08-05,2024-12-02,2024-12-25,2024-12-26,2025-01-01,2025-01-02,2025-04-18,2025-05-05,2025-05-26,2025-08-04,2025-12-01,2025-12-25,2025-12-26,2026-01-01,2026-01-02,2026-04-03,2026-05-04,2026-05-25,2026-06-15,2026-08-03,2026-11-30,2026-12-25,2026-12-28,2027-01-01,2027-01-04,2027-03-26,2027-05-03,2027-05-31,2027-08-02,2027-11-30,2027-12-27,2027-12-28,2028-01-03,2028-01-04,2028-04-14,2028-05-01,2028-05-29,2028-08-07,2028-11-30,2028-12-25,2028-12-26'),
  ('northern-ireland', '2019-01-01,2019-03-18,2019-04-19,2019-04-22,2019-05-06,2019-05-27,2019-07-12,2019-08-26,2019-12-25,2019-12-26,2020-01-01,2020-03-17,2020-04-10,2020-04-13,2020-05-08,2020-05-25,2020-07-13,2020-08-31,2020-12-25,2020-12-28,2021-01-01,2021-03-17,2021-04-02,2021-04-05,2021-05-03,2021-05-31,2021-07-12,2021-08-30,2021-12-27,2021-12-28,2022-01-03,2022-03-17,2022-04-15,2022-04-18,2022-05-02,2022-06-02,2022-06-03,2022-07-12,2022-08-29,2022-09-19,2022-12-26,2022-12-27,2023-01-02,2023-03-17,2023-04-07,2023-04-10,2023-05-01,2023-05-08,2023-05-29,2023-07-12,2023-08-28,2023-12-25,2023-12-26,2024-01-01,2024-03-18,2024-03-29,2024-04-01,2024-05-06,2024-05-27,2024-07-12,2024-08-26,2024-12-25,2024-12-26,2025-01-01,2025-03-17,2025-04-18,2025-04-21,2025-05-05,2025-05-26,2025-07-14,2025-08-25,2025-12-25,2025-12-26,2026-01-01,2026-03-17,2026-04-03,2026-04-06,2026-05-04,2026-05-25,2026-07-13,2026-08-31,2026-12-25,2026-12-28,2027-01-01,2027-03-17,2027-03-26,2027-03-29,2027-05-03,2027-05-31,2027-07-12,2027-08-30,2027-12-27,2027-12-28,2028-01-03,2028-03-17,2028-04-14,2028-04-17,2028-05-01,2028-05-29,2028-07-12,2028-08-28,2028-12-25,2028-12-26')
) source(region, dates) cross join lateral unnest(string_to_array(source.dates, ',')) day;

create table private.uk_holiday_refresh (singleton boolean primary key default true check(singleton), request_id bigint not null);
revoke all on private.uk_holiday_refresh from public, anon, authenticated;
create function private.request_uk_holidays() returns void language sql set search_path = '' as $$
  insert into private.uk_holiday_refresh(request_id)
  values(net.http_get(url := 'https://www.gov.uk/bank-holidays.json', timeout_milliseconds := 8000))
  on conflict(singleton) do update set request_id = excluded.request_id;
$$;

create function private.apply_uk_holidays() returns void language plpgsql set search_path = '' as $$
declare
  calendar jsonb;
  region_name text;
  events jsonb;
begin
  select r.content::jsonb into calendar from net._http_response r
    join private.uk_holiday_refresh q on q.request_id = r.id where r.status_code = 200;
  if calendar is null then return; end if;
  foreach region_name in array array['england-and-wales','scotland','northern-ireland'] loop
    events := calendar->region_name->'events';
    if jsonb_typeof(events) is distinct from 'array' or jsonb_array_length(events) = 0 then
      raise exception 'Incomplete GOV.UK holiday calendar';
    end if;
    delete from public.uk_bank_holiday_dates where region = region_name and holiday_date between
      (select min((v->>'date')::date) from jsonb_array_elements(events) v)
      and (select max((v->>'date')::date) from jsonb_array_elements(events) v);
    insert into public.uk_bank_holiday_dates(region,holiday_date)
    select distinct region_name,(v->>'date')::date from jsonb_array_elements(events) v;
  end loop;
  delete from private.uk_holiday_refresh;
end;
$$;
revoke all on function private.request_uk_holidays(), private.apply_uk_holidays() from public, anon, authenticated;

-- Return weighted hours above base. Employee-specific rates are applied by the existing wage listing.
create function public.wage_rule_premiums(target_company uuid, period_start date, period_end date)
returns table(job_id uuid, premium_hours numeric, overtime_premium_hours numeric)
language sql stable security invoker set search_path = '' as $$
  with bounds as (
    select period_start::timestamp at time zone 'Europe/London' as report_start,
      (period_end + 1)::timestamp at time zone 'Europe/London' as report_end,
      date_trunc('week', period_start::timestamp) at time zone 'Europe/London' as first_week
    where period_end >= period_start and period_end - period_start <= 366
      and private.is_company_owner(target_company)
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
revoke all on function public.wage_rule_premiums(uuid,date,date) from public, anon;
grant execute on function public.wage_rule_premiums(uuid,date,date) to authenticated;

alter publication supabase_realtime add table public.company_wage_preferences;
select cron.schedule('cleanflow-recurring-invoices', '5 * * * *',
  $$select private.generate_due_invoices((now() at time zone 'Europe/London')::date)$$);
select cron.schedule('cleanflow-holidays-fetch', '12 4 * * *', $$select private.request_uk_holidays()$$);
select cron.schedule('cleanflow-holidays-apply', '17 4 * * *', $$select private.apply_uk_holidays()$$);
