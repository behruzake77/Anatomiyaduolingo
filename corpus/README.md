# 🦴 CORPUS — Learn Anatomy. Master Life.

A production-ready, **Duolingo-style** anatomy learning app — mobile-first, with a premium
medical-education feel inspired by Complete Anatomy.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router) — the "if web" option from the brief |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** + central design tokens |
| State | **Zustand** (persisted to `localStorage`) |
| Animation | **Motion** (Framer Motion) — page transitions, confetti, micro-interactions |
| Icons | **Lucide React** |

## Quick start

```bash
cd corpus
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm start         # serve the production build
```

## Screens (12)

| # | Screen | Notes |
|---|---|---|
| 1 | Splash | Logo + tagline + loading bar → auto-advance |
| 2 | Onboarding | 3 slides, dots, Skip/Next |
| 3 | Dashboard | Daily goal, streak, level, continue learning, quick topics |
| 4 | Topics | 6 body systems with progress bars |
| 5 | Lesson / Quiz | Highlighted-image question, A–D options, explanation |
| 6 | Result (Correct) | Confetti, trophy ring, +XP, stats |
| 7 | Result (Wrong) | Explanation + Retry |
| 8 | Profile | Stats + menu |
| 9 | Achievements | Unlocked badges + Coming Soon |
| 10 | Study Mode | Drag-to-rotate 3D-style viewer, play/pause |
| 11 | Progress | Week/Month/Year filter, XP chart, donut |
| 12 | Settings | Toggles, language, dark mode, privacy/terms/logout |

## Project structure

```
corpus/
├── app/
│   ├── layout.tsx        # root layout, fonts, dark-mode init script
│   ├── page.tsx          # mounts the SPA shell
│   ├── globals.css       # Tailwind + design tokens (light/dark)
│   └── icon.svg          # favicon
├── public/
│   ├── fonts/            # Poppins (local, offline)
│   ├── img/              # anatomy illustrations
│   └── logo/             # 3 logo variants (light / dark / monochrome)
└── src/
    ├── app/AppNavigator.tsx   # screen router + AnimatePresence transitions
    ├── theme/tokens.ts        # colors, spacing, radius, typography, shadows
    ├── store/useAppStore.ts   # Zustand store (progress, XP, achievements, settings)
    ├── data/                  # anatomy.ts, achievements.ts, onboarding.ts
    ├── utils/                 # cn, levels, achievements
    ├── hooks/useHaptics.ts    # vibration feedback
    ├── components/
    │   ├── ui/                # Button, Card, ProgressBar, Badge, Avatar, Toggle,
    │   │                      # Donut, Sparkline, Segmented, Confetti, Skeleton, EmptyState, Logo
    │   └── layout/            # TopBar, BottomNav, Screen
    └── screens/               # the 12 screens
```

## Features

- **Gamification** — XP, levels (Beginner → Expert), daily goal, streak, 6 badges
- **Dark mode** — no-flash init script + reactive class toggle
- **Haptics** — Vibration API with graceful fallback
- **Confetti** — canvas-based, respects `prefers-reduced-motion`
- **Responsive** — verified 360 → 1440px (no horizontal overflow); centered `max-w-md` shell
- **Accessibility** — focus rings, `aria-*` labels, semantic roles, reduced-motion support
- **Persistence** — Zustand persist → `localStorage` (key `corpus-storage`)

## Design tokens

Defined in `app/globals.css` (Tailwind `@theme`) and mirrored in `src/theme/tokens.ts`:

- Primary `#6C5CE7` · Secondary `#A29BFE` · Success `#00B894` · Accent `#FD79A8` · Dark `#2D3436` · BG `#F8F9FA`
- 8px spacing grid · radius 12/16/24 · soft purple-tinted shadows
