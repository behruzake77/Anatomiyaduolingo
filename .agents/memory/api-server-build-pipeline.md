---
name: API server build pipeline
description: How the api-server builds for Vercel/Render, plus the pino-http import and project-reference typecheck pitfalls.
---

Build the API with the package filter, e.g. `pnpm --filter @workspace/api-server run build` (esbuild via `build.mjs`). The root `build` script no longer type-checks; it only runs each package's `build`.

**Why:** Strict `tsc` in the deploy path turns any type mismatch into a failed deploy, while the shipped artifact is an esbuild bundle that does not need type declarations.

**How to apply:** Keep deploy build commands free of `tsc`; run `pnpm run typecheck` locally or in CI instead.

`pnpm --filter @workspace/api-server run typecheck` fails with TS6305 unless `pnpm run typecheck:libs` (`tsc --build`) ran first, because `@workspace/api-zod` and `@workspace/db` are consumed as TypeScript project references.

**How to apply:** Always build the lib references before type-checking a single artifact.

pino-http must be imported as a default import: `import pinoHttp from "pino-http"`.

**Why:** Its types end with `export default PinoHttp; export { PinoHttp as pinoHttp }`, so `import * as pinoHttp from "pino-http"` produces TS2349 "This expression is not callable".

**How to apply:** Use the default import (or the named `{ pinoHttp }` import); never a namespace import.

`artifacts/corpus` and `artifacts/mockup-sandbox` vite configs throw when `PORT` (and `BASE_PATH` for the mockup) are unset, so a bare `pnpm -r run build` from the root fails in CI.

**How to apply:** Build those frontends through their package filter with `PORT` and `BASE_PATH` provided, as the Render blueprint does.
