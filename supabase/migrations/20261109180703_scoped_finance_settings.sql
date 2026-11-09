create table public.company_invoice_preferences (
  company_id uuid primary key references public.companies(id) on delete cascade,
  default_interval text not null default 'monthly' check (default_interval in ('weekly', 'biweekly', 'monthly')),
  custom_cycle integer check (custom_cycle between 1 and 365),
  invoice_weekday integer not null default 1 check (invoice_weekday between 0 and 6),
  invoice_month_day integer not null default 1 check (invoice_month_day between 1 and 31),
  cycle_anchor date not null default ((now() at time zone 'Europe/London')::date),
  auto_generate boolean not null default false
);

create table public.company_wage_preferences (
  company_id uuid primary key references public.companies(id) on delete cascade,
  base_hourly_rate numeric(10,2) check (base_hourly_rate between 0 and 99999999.99),
  night_multiplier numeric(4,2) not null default 1.50 check (night_multiplier between 1 and 10),
  weekend_multiplier numeric(4,2) not null default 1.50 check (weekend_multiplier between 1 and 10),
  holiday_multiplier numeric(4,2) not null default 2.00 check (holiday_multiplier between 1 and 10),
  overtime_40_multiplier numeric(4,2) not null default 1.50 check (overtime_40_multiplier between 1 and 10),
  overtime_48_multiplier numeric(4,2) not null default 2.00 check (overtime_48_multiplier between overtime_40_multiplier and 10),
  holiday_region text not null default 'england-and-wales' check (holiday_region in ('england-and-wales', 'scotland', 'northern-ireland'))
);

create table public.company_integration_preferences (
  company_id uuid primary key references public.companies(id) on delete cascade,
  xero_sync_invoices boolean not null default false,
  stripe_payment_links boolean not null default false,
  slack_webhook_url text check (length(slack_webhook_url) <= 512 and slack_webhook_url ~ '^https://hooks[.]slack[.]com/services/[A-Za-z0-9]+/[A-Za-z0-9]+/[A-Za-z0-9]+$'),
  slack_invoice_events boolean not null default false,
  slack_checkin_events boolean not null default false,
  slack_cancellation_events boolean not null default false
);

do $$
declare
  setting_table text;
begin
  foreach setting_table in array array['company_invoice_preferences', 'company_wage_preferences', 'company_integration_preferences']
  loop
    execute format('alter table public.%I enable row level security', setting_table);
    execute format('revoke all on public.%I from public, anon, authenticated', setting_table);
    execute format('grant select, insert, update on public.%I to authenticated', setting_table);
    execute format('create policy owner_read on public.%I for select to authenticated using (private.is_company_owner(company_id))', setting_table);
    execute format('create policy owner_insert on public.%I for insert to authenticated with check (private.is_company_owner(company_id))', setting_table);
    execute format('create policy owner_update on public.%I for update to authenticated using (private.is_company_owner(company_id)) with check (private.is_company_owner(company_id))', setting_table);
  end loop;
end;
$$;

create function public.preview_invoice_amount(target_company uuid)
returns numeric language sql stable security invoker set search_path = '' as $$
  select coalesce(sum(amount), 0) from public.invoices
  where company_id = target_company and status = 'draft' and private.is_company_owner(target_company);
$$;
revoke all on function public.preview_invoice_amount(uuid) from public, anon;
grant execute on function public.preview_invoice_amount(uuid) to authenticated;
