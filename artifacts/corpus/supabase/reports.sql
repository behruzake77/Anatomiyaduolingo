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
