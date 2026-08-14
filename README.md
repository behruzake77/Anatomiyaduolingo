# 🦴 AnatomiLingo

Anatomiyani **Duolingo uslubida** interaktiv o'rganish uchun mobil (PWA) ilova. Darslik — **A. Ahmedov va boshq. «Anatomiya I jild» (Toshkent, 2018)**.

> Dizayn: och mavzu, binafsha `#6C5CE7`, **Poppins** shrifti — "Anatomiyani o'rgan. Hayotni boshqar."

## Bo'limlar

| Bo'lim | Tavsif |
|---|---|
| 🏠 **Bosh sahifa** | Dashboard: kunlik maqsad, streak, daraja, "Davom etish", tezkor mavzular, mavzular to'plami |
| 🧠 **Atlas** | 14 ta nazariy mavzu: atamalar jadvali (lotin + o'zbek), PDF rasmlari, 3D modellar |
| 🎓 **Imtihon** | Yakuniy imtihon (30 savol, 15 daqiqa, 70% o'tish), aqlli takrorlash, tezkor mashq |
| 👤 **Profil** | Daraja, aniqlik, yutuqlar (badges), statistika, sozlamalar, "Ilova haqida" |

## Kurs tarkibi — 13 modul, 35 dars, 390 mashq

**Osteologiya (suyaklar)**
1. Umurtqa pog'onasi · 2. Bo'yin umurtqalari · 3. Ko'krak va bel · 4. Dumg'aza va dum · 5. Ko'krak qafasi suyaklari · 6. Qo'l skeleti · 7. Oyoq skeleti · 8. Kalla — miya qismi · 9. Kalla — yuz qismi

**Artrologiya · Miologiya · Ichki a'zolar**
10. Suyaklarning birlashuvi (bo'g'imlar) · 11. Mushaklar tizimi · 12. Hazm tizimi · 13. Nafas tizimi

**Tez kunda (II jild):** Asab tizimi, Qon aylanish tizimi

## Funksiyalar

- 🎯 **Kunlik maqsad** — har kuni XP to'plash (sozlash mumkin: 30/50/100 XP)
- ⭐ **Daraja tizimi** — XP asosida (Boshlang'ich → O'rta → Yuksak)
- 🏅 **Yutuqlar (badges)** — 12 ta: streak, darslar, XP, aniqlik, to'g'ri javoblar
- 🔁 **Aqlli takrorlash (spaced repetition)** — interval: 0/1/3/7/16/35 kun
- ❤️ **Yuraklar** (30 daqiqada tiklanadi), 🔥 **streak**, ⚡ **XP**
- ⚡ **Tezkor mavzular** — Suyaklar / Mushaklar / A'zolar bo'yicha tezkor mashq
- 🎨 **5 xil mashq turi**: test, rasm, moslashtirish, atama yig'ish, to'g'ri/noto'g'ri
- 🔊 Ovozli signallar, ⚙️ Sozlamalar, ℹ️ "Ilova haqida"

## Ishga tushirish

```bash
python3 -m http.server 8000
```

Brauzerda `http://localhost:8000` oching. PWA sifatida telefonga o'rnatish mumkin (3D modellarga internet kerak).

## Tuzilishi

```
index.html            — kirish nuqtasi
manifest.webmanifest  — PWA manifest
sw.js                 — service worker (offline kesh)
css/style.css         — dizayn (Poppins, och mavzu, binafsha aksent)
js/data.js            — COURSE (modullar), ATLAS (nazariya), QUICK, EXAM
js/app.js             — ilova logikasi, SRS, daraja, yutuqlar, sozlamalar
assets/img/           — PDF'dan olingan dars rasmlari
assets/fonts/         — Poppins (lokal, offline)
assets/icons/         — ilova ikonkalari
```

## Yangi mavzu qo'shish

1. **Darslar**: `js/data.js` → `COURSE.units[]` ga yangi modul/darslar qo'shing
2. **Nazariya**: `ATLAS[]` ga mavzu qo'shing (`sections[].terms` — atamalar)
3. **Tezkor mavzular**: `QUICK[]` — mavzu va tegishli `units[]` ro'yxati

Mashq turlari: `quiz` (q, opts, a, hint?), `img` (+img), `match` (pairs), `build` (q, answer, extra), `tf` (q, a, why?).

## Reja (bosqichma-bosqich kengaytirish)

- [x] **Osteologiya** — suyaklar
- [x] **Artrologiya** — bo'g'imlar
- [x] **Miologiya** — mushaklar
- [x] **Hazm a'zolari** — sistema digestorium
- [x] **Nafas a'zolari** — sistema respiratorium
- [ ] **Asab tizimi** — II jild (kelgusi bosqich)
- [ ] **Qon aylanish tizimi** — II jild (kelgusi bosqich)
