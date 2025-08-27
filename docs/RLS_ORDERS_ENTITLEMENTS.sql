-- docs/RLS_ORDERS_ENTITLEMENTS.sql
-- Ensure minimal RLS policies exist (safe to run multiple times).

alter table if exists orders enable row level security;
do $$ begin
  create policy "buyer can read their orders" on orders
    for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "server can insert orders" on orders
    for insert with check (true);
exception when duplicate_object then null; end $$;

alter table if exists entitlements enable row level security;
do $$ begin
  create policy "owner can read their entitlements" on entitlements
    for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "server can upsert entitlements" on entitlements
    for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "server can update entitlements" on entitlements
    for update using (true);
exception when duplicate_object then null; end $$;
