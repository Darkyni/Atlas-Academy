# ATLAS Academy — Expansão Stage 5

- Portfólio de evidências integrado à navegação principal.
- Registros de análises, casos, projetos, problemas, ensaios, apresentações e experimentos.
- Rubrica 0–3 para Explicar, Relacionar, Questionar, Aplicar e Transferir.
- Indicadores descritivos, filtros, busca, arquivamento e exportação Markdown.
- Persistência local separada por identidade e sincronização por `student_learning_records`.
- Migration incremental `010_evidence_portfolio.sql`.

Execute a migration 010 depois da 009. A sincronização remota depende do Supabase configurado, autenticação e migration aplicada. Build, typecheck, navegador e RLS real não foram presumidos como aprovados.
