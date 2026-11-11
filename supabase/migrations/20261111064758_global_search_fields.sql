CREATE FUNCTION public.search_workspace(search_term text)
RETURNS TABLE(category text,id uuid,title text,detail text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$
with me as (select company_id from public.profiles where id=auth.uid() and role='owner' and is_active),
q as (select lower(left(trim(search_term),120)) term),
results as (
(select 'Customers'::text category,c.id,c.name title,concat_ws(' · ',c.email,c.phone) detail from public.clients c,me,q where c.company_id=me.company_id and length(q.term)>0 and strpos(lower(concat_ws(' ',c.name,c.email,c.phone)),q.term)>0 order by c.name,c.id limit 6)
union all
(select 'Employees',s.id,s.name,coalesce(s.role,'') from public.staff s,me,q where s.company_id=me.company_id and length(q.term)>0 and strpos(lower(concat_ws(' ',s.name,s.role)),q.term)>0 order by s.name,s.id limit 6)
union all
(select 'Jobs',j.id,j.title,concat_ws(' · ',j.status,c.address,j.scheduled_date::text) from public.jobs j left join public.clients c on c.id=j.client_id and c.company_id=j.company_id cross join me cross join q where j.company_id=me.company_id and length(q.term)>0 and strpos(lower(concat_ws(' ',j.id::text,j.title,j.status,replace(j.status,'_',' '),c.address,c.city)),q.term)>0 order by j.scheduled_date desc,j.id limit 6)
union all
(select 'Inventory',m.id,m.name,'' from public.materials m,me,q where m.company_id=me.company_id and length(q.term)>0 and strpos(lower(m.name),q.term)>0 order by m.name,m.id limit 6)
) select * from results order by category,title,id;
$$;
REVOKE ALL ON FUNCTION public.search_workspace(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.search_workspace(text) TO authenticated;
