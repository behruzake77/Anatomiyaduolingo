-- CORPUS — Kahoot-uslubidagi sinf o'yini (PIN, lobby, ko'p o'yinchi).
-- Mavjud loyihaga: Supabase SQL Editor'da bir marta ishga tushiring.
-- Yangi o'rnatish: schema.sql oxirida ham shu jadvallar bor.

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

-- O'yin boshlanganidan keyin (countdown/question/reveal/scoreboard) ham
-- PIN bilan qo'shilish mumkin — faqat tugagan (podium) va bekor qilingan
-- (cancelled) o'yinlarga kirish taqiqlanadi.
drop policy if exists "kahoot players insert" on public.kahoot_players;
create policy "kahoot players insert" on public.kahoot_players
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.kahoot_games g
      where g.id = game_id
        and g.status in ('lobby','countdown','question','reveal','scoreboard')
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
