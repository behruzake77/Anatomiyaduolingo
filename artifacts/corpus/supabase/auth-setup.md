# CORPUS Supabase Auth sozlamalari

Ilovada quyidagi oqimlar tayyor:

- Email + parol orqali ro'yxatdan o'tish
- Emailga 6 xonali tasdiqlash kodi yuborish
- Kodni tekshirish va qayta yuborish
- Email + parol orqali kirish
- Google OAuth orqali kirish
- Sessionni brauzerda saqlash va OAuth callback'dan qaytish

## 1. Email OTP kodini yoqish

Supabase Dashboard → **Authentication → Providers → Email**:

1. Email provider'ni yoqing.
2. **Confirm email** ni yoqing.
3. **Authentication → Email Templates → Confirm signup** shablonida `{{ .Token }}` qiymatini ko'rsating. Shu qiymat foydalanuvchiga 6 xonali kod sifatida boradi.
4. `artifacts/corpus/supabase/schema.sql` faylini SQL Editor'da bir marta ishga tushiring.

Ilova `signup` OTP turini tekshiradi va email shabloni `email` turidagi kod qaytarsa, avtomatik fallback qiladi.

## 2. Google loginni yoqish

Supabase Dashboard → **Authentication → Providers → Google**:

1. Google provider'ni yoqing.
2. Google Cloud Console'da OAuth client yarating.
3. Google OAuth client'ining **Authorized redirect URI** qiymati:

   `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`

4. Google Cloud'dagi Client ID va Client Secret'ni Supabase Google provider sozlamalariga kiriting.
5. Supabase → **Authentication → URL Configuration** bo'limida ilovaning Render production URL'i va Replit preview URL'ini **Additional Redirect URLs** ro'yxatiga qo'shing.

Ilova `redirectTo` sifatida foydalanuvchi turgan joriy origin'ni yuboradi. Shu sababli Render va Replit URL'lari Supabase allowlist'ida bo'lishi kerak.

## 3. Frontend env

Replit va Render build muhitida quyidagilar bo'lsin:

```text
VITE_SUPABASE_URL=https://<SUPABASE_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

Eski Render konfiguratsiyasi vaqtincha `NEXT_PUBLIC_SUPABASE_URL` va
`NEXT_PUBLIC_SUPABASE_ANON_KEY` nomlaridan foydalanishda davom etishi mumkin.