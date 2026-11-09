-- Ensure deleting an optional linked profile/job/customer preserves the company scope.
alter table public.job_photo_documentation drop constraint if exists job_photo_documentation_job_same_company_fkey;
alter table public.job_photo_documentation add constraint job_photo_documentation_job_same_company_fkey foreign key(company_id,job_id) references public.jobs(company_id,id) on delete cascade;
alter table public.job_photo_documentation drop constraint if exists job_photo_documentation_creator_same_company_fkey;
alter table public.job_photo_documentation add constraint job_photo_documentation_creator_same_company_fkey foreign key(company_id,created_by) references public.profiles(company_id,id) on delete set null (created_by);
alter table public.nfc_tags drop constraint if exists nfc_tags_job_same_company_fkey;
alter table public.nfc_tags add constraint nfc_tags_job_same_company_fkey foreign key(company_id,job_id) references public.jobs(company_id,id) on delete set null (job_id);
alter table public.nfc_tags drop constraint if exists nfc_tags_customer_same_company_fkey;
alter table public.nfc_tags add constraint nfc_tags_customer_same_company_fkey foreign key(company_id,client_id) references public.clients(company_id,id) on delete set null (client_id);
alter table public.material_requests drop constraint if exists material_requests_requester_same_company_fkey;
alter table public.material_requests add constraint material_requests_requester_same_company_fkey foreign key(company_id,requested_by) references public.profiles(company_id,id) on delete set null (requested_by);
alter table public.material_transfers drop constraint if exists material_transfers_actor_same_company_fkey;
alter table public.material_transfers add constraint material_transfers_actor_same_company_fkey foreign key(company_id,transferred_by) references public.profiles(company_id,id) on delete set null (transferred_by);