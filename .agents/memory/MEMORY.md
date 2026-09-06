# Arena Session Memory — Uiverse: theme switch + pulse loader + GoBack sweep button

## Task (current session)

User feedback on the theme switch: "zor chiqan" (looks great) but (1) make it smaller with a fitting size, (2) make it actually work. Done:

- **Size**: `SettingsScreen.tsx` passes `size={12}` (was 18) → pill is 67.5×30px (was 101×45), height now matches the sibling `Toggle` (h-7 = 28px).
- **Real "not working" bug found & fixed**: the personalization rules `:root[data-background-style=…]` in `customization.css` (specificity 0,2,0) beat the `.dark` token block (0,1,0), so with ANY background style other than "Toza" selected (Lavanda/Yashil/Tun), toggling dark mode left `--bg` light → app went half-dark (dark cards on light background) → "button doesn't work". Fix: `.dark` → `:root.dark` in `index.css` (0,2,0 + later source order wins the tie); background tints now only affect light mode, dark palette always applies fully when dark mode is on.
- **Bigger tap target**: darkMode row text is now a `<label htmlFor>` bound to the switch input (`ThemeSwitch` gained an optional `id` prop; `SettingsScreen` passes `useId()`), so tapping "Tungi rejim" also toggles.
- **Polish**: `role="switch"` on the hidden checkbox; `haptic(10)` via `useHaptics()` on toggle (matches QuestionCard/ProjectStories patterns).
- Verified end-to-end with a Node vm + happy-dom harness that loads the vite dev server modules for real: click → `input.checked` flips → `html.dark` class → `--bg/--surface/--ink` flip (checked with the real compiled CSS injected) → persisted to `corpus-storage`; toggles back; row-text label tap works; verified with backgroundStyle clean/lavender/midnight. `typecheck` and `build` pass.

## Task (previous)

Three user-supplied Uiverse widgets, integrated into the CORPUS app with minimal edits (no redesign, no new deps):

1. **Galahhad sun/moon theme switch** (uiverse.io/Galahhad/strong-squid-82, MIT) — controls the app's dark/light mode from the Settings screen.
2. **milley69 heartbeat pulse loader** (Uiverse, `.loading` polyline) — replaces the round 3D sticker (`daily-target.webp`) that sat above "Yuklanmoqda…" in the Suspense fallback screen.
3. **AKAspidey01 "Go Back" sweep button** (Uiverse Tailwind button) — white pill button with a green rounded pill (back arrow) that expands across the button on hover; added to the two spots the user picked ("both"): the wrong-result screen and the lesson intro slides.

## Dark mode wiring (context)

- Store: `settings.darkMode` boolean (`toggleSetting("darkMode")`) in `artifacts/corpus/src/store/useAppStore.ts`.
- `AppNavigator.tsx` toggles `document.documentElement` `.dark` (+ data-theme attrs); `index.html` pre-applies `.dark` from persisted storage pre-hydration.
- Settings screen previously used a generic `Toggle` for the darkMode row.

## What was done

