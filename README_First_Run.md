
# HEMP'IN – Sprint 0 Scaffold

Created: 2025-08-27

This repository contains the **Sprint 0** scaffolding: ops checklists, Supabase schema & RLS, Netlify config, and a minimal Next.js + Tailwind app wired for Supabase.

## 0) Prerequisites
- Install **Node.js 20+** (https://nodejs.org/)
- Install **Git** (https://git-scm.com/)
- Install **Cursor** (https://cursor.com) or VS Code
- Have accounts for **GitHub**, **Netlify**, **Supabase**

## 1) First run locally
1. Copy `.env.example` → `.env.local` and fill in dev keys (from your **Dev** Supabase project; PayPal Sandbox is fine for now).
2. Install deps:
   ```bash
   npm install
   ```
3. Start dev:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## 2) Connect to GitHub
```bash
git init
git add .
git commit -m "chore: sprint 0 scaffold"
git branch -M main
git remote add origin <YOUR_GITHUB_PRIVATE_REPO_URL>
git push -u origin main
```

## 3) Netlify sites
- **Production** site → connects to `main` branch
- **Staging** site → connects to `staging` branch
- Enable Deploy Previews for PRs

**Environment Variables** (per site, in Netlify Dashboard):
- Production: Supabase **Prod** URL/Anon/Service; PayPal **Live**; `SITE_URL` = your prod URL
- Staging: Supabase **Staging** URL/Anon/Service; PayPal **Sandbox**; password-protect the site
- Deploy Previews: Supabase **Dev**; PayPal **Sandbox**

## 4) Supabase projects
Create three projects: **Dev**, **Staging**, **Prod**. In each:
- SQL Editor → run `ops/migrations/0001_schema.sql`, then `ops/migrations/0002_rls.sql`
- Storage: create `brand-media` and `product-media` buckets (private)
- Auth: configure email templates; disable providers you won't use

## 5) Next Steps
- Seed dummy data on Staging: run `ops/seeds/dummy/seed.sql` in Staging SQL editor.
- (Optional) Mirror Prod → Staging safely using `ops/RUNBOOK_Staging_Refresh.md` later.
- Configure PayPal webhooks to your Netlify Functions once Sprint 2 starts.
