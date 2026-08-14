# 🦴 AnatomiLingo

Anatomiyani **Duolingo uslubida** o'rganish uchun premium, mobile-first (PWA) ilova.
Manba: **A. Ahmedov va boshq. «Anatomiya I jild» (Toshkent, 2018)**.

> "Anatomiyani o'rgan. Hayotni boshqar."

## Dizayn tizimi

- **Dark navy** fon (`#090D18` / `#0D1324` / `#111827`), nozik glassmorphism
- Aksentlar (≤5): binafsha `#6C5CE7`, feruza `#20D9C5`, yashil `#22C55E`, sariq `#F59E0B`, qizil `#EF4444`, pushti `#F472B6`
- Shriftlar: **Poppins** (sarlavhalar) + **Inter** (matn/raqamlar)
- **Lucide** ikonkalari (inline SVG, `js/icons.js`)
- Markazlashgan **dizayn tokenlari** (`css/style.css` → `:root`): ranglar, radius, soyalar, harakat vaqtlari, breakpointlar
- Maxsus **logo**: chap yarmi bosh suyagi, o'ng yarmi mushak/teri (SVG)

## Bo'limlar

| Bo'lim | Tavsif |
|---|---|
| 🏠 **Bosh sahifa** | "Bugun o'rganishga tayyormisan?", kunlik maqsad (progress + streak), joriy kurs kartasi, **o'rganish yo'li** (path), tavsiya etilgan dars |
| 📖 **O'rganish** | Tezkor mavzular + 8 ta tana tizimi (progress, darslar, XP, %) |
| 🗺️ **Atlas** | Anatomiya ob'yektlari: rasmi, nomi, lotincha atamasi, vazifasi, bog'liq darslar |
| 🎓 **Sinov** | Imtihon (30 savol/15 daqiqa), aqlli takrorlash, tezkor mashq, progress, yutuqlar |
| 👤 **Profil** | Daraja, seriya, aniqlik, yutuqlar, xatcho'plar, sozlamalar, "Haqida" |

## Kurs — 13 modul, 35 dars, 390 mashq

Suyaklar (osteologiya) → bo'g'imlar (artrologiya) → mushaklar (miologiya) → hazm → nafas tizimi.
Asab, yurak-qon tomir, siydik va jinsiy tizimlar — "Tez kunda" (II jild).

## Funksiyalar

- 🎯 Kunlik maqsad, ⭐ daraja tizimi, 🔥 streak, ❤️ yuraklar
- 🏅 12 ta yutuq (badges) — qulflanganlari xira ko'rsatiladi
- 🔁 Spaced repetition (0/1/3/7/16/35 kun)
- 📊 Haftalik XP grafigi, tizimlar bo'yicha progress
- 🔖 Xatcho'plar, ⚙️ sozlamalar (ovoz, kunlik maqsad, tiklash)
- 🎉 Natija ekrani: konfetti, aniqlik/vaqt/XP/to'g'ri statistikasi, **"Qayta ishlash"**
- 5 xil mashq turi (test, rasm, moslashtirish, atama yig'ish, to'g'ri/noto'g'ri)

## Ishga tushirish

```bash
python3 -m http.server 8000
```

Brauzerda `http://localhost:8000` (PWA sifatida o'rnatish mumkin; 3D modellarga internet kerak).

## Tuzilishi

```
index.html            — kirish nuqtasi + splash
manifest.webmanifest  — PWA manifest
sw.js                 — service worker (offline kesh, v7)
css/style.css         — dizayn tizimi (tokenlar, komponentlar, responsivlik)
js/data.js            — COURSE, ATLAS, SYSTEMS, ATLAS_CATS, QUICK, UNIT_META, EXAM
js/icons.js           — Lucide inline SVG ikonkalari
js/app.js             — ilova logikasi (SRS, daraja, yutuqlar, router)
assets/img/illu/      — generatsiya qilingan anatomiya illyustratsiyalari (yagona uslub)
assets/img/           — PDF'dan olingan dars rasmlari
assets/icons/         — logo.svg + ikonkalar
assets/fonts/         — Poppins + Inter (lokal, offline)
```

## Yangi mavzu qo'shish

1. `js/data.js` → `COURSE.units[]` (darslar), `SYSTEMS[]` (tizim), `ATLAS_CATS[]` (atlas ob'yektlari)
2. `UNIT_META` ga yangi modul ikonkasini qo'shing
3. Illyustratsiya: `assets/img/illu/` ga yagona uslubdagi rasm

## Responsivlik

360 / 390 / 412 / 768 / 1440px da tekshirilgan — toshib ketish yo'q.
Mobil'da pastki navigatsiya, desktop (≥1024px)da yon panel.
