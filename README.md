# 🦴 AnatomiLingo

Anatomiyani **Duolingo uslubida** o'rganish uchun premium, mobile-first (PWA) o'quv platformasi.

> "Anatomiyani o'rgan. Hayotni boshqar."

## Asosiy kontent manbalari

Ilova to'rtta hujjatga tayangan holda qurilgan (ixtiro qilingan mazmun emas):

| Manba | Mazmun |
|---|---|
| **Anatomiya I jild** (A. Ahmedov va boshq., 2018) | Osteologiya, artrologiya, miologiya, hazm va nafas a'zolari |
| **Anatomiya II jild** (A. Ahmedov va boshq., 2018) | Siydik-tanosil, endokrin, yurak-tomir, nerv, sezgi a'zolari |
| **Odam anatomiyasi — Atlas I/II jild** (N.K. Ahmedov, 2004–2005) | Vizual anatomik manba |
| Sketchfab ochiq ta'lim 3D modellari | Interaktiv 3D anatomiya |

## Kontent quvuri (pipeline)

```
KITOB → BOB → MAVZU → DARS → ANATOMIK TUZILMA → TUSHUNTIRISH → SAVOLLAR → QUIZ → PROGRESS
  │                                                          ▲
  └────────────── ATLAS (vizual manba) ──────────────────────┘
```

- **`js/content.js`** — kitoblar ro'yxati (`BOOKS`) va to'liq **o'quv dasturi xaritasi** (`CURRICULUM`): har bir bo'lim/mavzu uchun manba sahifasi.
- **`js/data.js`** — darslar, savollar, tizimlar, atlas ob'yektlari. Har bir dars `source: {book, page}` manba havolasiga ega.

## O'quv tuzilmasi — 19 modul, 46 dars, 505 mashq

**I jild:** Suyaklar (u1–u9) · Bo'g'imlar (u10) · Mushaklar (u11) · Hazm (u12) · Nafas (u13)
**II jild:** Siydik (u14) · Jinsiy (u15) · Endokrin (u16) · Yurak-tomir (u17) · Nerv (u18) · Sezgi a'zolari (u19)

### 8 xil savol turi

`quiz` (test) · `img` (rasmni aniqlash) · `match` (moslashtirish) · `build` (atama yig'ish) · `tf` (to'g'ri/noto'g'ri) · `order` (tartiblash) · `fill` (bo'sh joyni to'ldirish) · `func` (tuzilma → vazifa)

Har bir savol: `explanation` (izoh), manba bo'limi va mavzu. Savollar kitob mazmunidan olinadi.

### Dars o'rganish oqimi

```
SLAYDLAR (kirish → vizual → tushuntirish → manba)
   ↓
SAVOLLAR (interaktiv)
   ↓
NATIJA (XP, aniqlik, qayta ishlash)
```

## Funksiyalar

- 🎯 **Kunlik maqsad**, ⭐ **daraja**, 🔥 **streak**, ❤️ **yuraklar**
- 🏅 **12 ta yutuq (badges)**
- 🔁 **Spaced repetition** (0/1/3/7/16/35 kun) — xatolar va unutilayotgan savollar avtomatik qaytadi
- 📊 **Mastery** — har bir tizim bo'yicha o'zlashtirish % (≥80% = "O'zlashtirilgan")
- 🗺️ **Anatomiya atlasi** — ob'yektlar: Uzbek + Latin + English nom, vazifa, bog'liq darslar, "O'rganish" tugmasi
- 🔖 **Xatcho'plar**, ⚙️ **sozlamalar**, haftalik XP grafigi
- 📖 Darsda **manba havolasi** (masalan: "Anatomiya II jild, 77–92-bet")

## Dizayn tizimi

- Dark navy (`#090D18`) + glassmorphism, Poppins/Inter, **Lucide** inline SVG ikonkalar
- Markazlashgan dizayn tokenlari (`css/style.css`)
- Custom logo (chap yarmi suyak / o'ng yarmi mushak)
- Izchil anatomiya illyustratsiyalari (generatsiya qilingan, yagona uslub)

## Ishga tushirish

```bash
python3 -m http.server 8000
```

Brauzerda `http://localhost:8000` (PWA sifatida o'rnatish mumkin; 3D modellarga internet kerak).

## Tuzilishi

```
index.html            — kirish nuqtasi + splash
manifest.webmanifest  — PWA manifest
sw.js                 — service worker (offline kesh)
css/style.css         — dizayn tizimi
js/content.js         — BOOKS + CURRICULUM (kontent xaritasi)
js/data.js            — COURSE, ATLAS, SYSTEMS, ATLAS_CATS, QUICK, EXAM
js/icons.js           — Lucide inline SVG ikonkalar
js/app.js             — ilova logikasi (SRS, mastery, yutuqlar, router)
assets/img/illu/      — anatomiya illyustratsiyalari
assets/img/atlas/     — atlas sahifa rasmlari
assets/img/           — PDF'dan olingan dars rasmlari
docs/screenshots/     — ekran skrinshotlari
*.pdf                 — manba hujjatlar (kitoblar + atlas)
```

## Yangi mavzu qo'shish

1. `js/content.js` → `CURRICULUM`ga bo'lim/mavzu va manba sahifasini qo'shing
2. `js/data.js` → `COURSE.units[]` (darslar, `source`, `slides`, savollar), `UNIT_META`
3. `SYSTEMS[]` va `ATLAS_CATS[]` ni yangilang
4. Illyustratsiya: `assets/img/illu/`ga yagona uslubdagi rasm

Savol formatlari: `quiz/q opts a hint? explanation?`, `img +img`, `match pairs`, `build q answer extra`, `tf q a why?`, `order q items explanation?`, `fill q answer extra explanation?`, `func q opts a`.
