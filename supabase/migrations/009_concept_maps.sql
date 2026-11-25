-- ATLAS Concept Studio: amplia os tipos de registro pessoal para mapas conceituais.
-- Execute após as migrations 005, 006, 007 e 008.
-- A tabela continua protegida pelas políticas RLS por user_id já criadas em 005.

alter table public.student_learning_records
  drop constraint if exists student_learning_records_record_type_check;

alter table public.student_learning_records
  add constraint student_learning_records_record_type_check
  check (record_type in (
    'flashcard_review', 'study_note', 'arcade_score', 'dynamic_test',
    'library_bookmark', 'field_ops', 'research_entry', 'study_plan', 'concept_map'
  ));

comment on column public.student_learning_records.payload is
  'JSON privado por estudante: revisão, notas, biblioteca, prática, pesquisa, planejamento e mapas conceituais.';
