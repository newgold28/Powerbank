-- ============================================================
-- AbiWande Events & Concierge — Supabase schema
-- Run this in Supabase Studio → SQL Editor (once).
-- ============================================================

-- 1. Enquiries -----------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz default now(),
  status text not null default 'New'
    check (status in ('New','Reviewing','Quote Sent','Confirmed','Declined','Completed')),
  event_type text,
  event_type_other text,
  services text[] not null default '{}',
  event_date text,
  flexible_date boolean not null default false,
  start_time text,
  end_time text,
  venue text,
  guest_count text,
  event_city text,
  indoor_outdoor text,
  full_name text not null,
  email text not null,
  phone text not null,
  contact_method text,
  budget_gbp numeric,
  theme_style text,
  additional_requests text,
  dietary_requirements text,
  reference_images jsonb not null default '[]'::jsonb,
  notes text,
  quote_amount numeric,
  deposit_status text,
  deposit_amount numeric
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_services_idx on public.enquiries using gin (services);

-- 2. Portfolio items -----------------------------------------
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  src text not null,
  category text not null default 'Events',
  title text,
  caption text,
  location text,
  date text
);

-- 3. Row Level Security --------------------------------------
alter table public.enquiries enable row level security;
alter table public.portfolio_items enable row level security;

-- Anyone may INSERT an enquiry (public booking form)…
create policy "enquiries_public_insert"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

-- …but only signed-in owners may read, update or delete them.
create policy "enquiries_owner_select"
  on public.enquiries for select
  to authenticated
  using (true);

create policy "enquiries_owner_update"
  on public.enquiries for update
  to authenticated
  using (true) with check (true);

create policy "enquiries_owner_delete"
  on public.enquiries for delete
  to authenticated
  using (true);

-- Portfolio: public may read (gallery), only owners may write.
create policy "portfolio_public_select"
  on public.portfolio_items for select
  to anon, authenticated
  using (true);

create policy "portfolio_owner_insert"
  on public.portfolio_items for insert
  to authenticated
  with check (true);

create policy "portfolio_owner_update"
  on public.portfolio_items for update
  to authenticated
  using (true) with check (true);

create policy "portfolio_owner_delete"
  on public.portfolio_items for delete
  to authenticated
  using (true);

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists enquiries_touch on public.enquiries;
create trigger enquiries_touch
  before update on public.enquiries
  for each row execute function public.touch_updated_at();

-- 4. Storage buckets -----------------------------------------
-- Private bucket for client reference images (signed URLs only).
insert into storage.buckets (id, name, public)
values ('reference-images', 'reference-images', false)
on conflict (id) do nothing;

-- Public bucket for portfolio photos the owner uploads.
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Storage policies -------------------------------------------------
-- Anyone (booking form) may upload a reference image…
create policy "ref_images_public_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'reference-images');

-- …only owners may read/list them (signed URLs are generated server-side).
create policy "ref_images_owner_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'reference-images');

-- Portfolio bucket: world-readable, owner-writable.
create policy "portfolio_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio');

create policy "portfolio_owner_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio');

create policy "portfolio_owner_update_obj"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');

create policy "portfolio_owner_delete_obj"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio');

-- 5. Create your owner account --------------------------------
-- Easiest: Supabase Studio → Authentication → Users → "Add user"
-- (set an email + password, confirm it), then optionally:
--
--   update auth.users
--   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
--   where email = 'bookings.abiwandeevents@gmail.com';
--
-- Also set ADMIN_EMAILS in your environment to lock the dashboard
-- to that address.
