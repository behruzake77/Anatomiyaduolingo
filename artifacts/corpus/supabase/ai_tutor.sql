-- CORPUS AI Anatomy Tutor foundation
create extension if not exists vector;

create table if not exists public.anatomy_chunks (
  id uuid primary key default gen_random_uuid(),
  book_id text not null,
  chapter text,
  section text,
  content text not null,
  page_number integer,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
create index if not exists anatomy_chunks_book_idx on public.anatomy_chunks(book_id);
create index if not exists anatomy_chunks_content_idx on public.anatomy_chunks using gin(to_tsvector('simple', content));

create table if not exists public.tutor_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_type text not null,
  content text not null,
  importance smallint not null default 3 check (importance between 1 and 5),
  created_at timestamptz not null default now()
);
create index if not exists tutor_memory_user_idx on public.tutor_memory(user_id, importance desc, created_at desc);

create table if not exists public.tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  duration_seconds integer not null default 0,
  topics jsonb not null default '[]'::jsonb,
  mistakes jsonb not null default '[]'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  understanding_score numeric,
  recommended_next_topic text,
  created_at timestamptz not null default now()
);
create index if not exists tutor_sessions_user_idx on public.tutor_sessions(user_id, created_at desc);

create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.tutor_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
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
