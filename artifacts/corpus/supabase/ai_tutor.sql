-- CORPUS AI Anatomy Tutor + Phase 1.5 RAG
create extension if not exists vector;

create table if not exists public.anatomy_chunks (
  id uuid primary key default gen_random_uuid(),
  book_id text not null,
  chapter text,
  section text,
  content text not null,
  page_number integer,
  chunk_key text,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(384),
  created_at timestamptz not null default now()
);
-- Safe upgrades for installations created with the Phase 1 migration.
alter table public.anatomy_chunks add column if not exists chunk_key text;
do $$
declare existing_rows bigint;
begin
  select count(*) into existing_rows from public.anatomy_chunks;
  if existing_rows = 0 then
    alter table public.anatomy_chunks alter column embedding type vector(384) using null::vector(384);
  else
    raise notice 'Existing anatomy_chunks rows detected; migrate embedding vectors to 384 dimensions before enabling Phase 1.5 RPC.';
  end if;
end $$;
drop index if exists public.anatomy_chunks_chunk_key_idx;
create unique index anatomy_chunks_chunk_key_idx on public.anatomy_chunks(chunk_key);
create index if not exists anatomy_chunks_book_idx on public.anatomy_chunks(book_id);
create index if not exists anatomy_chunks_content_idx on public.anatomy_chunks using gin(to_tsvector('simple', content));

create table if not exists public.tutor_memory (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  memory_type text not null, content text not null, importance smallint not null default 3 check (importance between 1 and 5), created_at timestamptz not null default now()
);
create index if not exists tutor_memory_user_idx on public.tutor_memory(user_id, importance desc, created_at desc);

create table if not exists public.tutor_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  duration_seconds integer not null default 0, topics jsonb not null default '[]'::jsonb, mistakes jsonb not null default '[]'::jsonb,
  strengths jsonb not null default '[]'::jsonb, understanding_score numeric, recommended_next_topic text, created_at timestamptz not null default now()
);
create index if not exists tutor_sessions_user_idx on public.tutor_sessions(user_id, created_at desc);

create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(), session_id uuid not null references public.tutor_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, role text not null check (role in ('user', 'assistant')),
  content text not null, created_at timestamptz not null default now()
);
create index if not exists tutor_messages_session_idx on public.tutor_messages(session_id, created_at);
create index if not exists tutor_messages_user_idx on public.tutor_messages(user_id, created_at desc);

alter table public.anatomy_chunks enable row level security;
alter table public.tutor_memory enable row level security;
alter table public.tutor_sessions enable row level security;
alter table public.tutor_messages enable row level security;
drop policy if exists anatomy_chunks_read on public.anatomy_chunks;
create policy anatomy_chunks_read on public.anatomy_chunks for select to authenticated using (true);
drop policy if exists tutor_memory_owner on public.tutor_memory;
create policy tutor_memory_owner on public.tutor_memory for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists tutor_sessions_owner on public.tutor_sessions;
create policy tutor_sessions_owner on public.tutor_sessions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists tutor_messages_owner on public.tutor_messages;
create policy tutor_messages_owner on public.tutor_messages for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.match_anatomy_chunks(query_embedding vector(384), match_count integer default 6, source_filter text default null)
returns table (id uuid, content text, book_title text, chapter text, section text, page_number integer, source_type text, similarity float)
language sql stable as $$
  select c.id, c.content, coalesce(c.metadata->>'book_title', c.book_id), c.chapter, c.section, c.page_number,
    coalesce(c.metadata->>'source_type', 'textbook'), 1 - (c.embedding <=> query_embedding) as similarity
  from public.anatomy_chunks c
  where c.embedding is not null and (source_filter is null or c.metadata->>'source_type' = source_filter)
  order by c.embedding <=> query_embedding limit greatest(1, least(match_count, 20));
$$;
