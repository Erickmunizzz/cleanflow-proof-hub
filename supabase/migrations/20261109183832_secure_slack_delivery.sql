create extension if not exists http with schema extensions;

-- Post directly from the private cron worker. The Slack URL never enters
-- pg_net's shared request queue or the delivery history.
create or replace function private.deliver_slack_outbox() returns void
language plpgsql set search_path = '' as $$
declare
  item record;
  webhook text;
  response_code integer;
begin
  for item in
    select * from private.slack_outbox
    where finished_at is null and next_attempt_at <= now()
    order by next_attempt_at,id limit 5 for update skip locked
  loop
    select p.slack_webhook_url into webhook from public.company_integration_preferences p
    where p.company_id = item.company_id and private.slack_event_enabled(p,item.event_kind);
    if webhook is null then
      update private.slack_outbox set finished_at = now(), outcome = 'disabled' where id = item.id;
      continue;
    end if;
    begin
      select status into response_code
      from extensions.http_post(webhook, jsonb_build_object('text',item.message)::text, 'application/json');
    exception when others then
      response_code := null;
    end;
    update private.slack_outbox set
      attempts = attempts + 1,
      finished_at = case when response_code between 200 and 299
        or item.attempts + 1 >= 5 or (response_code between 400 and 499 and response_code <> 429) then now() end,
      outcome = case when response_code between 200 and 299 then 'delivered'
        when item.attempts + 1 >= 5 or (response_code between 400 and 499 and response_code <> 429) then 'failed' end,
      next_attempt_at = now() + interval '2 minutes' * power(2,item.attempts)
    where id = item.id;
  end loop;
  delete from private.slack_outbox where finished_at < now() - interval '30 days';
end;
$$;
revoke all on function private.deliver_slack_outbox() from public, anon, authenticated;
select cron.schedule('cleanflow-slack-outbox', '* * * * *', $$select private.deliver_slack_outbox()$$);
