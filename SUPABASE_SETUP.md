# Supabase orqali ro'yxatdan o'tish tizimini yangidan qurish — QO'LLANMA

Bu loyihada ro'yxatdan o'tish / kirish **Supabase Auth** orqali ishlaydi
(`artifacts/corpus/src/lib/auth.ts`). Eski akkaunt ulana olmaganligingiz sabab
yangi Supabase loyihasi ochganingiz uchun, uni qayta ulash va "toza boshlash"
uchun quyidagi bosqichlarni bajaring.

> Kod tarafida bajarilgan ishlar:
> - `deleteAccount` xatosi tuzatildi (admin API endi xato qaytarsa ham hisob o'chiriladi)
> - Eski localStorage akkauntlar (`corpus-auth`, `corpus-progress-*`) avtomatik tozalanadi
> - Barcha Supabase foydalanuvchilarni tozalash skripti: `supabase/reset_all_users.sql`

---

## 1-QADAM — `.env.local` ga yangi Supabase kredensiallarini yozing

Fayl: `artifacts/corpus/.env.local`

1. supabase.com → loyihangizni oching
2. **Settings → API** bo'limiga o'ting
3. **Project URL** va **anon public** qiymatlarini nusxa oling
4. Ularni quyidagiga yozing:

```
VITE_SUPABASE_URL=https://YYYYYY.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> `.env.local` git-ga qo'shilmaydi — kredensiallaringiz ochiq qolmaydi.

---

## 2-QADAM — `schema.sql` ni ishga tushiring (jadval yaratish)

Supabase **SQL Editor** → `artifacts/corpus/supabase/schema.sql` faylidagi
butun kodni joylashtiring → **Run**.

Bu `profiles`, `progress`, `achievements`, `battles` jadvallarini, RLS siyosatlarini va
har bir yangi foydalanuvchi uchun avtomatik profil yaratuvchi trigger-ni o'rnatadi.

Agar `schema.sql` avval ishlatilgan bo'lsa, qo'shimchalarni yuguring:
- `artifacts/corpus/supabase/competition.sql` — jonli reyting ustunlari + 1ga-1 bellashuv jadvali.
- `artifacts/corpus/supabase/kahoot.sql` — Kahoot sinf o'yini (PIN lobby, o'yinchilar, realtime).
  - **Yangi:** o'yin boshlangandan keyin ham PIN bilan qo'shilish mumkin (faqat tugagan xonalar yopilgan)
    + `kahoot_players.avatar` ustuni (xona ro'yxatida avatar ko'rinadi).
    Agar `kahoot.sql` ni oldin ishlatgan bo'lsangiz, **qayta ishga tushiring** (idempotent, hech narsani buzmaydi) —
    shunda "boshlanib bo'lgan" o'yinga kirish va avatarlar ishlashini boshlaydi.
    (Qayta ishga tushirmasangiz ham o'yin ishlaydi — faqat boshlangan o'yinga kirish va avatar yo'q bo'ladi.)
- `artifacts/corpus/supabase/reports.sql` — talab/taklif va savol xatoliklari (admin inbox). O'zingizni admin qilish:
  ```sql
  update public.profiles set is_admin = true
  where id in (select id from auth.users where email = 'SIZNING_EMAIL');
  ```
  Yoki `.env.local`: `VITE_ADMIN_EMAILS=siz@email.com` / `VITE_ADMIN_USERNAMES=login`.
  > **Eslatma:** `.env` bo'lmasa ham `behruz` yoki `behruzake77` usernameli akkaunt
  > avtomatik admin hisoblanadi. Admin panelga kirish uchun maxfiy PIN **1030**
  > kiritiladi (bu kod tarafidagi qo'shimcha himoya qatlami, `lib/admin.ts` da).
- `artifacts/corpus/supabase/admin_messages.sql` — admin panel kengaytmasi:
  - `profiles.avatar` ustuni (reytinglarda avatar ko'rinishi uchun).
  - `admin_messages` jadvali (admin ↔ foydalanuvchi yozishmalar / chat).
  Buni ham Supabase SQL Editor'da bir marta ishga tushiring.
- `artifacts/corpus/supabase/broadcasts.sql` — admin umumiy xabarlari (bosh sahifadagi qo'ng'iroq). Barcha foydalanuvchilarga yuborish uchun `profiles.is_admin = true` kerak.
- `artifacts/corpus/supabase/user_quizzes.sql` — foydalanuvchi testlari (Kahoot: o'zi tuzadi, jamoa o'tkazadi).
- `artifacts/corpus/supabase/profile_username.sql` — username unique + tug'ilgan yil.

---

## 3-QADAM — (MAJBURIY) Email tasdiqlash + OTP ni sozlang

Ro'yxatdan o'tish 6 xonali **OTP kod** bilan ishlaydi. Buning uchun:

- **Authentication → Sign In / Providers → Email**:
  - **Enable Sign in with Email**: ON
  - **Confirm email**: ON
- **Authentication → Email Templates → Confirm signup**:
  - Body ga `{{ .Token }}` ni qo'ying (6 xonali kod shu yerda ko'rinadi)

---

## 4-QADAM — (ixtiyoriy) Google orqali kirishni yoqing

- **Authentication → Sign In / Providers → Google**:
  - Google Cloud Console'da OAuth Client yarating va kalitlarni kiriting
  - **Redirect URL** ga quyidagini qo'shing:
    `https://<loyihangiz>.supabase.co/auth/v1/callback`

---

## 5-QADAM — Avtorizatsiya (redirect) URL'larini qo'shing

**Authentication → URL Configuration → Redirect URLs** ga o'z saytingiz
manzilini qo'shing (masalan `http://localhost:5173/*` va production sayt).

---

## 6-QADAM — Eski akkauntlarni tozalash

Agar yangi loyihada test uchun yaratgan foydalanuvchilar bo'lsa va ularni
tozalash istasangiz:

Supabase **SQL Editor** → `artifacts/corpus/supabase/reset_all_users.sql`
faylidagi kodni joylashtiring → **Run**.

Bu **BARCHA** auth foydalanuvchilarini va ularning progress/profil
ma'lumotlarini o'chiradi (tiklab bo'lmaydi).

---

## 7-QADAM — Ilovani ishga tushiring va sinab ko'ring

```bash
pnpm install
pnpm --filter @workspace/corpus run dev
```

1. Yangi email bilan ro'yxatdan o'ting
2. Pochtangizdagi 6 xonali kodni kiriting
3. Profil ochilishi kerak

---

## Ma'lum: hisob o'chirish (deleteAccount) qanday ishlaydi

Brauzerda faqat **anon kalit** bor, shuning uchun `auth.users` qatorini
`admin.deleteUser` bilan o'chirish mumkin emas (service_role kerak). Endi kod
foydalanuvchining **o'z** satrlarini (progress, achievements, profiles) RLS
orqali o'chiradi va sessiyani yopadi — dastur ichida hisob "o'chirilgan" bo'lib
ko'rinadi. `auth.users` satrini to'liq o'chirish uchun (Google Play siyosati
uchun) server tomonida service_role bilan ishlaydigan kichik **Edge Function**
kerak:

```ts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
Deno.serve(async (req) => {
  const { user_id } = await req.json();
  await supabase.from("profiles").delete().eq("id", user_id);
  const { error } = await supabase.auth.admin.deleteUser(user_id);
  return new Response(JSON.stringify({ ok: !error, error }), { headers: { "Content-Type": "application/json" } });
});
```

Keyin `lib/auth.ts` dagi `deleteAccount` ushbu funksiyani chaqiradi.
