-- CORPUS — foydalanuvchi testlari (jamoa Kahoot).
-- Mavjud loyihaga: Supabase SQL Editor'da bir marta ishga tushiring.

create table if not exists public.user_quizzes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  owner_name text not null default '',
  title text not null default '',
  description text not null default '',
  is_public boolean not null default true,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_quizzes_owner_idx
  on public.user_quizzes (owner_id, updated_at desc);

create index if not exists user_quizzes_public_idx
  on public.user_quizzes (is_public, updated_at desc)
  where is_public = true;

alter table public.user_quizzes enable row level security;

drop policy if exists "quizzes read public or own" on public.user_quizzes;
create policy "quizzes read public or own" on public.user_quizzes
  for select using (is_public = true or auth.uid() = owner_id);

drop policy if exists "quizzes insert own" on public.user_quizzes;
create policy "quizzes insert own" on public.user_quizzes
  for insert with check (auth.uid() = owner_id);

drop policy if exists "quizzes update own" on public.user_quizzes;
create policy "quizzes update own" on public.user_quizzes
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "quizzes delete own" on public.user_quizzes;
create policy "quizzes delete own" on public.user_quizzes
  for delete using (auth.uid() = owner_id);

alter table public.kahoot_games
  add column if not exists quiz_id uuid;

alter table public.kahoot_games
  add column if not exists questions jsonb;
