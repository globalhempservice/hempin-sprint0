# Status

## Routes
- `apps/directory/pages/index.tsx` → `/`
- `apps/directory/pages/account/index.tsx` → `/account`
- `apps/directory/pages/account/brand/index.tsx` → `/account/brand`
- `apps/directory/pages/admin/index.tsx` → `/admin`
- `apps/directory/pages/api/health.ts` → `/api/health`

## Components
- `lib/authGuard.tsx` for Supabase auth
- `components/Alert.tsx` & `components/Stepper.tsx` as shared tokens; no dedicated header/nav component present.

## Supabase tables
- `profiles`
- `brands`
- `submissions` (RLS implied via user checks in queries; specifics not visible).

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
(from `lib/supabaseClient.ts`)

## Build note
Monorepo app at `apps/directory`. To build locally:

```
npm --prefix apps/directory install
npm --prefix apps/directory run build
```
(Build not executed in offline container.)

## Sprint 3 — S3-01
- Global Header with burger nav (auth-aware).
- Stub routes: /start, /event/bangkok2025, /contact, /mybrand, /myproducts.
- Minimal drawer utilities appended to styles/globals.css.