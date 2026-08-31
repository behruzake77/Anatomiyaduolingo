-- CORPUS — jonli reyting va 1ga-1 bellashuv.
-- Mavjud loyihaga qo'shimcha: Supabase SQL Editor'da bir marta ishga tushiring.
-- Yangi o'rnatish uchun schema.sql allaqachon shu o'zgarishlarni o'z ichiga oladi.

alter table public.profiles add column if not exists week_xp integer not null default 0;
alter table public.profiles add column if not exists week_key text not null default '';
alter table public.profiles add column if not exists league_index integer not null default 0;
alter table public.profiles add column if not exists battles_won integer not null default 0;
alter table public.profiles add column if not exists battles_lost integer not null default 0;

-- Reyting uchun profil o'qish ochiq (email yo'q — faqat username/XP).
drop policy if exists "profiles own select" on public.profiles;
drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read" on public.profiles
  for select using (true);

create table if not exists public.battles (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  status text not null default 'waiting',
  host_id uuid not null references auth.users(id) on delete cascade,
  guest_id uuid references auth.users(id) on delete set null,
  host_name text not null,
  guest_name text,
  seed text not null,
  q_count integer not null default 7,
  host_score integer not null default 0,
  guest_score integer not null default 0,
  host_done boolean not null default false,
  guest_done boolean not null default false,
  winner_id uuid,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create index if not exists battles_waiting_idx
  on public.battles (status, created_at)
  where status = 'waiting' and guest_id is null;

alter table public.battles enable row level security;

drop policy if exists "battles readable" on public.battles;
create policy "battles readable" on public.battles
  for select using (
    auth.uid() is not null and (
      status = 'waiting' or host_id = auth.uid() or guest_id = auth.uid()
    )
  );

drop policy if exists "battles insert host" on public.battles;
create policy "battles insert host" on public.battles
  for insert with check (auth.uid() = host_id);

drop policy if exists "battles update" on public.battles;
create policy "battles update" on public.battles
  for update using (
    host_id = auth.uid()
    or guest_id = auth.uid()
    or (status = 'waiting' and guest_id is null)
  ) with check (
    host_id = auth.uid() or guest_id = auth.uid()
  );

drop policy if exists "battles delete own" on public.battles;
create policy "battles delete own" on public.battles
  for delete using (host_id = auth.uid() or guest_id = auth.uid());

do $$
begin
  alter publication supabase_realtime add table public.battles;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
