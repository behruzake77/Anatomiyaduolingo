# Arena Session Memory — Corpus UI polish + 3D stickers

## Task (current)

The existing CORPUS app UI is already polished. This task ONLY adds soft 3D stickers / 3D illustrations to appropriate places. NOT a redesign. Keep existing layout, colors, fonts, cards, radius, spacing, navigation, icons, buttons. Do NOT touch the top icons on the Lessons screen. Do NOT replace bottom nav icons. No new dependencies.

## What was already done previously (UI polish, committed-history)

That polish is present in the working tree (uncommitted in this session at one point) but the current build is based on it plus the 3D sticker task.

## Current state after 3D sticker additions

New files:
- `artifacts/corpus/public/img/3d/` — optimized transparent WebP stickers:
  - `xp-star.webp` (star, purple/lilac)
  - `streak-flame.webp` (flame, amber/orange)
  - `daily-target.webp` (target, purple/lilac)
  - `lessons-book.webp` (stacked books, purple/lilac)
  - `accuracy-check.webp` (check, purple/lilac)
  - `trophy-3d.webp` (trophy, gold/amber)
  - `bone-3d.webp` (bone, pink/lilac)
  - `heart-3d.webp` (anatomy heart, pink/coral)
  - All under ~12 KB each; 256×256; transparent; `loading="lazy"` in component.
- `artifacts/corpus/src/components/ui/Sticker3D.tsx` — lightweight reusable sticker (`<img loading="lazy">` + optional soft drop-shadow). No new deps.

Modified files:
- `DashboardScreen.tsx`:
  - Continue Learning card: added one small `lessons-book` sticker in the top-right of the image/banner area (does not cover text/button).
  - Stats grid: `StatCard` now uses 3D stickers instead of lucide icons inside the existing colored chip circle (xp-star, streak-flame, lessons-book, accuracy-check).
  - Daily goal card: replaced the lucide zap with a 24px `daily-target` sticker beside the title.
  - Unused lucide imports trimmed (`Flame`, `BookOpen`, `TrendingUp`, `LucideIcon` removed; `Zap` kept for the Continue card minutes chip).
- `ProfileScreen.tsx`:
  - Achievements heading icon replaced with `trophy-3d` 28px sticker.
  - No changes to avatar, stats/edit-forms, menu groups, or nav.
- `LibraryScreen.tsx`:
  - `TopBar` right side gets a small `lessons-book` sticker.
  - Section titles (`Darslik`, `Atlas`) get small stickers (`lessons-book`, `bone-3d`) — book cards unchanged.
- Lessons screen: untouched except for the pre-existing bottom padding change. Top icons on that screen were NOT touched (per explicit instruction).
- `i18n.ts`, `BottomNav.tsx`, `Screen.tsx`, `AppNavigator.tsx`: unchanged during 3D sticker task (already had the earlier polish).

## Asset provenance

Generated in-sandbox with a soft-3D image model, then post-processed with Pillow:
- Flood-fill from borders to remove baked-in checkerboard/background.
- Keep only large connected regions (so stray checker remnant/shadow fragments are dropped).
- Resized to 256×256 and saved as transparent WebP (quality ~86, method 6).
- No third-party copyrighted assets were imported. No external bucket downloads used (Supabase CDN SSL handshake failed in this sandbox).

## Verification

- `corepack pnpm -r --filter ./artifacts/corpus run typecheck` passes.
- `PORT=4173 BASE_PATH=/ corepack pnpm -r --filter ./artifacts/corpus run build` passes (existing chunk-size warnings only).
- Dev server running on port 4173 (`corpus-app-f2e7e4bf`), `/` and all `/img/3d/*.webp` return 200.

## Workspace notes (unchanged)

- pnpm not on PATH; use `corepack pnpm`. `npx` currently `ENOENT` because `artifacts/corpus/node_modules/.bin` is not populated after fresh install until workspace install runs; `corepack pnpm install --frozen-lockfile` fixes it.
- Vite requires `PORT` and `BASE_PATH`.

## Guardrails

- Do not modify backend/DB/API/auth/supabase schema/.env.
- Do not add dependencies.
- Do not change Lessons-page top icons or bottom nav.
- Keep edits minimal and preserve the existing design system.

- [Imported artifact workflow](imported-artifact-workflow.md) — imported apps may need metadata registration; stop duplicate legacy workflows before starting the managed service.
