# 🦴 AnatomiLingo

Anatomiyani interaktiv o'rganish uchun professional mobil (PWA) ilova. Birinchi kurs — **Columna vertebralis** (umurtqa pog'onasi), `Columna-vertebralis.pdf` prezentatsiyasi asosida tuzilgan.

## Bo'limlar

| Bo'lim | Tavsif |
|---|---|
| 📖 **O'rganish** | 4 modul, 12 dars, 110+ mashq — ketma-ket ochiladi, progress kuzatiladi |
| 🧠 **Atlas** | Nazariy material: atamalar jadvali (lotin + o'zbek), PDF rasmlari va **11 ta interaktiv 3D model** (Sketchfab, ochiq ta'lim manbalari: Univ. of Michigan BlueLink, Elon Univ., Leiden UMC) |
| 🎓 **Imtihon** | Yakuniy imtihon (20 savol, 10 daqiqa taymer, 70% o'tish balli), aqlli takrorlash, tezkor mashq |
| 👤 **Profil** | Statistika: XP, streak, o'zlashtirilgan savollar, imtihon rekordi |

## O'quv metodikasi

- **Aqlli takrorlash (spaced repetition)** — har bir savol bo'yicha daraja saqlanadi (0→5), interval: 0/1/3/7/16/35 kun. Unutish arafasidagi savollar avtomatik navbatga chiqadi
- **Xato savollar** dars ichida qayta so'raladi va takrorlash bazasiga qo'shiladi
- **5 xil mashq turi**: test, rasm bo'yicha aniqlash, moslashtirish, atama yig'ish, to'g'ri/noto'g'ri
- **Gamifikatsiya**: XP, yuraklar (30 daqiqada tiklanadi), kunlik streak. Imtihon va tezkor mashq yuraklarsiz ishlaydi

## Ishga tushirish

```bash
python3 -m http.server 8000
```

Brauzerda `http://localhost:8000` oching. PWA sifatida telefonga o'rnatish mumkin, asosiy kontent offline ishlaydi (3D modellarga internet kerak).

## Tuzilishi

```
index.html            — kirish nuqtasi
manifest.webmanifest  — PWA manifest
sw.js                 — service worker (offline kesh)
css/style.css         — dizayn (Inter shrifti, professional tibbiy uslub)
js/data.js            — COURSE (darslar), ATLAS (nazariya + 3D), EXAM (sozlamalar)
js/app.js             — ilova logikasi, SRS, imtihon taymeri (progress localStorage'da)
assets/img/           — PDF'dan olingan dars rasmlari
assets/icons/         — ilova ikonkalari
assets/fonts/         — Inter (lokal, offline)
```

## Yangi mavzu qo'shish

1. **Darslar**: `js/data.js` → `COURSE.units[]` ga yangi modul/darslar qo'shing
2. **Nazariya**: `ATLAS[]` ga mavzu qo'shing (`sections[].terms` — atamalar, `m3d[].uid` — Sketchfab model ID)
3. Yangi PDF'dan rasm olish: `pymupdf` bilan eng katta rasmlarni `assets/img/` ga eksport qiling

Mashq turlari: `quiz` (q, opts, a, hint?), `img` (+img), `match` (pairs), `build` (q, answer, extra), `tf` (q, a, why?).
