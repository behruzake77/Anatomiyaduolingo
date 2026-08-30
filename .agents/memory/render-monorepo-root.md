---
name: Render monorepo root
description: Deployment path convention for the CORPUS app in the PNPM workspace.
---

Render's service root must be the repository root for this workspace; the frontend is nested under `artifacts/corpus`, not a top-level `corpus` directory.

**Why:** A service configured with `Root Directory=corpus` fails before installation because that directory does not exist in the migrated repository.

**How to apply:** Build with the workspace filter and publish `artifacts/corpus/dist/public`; keep Supabase browser env vars available during the Vite build.

Render's Node environment already provides `pnpm`; do not run `corepack enable` in the build command because `/usr/bin` can be read-only and Corepack may fail with `EROFS`.

**Why:** The Render build container's preinstalled pnpm is usable as-is, while Corepack's attempt to replace its system link is not permitted.

**How to apply:** Start the Render build command directly with `pnpm install --frozen-lockfile`.