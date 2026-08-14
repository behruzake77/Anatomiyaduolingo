# 🦴 AnatomiLingo

Anatomiyani interaktiv o'rganish uchun professional mobil (PWA) ilova. Darslik — **A. Ahmedov va boshq. «Anatomiya I jild» (Toshkent, 2018)**. Hozirgi kurs **Osteologiya (suyaklar haqidagi ilm)** — butun odam skeleti.

## Bo'limlar

| Bo'lim | Tavsif |
|---|---|
| 📖 **O'rganish** | 9 modul, 25 dars, 278 mashq — ketma-ket ochiladi, progress kuzatiladi |
| 🧠 **Atlas** | 10 ta nazariy mavzu: atamalar jadvali (lotin + o'zbek), PDF rasmlari va interaktiv 3D modellar (Sketchfab, ochiq ta'lim manbalari) |
| 🎓 **Imtihon** | Yakuniy imtihon (30 savol, 15 daqiqa taymer, 70% o'tish balli), aqlli takrorlash, tezkor mashq |
| 👤 **Profil** | Statistika: XP, streak, o'zlashtirilgan savollar, imtihon rekordi |

## Kurs modullari (Osteologiya)

1. Umurtqa pog'onasi
2. Bo'yin umurtqalari
3. Ko'krak va bel
4. Dumg'aza va dum
5. Ko'krak qafasi suyaklari (qovurg'alar + to'sh suyagi)
6. Qo'l skeleti
7. Oyoq skeleti
8. Kalla — miya qismi (neurocranium)
9. Kalla — yuz qismi (viscerocranium)

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

## Reja (bosqichma-bosqich kengaytirish)

Darslikning qolgan bo'limlari navbatdagi bosqichlarda qo'shiladi:

- [x] **Osteologiya** — suyaklar (joriy kurs)
- [ ] **Artrologiya** — suyaklarning o'zaro qo'shilishi (bo'g'imlar)
- [ ] **Miologiya** — mushaklar haqidagi ilm
- [ ] **Splanxnologiya** — ichki a'zolar: hazm a'zolari tizimi
- [ ] **Nafas a'zolari tizimi** — burun, hiqildoq, kekirdak, o'pka
