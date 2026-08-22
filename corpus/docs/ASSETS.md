# Asset Registry — Re-engagement Experience

Bu fayl re-engagement (qayta jalb etish) tajribasida ishlatiladigan barcha
vizual/video aktivlarni hujjatlashtiradi: manba, litsenziya va qayerda ishlatilishi.

## 1. Prefered (reference) assets — LottieFiles

Quyidagi animatsiyalar **"Free to use under the Lottie Simple License"** deb
belgilangan (har bir sahifada tekshirildi). Lottie Simple License tijorat
maqsadida bepul foydalanishga ruxsat beradi, **attribution shart emas**
(lekin rag'batlantiriladi).

| Asset | Source | License | Usage |
|---|---|---|---|
| Working Brain | https://lottiefiles.com/free-animation/working-brain-TZQYJcbQsv | Lottie Simple License (verified) | Brain lessons / learning state |
| Lub Dub | https://lottiefiles.com/free-animation/lub-dub-lub-dub-QX04B9a0u8 | Lottie Simple License (verified) | Heart lessons / success |
| Lungs Lottie Animation | https://lottiefiles.com/free-animation/lungs-lottie-animation-pY9nN237zx | Lottie Simple License (verified) | Respiratory / breathing |
| Skeleton | https://lottiefiles.com/free-animation/skeleton-Z2OolR8NYD | Lottie Simple License (verified) | Skeletal / categories |
| DNA animation | https://lottiefiles.com/free-animation/dna-animation-F4rx9M83Kq | Lottie Simple License (verified) | Genetics / progress |
| Success celebration | https://lottiefiles.com/free-animation/success-celebration-Sn1bJRj6pz | Lottie Simple License (verified) | Lesson/quiz success, milestone |

### Download status (honest note)

Bu loyihaning qurish muhiti (sandbox) to'g'ridan-to'g'ri `lottiefiles.com`
CDN'iga chiqa olmadi (network cheklangan) — shuning uchun JSON fayllarini
diskka yuklab, repo'ga kiritib bo'lmadi. Ular **reference/preferred** sifatida
qayd etilgan; ishga tushirilgan animatsiyalar quyida.

## 2. Preferred (reference) assets — Rive Community (tutor)

| Asset | Source | License | Status |
|---|---|---|---|
| Character Facial Animation | https://rive.app/community/files/14071-27651-character-facial-animation/ | community (login required to download) | reference |
| Interactive Character Animation | https://rive.app/community/files/14778-27867-interactive-character-animation/ | community (login required to download) | reference |
| Character Rigging & Animation | https://rive.app/community/files/13636-25823-character-rigging-and-animation/ | community (login required to download) | reference |

Rive Community fayllarini yuklab olish uchun Rive hisobi kerak va alohida
`.riv` litsenziyasi tekshirilishi shart. Shu muhitda buni bajara olmadik,
shuning uchun tutor quyida tavsiflangan in-house tizim bilan bajarildi
(priyoritet ro'yxatining ruxsat etilgan "minimal custom CSS motion" darajasi).

## 3. Actually integrated (bundled) — in-house, license-safe

Quyidagilar repo'da **o'zimiz** yaratilgan (tashqi litsenziya muammosi yo'q):

| Asset | Source | License | Usage |
|---|---|---|---|
| AnatomyTutor (8 state SVG + CSS motion) | `src/components/reengage/AnatomyTutor.tsx` | In-house (project-owned) | Dashboard tutor, welcome-back modal |
| AnatomyAnimation (brain/heart/lungs/skeleton) | `src/components/reengage/AnatomyAnimation.tsx` + `public/img/{brain,heart,lungs,skeleton}.jpg` | In-house motion + project's own atlas imagery | Daily challenge, comeback modal |
| DNA helix (CSS) | `src/components/reengage/AnatomyAnimation.tsx` | In-house | DNA challenge |
| ReengagementCard / WelcomeBackModal / DailyChallengeCard / StreakCelebration | `src/components/reengage/*` | In-house | Dashboard re-engagement |

`public/img/brain.jpg`, `heart.jpg`, `lungs.jpg`, `skeleton.jpg` — loyihaning
o'z atlas/kitob materiallaridan olingan tasvirlar (tashqi litsenziya talab etmaydi).

## 4. Motion principles

- Faqat CSS `@keyframes` (`rx-*` prefiks, `app/globals.css`).
- Global `prefers-reduced-motion` qoidasi barcha animatsiyani avtomatik
  minimal (opacity/transform) holatga tushiradi.
- Hech qanday tashqi animatsiya kutubxonasi yuklanmaydi (offline PWA toza qoladi).
- Welcome-back modal `next/dynamic` orqali lazy yuklanadi.
