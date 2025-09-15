# Hempin.org — Mothership

Hemp’in is the mothership. Not a side project, not a showroom brand—the **ecosystem hub**.

## What Hemp’in Is
- **Public identity + operating system** of the hemp ecosystem.
- Modules (“universes”) orbit the **user**: Fund, Market, Places, Organizations.
- **User Profile** is central: onboarding, badges/trophies, “leaf XP”, levels.
- **Showrooms** (Bangkok 2025 first) are physical extensions of the platform.

## Why This Exists
Industrial hemp is scattered across farms, processors, brands, researchers, and complex regulations. Hemp’in unifies:
- **Discovery** (directory, marketplace, events)
- **Coordination** (profiles, org links, associations, governance)
- **Commerce** (Shop + entitlements + payments)
- **Knowledge** (research, standards, compliance)

## Product Surfaces (Phase Line)
### Phase 1 (now)
- **Market v1** (inline UI): brand pages, product pages, checkout (PayPal), entitlements.
- **Profiles** (MVP): onboarding that actually saves; roles clear; completion % accurate.
- **Organizations**: basic list + detail; association links.
- **Admin**: 2-column console; moderate submissions; view orders.

### Phase 2
- **Performance**: Market speed, profile stability, nav/auth loop fixes.
- **Showroom Bangkok 2025**: landing, brand roster, packages, event logistics.
- **Research/Events**: carve basic index + detail pages from SSOT.

### Phase 3+
- **Universes**: Farm/Factory tools, Places directory, Fund portal.
- **Hempin-UI** package extraction (from proven inline components).
- **Geo-filtering & compliance** (country gating), WeChat mini-programs, LINE stores.
- **3D renders** of products.

## Brand & Design Pillars
- **GHS • SSOT Future Theme**: glassy dark mode, crisp type, modern orbital visuals.
- Tokens: teal **#38E2B5**, indigo **#2C2F64**, gold **#C9A66B**.
- Visual language: cosmic/nebula + orbits; minimalist UI; clarity over clutter.

## Architecture (High Level)
- **Next.js (Pages Router)** + **Tailwind CSS** (tokens in `globals.css`).
- **Supabase** (Postgres + RLS) for Auth + DB.
- **Netlify** (staging + production) with deterministic builds.
- Payments: **PayPal** first, **Stripe** later.
- Monorepo with app workspaces (e.g., `apps/directory` or `apps/market`).

## Governance & Roles (MVP)
- User: roles = brand, researcher, association, vendor, citizen (readers).
- Organization: membership in associations (EIHA, FIHO, national/regional).
- Admin: moderate orgs/products/events; review orders; grant entitlements.

## North Star
**Soil → Stars**: show real provenance (farm → fiber → yarn → fabric → product), quantify impact (LCA/carbon), reward good actors (badges, tokens later), and make it delightful to participate.