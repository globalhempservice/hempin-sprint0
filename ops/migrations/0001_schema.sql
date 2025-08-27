
-- Enable useful extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- PROFILES: mirrors auth.users id; auto-provisioned via trigger
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  age_verified boolean not null default false,
  role text not null default 'brand_rep' check (role in ('admin','brand_rep','visitor')),
  country text,
  created_at timestamp with time zone default now()
);

-- BRANDS
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  logo_url text,
  cover_url text,
  category text not null check (category in ('Fashion','Beauty','Homeware','Food & Drinks','Wellness','Innovation','Cannabis')),
  website text,
  socials jsonb not null default '{}'::jsonb,
  owner_id uuid references public.profiles(id) on delete set null,
  approved boolean not null default false,
  is_cannabis boolean not null default false,
  edition_city text not null default 'Bangkok',
  embargo_date date default date '2025-11-01',
  created_at timestamp with time zone default now()
);

-- BRAND MEMBERS
create table if not exists public.brand_members (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner','editor')),
  unique (brand_id, user_id)
);

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  slug text not null,
  name text not null,
  price_label text,
  description text,
  materials jsonb not null default '{}'::jsonb,
  hemp_percent int,
  images jsonb not null default '[]'::jsonb,
  is_cannabis boolean not null default false,
  edition_city text not null default 'Bangkok',
  qr_code text,
  approved boolean not null default false,
  created_at timestamp with time zone default now(),
  unique (brand_id, slug)
);

-- PACKAGES (catalog)
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  description text,
  base_price_cents int not null default 0,
  meta jsonb not null default '{}'::jsonb
);

-- PRICE RULES (date-based pricing for POPUP_KIT)
create table if not exists public.price_rules (
  id uuid primary key default gen_random_uuid(),
  package_code text not null,
  start_date date not null,
  end_date date not null,
  price_cents int not null,
  edition_city text not null default 'Bangkok'
);

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  total_cents int not null default 0,
  currency text not null default 'USD',
  created_at timestamp with time zone default now()
);

-- ORDER ITEMS
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  package_code text not null,
  quantity int not null default 1,
  unit_price_cents int not null default 0,
  brand_id uuid,
  product_id uuid
);

-- SUBMISSIONS (brand onboarding)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','submitted','needs_changes','approved')),
  notes_admin text,
  notes_user text,
  submitted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- LOGISTICS SHIPMENTS
create table if not exists public.logistics_shipments (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','in_transit','received','issue')),
  tracking_number text,
  carrier text,
  notes text,
  expected_arrival date,
  received_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- AGE CHECKS (audit)
create table if not exists public.age_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  method text not null default 'self_attest' check (method in ('self_attest','id_check')),
  checked_at timestamp with time zone default now(),
  result text not null default 'pass' check (result in ('pass','fail'))
);

-- STORAGE buckets are created in Supabase dashboard:
--   brand-media (private), product-media (private)

-- Seed core packages (optional values; edit later)
insert into public.packages (code, title, description, base_price_cents) values
  ('BRAND_PAGE', 'Brand Page (annual)', 'A public brand profile page', 5000)
  on conflict (code) do nothing;

insert into public.packages (code, title, description, base_price_cents) values
  ('PRODUCT_PAGE', 'Product Page (annual)', 'A public product detail page', 2000)
  on conflict (code) do nothing;

insert into public.packages (code, title, description, base_price_cents) values
  ('SPECIAL_1B5P', 'Special: 1 Brand + 5 Product Pages', 'Bundle offer for directory', 10000)
  on conflict (code) do nothing;

insert into public.packages (code, title, description, base_price_cents) values
  ('POPUP_KIT', 'Pop-up Kit (Bangkok 2025)', '1 Brand + 5 Products + showroom placement', 30000)
  on conflict (code) do nothing;

insert into public.packages (code, title, description, base_price_cents) values
  ('POPUP_EXTRA', 'Pop-up Extra (1 product)', 'Add +1 showroom product + product page', 10000)
  on conflict (code) do nothing;

-- Price windows for POPUP_KIT (Bangkok 2025)
insert into public.price_rules (package_code, start_date, end_date, price_cents, edition_city) values
  ('POPUP_KIT', date '2025-01-01', date '2025-09-01', 30000, 'Bangkok')
  on conflict do nothing;

insert into public.price_rules (package_code, start_date, end_date, price_cents, edition_city) values
  ('POPUP_KIT', date '2025-09-02', date '2025-09-30', 40000, 'Bangkok')
  on conflict do nothing;

insert into public.price_rules (package_code, start_date, end_date, price_cents, edition_city) values
  ('POPUP_KIT', date '2025-10-01', date '2025-10-15', 50000, 'Bangkok')
  on conflict do nothing;

-- PROFILE auto-provision trigger on new auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name',''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
