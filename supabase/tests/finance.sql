begin;
select set_config('request.jwt.claim.sub',(select id::text from public.profiles where role='owner' and is_active limit 1),true);
set local role authenticated;
do $$
declare c uuid; customer uuid; employee uuid; job uuid; wage uuid; invoice uuid; h numeric; a numeric;
begin
select company_id into strict c from public.profiles where id=auth.uid();
insert into public.clients(company_id,name) values(c,'Transactional finance validation') returning id into customer;
insert into public.staff(company_id,name) values(c,'Transactional finance validation') returning id into employee;
insert into public.jobs(company_id,client_id,staff_id,title,status,check_in_at,check_out_at)
values(c,customer,employee,'Transactional finance validation','completed','2026-11-01 09:00+00','2026-11-01 11:00+00') returning id into job;
insert into public.staff_wages(company_id,staff_id,hourly_rate,total_hours,period_start,period_end)
values(c,employee,10,999,'2026-11-01','2026-11-01') returning id,total_hours,total_amount into wage,h,a;
if h<>2 or a<>20 then raise exception 'Initial wage calculation incorrect'; end if;
update public.jobs set check_out_at='2026-11-01 12:00+00' where id=job;
select total_hours,total_amount into h,a from public.staff_wages where id=wage;
if h<>3 or a<>30 then raise exception 'Attendance refresh failed'; end if;
update public.staff_wages set hourly_rate=12.50 where id=wage;
select total_amount into a from public.staff_wages where id=wage;
if a<>37.50 then raise exception 'Rate update failed'; end if;
select total_hours into h from public.get_wage_hours(c,'2026-11-01','2026-11-01') where staff_id=employee;
if h<>3 then raise exception 'Summary mismatch'; end if;
insert into public.invoices(company_id,customer_id,invoice_number,amount,due_date)
values(c,customer,'VERIFY-'||gen_random_uuid(),37.50,'2026-11-30') returning id into invoice;
update public.invoices set status='paid' where id=invoice;
if not exists(select 1 from public.invoices where id=invoice and status='paid') then raise exception 'Invoice update failed'; end if;
begin
insert into public.invoices(company_id,customer_id,invoice_number,amount,due_date) values(c,gen_random_uuid(),'invalid',1,'2026-11-30');
raise exception 'Invalid customer accepted';
exception when foreign_key_violation then null; end;
end $$;
rollback;
