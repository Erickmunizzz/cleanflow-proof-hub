create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  source_type text not null check (source_type in ('incident', 'report')),
  source_id uuid not null,
  unique(user_id, source_type, source_id)
);
create index notifications_inbox_idx on public.notifications(user_id, company_id, created_at desc, id desc);
create index notifications_unread_idx on public.notifications(user_id, company_id) where not is_read;
create index notifications_company_idx on public.notifications(company_id);
create index notifications_author_idx on public.notifications(created_by);
alter table public.notifications enable row level security;
revoke all on public.notifications from anon, authenticated;
grant select on public.notifications to authenticated;
grant update (is_read) on public.notifications to authenticated;
create policy notifications_recipient_select on public.notifications for select to authenticated
using (user_id = (select auth.uid()) and private.is_company_owner(company_id));
create policy notifications_recipient_read on public.notifications for update to authenticated
using (user_id = (select auth.uid()) and private.is_company_owner(company_id))
with check (user_id = (select auth.uid()) and private.is_company_owner(company_id));

-- Only triggers can create notifications. Clients cannot forge notifications for other users.
create function private.notify_company_owners() returns trigger
language plpgsql security definer set search_path = '' as $$
declare actor uuid; actor_name text; kind text; heading text; body text;
begin
  if TG_TABLE_SCHEMA <> 'public' or TG_TABLE_NAME not in ('incidents','reports') then
    raise exception 'Unsupported notification source';
  end if;
  if TG_TABLE_NAME = 'incidents' then
    actor := NEW.reported_by; kind := 'incident'; heading := 'New incident: ' || NEW.type;
    body := NEW.description;
  else
    actor := NEW.created_by; kind := 'report'; heading := 'New report: ' || NEW.title;
    body := NEW.description;
  end if;
  -- RLS on the source tables authorizes the insert. Validate attribution as well.
  if auth.uid() is not null and auth.uid() <> actor then
    raise exception 'Notification author must match the authenticated user';
  end if;
  select p.full_name into actor_name from public.profiles p where p.id = actor and p.company_id = NEW.company_id;
  if not found then raise exception 'Author must belong to the source company'; end if;
  insert into public.notifications(company_id, user_id, title, message, created_by, source_type, source_id, created_at)
  select NEW.company_id, p.id, heading,
    coalesce(nullif(btrim(actor_name), ''), 'Workspace member') || ': ' || body,
    actor, kind, NEW.id, NEW.created_at
  from public.profiles p where p.company_id = NEW.company_id and p.role = 'owner' and p.is_active
  on conflict (user_id, source_type, source_id) do nothing;
  return NEW;
end;
$$;
revoke all on function private.notify_company_owners() from public, anon, authenticated;
create trigger incidents_notify_owners after insert on public.incidents for each row execute function private.notify_company_owners();
create trigger reports_notify_owners after insert on public.reports for each row execute function private.notify_company_owners();
alter publication supabase_realtime add table public.notifications;
