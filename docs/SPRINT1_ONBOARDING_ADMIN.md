# Sprint 1 — Onboarding & Admin (Completed)

**Goal**: Clean foundation + brand onboarding with moderation, plus admin queue.  
**Status**: ✅ Live on Staging (and changes merged accordingly).

## What shipped
- **Auth**: Supabase email magic-link; `/account` sign-in.
- **Guarding**: `useAuthGuard` redirect for protected pages.
- **Brand onboarding** (`/account/brand`):
  - Draft creation and **autosave on Next** (Sprint 1.1).
  - Category & website step; hidden slug.
  - Submission flow → creates `submissions` row.
  - **Status banners**: approved / submitted / needs changes (Sprint 1.2/1.3).
  - **Locking**: when submitted/approved, inputs are disabled (Sprint 1.3).
  - **Stepper completion derived from data** (Sprint 1.3).
- **Admin queue** (`/admin`):
  - View pending submissions with notes.
  - Actions: **Approve** (sets `brands.approved=true` and `submissions.status='approved'`), **Needs changes** (sets `submissions.status='needs_changes'`).
  - Cards disappear after action.
  - Mobile spacing fix for buttons.
- **Health check**: `/api/health` returns `{ ok: true }`.

## Data model (relevant tables)
- `brands`: owner_id, name, slug, category, website, approved, embargo_date
- `submissions`: user_id, brand_id, status (`submitted|approved|needs_changes`), notes_user, submitted_at
- `profiles`: role (`admin|user`) for gating `/admin`

## Environments
- **GitHub**: private repo; branches `staging`, `main`, and feature branches via PRs.
- **Netlify**: two sites — *Production* (main) and *Staging* (staging); Node 20.
- **Supabase**: staging & prod projects; email auth enabled.

## Admin setup
- Set your admin email in `profiles.role='admin'` via SQL:
```sql
update profiles set role='admin'
where id in (select id from auth.users where email = 'me@pauliglesia.com');
```
- Backfill latest submissions to approved (if brand was already approved):
```sql
update submissions s
set status = 'approved'
from (
  select brand_id, max(submitted_at) as last_time
  from submissions
  group by brand_id
) last
join brands b on b.id = last.brand_id
where s.brand_id = last.brand_id
  and s.submitted_at = last.last_time
  and b.approved = true
  and s.status = 'submitted';
```

## Sanity checklist
- `/api/health` returns `{ ok: true }`.
- `/account` magic-link flow works.
- `/account/brand` autosaves on step 1; submission inserts row.
- `/admin` approves or requests changes → DB updates as expected.

## Notes
- Public brand pages and product CRUD are **out of scope** for Sprint 1; planned in Sprint 3/4.
