-- CORPUS account data for Supabase.
-- Run this once in Supabase SQL Editor. It is safe to re-run.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  daily_goal integer not null default 20,
  last_activity date default current_date,
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
create policy "profiles own select" on public.profiles
  for select using (auth.uid() = id);

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