-- CORPUS — admin panel kengaytirish:
-- 1) profiles jadvaliga avatar ustuni (reytinglarda avatar ko'rsatish uchun)
-- 2) admin_messages jadvali (admin ↔ foydalanuvchi yozishmalar / chat)
-- Mavjud loyihaga: Supabase SQL Editor'da bir marta ishga tushiring.

-- Avatar: foydalanuvchi tanlagan profil rasmi (data URL / emoji / color string).
alter table public.profiles
  add column if not exists avatar text;

-- Admin chat jadvali
create table if not exists public.admin_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  from_admin boolean not null default true,
  author_name text not null default 'Admin',
  body text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists admin_messages_user_idx
  on public.admin_messages (user_id, created_at);

alter table public.admin_messages enable row level security;

-- Har kim faqat o'z (user) yozishmalarini o'qiy oladi, admin esa hammasini.
drop policy if exists "admin_messages read own" on public.admin_messages;
create policy "admin_messages read own" on public.admin_messages
  for select using (auth.uid() = user_id or public.is_corpus_admin());

-- Admin xabar yuborishi mumkin; foydalanuvchi ham o'z thread'iga yozishi mumkin.
drop policy if exists "admin_messages insert" on public.admin_messages;
create policy "admin_messages insert" on public.admin_messages
  for insert with check (
    public.is_corpus_admin() or auth.uid() = user_id
  );

do $$
begin
  alter publication supabase_realtime add table public.admin_messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
