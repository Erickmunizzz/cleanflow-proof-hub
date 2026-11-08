create or replace function private.is_company_owner(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.companies as c
    where c.id = target_company_id
      and (
        c.owner_user_id = (select auth.uid())
        or exists (
          select 1
          from public.profiles as p
          where p.id = (select auth.uid())
            and p.company_id = c.id
            and p.role = 'owner'
            and p.is_active is true
        )
      )
  );
$function$;
