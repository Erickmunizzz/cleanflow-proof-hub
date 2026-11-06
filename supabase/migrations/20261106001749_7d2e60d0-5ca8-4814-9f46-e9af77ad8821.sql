LOCK TABLE public.clients, public.staff IN SHARE ROW EXCLUSIVE MODE;
INSERT INTO public.clients (name, email) SELECT 'Test Maria', 'maria@test.com' WHERE NOT EXISTS (SELECT 1 FROM public.clients);
INSERT INTO public.staff (name, role) SELECT 'Test Joao', 'Cleaner' WHERE NOT EXISTS (SELECT 1 FROM public.staff);