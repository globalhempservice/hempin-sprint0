# Sprint 2 Scaffold

This scaffold adds:
- `/shop` (UI stub)
- `/account/billing` (UI stub)
- `/admin/payments` (UI stub)
- Netlify Functions (stubs): `shop-create-order`, `shop-capture-order`, `paypal-webhook`
- `lib/pricing.ts`, `lib/paypal.ts`, `lib/supabaseAdmin.ts`
- `docs/SEEDS_SPRINT2.sql` with seed data
- `.env.example` additions

## Next steps
1. Add env vars to Netlify (Staging): `PAYPAL_*`, `SUPABASE_*`, `NEXT_PUBLIC_*`.
2. Run seed SQL in Supabase (Staging).
3. Wire `/shop` button to call `/.netlify/functions/shop-create-order` (client fetch).
4. Render PayPal Smart Buttons using the returned `orderID`; on approve, call `shop-capture-order`.
5. Implement real webhook signature verification before Production.
