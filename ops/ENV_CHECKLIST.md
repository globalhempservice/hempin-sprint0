
# ENV_CHECKLIST

Add these keys in the **Netlify Dashboard** for each site (Production, Staging). For local dev, copy `.env.example` → `.env.local` and fill with **Dev** values.

## Netlify → Site Settings → Environment

- `NEXT_PUBLIC_SUPABASE_URL` = https://<PROJECT>.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = <anon key>
- `SUPABASE_SERVICE_ROLE_KEY` = <service role key>  # Functions only

- `PAYPAL_CLIENT_ID` = (Sandbox on Staging / Live on Prod)
- `PAYPAL_SECRET` = (Sandbox on Staging / Live on Prod)
- `PAYPAL_WEBHOOK_ID` = (Create in PayPal developer dashboard)

- `SITE_URL` = https://hempin.netlify.app (prod) / https://hempin-staging.netlify.app (staging)

> Never commit real keys. Keep `.env.local` out of Git by `.gitignore`.
