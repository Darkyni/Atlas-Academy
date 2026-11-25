-- ATLAS Study Planner: persiste sessões de estudo no registro privado de cada usuário.
-- Execute após revisar as migrations 005, 006 e 007.

alter table public.student_learning_records
  drop constraint if exists student_learning_records_record_type_check;

alter table public.student_learning_records
  add constraint student_learning_records_record_type_check
  check (record_type in (
    'flashcard_review', 'study_note', 'arcade_score', 'dynamic_test',
    'library_bookmark', 'field_ops', 'research_entry', 'study_plan'
  ));

comment on column public.student_learning_records.payload is
  'JSON de registros pessoais de aprendizagem, pesquisa, prática e planejamento semanal.';
