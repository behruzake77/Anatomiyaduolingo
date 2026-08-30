-- ============================================================================
-- CORPUS — BARCHA RO'YXATDAN O'TGAN AKKOUNTLARNI TOZALASH
-- ============================================================================
-- Bu skript Supabase'dagi BARCHA foydalanuvchilarni va ularning ma'lumotlarini
-- butunlay o'chiradi. auth.users ga on delete cascade bo'lgani uchun
-- `profiles`, `progress`, `achievements` jadvallari ham avtomatik tozalanadi.
--
-- DIQQAT: Bu tiklab bo'lmaydigan amal! Barcha foydalanuvchilar va ularning
-- progressi yo'qoladi. Faqat yangi loyihani "yangidan boshlash" istasangiz
-- bajaring.
--
-- QANDAY BAJARISH KERAK:
--   1. supabase.com → yangi (yoki mavjud) loyihangizni oching
--   2. SQL Editor bo'limiga o'ting
--   3. Pastdagi butun kodni joylashtiring va "Run" tugmasini bosing
-- ============================================================================

-- 1) Har qanday autsors (identities) qoldig'ini ham tozalaydi (jami foydalanuvchilar)
delete from auth.identities; -- auth.users dan avtomatik kaskadlanadi

-- 2) Barcha auth foydalanuvchilarini o'chiradi (qolgan barcha jadvallar kaskad)
delete from auth.users;

-- 3) Xavfsizlik uchun app jadvallarini ham qo'lda bo'shatamiz (agar FK bo'lmasa)
truncate table public.achievements;
truncate table public.progress;
truncate table public.profiles;

-- 4) Tekshirish: 0 qator bo'lishi kerak
select
  (select count(*) from auth.users)        as auth_users,
  (select count(*) from public.profiles)   as profiles,
  (select count(*) from public.progress)   as progress,
  (select count(*) from public.achievements) as achievements;
