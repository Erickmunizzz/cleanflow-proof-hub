create table public.staff_absences (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  staff_id uuid not null,
  absence_type text not null check (absence_type in ('falta', 'ferias', 'doenca', 'folga')),
  start_date date not null,
  end_date date not null,
  reason text not null check (length(btrim(reason)) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now(),
  check (isfinite(start_date) and isfinite(end_date) and start_date <= end_date),
  constraint staff_absences_staff_company_fkey foreign key (company_id, staff_id)
    references public.staff(company_id, id) on delete restrict
);

create index staff_absences_company_created_idx on public.staff_absences(company_id, created_at desc, id desc);
create index staff_absences_staff_dates_idx on public.staff_absences(company_id, staff_id, start_date, end_date);

alter table public.staff_absences enable row level security;
revoke all on public.staff_absences from public, anon, authenticated;
grant select, insert on public.staff_absences to authenticated;
grant update (status) on public.staff_absences to authenticated;
create policy staff_absences_owner_select on public.staff_absences for select to authenticated
  using (private.is_company_owner(company_id));
create policy staff_absences_owner_insert on public.staff_absences for insert to authenticated
  with check (private.is_company_owner(company_id));
create policy staff_absences_owner_approval on public.staff_absences for update to authenticated
  using (private.is_company_owner(company_id))
  with check (private.is_company_owner(company_id));

-- Jobs without a recorded duration occupy their start instant only.
create function private.staff_shift_window(start_at timestamptz, minutes integer)
returns tstzrange language sql immutable set search_path = '' as $$
  select tstzrange(start_at, start_at + coalesce(minutes * interval '1 minute', interval '1 microsecond'), '[)');
$$;

create function private.guard_job_staff_absence()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and not private.is_company_owner(new.company_id) then
    return new; -- Existing jobs RLS and cleaner guards control unauthorized writes.
  end if;
  if new.staff_id is null or new.status not in ('scheduled', 'in_progress') then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.status in ('scheduled', 'in_progress')
      and (new.company_id, new.staff_id, new.scheduled_date, new.duration_minutes)
          is not distinct from (old.company_id, old.staff_id, old.scheduled_date, old.duration_minutes) then
      return new;
    end if;
  end if;

  -- Both write paths serialize on the same staff member.
  perform pg_advisory_xact_lock(hashtextextended(new.staff_id::text, 748201));
  if exists (
    select 1 from public.staff_absences a
    where a.company_id = new.company_id and a.staff_id = new.staff_id and a.status = 'approved'
      and tstzrange(a.start_date::timestamp at time zone 'Europe/London',
                    (a.end_date + 1)::timestamp at time zone 'Europe/London', '[)')
          && private.staff_shift_window(new.scheduled_date, new.duration_minutes)
  ) then
    raise exception 'Scheduling conflict: this employee has approved time off during the job. Choose another employee or time.'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create function private.guard_staff_absence_approval()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  starts_at timestamptz;
  ends_at timestamptz;
begin
  if auth.uid() is not null and not private.is_company_owner(new.company_id) then
    return new;
  end if;
  if new.status <> 'approved' or new.start_date > new.end_date
    or not isfinite(new.start_date) or not isfinite(new.end_date) then
    return new;
  end if;
  if tg_op = 'UPDATE' then
    if (new.company_id, new.staff_id, new.start_date, new.end_date, new.status)
        is not distinct from (old.company_id, old.staff_id, old.start_date, old.end_date, old.status) then
      return new;
    end if;
  end if;

  starts_at := new.start_date::timestamp at time zone 'Europe/London';
  ends_at := (new.end_date + 1)::timestamp at time zone 'Europe/London';
  perform pg_advisory_xact_lock(hashtextextended(new.staff_id::text, 748201));
  if exists (
    select 1 from public.jobs j
    where j.company_id = new.company_id and j.staff_id = new.staff_id
      and j.status in ('scheduled', 'in_progress')
      and j.scheduled_date < ends_at
      and private.staff_shift_window(j.scheduled_date, j.duration_minutes) && tstzrange(starts_at, ends_at, '[)')
  ) then
    raise exception 'Scheduling conflict: reschedule or reassign the employee''s existing jobs before approving this absence.'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke all on function private.staff_shift_window(timestamptz, integer) from public, anon, authenticated;
revoke all on function private.guard_job_staff_absence() from public, anon, authenticated;
revoke all on function private.guard_staff_absence_approval() from public, anon, authenticated;

create trigger jobs_guard_staff_absence
  before insert or update of company_id, staff_id, scheduled_date, duration_minutes, status on public.jobs
  for each row execute function private.guard_job_staff_absence();
create trigger staff_absences_guard_approval
  before insert or update of company_id, staff_id, start_date, end_date, status on public.staff_absences
  for each row execute function private.guard_staff_absence_approval();

alter publication supabase_realtime add table public.staff_absences;
