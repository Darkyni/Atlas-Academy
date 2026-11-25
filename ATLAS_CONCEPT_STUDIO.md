# ATLAS Concept Studio

## Objetivo

O Estúdio de Conceitos permite criar mapas de conhecimento pessoais, registrar conceitos, classificar sua natureza (conceito, causa, evidência ou exemplo), associar cada item a um departamento e declarar a confiança atual no entendimento.

## Mecânicas

- Mapas com título e pergunta orientadora.
- Conceitos com descrição, departamento, natureza e confiança de 1 a 5.
- Relações direcionais nomeadas (por exemplo: causa, depende de, limita, é evidência de, contrasta com, exemplifica, influencia e é parte de).
- Indicadores de quantidade de conceitos, relações, departamentos conectados e densidade relacional.
- Busca, seleção de mapas, remoção de nós e relações, arquivamento e exportação Markdown.
- Ao remover um conceito, suas relações incidentes também são removidas para evitar referências quebradas.

## Persistência e privacidade

- Chave local: `atlas:v2:<identidade>:atlas-concept-studio-v1` via `getAtlasStorageKey`.
- Registro remoto: `student_learning_records`, `record_type = concept_map`.
- A migration `009_concept_maps.sql` amplia a constraint de tipos, sem recriar tabela nem modificar políticas RLS.
- Aplicar a migration somente após verificar que 005–008 estão aplicadas no projeto Supabase.
- Não há importação automática de chaves legadas sem namespace.

## Limitações atuais

A representação é um canvas editorial de cartões e uma lista explícita de relações; não é um editor gráfico livre com arrastar/soltar. O cálculo de densidade é um indicador descritivo simples, não uma medida científica de qualidade do mapa. A sincronização remota depende da migration 009 e das políticas RLS já aplicadas.
