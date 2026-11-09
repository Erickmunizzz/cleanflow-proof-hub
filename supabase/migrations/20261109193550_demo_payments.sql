alter table public.companies add column plan text not null default 'trial'
  check (plan in ('starter','trial','scale'));

create function private.guard_company_plan() returns trigger
language plpgsql set search_path = '' as $$
begin
  if current_user in ('authenticated','anon') then
    if (tg_op = 'INSERT' and new.plan <> 'trial')
      or (tg_op = 'UPDATE' and new.plan is distinct from old.plan) then
      raise exception 'Company plans are managed by billing administrators.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function private.guard_company_plan() from public, anon, authenticated;
create trigger companies_guard_plan before insert or update of plan on public.companies
for each row execute function private.guard_company_plan();

create table public.demo_payment_transactions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  kind text not null check (kind in ('collection','payout')),
  customer_id uuid,
  provider text check (provider in ('stripe','gocardless')),
  amount_pence bigint not null check (amount_pence > 0),
  gateway_fee_pence bigint not null default 0 check (gateway_fee_pence >= 0),
  platform_fee_pence bigint not null default 0 check (platform_fee_pence >= 0),
  net_pence bigint generated always as (amount_pence - gateway_fee_pence - platform_fee_pence) stored,
  created_at timestamptz not null default now(),
  check (gateway_fee_pence + platform_fee_pence < amount_pence),
  check ((kind='collection' and provider is not null)
      or (kind='payout' and customer_id is null and provider is null)),
  foreign key (company_id,customer_id) references public.clients(company_id,id) on delete set null (customer_id),
  unique (company_id,id)
);
create index demo_transactions_company_created_idx on public.demo_payment_transactions(company_id,created_at desc);
create table public.demo_job_payouts (
  company_id uuid not null,
  job_id uuid not null,
  transaction_id uuid not null,
  amount_pence bigint not null check (amount_pence > 0),
  primary key (company_id,job_id),
  foreign key (company_id,job_id) references public.jobs(company_id,id) on delete cascade,
  foreign key (company_id,transaction_id) references public.demo_payment_transactions(company_id,id) on delete cascade
);
create index demo_payouts_transaction_idx on public.demo_job_payouts(company_id,transaction_id);

alter table public.demo_payment_transactions enable row level security;
alter table public.demo_job_payouts enable row level security;
revoke all on public.demo_payment_transactions, public.demo_job_payouts from public,anon,authenticated;
grant select on public.demo_payment_transactions, public.demo_job_payouts to authenticated;
create policy demo_transactions_owner_read on public.demo_payment_transactions for select to authenticated using (private.is_company_owner(company_id));
create policy demo_payouts_owner_read on public.demo_job_payouts for select to authenticated using (private.is_company_owner(company_id));

create function private.require_demo_scale(target_company uuid) returns void
language plpgsql set search_path = '' as $$
begin
  if not coalesce(private.is_company_owner(target_company),false) then
    raise exception 'Only the company owner can create demo payments.' using errcode = '42501';
  end if;
  perform 1 from public.companies where id = target_company and plan = 'scale' for share;
  if not found then
    raise exception 'Upgrade to Scale to unlock' using errcode = '42501';
  end if;
end;
$$;
revoke all on function private.require_demo_scale(uuid) from public,anon,authenticated;

create function public.create_demo_collection(target_company uuid, target_customer uuid, provider_name text, gross_pence bigint)
returns public.demo_payment_transactions
language plpgsql security definer set search_path = '' as $$
declare result public.demo_payment_transactions;
begin
  perform private.require_demo_scale(target_company);
  if gross_pence is null or gross_pence < 100 or gross_pence > 100000000
    or provider_name is null or provider_name not in ('stripe','gocardless') then
    raise exception 'Enter a valid provider and an amount between £1 and £1,000,000.' using errcode = '22023';
  end if;
  if not exists(select 1 from public.clients where id=target_customer and company_id=target_company and not is_archived) then
    raise exception 'Select an active customer from this workspace.' using errcode = '22023';
  end if;
  insert into public.demo_payment_transactions(company_id,kind,customer_id,provider,amount_pence,gateway_fee_pence,platform_fee_pence)
  values(target_company,'collection',target_customer,provider_name,gross_pence,round(gross_pence * 0.015)::bigint + 20,round(gross_pence * 0.01)::bigint)
  returning * into result;
  return result;
end;
$$;

