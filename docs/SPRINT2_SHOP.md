# Sprint 2 — Shop & Payments (PayPal)

**Goal**: Enable paid onboarding for brands via a simple `/shop`, PayPal checkout, and automatic entitlement provisioning.

## Offers & Pricing (USD)
- Brand page — $50
- Single Product page — $20
- Special Offer: 1 brand + 5 product pages — $100
- Pop-up kit (Bangkok 2025) — date-tiered (Europe/Paris):
  - ≤ 2025-09-01: $300
  - 2025-09-02 … 2025-09-30: $400
  - 2025-10-01 … 2025-10-15: $500
  - Closed after 2025-10-15
- Pop-up extra — $100 (1 extra exhibited + 1 product page)

## User Stories
- U1: `/shop` shows offers + today’s Bangkok price.
- U2: PayPal checkout (server-side create/capture).
- U3: Automatic entitlements after capture/webhook.
- U4: `/account/billing` shows entitlements + order history.
- U5: `/admin/payments` lists orders, filter by status.

## Data Model (Supabase)
```sql
create table if not exists products (
  id text primary key,
  title text not null,
  description text,
  base_price_usd integer not null,
  kind text not null
);

create table if not exists price_rules (
  id bigserial primary key,
  product_id text references products(id) on delete cascade,
  phase text not null,
  price_usd integer not null,
  start_date date not null,
  end_date date not null
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  paypal_order_id text unique,
  status text not null,
  amount_usd integer not null,
  currency text default 'USD',
  items jsonb not null,
  created_at timestamptz default now(),
  captured_at timestamptz
);

create table if not exists entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  brand_page boolean default false,
  product_slots integer default 0,
  popup_bkk_2025 boolean default false,
  popup_extras integer default 0,
  updated_at timestamptz default now()
);
```

### RLS
```sql
alter table orders enable row level security;
create policy "buyer can read their orders" on orders for select using (auth.uid() = user_id);
create policy "server can insert orders" on orders for insert with check (true);

alter table entitlements enable row level security;
create policy "owner can read their entitlements" on entitlements for select using (auth.uid() = user_id);
create policy "server can upsert entitlements" on entitlements for insert with check (true);
create policy "server can update entitlements" on entitlements for update using (true);
```

## Netlify Functions & Env Vars
- `/.netlify/functions/shop-create-order`
- `/.netlify/functions/shop-capture-order`
- `/.netlify/functions/paypal-webhook`

Env:
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_ENV` (sandbox/live).

## Pricing helper (pseudo)
```ts
function priceFor(productId: string, today: string) {
  if (productId !== 'popup_bkk_2025') return staticPrice(productId)
  if (today <= '2025-09-01') return 30000
  if (today <= '2025-09-30') return 40000
  if (today <= '2025-10-15') return 50000
  throw new Error('Registration closed for Bangkok 2025')
}
```

## Seeds (Staging)
```sql
insert into products (id,title,description,base_price_usd,kind) values
('brand_page','Brand page','Your brand page on HEMP’IN',5000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into products (id,title,description,base_price_usd,kind) values
('product','Single product page','1 product page for 1 year',2000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into products (id,title,description,base_price_usd,kind) values
('bundle_1b5p','Special Offer: Brand + 5 products','Best value starter pack',10000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into products (id,title,description,base_price_usd,kind) values
('popup_bkk_2025','Pop-up kit (Bangkok 2025)','Includes 5 exhibited products + brand + 5 product pages',50000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into products (id,title,description,base_price_usd,kind) values
('popup_extra','Pop-up extra exhibited + product page','Add one more exhibited product',10000,'one_time')
on conflict (id) do update set title=excluded.title;

insert into price_rules (product_id,phase,price_usd,start_date,end_date) values
('popup_bkk_2025','early',30000,'2025-01-01','2025-09-01'),
('popup_bkk_2025','general',40000,'2025-09-02','2025-09-30'),
('popup_bkk_2025','late',50000,'2025-10-01','2025-10-15');
```

## QA Checklist
- `/shop` pricing correct for Europe/Paris today.
- PayPal sandbox capture → local `orders` shows `captured`.
- Entitlements match purchase.
- Webhook idempotent.
- Bangkok kit closed after 2025-10-15.
- `/account/billing` shows entitlements and shipping note.
- `/admin/payments` lists orders with filters.
