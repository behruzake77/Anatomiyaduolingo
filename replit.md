# CORPUS Anatomy Learning

Uzbek tilidagi, darslar, testlar, takrorlash, progress va anatomiya atlasini birlashtirgan o‘quv ilovasi.

## Run & Operate

- `corepack pnpm install --frozen-lockfile` — restore workspace dependencies after import
- `PORT=22229 BASE_PATH=/ corepack pnpm --filter @workspace/corpus run dev` — run the CORPUS preview
- `corepack pnpm --filter @workspace/corpus run typecheck` — check the web app types
- `PORT=4173 BASE_PATH=/ corepack pnpm --filter @workspace/corpus run build` — build the web app
- The managed Replit workflow is `artifacts/corpus: web`; it supplies `PORT=22229` and `BASE_PATH=/`.
- Supabase/auth configuration is read from the project’s local environment files; do not commit or expose those values.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite + Tailwind CSS
- Supabase client for authentication and optional persistence
- Zustand for local app state and offline-friendly persistence
- Motion, Three.js, and React Three Fiber for lightweight interaction and 3D content

## Where things live

- `artifacts/corpus/src/screens/` — app screens and navigation destinations
- `artifacts/corpus/src/components/` — shared UI, animation, mascot, and 3D sticker components
- `artifacts/corpus/src/data/` — lesson, onboarding, achievement, atlas, and UI data
- `artifacts/corpus/public/img/3d/` — local 3D stickers and `ASSET_SOURCES.md`
- `artifacts/corpus/public/3d/mascot.glb` — local mascot model
- `artifacts/corpus/public/img/stickers/` — existing animated reaction GIFs
- `artifacts/corpus/public/img/stories/` — 9:16 story banners + `covers/` thumbnails for the Home "Hikoyalar" (Project Stories); content lives in `src/data/projectStories.ts` (bilingual, `version` bump = show as unseen again)
- `artifacts/corpus/src/index.css` — design tokens and reduced-motion-safe animation utilities

## Architecture decisions

- Keep the app frontend-first and offline-friendly; local store state handles the learning flow while Supabase is optional for account/persistence features.
- Keep visual assets local so onboarding, loading, achievement, and result states do not depend on third-party CDNs.
- Use open-license 3D previews and document their sources beside the assets; check individual licenses before adding new packs.
- Preserve the existing visual system and use stickers as small decorative replacements rather than redesigning screens.

## Product

Users can register or sign in, study anatomy lessons and atlas pages, take adaptive quizzes, review mistakes, track XP/streak/progress, earn achievements, and use 3D anatomy/mascot content.

## User preferences

- User prefers quick, practical additions and wants supplied visual resources used in the appropriate product states.

## Gotchas

- Use `corepack pnpm`; plain `pnpm` may not be on PATH in a fresh environment.
- Vite needs both `PORT` and `BASE_PATH`; the managed workflow already supplies them.
- Do not copy third-party media without checking its license. Reference libraries are documented in `public/img/3d/ASSET_SOURCES.md`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
