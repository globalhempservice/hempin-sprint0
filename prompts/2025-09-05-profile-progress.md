**Context:**
Project: HEMP’IN STAGING
Stack: Next.js + Supabase + Tailwind
Baseline: baseline-2025-09-05; preserve auth + routes; theme consistent

**Task:**
- Type: Fix
- Details: Profile stuck on loading, should load and be pleasant to the eye 
- Constraints: No new deps; Supabase only; no route changes; keep styles.

**Scope:**
- Output: Full file for `/pages/account/profile.tsx` (or current path), plus any tiny util added under `/lib/` if needed.
- Files: list exact files touched
- Format: Code blocks per file (full content)

**Integration notes:**
- Depends on: `profiles` table; existing form components
- Avoid: RLS changes, env changes