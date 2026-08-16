# 🦴 CORPUS — Anatomiyani o'rgan. Hayotni boshqar.

A production-ready, **Duolingo-style** anatomy learning app — mobile-first, with a premium
medical-education feel inspired by Complete Anatomy. **O'zbekcha asosiy til**, inglizcha ikkilamchi.

## Tibbiyot talabalari uchun — to'liq kontent

**Manba siyosati:**
- **Ma'lumot manbai — faqat A. Ahmedov va boshq. "Anatomiya I/II jild" (2018) darsligi.** Barcha darslar, savollar, izohlar va faktlar shu kitobdan olinadi — ixtiro qilinmaydi. Har bir darsda `source: { book, page }` kitob sahifasi ko'rsatiladi.
- **"Odam anatomiyasi Atlas" (N.K. Ahmedov) — faqat rasm manbai.** Atlas faqat darslikda rasm yetishmaganda tasvir uchun ishlatiladi; undan ma'lumot/fakt olinmaydi.

**Jami: 11 tizim · 34 bo'lim · 83 dars · 953 savol** (butun kitob, 83/83 dars manbali).

**Vizual qamrov**: har bir darsda rasmli kirish slaydi + **46 ta rasmli savol** (img turi). **40 darsga kitobdan (Ahmedov I jild) kesilgan o'z rasmi** berilgan — suyaklar (25), bo'g'imlar (6) va mushaklar (9) — umumiy skelet emas, aynan o'rganilayotgan qism. **Har bir kitob rasmi raqamlangan qismlar ro'yxati bilan** keladi (masalan Atlas C1: 1-tuberculum anterius … 9-fovea dentis) — tibbiyot uchun har bir qism nomi raqam bilan ko'rsatiladi. **Topish rejimi**: har bir kitob rasmi **raqamlangan qismlar ro'yxati** bilan keladi (kitob izohining aniq nusxasi — masalan Atlas C1: 1-tuberculum anterius … 9-fovea dentis, chanoq: 29 qism). Ro'yxatdagi qismni bossangiz, rasm katta ochilib "№N — nomini rasmda toping" ko'rsatiladi va pastdagi "Ro'yxat" tugmasi bilan barcha nomlar ochiladi. Rasmda kitobning o'zi bosib chiqargan raqam bor — foydalanuvchi zoom qilib o'sha raqamni topadi. Shundan **8 tasi ko'ndalang kesma (rang bilan ajratilgan)**. Har bir rasmni bosib **to'liq ekranda kattalashtirib o'qish** mumkin (chimchilab zoom, surib ko'chirish, ikki marta bosish, sichqoncha g'ildiragi, +/− tugmalari, ESC yopish).

| Tizim | Bo'limlar | Darslar |
|---|---|---|
| 🦴 Suyaklar (Osteologiya) | 9 | 25 |
| 🔗 Bo'g'imlar (Artrologiya) | 2 | 6 |
| 💪 Mushaklar (Miologiya) | 3 | 9 |
| 🍎 Hazm tizimi | 2 | 6 |
| 🌬️ Nafas tizimi | 2 | 4 |
| 💧 Siydik tizimi | 2 | 4 |
| 👥 Jinsiy tizim | 2 | 3 |
| ⚡ Endokrin bezlar | 2 | 3 |
| ❤️ Yurak-qon tomir | 3 | 7 |
| 🧠 Asab tizimi | 4 | 10 |
| ✨ Sezgi a'zolari | 3 | 6 |

**8 xil savol turi**: test (quiz) · rasmni aniqlash (img) · moslashtirish (match) · atama yig'ish (build) · to'g'ri/noto'g'ri (tf) · tartiblash (order) · bo'sh joyni to'ldirish (fill) · tuzilma→vazifa (func)

**3 darajali qiyinlik tizimi**: savollar **oson → o'rta → qiyin** tartibida gradatsiyalanadi. Har bir darsning oxirida **klinik/amaliy (qiyin) savollar** — masalan, "tuberculum caroticum'ga bosib qon to'xtatish", "collum chirurgicum sinishi", "kichik qon aylanish doirasi" va h.k. Har savolda qiyinlik belgisi (Oson/O'rta/Qiyin) ko'rsatiladi.

Darslar kitob tartibida **ketma-ket ochiladi** (Duolingo yo'li), har bir darsda kirish slaydlari (kitob ma'lumoti + manba sahifasi).

## Kirish / Ro'yxatdan o'tish

- Ilova birinchi ochilganda **ro'yxatdan o'tish** so'raladi (username + parol, localStorage'da saqlanadi)
- **Yangi foydalanuvchi 0 XP bilan boshlaydi** — hech qanday oldindan to'ldirilgan progress yo'q
- Har bir foydalanuvchining progressi **alohida** saqlanadi (`corpus-progress-<username>`)
- Chiqish → progress saqlanib qoladi; qayta kirishda tiklanadi

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

- **O'zbekcha asosiy til** — barcha interfeys va kontent o'zbekcha (+ lotincha atamalar); Sozlamalar → Til → English
- **Gamifikatsiya** — XP, levels (Boshlang'ich → Ekspert), kunlik maqsad, seriya, 6 badge
- **Premium logo** — split-face (suyak/anatomiya), binafsha gradient, halqa + laurel aksent
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
