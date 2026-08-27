# 🤖 Google Play'ga chiqarish — CORPUS

Bu papka ilovani Play Market'ga chiqarish uchun hamma narsani o'z ichiga oladi.
Ilova **PWA** bo'lgani uchun **TWA (Trusted Web Activity)** orqali native Android
paketiga (`.aab`) aylantiriladi — Bubblewrap bilan, kod yozish shart emas.

## 📦 Papka tarkibi

| Fayl | Vazifasi |
|---|---|
| `twa-manifest.json` | Bubblewrap konfiguratsiyasi (paket nomi, ranglar, ikonkalar) |
| `update-assetlinks.sh` | Sayt + ilova bog'lanishi (SHA-256 ni `assetlinks.json`ga yozadi) |
| `store-listing.md` | Play Store sahifasi matnlari (o'zbek + ingliz) |
| `feature-graphic.png` | Banner 1024×500 (Play sahifasi uchun) |
| `README.md` | Shu yo'riqnoma |

## ⚠️ Shartlar (boshlanishidan oldin)

1. **Ilova internetda HTTPS da turishi shart.** Repo'dagi `render.yaml` bilan
   Render.com'ga bepul deploy qilish mumkin (boshqa platforma ham bo'ladi:
   Vercel, Netlify, Railway...).
2. **Domen kerak** (masalan `corpus.uz` yoki `corpus.onrender.com`).
   `render.yaml`'dagi nomni o'z domeningizga o'zgartiring.
3. **Google Play Developer hisobi** — $25 (bir marta, umrbod): play.google.com/console

---

## 1-bosqich — Deploy

```bash
# Render.com misoli (boshqa platforma ham xuddi shunday)
# 1. GitHub repo'ni ulang (rootDir: corpus avvaldan belgilangan)
# 2. Build: npm install --include=dev && npm run build
# 3. Start:  npm start
```

Deploydan keyin tekshiring:
- `https://DOMEN/` — ilova ochiladi
- `https://DOMEN/manifest.json` — manifest ko'rinadi
- `https://DOMEN/books/anatomiya-i-1.pdf` — kitoblar ochiladi

## 2-bosqich — Konfiguratsiyani to'ldirish

`twa-manifest.json` da **`CORPUS-DOMAIN`** deb yozilgan joylarga o'z
domeningizni qo'ying (5 ta joy: `host`, `iconUrl`, `maskableIconUrl`,
`monochromeIconUrl`, `webManifestUrl`, `fullScopeUrl`).

`packageId` — xohlasangiz o'zgartiring (qaytarib bo'lmaydi!): `com.corpus.anatomy`.

## 3-bosqich — Imzo kaliti (keystore) yaratish

```bash
keytool -genkeypair -v \
  -keystore corpus-release.keystore \
  -alias corpus \
  -keyalg RSA -keysize 2048 -validity 10000
```

> ⚠️ **Bu faylni va parolni MUROJAAT QILMASDAN saqlang** — yo'qotsangiz,
> ilovani yangilay olmaysiz! Papkadan tashqarida (parol menejerda) saqlang.
> Git'ga QO'SHMANG (`.gitignore`da bor).

## 4-bosqich — Android paketi (AAB) qurish

```bash
npm install -g @bubblewrap/cli

cd corpus/play
bubblewrap build --manifest ./twa-manifest.json
# (birinchi marta so'raydi: keystore paroli, nom, parollar)
```

Natija: `app-release-bundle.aab` (+ test uchun `app-release.apk`).

**Sinov:** telefonda `.apk`'ni o'rnatib ko'ring — sayt ilova ichida
brauzer chizig'isiz ochilishi kerak (TWA ishlagani).

## 5-bosqich — assetlinks.json (sayt ↔ ilova bog'lanishi)

Bubblewrap oxirida SHA-256 barmoq izini ko'rsatadi. Yoki Play Console'da:
**Release → Setup → App signing** (Play App Signing barmoq izi ham kerak!).

```bash
# Ikkala SHA-256 ni ham qo'shing (upload + play app signing)
./update-assetlinks.sh "AA:BB:...:FF" com.corpus.anatomy
# Qo'lda tahrirlash: corpus/public/.well-known/assetlinks.json
```

So'ng **qayta deploy** qiling — aks holda Chrome brauzer chizig'ini ko'rsatadi.

## 6-bosqich — Play Console

1. **Create app** → nom: `CORPUS — Anatomiyani o'rgan`, til: uz, bepul
2. **Store listing** — `store-listing.md` dagi matnlarni ko'chiring:
   - ikonka 512×512: `corpus/public/logo/icon-512.png`
   - feature graphic 1024×500: `play/feature-graphic.png`
   - telefon skrinshotlari: min. 2 ta (ilovadan oling)
3. **Content rating** — anketa: ta'lim ilovasi, tibbiy ma'lumot yo'q,
   reklama bor (AdBanner) deb ko'rsating
4. **Data safety** (muhim!):
   - Ma'lumot yig'iladimi? — **Yo'q**
   - Ma'lumot ulashiladimi? — **Yo'q**
   - Hisob: faqat qurilmada (localStorage), serverga hech narsa ketmaydi
   - Shuning uchun privacy policy oddiy — `store-listing.md` da namuna bor
5. **Target audience** — 13+ (tibbiy talabalar 18+ lekin cheklov shart emas)
6. **AAB yuklash** → Ichki test → sinab ko'rish → Production

## 7-bosqich — Yangi versiya chiqarish

```bash
# twa-manifest.json da:
#   appVersion: "1.1.0"
#   appVersionCode: 2   # har doim +1!
bubblewrap build --manifest ./twa-manifest.json
# Play Console → Production → New release → .aab yuklang
```

---

## ✅ Play siyosatiga moslik (allaqachon bajarilgan)

| Talab | Holat |
|---|---|
| Hisob o'chirish imkoni | ✅ Sozlamalar → «Hisobni o'chirish» (ikkita bosishda tasdiqlash) |
| Maxfiylik sahifasi | ✅ Ilova ichida: Sozlamalar → Maxfiylik siyosati |
| Offline ishlash | ✅ Service worker (`corpus-v3`) |
| Nusxa ko'chirilmagan kontent | ✅ Barcha kontent darslikka bog'langan (manba ko'rsatilgan) |
| targetSdkVersion 35 | ✅ twa-manifest.json da |
| Maskable ikonka | ✅ `logo/icon-512-maskable.png` |

## ❓ FAQ

**Brauzer chizig'i ko'rinadi** → `assetlinks.json` noto'g'ri yoki deploy
qilinmagan. SHA-256 va paket nomini tekshiring.

**PDF kitoblar sekin** → Render bepul tarifida sekin bo'lishi mumkin;
kitoblarni CDN'ga (masalan R2/S3) ko'chirish mumkin.

**iOS ham kerakmi?** → Xuddi shu PWA App Store'ga **PWABuilder** bilan
chiqariladi (keyingi qadam).
