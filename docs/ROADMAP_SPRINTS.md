# Roadmap — Sprints 2–4

## Sprint 2 — Shop & Payments (PayPal)

**Goal**: Enable paid onboarding for brands via a simple `/shop`, PayPal checkout, and automatic entitlement provisioning.

### Features
- `/shop` lists purchasable offers.
- PayPal checkout and webhook-driven entitlements.
- `/account/billing` shows purchased entitlements and order history.
- `/admin/payments` lists orders with status filters.

### Pricing (USD)
- Brand page — $50
- Single product page — $20
- Special Offer: 1 brand + 5 product pages — $100
- Pop-up kit (Bangkok 2025) — date-tiered:
  - ≤ 2025-09-01: $300
  - 2025-09-02 … 2025-09-30: $400
  - 2025-10-01 … 2025-10-15: $500
- Pop-up extra — $100 (1 extra exhibited + 1 product page)

### Pages
- `/shop`
- `/account/billing`
- `/admin/payments`

## Sprint 3 — Brand & Product Pages

**Goal**: Launch public-facing brand and product pages backed by CRUD tools for authenticated users.

### Features
- Public brand profile pages with custom styling.
- Product CRUD for brand owners.
- Directory listing of all brands and products.
- Role-based access for managing owned pages.

### Pricing
- Uses existing brand and product slots purchased in Sprint 2.

### Pages
- `/brands`
- `/brands/[id]`
- `/products/[id]`
- `/account/brands`
- `/account/products`

## Sprint 4 — Consumer Shopping & Search

**Goal**: Allow visitors to browse and search products, preparing for future e‑commerce.

### Features
- Searchable catalog with categories and filters.
- Featured collections and promos.
- Basic cart flow (client-side placeholder).

### Pricing
- No new offers; uses existing entitlements.

### Pages
- `/catalog`
- `/search`
- `/cart`