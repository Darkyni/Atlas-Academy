-- ATLAS Academy v8 — histórico de avaliações formativas por competência.
-- Execute uma única vez no SQL Editor do Supabase após conferir as migrations anteriores.
-- Não altera nem apaga registros existentes.

create table if not exists public.mastery_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  lesson_id text not null,
  responses jsonb not null,
  confidence smallint not null default 2 check (confidence between 0 and 3),
  evaluation jsonb not null,
  evaluated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists mastery_assessments_user_lesson_idx
  on public.mastery_assessments (user_id, lesson_id, evaluated_at desc);

alter table public.mastery_assessments enable row level security;

drop policy if exists "mastery_assessments_select_own" on public.mastery_assessments;
create policy "mastery_assessments_select_own"
  on public.mastery_assessments for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "mastery_assessments_insert_own" on public.mastery_assessments;
create policy "mastery_assessments_insert_own"
  on public.mastery_assessments for insert to authenticated
  with check (auth.uid() = user_id);

grant select, insert on public.mastery_assessments to authenticated;
