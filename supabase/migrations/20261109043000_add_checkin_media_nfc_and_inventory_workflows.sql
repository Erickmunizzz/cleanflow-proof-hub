create unique index if not exists materials_company_id_id_unique on public.materials(company_id,id);

create table if not exists public.job_photo_documentation (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  job_id uuid not null,
  photo_url text not null,
  caption text,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint job_photo_documentation_job_same_company_fkey foreign key (company_id,job_id) references public.jobs(company_id,id) on delete cascade,
  constraint job_photo_documentation_creator_same_company_fkey foreign key (company_id,created_by) references public.profiles(company_id,id) on delete set null (created_by)
);
create index if not exists job_photo_documentation_company_created_idx on public.job_photo_documentation(company_id,created_at desc);

create table if not exists public.nfc_tags (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  tag_code text not null,
  label text not null,
  job_id uuid,
  client_id uuid,
  is_active boolean not null default true,
  last_scanned_at timestamptz,
  created_at timestamptz not null default now(),
  constraint nfc_tags_company_code_unique unique(company_id,tag_code),
  constraint nfc_tags_job_same_company_fkey foreign key(company_id,job_id) references public.jobs(company_id,id) on delete set null (job_id),
  constraint nfc_tags_customer_same_company_fkey foreign key(company_id,client_id) references public.clients(company_id,id) on delete set null (client_id)
);
create index if not exists nfc_tags_company_active_idx on public.nfc_tags(company_id,is_active,label);

create table if not exists public.material_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  material_id uuid not null,
  quantity numeric not null check(quantity>0),
  status text not null default 'pending' check(status in ('pending','approved','fulfilled','rejected')),
  notes text,
  requested_by uuid,
  created_at timestamptz not null default now(),
  constraint material_requests_material_same_company_fkey foreign key(company_id,material_id) references public.materials(company_id,id) on delete cascade,
  constraint material_requests_requester_same_company_fkey foreign key(company_id,requested_by) references public.profiles(company_id,id) on delete set null (requested_by)
);
create index if not exists material_requests_company_created_idx on public.material_requests(company_id,created_at desc);

create table if not exists public.material_transfers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  material_id uuid not null,
  quantity numeric not null check(quantity>0),
  from_location text not null,
  to_location text not null,
  notes text,
  transferred_by uuid,
  created_at timestamptz not null default now(),
  constraint material_transfers_material_same_company_fkey foreign key(company_id,material_id) references public.materials(company_id,id) on delete cascade,
  constraint material_transfers_actor_same_company_fkey foreign key(company_id,transferred_by) references public.profiles(company_id,id) on delete set null (transferred_by)
);
create index if not exists material_transfers_company_created_idx on public.material_transfers(company_id,created_at desc);

do $$
declare t text; p text;
begin
  foreach t in array array['job_photo_documentation','nfc_tags','material_requests','material_transfers'] loop
    execute format('alter table public.%I enable row level security',t);
    foreach p in array array['select','insert','update','delete'] loop
      if not exists(select 1 from pg_policies where schemaname='public' and tablename=t and policyname=t||'_owner_'||p) then
        if p='select' then execute format('create policy %I on public.%I for select to authenticated using (private.is_company_owner(company_id))',t||'_owner_'||p,t);
        elsif p='insert' then execute format('create policy %I on public.%I for insert to authenticated with check (private.is_company_owner(company_id))',t||'_owner_'||p,t);
        elsif p='update' then execute format('create policy %I on public.%I for update to authenticated using (private.is_company_owner(company_id)) with check (private.is_company_owner(company_id))',t||'_owner_'||p,t);
        else execute format('create policy %I on public.%I for delete to authenticated using (private.is_company_owner(company_id))',t||'_owner_'||p,t); end if;
      end if;
    end loop;
  end loop;
  grant select,insert,update,delete on public.job_photo_documentation,public.nfc_tags,public.material_requests,public.material_transfers to authenticated;
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    foreach t in array array['job_photo_documentation','nfc_tags','material_requests','material_transfers'] loop
      if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then execute format('alter publication supabase_realtime add table public.%I',t); end if;
    end loop;
  end if;
end $$;