create function public.demo_payable_jobs(target_company uuid, first_day date, last_day date)
returns table(job_id uuid, title text, employee text, completed_at timestamptz, amount_pence bigint)
language sql stable security invoker set search_path = '' as $$
  with bounds as (
    select first_day::timestamp at time zone 'Europe/London' as starts,
      (last_day+1)::timestamp at time zone 'Europe/London' as ends
    where last_day >= first_day and last_day-first_day <= 30 and private.is_company_owner(target_company)
  ), jobs as (
    select j.*, s.name as employee_name,
      (j.check_in_at at time zone 'Europe/London')::date as start_day,
      (j.check_out_at at time zone 'Europe/London')::date as end_day
    from public.jobs j cross join bounds b
    left join public.staff s on s.id=j.staff_id and s.company_id=j.company_id
    where j.company_id=target_company and j.status='completed'
      and coalesce(j.check_out_at,j.scheduled_date) >= b.starts and coalesce(j.check_out_at,j.scheduled_date) < b.ends
      and not exists (select 1 from public.demo_job_payouts p where p.company_id=j.company_id and p.job_id=j.id)
  ), premiums as (
    select p.* from public.wage_rule_premiums(target_company,
      (select least(first_day, min(start_day)) from jobs where start_day >= first_day-30),last_day) p
  )
  select j.id,j.title,j.employee_name,coalesce(j.check_out_at,j.scheduled_date),
    case when j.staff_id is not null and j.check_out_at > j.check_in_at
       and j.start_day >= first_day-30 and not coalesce(d.is_excluded,false) and coalesce(r.hourly_rate,w.base_hourly_rate) is not null
    then round(100 * ((extract(epoch from j.check_out_at-j.check_in_at)/3600
      + coalesce(p.premium_hours,0) + coalesce(p.overtime_premium_hours,0)) * coalesce(r.hourly_rate,w.base_hourly_rate)
      + coalesce(d.periodic,0) + coalesce(d.overtime,0) + coalesce(d.personal,0) + coalesce(d.special,0)))::bigint end
  from jobs j
  left join premiums p on p.job_id=j.id
  left join public.company_wage_preferences w on w.company_id=target_company
  left join public.job_wage_details d on d.company_id=j.company_id and d.job_id=j.id
  left join lateral (
    select hourly_rate from public.staff_wages
    where company_id=target_company and staff_id=j.staff_id and period_start <= j.start_day and period_end >= j.end_day
    order by (period_end-period_start),created_at desc,id limit 1
  ) r on true;
$$;

create function public.create_demo_payout(target_company uuid, first_day date, last_day date, selected_jobs uuid[], expected_pence bigint)
returns public.demo_payment_transactions
language plpgsql security definer set search_path = '' as $$
declare result public.demo_payment_transactions; count_jobs integer; total bigint; payout_items jsonb;
begin
  perform private.require_demo_scale(target_company);
  if coalesce(cardinality(selected_jobs),0) not between 1 and 50 then
    raise exception 'Select between 1 and 50 completed jobs.' using errcode = '22023';
  end if;
  select count(*),sum(j.amount_pence),jsonb_agg(jsonb_build_object('job_id',j.job_id,'amount_pence',j.amount_pence))
    into count_jobs,total,payout_items
    from public.demo_payable_jobs(target_company,first_day,last_day) j
    where j.job_id=any(selected_jobs) and j.amount_pence>0;
  if count_jobs <> cardinality(selected_jobs) or total is distinct from expected_pence then
    raise exception 'The jobs or amounts changed. Refresh the list and select the jobs again.' using errcode = '22023';
  end if;
  insert into public.demo_payment_transactions(company_id,kind,amount_pence)
    values(target_company,'payout',total) returning * into result;
  insert into public.demo_job_payouts(company_id,job_id,transaction_id,amount_pence)
    select target_company,v.job_id,result.id,v.amount_pence
    from jsonb_to_recordset(payout_items) v(job_id uuid,amount_pence bigint);
  return result;
exception when unique_violation then
  raise exception 'A selected job has already been recorded. Refresh the list and try again.' using errcode = '22023';
end;
$$;

-- The opaque demo link only exposes its gross amount and chosen provider.
create function public.get_demo_checkout(link_id uuid)
returns table(amount_pence bigint, provider text)
language sql stable security definer set search_path = '' as $$
  select t.amount_pence,t.provider from public.demo_payment_transactions t
  where t.id=link_id and t.kind='collection';
$$;

revoke all on function public.create_demo_collection(uuid,uuid,text,bigint),
  public.demo_payable_jobs(uuid,date,date), public.create_demo_payout(uuid,date,date,uuid[],bigint),
  public.get_demo_checkout(uuid) from public,anon,authenticated;
grant execute on function public.create_demo_collection(uuid,uuid,text,bigint), public.demo_payable_jobs(uuid,date,date),
  public.create_demo_payout(uuid,date,date,uuid[],bigint) to authenticated;
grant execute on function public.get_demo_checkout(uuid) to anon,authenticated;
