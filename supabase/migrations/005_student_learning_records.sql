-- ATLAS v1.0: sincronização de revisões, anotações, jogos e avaliações.
-- Migration incremental e idempotente. Não altera nem remove tabelas existentes.

create table if not exists public.student_learning_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  record_type text not null check (record_type in ('flashcard_review','study_note','arcade_score','dynamic_test','library_bookmark')),
  record_key text not null check (length(record_key) between 1 and 180),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, record_type, record_key)
);

-- Reaplica a lista permitida caso uma execução anterior da migration tenha sido parcial.
alter table public.student_learning_records
  drop constraint if exists student_learning_records_record_type_check;
alter table public.student_learning_records
  add constraint student_learning_records_record_type_check
  check (record_type in ('flashcard_review','study_note','arcade_score','dynamic_test','library_bookmark'));

create index if not exists student_learning_records_user_type_idx
  on public.student_learning_records (user_id, record_type);

alter table public.student_learning_records enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'student_learning_records'
      and policyname = 'student_learning_records_own_select'
  ) then
    create policy student_learning_records_own_select
      on public.student_learning_records for select
      to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'student_learning_records'
      and policyname = 'student_learning_records_own_insert'
  ) then
    create policy student_learning_records_own_insert
      on public.student_learning_records for insert
      to authenticated with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'student_learning_records'
      and policyname = 'student_learning_records_own_update'
  ) then
    create policy student_learning_records_own_update
      on public.student_learning_records for update
      to authenticated using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'student_learning_records'
      and policyname = 'student_learning_records_own_delete'
  ) then
    create policy student_learning_records_own_delete
      on public.student_learning_records for delete
      to authenticated using (auth.uid() = user_id);
  end if;
end $$;

grant select, insert, update, delete on public.student_learning_records to authenticated;
