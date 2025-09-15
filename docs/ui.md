# UI Strategy — Option A (Inline for Market v1)

We move fast with inline components inside the `market` app. Once patterns stabilize, we extract into a shared `hempin-ui` package (later).

## Design Tokens (GHS • SSOT Future Theme)
- Brand: `--brand-1: #6B5CF6` (indigo-violet), `--brand-2: #38E2B5` (teal-mint), `--brand: #6B5CF6`
- Surfaces: `--bg: #0e0e12`, `--surface: #15151c`, `--surface-2: #1b1b25`
- Text: `--text: #eaeaf2`, `--text-2: #b9b9c7`
- States: `--success: #1ec28b`, etc.

**Tip:** keep tokens in `apps/market/styles/globals.css` and reference with Tailwind CSS vars.

## Core Components (Inline First)
- `Button` (primary/ghost/disabled + loading)
- `Card` (glassy surface, elevation tokens)
- `Navbar` (auth state aware)
- `Badge` (status, role, “leaf XP”)
- `Form` inputs (profile + org + product)
- `Modal` (confirmations)
- `List` patterns (orgs, products)

Keep APIs tiny; avoid premature variants. Prove usage in Market v1.

## Pages That Must Look Great (Now)
- **Profile**: clean sections, visible progress, obvious “Save”.
- **Brand/Product**: trustworthy info hierarchy; images responsive.
- **Checkout**: minimal friction; clear success/failure states.

## Extraction Protocol (Later)
When 3+ pages reuse the same component with few changes:
1) Move to `packages/hempin-ui/` in monorepo.
2) Add Storybook (optional) and version (e.g., `0.1.0`).
3) Replace inline imports app-by-app.