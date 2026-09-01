# Arena Session Memory — Corpus UI polish

## Task

Polish the existing CORPUS app UI to feel like a real mobile app (NOT a full redesign). Keep existing colors, fonts, gradients, cards, icons, visual identity. No backend/database/API/auth changes. No new dependencies. Only fix UI alignment, spacing, responsiveness, navigation, profile header, avatar, UX.

## Current State

All UI polish patches are now applied and verified:

- **Fixed typecheck**: added `return undefined;` in the `AppNavigator.tsx` back-button effect catch block (pre-existing `TS7030`).
- **Home screen header** rewritten: CORPUS brand header removed; now a compact personal header with avatar (supports emoji/color/image via local `HeaderAvatar`), `Xayrli kun`, username, `Daraja X · Boshlang'ich`, and bell on the right. Existing `StreakCelebration`, `AdBanner`, `DashboardBanners`, `WelcomeBackModal` preserved.
- **Home screen content**: kept Continue Learning card (improved truncation/shrink chips), added responsive 2×2 stat grid (Jami XP / Kunlik seriya / Darslar / Aniqlik) and a `Bugungi maqsad` progress card with 100% completion text. No horizontal page scroll introduced.
- **BottomNav**: 4 equal tabs — Bosh sahifa / Darslar / Kutubxona / Profil (3rd is `Kutubxona`, not Reyting). Active top indicator + pill, larger tap area, truncation, `max(env(safe-area-inset-bottom), 0.5rem)` bottom padding, `active:scale` feedback.
- **i18n**: `learn` now `Darslar` (uz) / `Lessons` (en); added `goalCompleted`, `menuMyProfile`, `menuReading`, `menuActivities`, `menuSettings`, `menuOpen`, `menuItems`, and changed `yourProfile` to `Mening profilim` / `My profile`.
- **ProfileScreen**: avatar now `64px` (`h-16 w-16`) and centered inside the Donut ring (no crop/overlap), stats/daily-goal/accuracy cards fixed alignment, and long menu is grouped into 4 collapsible category cards: Mening profilim / O'qish / Faoliyatlar / Sozlamalar. `aria-expanded` added. Existing achievements carousel preserved.
- **Screen wrapper**: bottom padding reduced from `7rem` to `calc(5rem + env(safe-area-inset-bottom))` to match the shorter nav and keep content above the gesture bar.
- **Library + Lessons** (the only non-`Screen`-padded tabs that show the bottom nav) now also use `pb-[calc(5rem+env(safe-area-inset-bottom))]` instead of a hardcoded `pb-28`.

## Key Results

- `corepack pnpm -r --filter ./artifacts/corpus run typecheck` passes.
- `PORT=4173 BASE_PATH=/ corepack pnpm -r --filter ./artifacts/corpus run build` passes (Vite build to `dist/public`; chunk-size warning is pre-existing).
- Dev server running at port 4173 (`corpus-app-22a54fc7`); `/` returns 200.
- No backend/DB/API/auth files changed. No dependencies added.

## Workspace Notes

- `pnpm` is NOT on PATH; use `corepack pnpm` (pnpm v10.26.1). Node v22.22.3, npm 10.9.8, corepack 0.34.6.
- Dependencies were installed: `corepack pnpm install --frozen-lockfile` (539 packages).
- Vite `build`/`dev` require `PORT` and `BASE_PATH` env vars (mandatory in `artifacts/corpus/vite.config.ts`). Use `PORT=4173 BASE_PATH=/`.
- Source app is under `artifacts/corpus/src`.

## Errors & Dead Ends

- Build without `PORT`/`BASE_PATH` fails inside `vite.config.ts` — expected, not a code bug.
- Typecheck initially failed on `AppNavigator.tsx` `TS7030` — fixed (see Current State). Actual UI files then passed typecheck and build.

## Immediate Next Steps

- Commit the changes on `arena/01a05c8d-anatomiyaduolingo` and push only that branch.
- If the user wants, open a PR from `arena/01a05c8d-anatomiyaduolingo`.
- Final responsiveness QA at 360/375/390/412 px (no browser render tool available here; verified by code review + typecheck/build).

## Actions Taken

- Read project structure and identified it as a Vite + React + Tailwind + Zustand app in `artifacts/corpus`.
- Read `AppNavigator`, layout `Screen`/`BottomNav`/`TopBar`, `DashboardScreen`, `ProfileScreen`, `Avatar`, `Donut`, `Card`, `Button`, `Logo`, `ProgressBar`, `InboxBell`, `DashboardBanners`, `AdBanner`, `store/useAppStore`, `i18n.ts`, `theme/tokens.ts`, `index.css`.
- Installed dependencies via `corepack pnpm install --frozen-lockfile`.
- Patched `AppNavigator.tsx` (TS7030 fix).
- Rewrote `DashboardScreen.tsx` (personal header, stats 2×2, daily goal; preserved continue card + banners/modal).
- Rewrote `ProfileScreen.tsx` (fixed avatar, grouped collapsible menu).
- Updated `BottomNav.tsx` (4 balanced tabs, safe-area, active indicator, feedback).
- Updated `Screen.tsx` and Library/Lessons bottom padding for nav clearance/spacing system.
- Updated `i18n.ts` (nav label + profile group/goal strings, uz + en).
- Ran `typecheck` and `build` — both pass.

## Memory Constraints / Guardrails

- Do not bump base branch, only `arena/01a05c8d-anatomiyaduolingo`.
- Don't switch branches; don't edit backend, DB, API, auth, supabase schema, or `.env.local`.
- Keep all edits UI-only and preserve existing design tokens/components.
