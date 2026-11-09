alter table public.incidents
  alter column job_id drop not null;

drop policy if exists incidents_assigned_cleaner_insert on public.incidents;
create policy incidents_assigned_cleaner_insert
  on public.incidents for insert to authenticated
  with check (
    private.is_company_cleaner(company_id)
    and reported_by = (select auth.uid())
    and (
      job_id is null
      or exists (
        select 1 from public.jobs j
        where j.id = incidents.job_id
          and j.company_id = incidents.company_id
          and private.is_assigned_staff(j.staff_id, j.company_id)
      )
    )
  );
