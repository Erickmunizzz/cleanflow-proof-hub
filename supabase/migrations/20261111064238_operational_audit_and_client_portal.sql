-- Cover every currently uncovered FK, including the 16 advisor findings.
DO $$ DECLARE r record; cols text; BEGIN
 FOR r IN select c.* from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace where c.contype='f' and n.nspname in ('public','private') and not exists(select 1 from pg_index i where i.indrelid=c.conrelid and i.indisvalid and i.indpred is null and (i.indkey::smallint[])[0:cardinality(c.conkey)-1] @> c.conkey) LOOP
 select string_agg(quote_ident(a.attname),',' order by u.ord) into cols from unnest(r.conkey) with ordinality u(num,ord) join pg_attribute a on a.attrelid=r.conrelid and a.attnum=u.num;
 execute format('CREATE INDEX IF NOT EXISTS %I ON %s (%s)', 'fk_cover_'||r.oid,r.conrelid::regclass,cols);
 END LOOP;
END $$;
DROP INDEX IF EXISTS public.profiles_company_id_id_uidx;
CREATE TABLE public.activity_events (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
 actor_id uuid, entity text not null, record_id text, action text not null, changed_fields text[] not null default '{}', created_at timestamptz not null default now()
);
CREATE INDEX ON public.activity_events(company_id,created_at desc,id);
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_read ON public.activity_events FOR SELECT TO authenticated USING(private.is_company_owner(company_id));
GRANT SELECT ON public.activity_events TO authenticated;
REVOKE INSERT,UPDATE,DELETE ON public.activity_events FROM anon,authenticated;
CREATE FUNCTION private.audit_operation() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE old_row jsonb; new_row jsonb; tenant uuid; fields text[];
BEGIN
 if TG_OP <> 'INSERT' then old_row=to_jsonb(OLD); end if;
 if TG_OP <> 'DELETE' then new_row=to_jsonb(NEW); end if;
 tenant=nullif(coalesce(new_row,old_row)->>'company_id','')::uuid;
 if tenant is null then return coalesce(NEW,OLD); end if;
 if TG_OP='UPDATE' then
 select array_agg(key order by key) into fields from jsonb_object_keys(new_row) key where (new_row->key) is distinct from (old_row->key);
 if fields is null then return NEW; end if;
 end if;
 insert into public.activity_events(company_id,actor_id,entity,record_id,action,changed_fields) values(tenant,auth.uid(),TG_TABLE_NAME,coalesce(new_row,old_row)->>'id',lower(TG_OP),coalesce(fields,'{}'));
 return coalesce(NEW,OLD);
END $$;
REVOKE ALL ON FUNCTION private.audit_operation() FROM PUBLIC,anon,authenticated;
CREATE TABLE public.client_portal_links (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
 client_id uuid not null, token uuid not null unique default gen_random_uuid(), expires_at timestamptz not null default now()+interval '7 days', revoked_at timestamptz, created_at timestamptz not null default now(),
 foreign key(company_id,client_id) references public.clients(company_id,id) on delete cascade
);
CREATE INDEX ON public.client_portal_links(company_id,client_id);
ALTER TABLE public.client_portal_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_manage ON public.client_portal_links FOR ALL TO authenticated USING(private.is_company_owner(company_id)) WITH CHECK(private.is_company_owner(company_id) AND expires_at>now() AND expires_at<=now()+interval '30 days');
GRANT SELECT,INSERT,UPDATE,DELETE ON public.client_portal_links TO authenticated;
REVOKE ALL ON public.client_portal_links FROM anon;
-- An unguessable, expiring bearer token gives read-only access to a limited projection.
CREATE FUNCTION public.read_client_portal(access_token uuid) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
select jsonb_build_object('customer',c.name,'jobs',coalesce((select jsonb_agg(jsonb_build_object('id',j.id,'title',j.title,'scheduled_date',j.scheduled_date,'status',j.status) order by j.scheduled_date desc) from public.jobs j where j.company_id=l.company_id and j.client_id=l.client_id),'[]'::jsonb))
from public.client_portal_links l join public.clients c on c.company_id=l.company_id and c.id=l.client_id
where l.token=access_token and l.revoked_at is null and l.expires_at>now()
$$;
REVOKE ALL ON FUNCTION public.read_client_portal(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.read_client_portal(uuid) TO anon,authenticated;
DO $$ DECLARE r record; BEGIN
 FOR r IN select table_name from information_schema.columns where table_schema='public' and column_name='company_id' and table_name not in ('activity_events','uk_bank_holiday_dates') and exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname=table_name and c.relkind='r') LOOP
 execute format('CREATE TRIGGER audit_operation AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION private.audit_operation()',r.table_name);
 END LOOP;
END $$;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events,public.client_portal_links;
