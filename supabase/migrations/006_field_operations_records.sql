-- ATLAS Field Operations: adiciona um tipo de registro sem alterar dados existentes.
-- Execute somente após revisar o histórico de migrations do projeto.
-- A migration é incremental; não remove tabelas, linhas ou políticas existentes.

alter table public.student_learning_records
  drop constraint if exists student_learning_records_record_type_check;

alter table public.student_learning_records
  add constraint student_learning_records_record_type_check
  check (record_type in (
    'flashcard_review', 'study_note', 'arcade_score', 'dynamic_test',
    'library_bookmark', 'field_ops'
  ));

-- As políticas RLS existentes continuam restringindo cada linha ao próprio usuário.
