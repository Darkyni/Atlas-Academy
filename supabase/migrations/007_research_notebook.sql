-- ATLAS Research Notebook: adiciona registros estruturados de pesquisa ao armazenamento privado.
-- Execute após as migrations 005 e 006. Mantém as políticas RLS por usuário existentes.

alter table public.student_learning_records
  drop constraint if exists student_learning_records_record_type_check;

alter table public.student_learning_records
  add constraint student_learning_records_record_type_check
  check (record_type in (
    'flashcard_review', 'study_note', 'arcade_score', 'dynamic_test',
    'library_bookmark', 'field_ops', 'research_entry'
  ));

comment on column public.student_learning_records.payload is
  'JSON de registros acadêmicos pessoais; research_entry guarda sínteses, perguntas, hipóteses, fontes e conexões.';
