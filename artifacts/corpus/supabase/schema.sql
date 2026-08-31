-- CORPUS account data for Supabase.
-- Run this once in Supabase SQL Editor. It is safe to re-run.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  birth_year integer,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  daily_goal integer not null default 20,
  last_activity date default current_date,
  week_xp integer not null default 0,
  week_key text not null default '',
  league_index integer not null default 0,
  battles_won integer not null default 0,
  battles_lost integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  correct integer not null default 0,
  wrong integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, badge)
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.achievements enable row level security;

drop policy if exists "profiles own select" on public.profiles;
drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read" on public.profiles
  for select using (true);

drop policy if exists "profiles own insert" on public.profiles;
create policy "profiles own insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles own delete" on public.profiles;
create policy "profiles own delete" on public.profiles
  for delete using (auth.uid() = id);

drop policy if exists "progress own all" on public.progress;
create policy "progress own all" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "achievements own all" on public.achievements;
create policy "achievements own all" on public.achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_corpus_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
      split_part(new.email, '@', 1),
      'user'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_corpus on auth.users;
create trigger on_auth_user_created_corpus
  after insert on auth.users
  for each row execute procedure public.handle_new_corpus_user();

-- Kahoot-uslubidagi sinf o'yini (to'liq siyosat: supabase/kahoot.sql).
create table if not exists public.kahoot_games (
  id uuid primary key default gen_random_uuid(),
  pin text not null unique,
  host_id uuid not null references auth.users(id) on delete cascade,
  host_name text not null,
  seed text not null,
  q_count integer not null default 10,
  q_seconds integer not null default 20,
  status text not null default 'lobby',
  q_index integer not null default 0,
  q_started_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.kahoot_players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.kahoot_games(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  score integer not null default 0,
  streak integer not null default 0,
  answers jsonb not null default '[]'::jsonb,
  is_bot boolean not null default false,
  joined_at timestamptz not null default now()
);

-- RLS, indekslar va realtime — mavjud loyihaga: supabase/kahoot.sql.

create index if not exists kahoot_games_pin_idx on public.kahoot_games (pin);
create index if not exists kahoot_games_lobby_idx
  on public.kahoot_games (status, created_at)
  where status = 'lobby';

create table if not exists public.kahoot_players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.kahoot_games(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  score integer not null default 0,
  streak integer not null default 0,
  answers jsonb not null default '[]'::jsonb,
  is_bot boolean not null default false,
  joined_at timestamptz not null default now()
);

create unique index if not exists kahoot_players_user_uniq
  on public.kahoot_players (game_id, user_id)
  where user_id is not null;

create index if not exists kahoot_players_game_idx on public.kahoot_players (game_id);

alter table public.kahoot_games enable row level security;
alter table public.kahoot_players enable row level security;

drop policy if exists "kahoot games read" on public.kahoot_games;
create policy "kahoot games read" on public.kahoot_games
  for select using (auth.uid() is not null);

drop policy if exists "kahoot games insert" on public.kahoot_games;
create policy "kahoot games insert" on public.kahoot_games
  for insert with check (auth.uid() = host_id);

drop policy if exists "kahoot games update" on public.kahoot_games;
create policy "kahoot games update" on public.kahoot_games
  for update using (auth.uid() = host_id) with check (auth.uid() = host_id);

drop policy if exists "kahoot games delete" on public.kahoot_games;
create policy "kahoot games delete" on public.kahoot_games
  for delete using (auth.uid() = host_id);

drop policy if exists "kahoot players read" on public.kahoot_players;
create policy "kahoot players read" on public.kahoot_players
  for select using (auth.uid() is not null);

drop policy if exists "kahoot players insert" on public.kahoot_players;
create policy "kahoot players insert" on public.kahoot_players
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.kahoot_games g
      where g.id = game_id and g.status = 'lobby'
    )
  );

drop policy if exists "kahoot players update" on public.kahoot_players;
create policy "kahoot players update" on public.kahoot_players
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "kahoot players delete" on public.kahoot_players;
create policy "kahoot players delete" on public.kahoot_players
  for delete using (
    auth.uid() = user_id
    or exists (select 1 from public.kahoot_games g where g.id = game_id and g.host_id = auth.uid())
  );

do $$
begin
  alter publication supabase_realtime add table public.kahoot_games;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.kahoot_players;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

-- Talab/taklif (to'liq: supabase/reports.sql).
-- CORPUS — talab/taklif va savol xatoliklari (admin inbox).
-- Mavjud loyihaga: Supabase SQL Editor'da bir marta ishga tushiring.
-- O'zingizni admin qilish:
--   update public.profiles set is_admin = true
--   where id in (select id from auth.users where email = 'SIZNING_EMAIL');

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create or replace function public.is_corpus_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

create table if not exists public.question_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null default '',
  kind text not null default 'error',
  status text not null default 'open',
  lesson_id text,
  lesson_title text,
  q_index integer,
  q_type text,
  prompt text,
  source text,
  message text not null default '',
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists question_reports_status_idx
  on public.question_reports (status, created_at desc);

create index if not exists question_reports_user_idx
  on public.question_reports (user_id, created_at desc);

alter table public.question_reports enable row level security;

drop policy if exists "reports insert own" on public.question_reports;
create policy "reports insert own" on public.question_reports
  for insert with check (auth.uid() = user_id);

drop policy if exists "reports read own or admin" on public.question_reports;
create policy "reports read own or admin" on public.question_reports
  for select using (auth.uid() = user_id or public.is_corpus_admin());

drop policy if exists "reports update admin" on public.question_reports;
create policy "reports update admin" on public.question_reports
  for update using (public.is_corpus_admin()) with check (public.is_corpus_admin());

drop policy if exists "reports delete admin" on public.question_reports;
create policy "reports delete admin" on public.question_reports
  for delete using (public.is_corpus_admin() or auth.uid() = user_id);

-- Admin umumiy xabarlari (to'liq: supabase/broadcasts.sql).
create table if not exists public.app_broadcasts (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  body text not null default '',
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'Admin',
  created_at timestamptz not null default now()
);

create index if not exists app_broadcasts_created_idx
  on public.app_broadcasts (created_at desc);

alter table public.app_broadcasts enable row level security;

drop policy if exists "broadcasts read" on public.app_broadcasts;
create policy "broadcasts read" on public.app_broadcasts
  for select using (true);

drop policy if exists "broadcasts insert admin" on public.app_broadcasts;
create policy "broadcasts insert admin" on public.app_broadcasts
  for insert with check (public.is_corpus_admin());

drop policy if exists "broadcasts delete admin" on public.app_broadcasts;
create policy "broadcasts delete admin" on public.app_broadcasts
  for delete using (public.is_corpus_admin());

do $$
begin
  alter publication supabase_realtime add table public.app_broadcasts;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

-- Foydalanuvchi testlari (to'liq: supabase/user_quizzes.sql).
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
