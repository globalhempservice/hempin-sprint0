
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.brand_members enable row level security;
alter table public.products enable row level security;
alter table public.packages enable row level security;
alter table public.price_rules enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.submissions enable row level security;
alter table public.logistics_shipments enable row level security;
alter table public.age_checks enable row level security;

-- Helper: is_admin
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role = 'admin'
  );
$$;

-- PROFILES policies
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select using (
  id = auth.uid() or public.is_admin(auth.uid())
);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update using (id = auth.uid());

-- BRANDS policies
drop policy if exists brands_public_read on public.brands;
create policy brands_public_read on public.brands
for select using (
  approved = true
  and (embargo_date is null or embargo_date <= now()::date)
  and (
    not is_cannabis
    or (
      auth.uid() is not null
      and exists (
        select 1 from public.profiles pr
        where pr.id = auth.uid() and pr.age_verified = true
      )
    )
  )
);

drop policy if exists brands_owner_read_write on public.brands;
create policy brands_owner_read_write on public.brands
for all using (
  owner_id = auth.uid() or public.is_admin(auth.uid())
) with check (
  owner_id = auth.uid() or public.is_admin(auth.uid())
);

-- BRAND MEMBERS policies
drop policy if exists brand_members_owner on public.brand_members;
create policy brand_members_owner on public.brand_members
for all using (
  exists (
    select 1 from public.brands b
    where b.id = brand_id
      and (b.owner_id = auth.uid() or public.is_admin(auth.uid()))
  )
) with check (
  exists (
    select 1 from public.brands b
    where b.id = brand_id
      and (b.owner_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

-- PRODUCTS policies
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
for select using (
  approved = true
  and exists (
    select 1 from public.brands b
    where b.id = products.brand_id
      and b.approved = true
      and (b.embargo_date is null or b.embargo_date <= now()::date)
  )
  and (
    not is_cannabis
    or (
      auth.uid() is not null
      and exists (
        select 1 from public.profiles pr
        where pr.id = auth.uid() and pr.age_verified = true
      )
    )
  )
);

drop policy if exists products_owner_read_write on public.products;
create policy products_owner_read_write on public.products
for all using (
  exists (
    select 1 from public.brands b
    where b.id = products.brand_id
      and (b.owner_id = auth.uid() or public.is_admin(auth.uid()))
  )
) with check (
  exists (
    select 1 from public.brands b
    where b.id = products.brand_id
      and (b.owner_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

-- PACKAGES (read-only public)
drop policy if exists packages_public_read on public.packages;
create policy packages_public_read on public.packages
for select using (true);

-- PRICE RULES (read-only public)
drop policy if exists price_rules_public_read on public.price_rules;
create policy price_rules_public_read on public.price_rules
for select using (true);

-- ORDERS & ORDER ITEMS (owner + admin)
drop policy if exists orders_owner on public.orders;
create policy orders_owner on public.orders
for all using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists order_items_owner on public.order_items;
create policy order_items_owner on public.order_items
for all using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

-- SUBMISSIONS (owner + admin)
drop policy if exists submissions_owner on public.submissions;
create policy submissions_owner on public.submissions
for all using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- LOGISTICS (owner brand + admin) – read/update by brand owner/admin
drop policy if exists logistics_owner on public.logistics_shipments;
create policy logistics_owner on public.logistics_shipments
for all using (
  exists (
    select 1 from public.brands b
    where b.id = logistics_shipments.brand_id
      and (b.owner_id = auth.uid() or public.is_admin(auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.brands b
    where b.id = logistics_shipments.brand_id
      and (b.owner_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

-- AGE CHECKS (owner + admin)
drop policy if exists age_checks_owner on public.age_checks;
create policy age_checks_owner on public.age_checks
for all using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));
