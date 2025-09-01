-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.age_checks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  method text NOT NULL DEFAULT 'self_attest'::text CHECK (method = ANY (ARRAY['self_attest'::text, 'id_check'::text])),
  checked_at timestamp with time zone DEFAULT now(),
  result text NOT NULL DEFAULT 'pass'::text CHECK (result = ANY (ARRAY['pass'::text, 'fail'::text])),
  CONSTRAINT age_checks_pkey PRIMARY KEY (id),
  CONSTRAINT age_checks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  icon text,
  active boolean DEFAULT true,
  slug text UNIQUE,
  CONSTRAINT badges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.brand_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'editor'::text CHECK (role = ANY (ARRAY['owner'::text, 'editor'::text])),
  CONSTRAINT brand_members_pkey PRIMARY KEY (id),
  CONSTRAINT brand_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT brand_members_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);
CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  logo_url text,
  cover_url text,
  category text NOT NULL CHECK (category = ANY (ARRAY['Fashion'::text, 'Beauty'::text, 'Homeware'::text, 'Food & Drinks'::text, 'Wellness'::text, 'Innovation'::text, 'Cannabis'::text])),
  website text,
  socials jsonb NOT NULL DEFAULT '{}'::jsonb,
  owner_id uuid,
  approved boolean NOT NULL DEFAULT false,
  is_cannabis boolean NOT NULL DEFAULT false,
  edition_city text NOT NULL DEFAULT 'Bangkok'::text,
  embargo_date date DEFAULT '2025-11-01'::date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT brands_pkey PRIMARY KEY (id),
  CONSTRAINT brands_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.contribution_tiers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  label text NOT NULL,
  amount_cents integer NOT NULL,
  perks ARRAY DEFAULT '{}'::text[],
  CONSTRAINT contribution_tiers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contributions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tier_id uuid,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'USD'::text,
  paypal_order_id text,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contributions_pkey PRIMARY KEY (id),
  CONSTRAINT contributions_tier_id_fkey FOREIGN KEY (tier_id) REFERENCES public.contribution_tiers(id),
  CONSTRAINT contributions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.entitlements (
  user_id uuid NOT NULL,
  brand_page boolean NOT NULL DEFAULT false,
  product_slots integer NOT NULL DEFAULT 0,
  popup_bkk_2025 boolean NOT NULL DEFAULT false,
  popup_extras integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  key text,
  meta jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT entitlements_pkey PRIMARY KEY (user_id),
  CONSTRAINT entitlements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.event_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  name text NOT NULL,
  price_cents integer NOT NULL,
  currency text DEFAULT 'USD'::text,
  qty_total integer,
  qty_sold integer DEFAULT 0,
  CONSTRAINT event_tickets_pkey PRIMARY KEY (id),
  CONSTRAINT event_tickets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_profile_id uuid,
  brand_id uuid,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  body_md text,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  venue_name text,
  city text,
  country text,
  featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft'::text,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT events_owner_profile_id_fkey FOREIGN KEY (owner_profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.experiment_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT experiment_votes_pkey PRIMARY KEY (id),
  CONSTRAINT experiment_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT experiment_votes_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id)
);
CREATE TABLE public.experiments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  icon text,
  path text NOT NULL,
  status text NOT NULL DEFAULT 'active'::text,
  CONSTRAINT experiments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.featured_experiments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL,
  start_at timestamp with time zone DEFAULT now(),
  end_at timestamp with time zone,
  display_order integer DEFAULT 1,
  CONSTRAINT featured_experiments_pkey PRIMARY KEY (id),
  CONSTRAINT featured_experiments_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id)
);
CREATE TABLE public.logistics_shipments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'not_started'::text CHECK (status = ANY (ARRAY['not_started'::text, 'in_transit'::text, 'received'::text, 'issue'::text])),
  tracking_number text,
  carrier text,
  notes text,
  expected_arrival date,
  received_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT logistics_shipments_pkey PRIMARY KEY (id),
  CONSTRAINT logistics_shipments_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  package_code text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price_cents integer NOT NULL DEFAULT 0,
  brand_id uuid,
  product_id uuid,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'created'::text CHECK (status = ANY (ARRAY['created'::text, 'authorized'::text, 'captured'::text, 'canceled'::text, 'failed'::text, 'refunded'::text])),
  total_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD'::text,
  created_at timestamp with time zone DEFAULT now(),
  paypal_order_id text UNIQUE,
  items jsonb,
  captured_at timestamp with time zone,
  meta jsonb,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.packages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  base_price_cents integer NOT NULL DEFAULT 0,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT packages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.point_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reason text NOT NULL,
  points integer NOT NULL,
  ref_table text,
  ref_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT point_events_pkey PRIMARY KEY (id),
  CONSTRAINT point_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.price_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  package_code text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  price_cents integer NOT NULL,
  edition_city text NOT NULL DEFAULT 'Bangkok'::text,
  CONSTRAINT price_rules_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  price_label text,
  description text,
  materials jsonb NOT NULL DEFAULT '{}'::jsonb,
  hemp_percent integer,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_cannabis boolean NOT NULL DEFAULT false,
  edition_city text NOT NULL DEFAULT 'Bangkok'::text,
  qr_code text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);
