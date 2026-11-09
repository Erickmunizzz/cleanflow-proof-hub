begin;
select set_config('request.jwt.claim.sub', (select id::text from public.profiles where role='owner' and is_active limit 1), true);
set local role authenticated;
do $$
declare c uuid; r uuid; i uuid; n integer;
begin
 select company_id into strict c from public.profiles where id=auth.uid();
 insert into public.reports(company_id,title,description) values(c,'Notification verification','Rollback only') returning id into r;
 insert into public.incidents(company_id,type,description,reported_by,job_id) values(c,'other','Notification verification',auth.uid(),null) returning id into i;
 perform set_config('test.report_id',r::text,true);
 perform set_config('test.incident_id',i::text,true);
 select count(*) into n from public.notifications where source_id in (r,i) and not is_read;
 if n <> 2 then raise exception 'Expected two unread own notifications, got %',n; end if;
 if exists(select 1 from public.notifications where user_id<>auth.uid()) then raise exception 'Other recipients exposed'; end if;
 update public.notifications set is_read=true where source_id=r;
 select count(*) into n from public.notifications where source_id in (r,i) and not is_read;
 if n <> 1 then raise exception 'Read count did not decrease'; end if;
 begin
   update public.notifications set title='Forbidden' where source_id=r;
   raise exception 'Content modification incorrectly permitted';
 exception when insufficient_privilege then null; end;
 begin
   insert into public.notifications(company_id,user_id,title,message,source_type,source_id) values(c,auth.uid(),'Forbidden','Forbidden','report',r);
   raise exception 'Forged insert incorrectly permitted';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$
declare expected integer; actual integer;
begin
 select count(*)*2 into expected from public.profiles where role='owner' and is_active and company_id=(select company_id from public.profiles where id=auth.uid());
 select count(*) into actual from public.notifications where source_id in (current_setting('test.report_id')::uuid,current_setting('test.incident_id')::uuid);
 if actual<>expected then raise exception 'Recipient fanout mismatch: % vs %',actual,expected; end if;
end $$;
rollback;
