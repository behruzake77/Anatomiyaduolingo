-- Username unique + tug'ilgan yil. SQL Editor'da bir marta Run.

alter table public.profiles
  add column if not exists birth_year integer;

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username));
