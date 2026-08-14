# 🦴 AnatomiLingo

Anatomiyani **Duolingo uslubida** o'rganish uchun mobil (PWA) ilova. Birinchi kurs — **Columna vertebralis** (umurtqa pog'onasi), `Columna-vertebralis.pdf` prezentatsiyasi asosida tuzilgan.

## Xususiyatlar

- 🎮 **To'liq gamifikatsiya** — XP, ❤️ yuraklar (har 30 daqiqada tiklanadi), 🔥 kunlik streak
- 📚 **4 bo'lim, 12 dars, 110+ mashq**:
  1. Umurtqa pog'onasi (bo'limlar, tuzilish, o'simtalar)
  2. Bo'yin umurtqalari (tipik, Atlas, Axis, C3–C7)
  3. Ko'krak va bel umurtqalari
  4. Dumg'aza (Os sacrum) va dum suyagi (Os coccygis)
- 🧩 **5 xil mashq turi**: test, rasm bo'yicha savol, juftlarni moslashtirish, atama yig'ish, to'g'ri/noto'g'ri
- 🖼️ PDF'dan olingan **haqiqiy anatomik rasmlar** bilan mashqlar
- 💪 **Xatolar ustida ishlash** — noto'g'ri javob berilgan savollar saqlanadi va takrorlanadi (spaced repetition); xato savol dars ichida ham qayta so'raladi
- 📱 **PWA** — telefonga o'rnatish mumkin ("Bosh ekranga qo'shish"), offline ishlaydi
- 🇺🇿 Interfeys o'zbekcha, atamalar lotincha + o'zbekcha tarjimalari

## Ishga tushirish

Oddiy statik server yetarli:

```bash
python3 -m http.server 8000
# yoki
npx serve .
```

Brauzerda `http://localhost:8000` oching.

## Tuzilishi

```
index.html            — kirish nuqtasi
manifest.webmanifest  — PWA manifest
sw.js                 — service worker (offline kesh)
css/style.css         — Duolingo uslubidagi dizayn
js/data.js            — kurs ma'lumotlari (darslar, mashqlar)
js/app.js             — ilova logikasi (progress localStorage'da)
assets/img/           — PDF'dan olingan dars rasmlari
assets/icons/         — ilova ikonkalari
```

## Yangi dars qo'shish

`js/data.js` faylida `COURSE.units[].lessons[]` massiviga yangi dars qo'shing. Mashq turlari:

| Turi | Maydonlar | Tavsif |
|---|---|---|
| `quiz` | `q, opts, a, hint?` | 4 variantli savol |
| `img` | `q, img, opts, a, hint?` | Rasm bilan savol |
| `match` | `pairs: [[lotin, o'zbek], ...]` | Juftlarni moslashtirish |
| `build` | `q, answer, extra` | So'zlardan atama yig'ish |
| `tf` | `q, a, why?` | To'g'ri/Noto'g'ri |
