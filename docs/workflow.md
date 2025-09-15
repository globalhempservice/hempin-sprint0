# Always-Build Workflow (Deterministic Netlify)

This is the golden path. If it fails locally, it will fail in CI/Netlify—which is the point.

## One-Time Repo Hygiene
- **Package manager**: npm only.
- Commit **package-lock.json** at root and in each app (`apps/*/package-lock.json`).
- Pin Node: create `.nvmrc` and `.node-version` → `20.11.1`.
- Root `package.json` engines:
  ```json
  { "engines": { "node": "20.x", "npm": "10.x" } }