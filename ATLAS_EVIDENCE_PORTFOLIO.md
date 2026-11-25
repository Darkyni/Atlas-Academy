# ATLAS — Portfólio de evidências

## Objetivo
Registrar produções acadêmicas e avaliar evidências de domínio nas cinco competências ATLAS: Explicar, Relacionar, Questionar, Aplicar e Transferir.

## Funcionalidades
- Registros de análises, estudos de caso, projetos, problemas, ensaios, apresentações e experimentos.
- Departamento, curso/contexto, problema, reflexão crítica, resultado e etiquetas.
- Rubrica de 0 a 3 por competência.
- Indicadores descritivos agregados, filtros, arquivamento e exportação Markdown.
- Persistência local separada por identidade e sincronização autenticada via `student_learning_records`.

## Rubrica
- 0: sem evidência suficiente.
- 1: desempenho inicial.
- 2: desempenho consistente.
- 3: desempenho autônomo.

A média exibida é descritiva e não deve ser interpretada como nota psicométrica ou certificação.

## Banco de dados
Aplicar `supabase/migrations/010_evidence_portfolio.sql` depois das migrations 005–009. A migration amplia a constraint `record_type`; mantém a tabela e as políticas RLS existentes. Não foi executada automaticamente.

## Limitações
- Não há upload de arquivos binários nesta entrega; o portfólio registra descrição e reflexão sobre artefatos.
- A sincronização depende de Supabase configurado, usuário autenticado e migration 010 aplicada.
- Build e testes reais devem ser executados no ambiente com dependências instaladas.
