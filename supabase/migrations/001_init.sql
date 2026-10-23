-- Mwalimu Cloud: unofficial AZ-900 study tool. Schema + RLS.
create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  language text not null default 'en',
  exam_date date,
  created_at timestamptz not null default now()
);

create table public.topics (
  id text primary key,
  domain text not null,
  title text not null,
  description text,
  sort_order int not null default 0
);

create table public.explanations (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null references public.topics(id),
  language text not null,
  level text not null check (level in ('standard','simpler')),
  content jsonb not null,
  prompt_version text not null,
  created_at timestamptz not null default now(),
  unique (topic_id, language, level)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null references public.topics(id),
  type text not null check (type in ('single','multiple','true_false')),
  body jsonb not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  prompt_version text not null,
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);
create index questions_topic_idx on public.questions(topic_id) where not flagged;

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected jsonb not null,
  is_correct boolean not null,
  time_ms int,
  created_at timestamptz not null default now()
);
create index attempts_user_idx on public.attempts(user_id, created_at desc);

create table public.review_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  box int not null check (box between 1 and 5),
  due_at timestamptz not null,
  last_reviewed_at timestamptz not null,
  primary key (user_id, question_id)
);

-- No personal data: callers are stored as a salted hash only (used for rate limiting).
create table public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  function_name text not null,
  caller_hash text,
  prompt_version text,
  model text,
  latency_ms int,
  tokens_in int,
  tokens_out int,
  success boolean not null,
  created_at timestamptz not null default now()
);
create index ai_logs_rate_idx on public.ai_logs(caller_hash, created_at desc);

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.topics enable row level security;
alter table public.explanations enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.review_state enable row level security;
alter table public.ai_logs enable row level security;  -- no policies: service role only

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "topics readable" on public.topics for select using (true);
create policy "explanations readable" on public.explanations for select using (true);
create policy "questions readable" on public.questions for select using (not flagged);
create policy "own attempts" on public.attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own review state" on public.review_state for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Clients may only FLAG a question; they can never edit it.
create or replace function public.flag_question(qid uuid) returns void
language sql security definer set search_path = public as $$
  update public.questions set flagged = true where id = qid;
$$;
grant execute on function public.flag_question(uuid) to anon, authenticated;

-- Auto-create a profile on sign-up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();
