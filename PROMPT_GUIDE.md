# AI Coding Guardrails (Codex / Cursor / ChatGPT)

**STACK (hard constraints)**
- Next.js (Pages Router) + Tailwind CSS
- Supabase (Auth, DB, RLS). 
- Deploy: Netlify (Node 20)
- Timezone: Europe/Paris

**DO NOT INTRODUCE**
- Prisma, Drizzle, Sequelize
- Zustand, Redux, shadcn/ui, next-auth
- Global rewrites of folder structure

**ALWAYS PRESERVE**
- Working auth and session flows
- Public routes: /organizations, /marketplace, /research
- Account routes: /account/*
- Admin routes: /admin/*
- Theme: “GHS • SSOT Future Theme” (glassy cards, consistent buttons)

**STYLE**
- TypeScript where files are already TS; otherwise keep current file type
- Minimal deps; prefer stdlib + existing utilities
- Keep functions pure where possible; avoid side effects in components

**CODE DELIVERY CONTRACT**
- If asked for a *full file*, return the entire file content, nothing else
- If asked for a *patch*, change only the requested lines and show unified diff
- Do not rename/move files unless explicitly requested
- Include brief rationale at the top of the PR description (“What/Why/How to test”)

**DB & SECURITY**
- Respect existing Supabase tables and RLS policies
- Never expose service keys client-side
- Queries must check auth context when reading/writing user data

**PERF & DX**
- Keep bundle size stable; no heavy UI kits
- No breaking changes to env vars or build config unless requested

> If a task conflicts with these guardrails, STOP and propose a minimal alternative.