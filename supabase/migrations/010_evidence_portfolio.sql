-- ATLAS Evidence Portfolio: artefatos acadêmicos e rubricas de domínio por estudante.
-- Execute após a migration 009. Preserva as políticas RLS existentes.

alter table public.student_learning_records
  drop constraint if exists student_learning_records_record_type_check;

alter table public.student_learning_records
  add constraint student_learning_records_record_type_check
  check (record_type in (
    'flashcard_review', 'study_note', 'arcade_score', 'dynamic_test',
    'library_bookmark', 'field_ops', 'research_entry', 'study_plan',
    'concept_map', 'evidence_portfolio'
  ));

comment on column public.student_learning_records.payload is
  'JSON privado por estudante: progresso, pesquisa, planejamento, mapas conceituais e portfólio de evidências.';