Theme switch (session part 1):
- `src/theme/theme-switch.css` — faithful Galahhad port (canonical CSS fetched from the uiverse page; the user's paste was truncated mid-last-rule). Deliberate deviations: checkbox hidden via 1px clip instead of `display:none` (keyboard-focusable) + `:focus-visible` outline using `var(--theme-primary, #6c5ce7)`; `.theme-switch` made `inline-block; line-height:0; vertical-align:middle`. Everything else pixel-faithful; size scales via `--toggle-size` (px set inline by the component).
- `src/components/ui/ThemeSwitch.tsx` — controlled `{checked, onCheckedChange, size=20, label, className}`; renders exact original markup; star SVG path verified 77/77 command segments vs user message.
- `SettingsScreen.tsx` — darkMode row only: `<ThemeSwitch checked={settings.darkMode} onCheckedChange={() => onToggle("darkMode")} size={18} label={r.label} />`; other rows keep `Toggle`.
- `src/index.css` — imports `theme-switch.css` (after customization.css).

GoBack sweep button (session part 3, user picked "both" spots):
- `src/components/ui/GoBackButton.tsx` — pure-Tailwind port of the AKAspidey01 widget (no CSS file needed). Original: `button.bg-white.w-48.rounded-2xl.h-14` + `div.bg-green-400.w-1/4.group-hover:w-[184px].duration-500` + back-arrow SVG paths (copied verbatim) + `<p>Go Back</p>`.
  - Faithful behavior: h-14, rounded-2xl, green-400 pill h-12 top-[4px] left-1, rounded-xl, `group-hover` pill grows `w-[calc(100%-0.5rem)]` (original's 184px = full width minus 8px; % keeps it right at any width), duration-500, arrow SVG 25px.
  - Structure changed to a reusable component: label is centered in the zone right of the resting pill (`left-[3.75rem]` … `right-3`, `truncate text-center`), so long localized labels stay readable in every state; button `w-full min-w-48` so it stretches in flex stacks; `focus-visible` ring; `dark:bg-surface2 dark:text-ink` (light mode keeps the exact original white/black).
  - App is LTR-only (uz/en), so the fixed left pill is safe.
- `ResultWrongScreen.tsx` — bottom stack now: primary `retry` Button + `<GoBackButton label={t.backToTopics}>` (replaces the ghost Button).
- `LessonScreen.tsx` (`SlideView`) — bottom controls now stacked: primary continue Button on top, `<GoBackButton label={t.backToTopics}>` below (was ghost back + primary side-by-side).

Pulse loader (session part 2):
- `src/components/ui/PulseLoader.tsx` + `PulseLoader.css` — exact milley69 markup (`<div class="loading">` > svg 64×48 with `#back`/`#front` polylines, `dash_682` keyframes). Added `role="status"`; also static-stroke fallbacks for `html.low-end` and `prefers-reduced-motion` (mirrors CorpusLoader.css conventions).
- `AppNavigator.tsx` — `ScreenFallback` (Suspense fallback) now renders `<PulseLoader />` + the unchanged "Yuklanmoqda…" caption; `Sticker3D`/`daily-target.webp` removed from that view and the import swapped.

## Verification

- `corepack pnpm -r --filter ./artifacts/corpus run typecheck` passes.
- `PORT=4174 BASE_PATH=/ corepack pnpm -r --filter ./artifacts/corpus run build` passes (pre-existing chunk-size warnings only); built CSS contains `.theme-switch__*` and `dash_682` rules.
- Dev server via start_process (name "CORPUS app preview", port 4173, `PORT=4173 BASE_PATH=/ corepack pnpm -r --filter @workspace/corpus run dev`); `/` 200; modules/CSS transform cleanly.
- Not visually inspected in a browser (no browser tool) — user checks the live preview.
- Commits on `arena/01a071ef-anatomiyaduolingo`: b4eda89 (theme switch) + one for the loader; PR #29 open against main (title/body kept in sync via REST API because `gh pr edit` fails on a legacy "Projects (classic)" GraphQL warning — workaround: `gh api -X PATCH repos/behruzake77/Anatomiyaduolingo/pulls/29 -F body=@file`).

## Prior sessions (already committed history — do not redo)

- UI polish pass + 3D stickers task completed earlier on other arena branches (see git history / merge commits).
- Repo layout: corpus app in `artifacts/corpus` (Vite + React 19 + Tailwind v4 + zustand); screens `src/screens/`, ui components `src/components/ui/`, theme CSS `src/theme/` imported by `src/index.css`, plus colocated component CSS imports (CorpusLoader.css, PulseLoader.css).

## Guardrails / workspace notes (unchanged)

- Do not modify backend/DB/API/auth/supabase schema/.env.
- Do not add dependencies.
- Do not change Lessons-page top icons or bottom nav.
- Keep edits minimal and preserve the existing design system.
- pnpm not on PATH — use `corepack pnpm`. Vite requires `PORT` and `BASE_PATH`.
- [Imported artifact workflow](imported-artifact-workflow.md) — imported apps may need metadata registration; stop duplicate legacy workflows before starting the managed service.

