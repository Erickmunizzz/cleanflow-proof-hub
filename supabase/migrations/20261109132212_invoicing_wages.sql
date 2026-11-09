create table public.invoices (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id),
 customer_id uuid not null, invoice_number text not null check(length(btrim(invoice_number)) between 1 and 80),
 amount numeric(12,2) not null check(amount >= 0),
 status text not null default 'draft' check(status in ('draft','sent','paid','overdue')),
 due_date date not null, created_at timestamptz not null default now(),
 unique(company_id, invoice_number),
 foreign key(company_id,customer_id) references public.clients(company_id,id)
);
create index invoices_company_status_created_idx on public.invoices(company_id,status,created_at desc,id desc);
create index invoices_customer_idx on public.invoices(company_id,customer_id);
create table public.staff_wages (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id),
 staff_id uuid not null, total_hours numeric(12,4) not null default 0 check(total_hours >= 0),
 hourly_rate numeric(10,2) not null check(hourly_rate >= 0),
 total_amount numeric(14,2) generated always as (round(total_hours * hourly_rate,2)) stored,
 period_start date not null, period_end date not null, created_at timestamptz not null default now(),
 check(period_end >= period_start), unique(company_id,staff_id,period_start,period_end),
 foreign key(company_id,staff_id) references public.staff(company_id,id)
);
create index staff_wages_company_period_idx on public.staff_wages(company_id,period_start,period_end);
create index jobs_payroll_idx on public.jobs(company_id,staff_id,check_in_at) where status='completed';
alter table public.invoices enable row level security;
alter table public.staff_wages enable row level security;
revoke all on public.invoices, public.staff_wages from anon, authenticated;
grant select,insert,update,delete on public.invoices, public.staff_wages to authenticated;
create policy invoices_owner on public.invoices for all to authenticated using(private.is_company_owner(company_id)) with check(private.is_company_owner(company_id));
create policy staff_wages_owner on public.staff_wages for all to authenticated using(private.is_company_owner(company_id)) with check(private.is_company_owner(company_id));

-- Clip actual attendance to the inclusive London calendar date range. No scheduled hours or breaks are inferred.
create function private.payroll_hours(c uuid,s uuid,a date,b date) returns numeric
language sql stable security invoker set search_path='' as $$
 select round(coalesce(sum(extract(epoch from (
 least(j.check_out_at, (b+1)::timestamp at time zone 'Europe/London') -
 greatest(j.check_in_at, a::timestamp at time zone 'Europe/London')))/3600),0),4)
 from public.jobs j where j.company_id=c and j.staff_id=s and j.status='completed'
 and j.check_out_at>j.check_in_at
 and j.check_in_at < (b+1)::timestamp at time zone 'Europe/London'
 and j.check_out_at > a::timestamp at time zone 'Europe/London';
$$;
revoke all on function private.payroll_hours(uuid,uuid,date,date) from public,anon;
grant execute on function private.payroll_hours(uuid,uuid,date,date) to authenticated;
create function public.get_wage_hours(target_company uuid,start_date date,end_date date)
returns table(staff_id uuid,staff_name text,total_hours numeric)
language sql stable security invoker set search_path='' as $$
 select s.id,s.name,private.payroll_hours(target_company,s.id,start_date,end_date)
 from public.staff s where s.company_id=target_company and private.is_company_owner(target_company)
 and start_date<=end_date order by s.name,s.id;
$$;
revoke all on function public.get_wage_hours(uuid,date,date) from public,anon;
grant execute on function public.get_wage_hours(uuid,date,date) to authenticated;
create function private.calculate_wage_hours() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 NEW.total_hours := private.payroll_hours(NEW.company_id,NEW.staff_id,NEW.period_start,NEW.period_end);
 return NEW;
end; $$;
revoke all on function private.calculate_wage_hours() from public,anon,authenticated;
create trigger calculate_wage_hours before insert or update on public.staff_wages for each row execute function private.calculate_wage_hours();
-- Keep saved wage calculations current when attendance changes, including cleaner check-outs.
create function private.refresh_job_wages() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if TG_OP <> 'INSERT' then
 update public.staff_wages set total_hours=total_hours where company_id=OLD.company_id and staff_id=OLD.staff_id;
 end if;
 if TG_OP <> 'DELETE' then
 update public.staff_wages set total_hours=total_hours where company_id=NEW.company_id and staff_id=NEW.staff_id;
 end if;
 return null;
end; $$;
revoke all on function private.refresh_job_wages() from public,anon,authenticated;
create trigger refresh_job_wages after insert or update of status,check_in_at,check_out_at,staff_id,company_id or delete on public.jobs for each row execute function private.refresh_job_wages();
alter publication supabase_realtime add table public.invoices,public.staff_wages;
