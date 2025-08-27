
# RUNBOOK – Refresh Staging from Prod (Safe + Anonymized)

## Option A – Manual (Dashboard)
1) In **Prod** Supabase → **Backups** → Download latest dump (or create new).
2) In **Staging** Supabase → **SQL Editor**:
   - Drop + recreate schema (or create a new empty project).
   - Import the **Prod** dump.
3) Run `ops/anonymize.sql` in **Staging** to scrub PII:
   - Hash/replace emails, names, phone numbers.
4) Storage (media):
   - Optionally copy buckets `brand-media/` and `product-media/` from Prod to Staging (download/upload or via Supabase CLI).
5) Verify RLS & auth settings match staging expectations (read-only if desired).
6) Test the site flows on `hempin-staging.netlify.app`.

## Option B – Supabase CLI (Advanced)
- Install Supabase CLI: https://supabase.com/docs/guides/cli
- Use `supabase db dump` from Prod and `supabase db restore` into Staging.
- Then run `ops/anonymize.sql` against Staging.

## Notes
- Never copy **live** PayPal credentials to Staging.
- For staging mirror, consider enforcing **read-only RLS** for writes.
