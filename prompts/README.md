# Prompts Playbook

Each task lives in `/prompts` as a dated markdown file:
- Naming: `YYYY-MM-DD-<short-slug>.md`  (e.g., `2025-09-05-profile-progress.md`)
- One file = one atomic task.

## Task Template
**Context (what we’re working on):**
Project: [name]
Stack: [frameworks/libs only]
Repo path: [if relevant]
Baseline: [known good state not to break]

**Task (what I want):**
- [feature/fix/bug]: [short description]
- Details: [expected behavior]
- Constraints: [e.g. Supabase only; no new deps; keep theme]

**Scope (what to deliver):**
- Output type: [full file / patch / SQL / component]
- File(s) affected: [paths]
- Format: [filenames in code fences; diffs if patch]

**Integration notes:**
- Dependencies: [which parts it touches]
- Avoid: [libs/patterns/areas to leave alone]

**Optional:**
- Comment style: [inline/minimal/none]
- Test case: [input → expected]
- Definition of done: [criteria]

## Short Version (for fast asks)
Context: [stack + baseline]
Task: [do X in file Y; expected Z]
Constraints: [no new deps; keep styles]
Deliver: [full file/patch + quick test]