CREATE TABLE public.profile_modules (
  id bigint NOT NULL DEFAULT nextval('profile_modules_id_seq'::regclass),
  user_id uuid,
  module text NOT NULL CHECK (module = ANY (ARRAY['supermarket'::text, 'trade'::text, 'events'::text, 'research'::text, 'experiments'::text])),
  enabled boolean NOT NULL DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  enabled_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_modules_pkey PRIMARY KEY (id),
  CONSTRAINT profile_modules_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profile_sessions (
  id bigint NOT NULL DEFAULT nextval('profile_sessions_id_seq'::regclass),
  user_id uuid,
  occurred_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profile_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT profile_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  name text,
  age_verified boolean NOT NULL DEFAULT false,
  role text NOT NULL DEFAULT 'brand_rep'::text CHECK (role = ANY (ARRAY['admin'::text, 'brand_rep'::text, 'visitor'::text])),
  country text,
  created_at timestamp with time zone DEFAULT now(),
  display_name text,
  avatar_url text,
  persona text DEFAULT 'consumer'::text CHECK (persona = ANY (ARRAY['consumer'::text, 'pro'::text, 'researcher'::text])),
  interests ARRAY DEFAULT '{}'::text[],
  city text,
  session_count integer DEFAULT 0,
  last_seen_at timestamp with time zone,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.proposals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL,
  brand_id uuid,
  supplier_id uuid,
  price numeric,
  moq numeric,
  lead_time_days integer,
  notes text,
  status text NOT NULL DEFAULT 'submitted'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT proposals_pkey PRIMARY KEY (id),
  CONSTRAINT proposals_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT proposals_rfq_id_fkey FOREIGN KEY (rfq_id) REFERENCES public.rfqs(id),
  CONSTRAINT proposals_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.rfq_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL,
  sku text,
  description text,
  qty numeric,
  unit text,
  CONSTRAINT rfq_items_pkey PRIMARY KEY (id),
  CONSTRAINT rfq_items_rfq_id_fkey FOREIGN KEY (rfq_id) REFERENCES public.rfqs(id)
);
CREATE TABLE public.rfq_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rfq_messages_pkey PRIMARY KEY (id),
  CONSTRAINT rfq_messages_rfq_id_fkey FOREIGN KEY (rfq_id) REFERENCES public.rfqs(id),
  CONSTRAINT rfq_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.rfqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  title text NOT NULL,
  spec text,
  quantity numeric,
  unit text,
  incoterms text,
  target_price numeric,
  currency text DEFAULT 'USD'::text,
  status text NOT NULL DEFAULT 'draft'::text,
  closes_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rfqs_pkey PRIMARY KEY (id),
  CONSTRAINT rfqs_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.safe_agreements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  contribution_id uuid,
  terms jsonb NOT NULL,
  file_path text,
  status text NOT NULL DEFAULT 'draft'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT safe_agreements_pkey PRIMARY KEY (id),
  CONSTRAINT safe_agreements_contribution_id_fkey FOREIGN KEY (contribution_id) REFERENCES public.contributions(id),
  CONSTRAINT safe_agreements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.shop_price_rules (
  id bigint NOT NULL DEFAULT nextval('shop_price_rules_id_seq'::regclass),
  product_id text,
  phase text NOT NULL,
  price_usd integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  CONSTRAINT shop_price_rules_pkey PRIMARY KEY (id),
  CONSTRAINT shop_price_rules_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.shop_products(id)
);
CREATE TABLE public.shop_products (
  id text NOT NULL,
  title text NOT NULL,
  description text,
  base_price_usd integer NOT NULL,
  kind text NOT NULL,
  CONSTRAINT shop_products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  brand_id uuid,
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'submitted'::text, 'needs_changes'::text, 'approved'::text])),
  notes_admin text,
  notes_user text,
  submitted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT submissions_pkey PRIMARY KEY (id),
  CONSTRAINT submissions_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.ticket_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  event_id uuid,
  ticket_id uuid,
  qty integer NOT NULL,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD'::text,
  paypal_order_id text,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_orders_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_orders_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT ticket_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT ticket_orders_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.event_tickets(id)
);
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL,
  awarded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_badges_pkey PRIMARY KEY (id),
  CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id)
);
