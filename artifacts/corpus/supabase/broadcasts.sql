-- CORPUS — admin umumiy xabarlari (barcha foydalanuvchilarga).
-- Mavjud loyihaga: Supabase SQL Editor'da bir marta ishga tushiring.
-- Admin: profiles.is_admin = true (reports.sql dagi is_corpus_admin()).

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
