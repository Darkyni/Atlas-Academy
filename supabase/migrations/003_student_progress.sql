-- ATLAS Academy v6 — sincronização de conclusão de aulas entre dispositivos.
-- Execute uma única vez no SQL Editor do Supabase.
create table if not exists public.student_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  course_id text not null,
  completed boolean not null default false,
  score smallint,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id),
  constraint student_lesson_progress_score_range
    check (score is null or (score >= 0 and score <= 100))
);

create index if not exists student_lesson_progress_user_course_idx
  on public.student_lesson_progress (user_id, course_id);

alter table public.student_lesson_progress enable row level security;

drop policy if exists "student_progress_select_own" on public.student_lesson_progress;
create policy "student_progress_select_own"
  on public.student_lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "student_progress_insert_own" on public.student_lesson_progress;
create policy "student_progress_insert_own"
  on public.student_lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "student_progress_update_own" on public.student_lesson_progress;
create policy "student_progress_update_own"
  on public.student_lesson_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "student_progress_delete_own" on public.student_lesson_progress;
create policy "student_progress_delete_own"
  on public.student_lesson_progress for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.student_lesson_progress to authenticated;
