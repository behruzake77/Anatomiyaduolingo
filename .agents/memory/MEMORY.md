# Arena Session Memory — Galahhad sun/moon theme switch for dark mode

## Task (current)

User supplied the Uiverse "theme-switch" by Galahhad (animated sun/moon day↔night pill: sliding disc, clouds that sink and stars that rise in the night state) and asked to use it to switch the CORPUS app between dark ("qorong'i") and light ("kunduzgi") mode. NOT a redesign. No new dependencies. Keep the rest of the UI as-is.

## How dark mode works in CORPUS (context)

- Store: `settings.darkMode` boolean in `artifacts/corpus/src/store/useAppStore.ts` (`toggleSetting("darkMode")`).
- `AppNavigator.tsx` effect toggles `document.documentElement.classList` `.dark` from it (+ data-theme-color etc.), and `index.html` pre-applies `.dark` from persisted storage before React loads (both stay in sync automatically).
- Settings screen (`src/screens/SettingsScreen.tsx`) previously showed dark mode as a generic `Toggle` row (rows: notifications / darkMode / sound).

## What was done this session

New files:
- `artifacts/corpus/src/theme/theme-switch.css` — faithful port of Galahhad's CSS. Source verified by fetching https://uiverse.io/Galahhad/strong-squid-82 (the version pasted by the user was truncated mid-last-rule and HTML-escaped). Changes vs original, deliberately small:
  - checkbox hidden via 1px clip (sr-only) instead of `display:none`, so Tab/Space still toggle it; added `.theme-switch__checkbox:focus-visible + .theme-switch__container` outline using `var(--theme-primary, #6c5ce7)`.
  - added `display:inline-block; line-height:0; vertical-align:middle` on `.theme-switch` so it sits cleanly inside flex rows.
  - everything else (vars, sizes, box-shadows incl. the duplicated layers, clouds box-shadow art, star SVG) copied exactly; colors lowercased; full CSS self-contained (no app tokens needed).
- `artifacts/corpus/src/components/ui/ThemeSwitch.tsx` — controlled component `{checked, onCheckedChange, size=20px, label, className}`; renders the exact Uiverse markup (clouds div, stars svg with the 7-star path, circle-container > sun-moon-container > moon + 3 spots). SVG path was verified char-by-char against the user message (77/77 command segments identical).

Modified:
- `src/screens/SettingsScreen.tsx` — only the darkMode row now renders `<ThemeSwitch checked={settings.darkMode} onCheckedChange={() => onToggle("darkMode")} size={18} label={r.label} />`; notifications/sound rows keep the existing `Toggle`; row icons/labels unchanged.
- `src/index.css` — added `@import "./theme/theme-switch.css";` after the customization.css import.

## Verification

- `corepack pnpm -r --filter ./artifacts/corpus run typecheck` passes.
- `PORT=4174 BASE_PATH=/ corepack pnpm -r --filter ./artifacts/corpus run build` passes (pre-existing chunk-size warnings only); built CSS contains all `.theme-switch__*` rules.
- Dev server running via start_process (name "CORPUS app preview", port 4173, `PORT=4173 BASE_PATH=/ corepack pnpm -r --filter @workspace/corpus run dev`); `/` returns 200; SettingsScreen.tsx + theme-switch.css transform without errors.
- Not visually inspected in a browser (no browser tool in sandbox) — user should click Settings → "Tungi rejim" row in the live preview to see the animation.

## Prior sessions (already committed history — do not redo)

- UI polish pass + 3D stickers task were completed earlier on other arena branches (see git history / merge commits). `.agents/memory` older files may describe them.
- Repo layout: corpus app lives in `artifacts/corpus` (Vite + React 19 + Tailwind v4 + zustand). UI components `artifacts/corpus/src/components/ui/`, screens in `src/screens/`, theme CSS in `src/theme/` (customization.css, theme-switch.css), imported by `src/index.css`.

## Guardrails / workspace notes (unchanged)

- Do not modify backend/DB/API/auth/supabase schema/.env.
- Do not add dependencies.
- Do not change Lessons-page top icons or bottom nav.
- Keep edits minimal and preserve the existing design system.
- pnpm not on PATH — use `corepack pnpm`. Vite requires `PORT` and `BASE_PATH`.
- [Imported artifact workflow](imported-artifact-workflow.md) — imported apps may need metadata registration; stop duplicate legacy workflows before starting the managed service.
