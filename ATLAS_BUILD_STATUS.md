# ATLAS Academy — Build Status

## Current package

Reconstrução visual e arquitetural — direção C, híbrido autoral e organização densa — 2026-11-25.

> As seções históricas abaixo documentam versões anteriores. O estado mais recente está na seção “Reconstrução autoral — 2026-11-25”.

## Scope completed in source

- Unified RPG visual language across dashboard, academy, library, lab, challenges, tutor and lesson surfaces.
- Character HUD with level/title/XP derived from completed lessons.
- Six territory cards with independent progress.
- Quest board, local progress signals and achievement milestones.
- Course assessment reframed as a final region challenge, retaining the 70% completion gate.
- Mastery assessment reframed around five intellectual attributes while preserving its existing rubric and API integration.
- Existing curriculum, resources, Supabase client, API routes and migrations retained.

## Validation

- `node scripts/validate-content.mjs`: passed (42 missions, 97 resources, 30 advanced lessons, 24 practice scenarios; CSS balance and RPG integration checks passed).
- TypeScript/TSX syntax transpilation: 23 files, 0 syntax diagnostics.
- Full TypeScript typecheck and Next.js production build: **not verified** because dependency installation timed out in the build environment.
- Browser, mobile-device, Supabase and Vercel deployment: **not verified**.

## Deployment gate

Do not deploy until `npm install`, `npm run typecheck`, and `npm run build` succeed in Codespaces and the main learning flows have been manually checked.


## Extensão Campo & Engenharia — 2026-11-15

- Adicionada a navegação `Campo & Engenharia` e o componente `PracticalAcademy`.
- Criadas três trilhas (ATLAS SURVIVAL, ATLAS HOME LAB e ATLAS FIELD ENGINEERING), com cinco módulos cada.
- Incluídas missões práticas, checklist de preparação persistido em `localStorage` e seis cenários/modos de simulação.
- Conteúdo inclui limites de segurança e encaminhamento a profissionais para atividades de risco.
- O progresso da extensão permanece local; não foi criada migration nem alterado o schema Supabase.
- Validação estática de conteúdo executada após as alterações: aprovada.
- Transpilação sintática TypeScript/TSX: 26 arquivos, sem diagnósticos sintáticos.
- `npm install` não concluiu no ambiente; `npm run typecheck` e `npm run build` permanecem não verificados.
- Nenhuma publicação ou alteração no Supabase/Vercel foi realizada.


## ATLAS Operations Upgrade — 2026-11-16

### Implementado no pacote-fonte
- Expandidas as trilhas SURVIVAL, HOME LAB e FIELD ENGINEERING de 5 para 8 módulos cada (24 módulos no total), com novos conteúdos intermediários e avançados.
- Criado `FieldOperationsCenter` com dimensionador de reserva de água, checklist de prontidão, matriz de risco, diário de manutenção, puzzle de sequência de crise e calculadora educacional da Lei de Ohm.
- Registros do Centro de Operações mantidos no navegador e com tentativa de sincronização autenticada em `student_learning_records` pelo tipo `field_ops`.
- Criada migration incremental `006_field_operations_records.sql`; não foi executada no banco. As políticas RLS existentes são preservadas.
- Acrescentado link de salto para conteúdo, foco visível e metadados revisados.
- Atualizados README, documentação de Campo & Engenharia e validador de conteúdo.

### Validação deste pacote
- `node scripts/validate-content.mjs`: aprovado, incluindo 24 módulos de Campo & Engenharia, ferramentas do Centro de Operações, migration 006 e balanceamento CSS.
- Transpilação sintática dos arquivos TS/TSX alterados: 5 arquivos, zero diagnósticos de sintaxe.
- `npm install`: não concluiu dentro do limite do ambiente.
- `tsc --noEmit`: não aprovou; o ambiente está sem `next`, `react`, `lucide-react`, `@supabase/supabase-js` e tipos Node, causando erros de resolução e JSX. Isso não permite afirmar que o typecheck completo passou.
- Build Next.js, testes de navegador, sincronização Supabase, responsividade em dispositivo real e deploy: não verificados.

### Limites e próximo passo obrigatório
1. Instalar dependências em ambiente com acesso ao registry.
2. Executar `npm run typecheck` e `npm run build`; corrigir qualquer erro real encontrado.
3. Revisar e executar migration 006 somente se a 005 estiver aplicada e a 006 ainda estiver pendente.
4. Testar o Centro de Operações com e sem autenticação e verificar RLS.
5. Publicar somente após autorização e validação da implantação.

Nenhum commit, push, alteração de produção, migração no banco ou deploy foi realizado por esta atualização.

## Security and reliability hardening — 2026-11-16

- A rota de avaliação de domínio agora exige token Bearer de uma sessão Supabase validada no servidor; sem sessão válida, não consome a API de IA.
- Incluídos limites de payload e tamanho de respostas, validação da estrutura e limites de tamanho da saída, timeout de 35 segundos e respostas sem cache.
- Incluído limitador inicial de cinco avaliações por minuto por usuário e instância. **Limitação conhecida:** memória local não é um rate limiter distribuído e pode reiniciar entre execuções serverless; configurar Redis/serviço equivalente antes de exposição pública com tráfego relevante.
- Progresso local de aulas separado por ID da conta; modo visitante usa namespace próprio. A chave legada só é importada para visitante, não para uma conta autenticada.
- Cabeçalhos HTTP de segurança adicionados em `next.config.ts`.
- `.gitignore` criado; removidos arquivos de download acidentais e cache `tsconfig.tsbuildinfo`; `.env.example` padronizado.
- Restaurado o script `scripts/update-atlas.ps1` chamado pelo atualizador Windows; ele verifica a raiz Git, alerta sobre alterações não commitadas, cria backup dos arquivos que serão sobrescritos e preserva `.git`, `.env*`, dependências e diretórios de build. Não faz commit/push/deploy.
- Workflow CI inclui `validate:security`; comando agregado `npm run validate:all` criado.
- Validação de conteúdo: PASS (17 verificações); validação estática de segurança: PASS (10 verificações); destinos da Biblioteca: PASS (97 URLs/arquivos locais e IDs únicos); transpilação sintática TypeScript/TSX: PASS (27 arquivos, zero diagnósticos).
- `npm install` não pôde completar porque o ambiente não resolve `registry.npmjs.org` (falha DNS). Por isso typecheck sem dependências reporta apenas ausência de `next`, `react`, `lucide-react`, `@supabase/supabase-js` e tipos Node; **typecheck semântico e build Next.js seguem não verificados**.
- Testes em browser, autenticação real, RLS, migrações no Supabase, deploy e domínio Vercel não foram executados.


## Revisão semanal e hardening de acessibilidade — 2026-11-22

### Alterações implementadas nesta cópia de trabalho
- Corrigida a estrutura de landmarks: o contêiner geral deixou de ser `main`; o landmark principal agora envolve a área de aplicação e recebe o destino do link “Pular para o conteúdo”.
- O destino do link de salto agora é programaticamente focável (`tabIndex={-1}`).
- Controles de seleção do Laboratório e do Centro de Operações deixaram de declarar semântica ARIA de abas incompleta (`tablist`/`tab`) e passaram a usar grupo de botões com `aria-pressed`, coerente com a implementação atual sem painéis de abas associados.
- Adicionada camada de legibilidade com tamanho mínimo de 15 px para texto corrido em áreas pedagógicas selecionadas, maior entrelinha, cores de texto mais escuras e foco visível mais claro.
- Reforçado o respeito a `prefers-reduced-motion` e ao espaçamento de rolagem para âncoras.
- O validador de segurança agora alerta explicitamente que diversos módulos ainda usam chaves `localStorage` globais e que a checagem de progresso por usuário cobre apenas o progresso de aulas.

### Achados críticos ainda pendentes
- Laboratório, biblioteca, campo/operações, avaliação de maestria, oficina de aulas, avaliação de curso, academia prática, arcade e progressão ainda apresentam chaves locais globais em pelo menos parte do fluxo. Em alguns casos, dados locais são combinados e enviados à conta autenticada após login. Isso pode misturar dados de visitante/contas no mesmo navegador. Não realizar migração automática desses registros até criar namespace por usuário e importação explícita.
- A migration `006_field_operations_records.sql` está presente no pacote e inclui `field_ops`; sua aplicação no Supabase não foi confirmada. Não executar sem conferir o histórico de migrations e a migration 005.
- `package-lock.json` não existe no pacote-base. Tentativa de gerar lockfile falhou: acesso ao registry npm indisponível e pacote ausente do cache local. Não foi criado lockfile artificial.
- Não foi possível instalar dependências. Typecheck semântico e build Next.js permanecem não verificados.

### Testes executados nesta revisão
- `node scripts/validate-content.mjs`: PASS.
- `node scripts/validate-security.mjs`: PASS nas verificações estáticas existentes; agora também emite WARN para armazenamento local compartilhado.
- `node scripts/validate-resources.mjs`: PASS (97 destinos e IDs verificados).
- TypeScript, build, testes de navegador, leitores de tela, medições WCAG automatizadas, autenticação Supabase, RLS, migrações, Vercel e GitHub: NÃO EXECUTADOS / NÃO VERIFICADOS.

### Próximos passos obrigatórios
1. Implementar namespace local por usuário em todos os módulos, separando `guest` de IDs Supabase e removendo importação automática cruzada; oferecer migração explícita e revisável dos dados antigos.
2. Criar `package-lock.json` em ambiente com acesso ao npm registry; adotar `npm ci` no CI.
3. Executar `npm run typecheck` e `npm run build` com dependências instaladas.
4. Validar contraste real de todos os estados e componentes segundo WCAG 2.2 AA; a camada CSS adicionada é melhoria parcial, não certificação.
5. Testar fluxos de duas contas no mesmo navegador, logout/login, persistência entre dispositivos e RLS com contas de teste.

Nenhuma migration foi executada. Nenhum dado, credencial, repositório remoto ou implantação foi alterado. Esta revisão modifica apenas a cópia de trabalho empacotada para entrega.


## Isolamento de persistência local — 2026-11-24

### Implementado nesta cópia
- Criado `src/lib/atlas-storage.ts`, que separa chaves locais por identidade Supabase (`atlas:v2:user:<uuid>`) ou visitante (`atlas:v2:guest`).
- Os módulos Learning Lab, Biblioteca, Campo & Engenharia, Centro de Operações, avaliações, oficina de aula, arcade e painel de progressão passaram a usar o namespace.
- Chaves legadas sem namespace permanecem intactas, mas não são importadas automaticamente para visitante ou conta, inclusive no progresso de aulas, pois versões anteriores poderiam ter misturado dados de identidades diferentes.
- Se houver token Supabase persistido, mas não for possível identificar seu usuário, o armazenamento falha fechado em um namespace neutro, em vez de expor o espaço de visitante.
- A aplicação reinicia o estado em memória quando a identidade autenticada muda, evitando que componentes montados mantenham o estado da conta anterior após login/logout.
- As chaves de sincronização Supabase permanecem estáveis; RLS e migrations existentes não foram alteradas.

### Verificações
- `npm run validate:all`: PASS (conteúdo, segurança e 97 destinos de recursos).
- Transpilação sintática TypeScript/TSX: PASS (27 arquivos, zero diagnósticos).
- `npm install --package-lock-only --ignore-scripts --no-audit --no-fund`: excedeu 120 s; nenhum lockfile artificial foi criado. `npm run typecheck`: bloqueado por dependências ausentes (`next`, `react`, `@supabase/supabase-js`, tipos Node), não por um diagnóstico semântico isolado.
- Não foram executados testes de browser, duas contas reais, RLS, Storage ou Supabase remoto.

### Limitações que impedem declarar o serviço integralmente finalizado
1. O isolamento de chaves foi implementado no código, mas precisa ser validado em navegador com duas contas distintas e um perfil visitante.
2. A migration 006 existe, mas não foi aplicada nem verificada no projeto Supabase.
3. Não há `package-lock.json`; `npm ci`, typecheck semântico e build Next.js ainda dependem de acesso ao registry npm.
4. Não houve acesso de publicação ao GitHub/Vercel; nenhuma implantação foi realizada.

### Redesign visual — decisão e andamento
A direção C (híbrido autoral) e a organização densa foram escolhidas pelo usuário em 25/11/2026. A primeira etapa do redesign foi implementada na seção “Reconstrução autoral — 2026-11-25”, preservando autenticação, persistência e conteúdo acadêmico.


## Reconstrução autoral — 2026-11-25

### Direção aplicada nesta etapa
- A identidade visual passa a usar azul-petróleo, marfim, grafite, verde-sálvia e dourado fosco, com superfícies planas, divisórias finas, tipografia editorial e hierarquia compacta.
- O shell principal foi redesenhado: navegação agrupada por função, rótulos de academia pessoal, barra de contexto, índice editorial dos seis departamentos e registro de progresso por departamento.
- O painel inicial foi refeito para priorizar próxima sessão, indicadores de estudo, departamentos e ritmo semanal; foram removidas a HUD, a representação de mundo, o painel de missões e o salão de conquistas.
- A navegação “Desafios” passou a se chamar “Prática aplicada”. A avaliação integradora também perdeu rótulos de batalha/chefes de fase e passou a usar linguagem acadêmica. O componente foi extraído para `PracticeCenter.tsx` e sua interface foi reescrita como exercícios de evocação, análise de evidências, relações conceituais e raciocínio procedimental.
- Foram removidos XP, troféus, territórios como metáfora de navegação, linguagem de missão e recompensas. A chave persistente `atlas-game-world-v1` e o tipo de registro Supabase `arcade_score` foram mantidos para preservar as conclusões existentes; valores antigos de XP são ignorados e não são exibidos.
- Componentes de navegação, barra superior, índice editorial e registro departamental foram extraídos para `src/components/atlas/AtlasShell.tsx` e `src/components/atlas/DepartmentPanels.tsx`.
- O tema RPG e os componentes de progressão antigos foram retirados do bundle de interface. A identidade e os estados visuais agora vivem em `src/app/atlas-academic.css`.
- Autenticação Supabase, recuperação de senha, sincronização de progresso de aulas, isolamento de armazenamento local, avaliações, biblioteca, laboratório, tutor e Campo & Engenharia foram preservados no código.

### Validação executada
- Transpilação sintática TS/TSX: 26 arquivos, zero erros de sintaxe.
- `npm run validate:all`: PASS — conteúdo, segurança e 97 destinos de recursos.
- A validação de conteúdo foi atualizada para verificar ausência de componentes e termos RPG na interface, preservação das quatro modalidades de prática e integridade dos departamentos.

### Limitações ainda abertas
- `npm run typecheck` e `npm run build` não foram confirmados porque as dependências do projeto não estão instaladas neste ambiente; a tentativa anterior de instalação não conseguiu concluir por indisponibilidade do registry.
- Não houve execução em navegador, testes responsivos reais, teste de login com duas contas, verificação RLS, execução de migrations ou deploy.
- A reconstrução atual é a primeira etapa do redesign: páginas internas de Biblioteca, Laboratório, avaliações, tutor, Campo & Engenharia e leitura de aula ainda precisam de uma revisão visual individual e teste funcional.

Nenhuma alteração foi enviada ao GitHub, Supabase ou Vercel.


## Redesign C — segunda etapa de reconstrução — 2026-11-25

### Implementado nesta etapa
- Reconstruída a experiência de leitura das aulas em duas colunas no desktop: conteúdo editorial e índice contextual com âncoras para objetivo, seções, estudo de caso, conceitos, verificação, reflexão e referências. Em telas menores, o índice passa a ocupar uma faixa compacta antes do conteúdo.
- Reorganizadas as superfícies internas da Academia, cursos, Biblioteca, Laboratório, avaliações e Campo & Engenharia para compartilhar a linguagem editorial do ATLAS, com hierarquia de metadados, divisórias, superfícies neutras e controles consistentes.
- Adicionada pesquisa global do currículo, com resultados de aulas, navegação direta para a aula correspondente, fechamento por Escape e atalho Ctrl/⌘ + K.
- Reforçado o contraste de textos pequenos e metadados nas superfícies claras; mantidos foco visível, estados desabilitados e adaptação para dispositivos menores.
- Corrigido um risco de mistura de progresso: o fluxo de login não envia mais o estado de aulas concluídas que estava em memória no modo visitante para a nova conta. A conta autenticada hidrata somente o namespace próprio e seus registros Supabase; dados antigos/visitante não são importados automaticamente.
- Atualizada a documentação e ampliados os validadores para cobrir pesquisa global, índice de leitura e ausência de migração automática de progresso visitante no login.

### Verificações executadas
- `npm run validate:all`: PASS — 22 verificações de conteúdo/estrutura, 14 verificações estáticas de segurança e 97 destinos/IDs de recursos.
- Transpilação sintática com TypeScript 5.8.3: 26 arquivos TS/TSX, zero diagnósticos de sintaxe.
- Chaves CSS balanceadas nos arquivos globais e acadêmicos.
- `npm run typecheck`: NÃO CONCLUÍDO — dependências ausentes (`next`, `react`, `lucide-react`, `@supabase/supabase-js` e `@types/node`). A tentativa de instalação excedeu o limite do ambiente. Os erros em cascata do TypeScript decorrem da ausência dos módulos e tipos; o typecheck semântico continua pendente.
- `npm run build`: NÃO EXECUTADO — Next.js não está instalado.

### Itens que dependem de ambiente externo e impedem declarar 100% de prontidão
1. Instalar dependências com acesso ao registry npm e gerar `package-lock.json` legítimo; executar `npm ci`, `npm run typecheck` e `npm run build`.
2. Executar testes em navegador desktop/mobile, navegação por teclado, leitores de tela e auditoria WCAG 2.2 AA automatizada/manual. O ajuste de contraste é uma melhoria, não uma certificação.
3. Testar autenticação real com conta A, conta B e visitante no mesmo navegador; validar persistência, logout/login e sincronização entre dispositivos.
4. Conferir no Supabase o histórico real de migrations, validar políticas RLS e executar `006_field_operations_records.sql` somente se estiver pendente e após confirmar a 005.
5. Configurar variáveis de ambiente, confirmar o comportamento de upload/bucket e avaliação assistida por IA, testar o tutor no modo local e, se desejado, integrar um provedor generativo com chave exclusivamente no servidor.
6. Fazer deploy e smoke tests na Vercel/GitHub somente com autorização e acesso apropriado.

Nenhuma migration foi executada, nenhuma credencial foi criada ou alterada e nenhum push/deploy foi realizado nesta etapa.


## Expansão acadêmica — Caderno de Pesquisa — 2026-11-25

### Implementado nesta etapa
- Adicionada a área “Caderno de pesquisa” à navegação principal e ao dashboard.
- Criado sistema de registros estruturados em cinco formatos: síntese, pergunta, hipótese, fonte e conexão interdisciplinar.
- Cada registro contém departamento, conteúdo, etiquetas, autoavaliação de confiança, histórico de revisões e próxima data sugerida.
- Criada revisão adaptativa com intervalos de 1, 3, 7, 14 e 30 dias conforme a confiança declarada. O indicador é metacognitivo e não substitui a avaliação objetiva de domínio.
- Incluídos busca, filtros por tipo e pendência, edição, arquivamento, métricas e exportação integral em Markdown.
- Persistência local usa `getAtlasStorageKey` e namespace por identidade; sincronização autenticada usa `student_learning_records` com o tipo `research_entry`.
- Criada migration incremental `007_research_notebook.sql`, que amplia a restrição de tipos de registro e mantém as políticas RLS já aplicadas à tabela. A migration não foi executada no Supabase remoto.

### Verificações executadas
- `npm run validate:all`: PASS após adicionar verificações específicas do Caderno de Pesquisa e da migration 007.
- Transpilação sintática TypeScript/TSX: 27 arquivos, zero diagnósticos.
- CSS: chaves balanceadas.
- `npm run typecheck` e `npm run build`: continuam pendentes porque `node_modules` não está instalado neste ambiente.
- Não foram realizados testes reais em navegador, autenticação multiusuário, RLS remoto, execução de migrations ou deploy.

### Próxima expansão recomendada
1. Painel de domínio por competência com evidências vinculadas às aulas e avaliações.
2. Planejador semanal editável com blocos de foco, metas e recuperação de sessões.
3. Mapa de conceitos e relações interdisciplinares usando registros do Caderno.
4. Revisão integrada entre flashcards, anotações e erros recorrentes, sem duplicar mecanismos já existentes.

Nenhuma migration foi executada e nenhuma publicação externa foi realizada.


## Sistema de Planejamento Semanal — 2026-11-25

### Implementado nesta etapa
- A área “Plano de estudos” deixou de ser apenas uma agenda estática e passou a usar o componente `AtlasStudyPlanner`.
- O planejamento inicial preserva as seis sessões sugeridas e permite adicionar sessões personalizadas por dia, área, tema, horário e duração.
- Sessões podem ser marcadas como concluídas, reabertas ou removidas; os indicadores semanais são derivados dos registros ativos.
- Sessões vinculadas ao currículo mantêm atalho para abrir a aula correspondente.
- Persistência local por identidade via `getAtlasStorageKey`; sincronização autenticada pelo tipo `study_plan` em `student_learning_records`.
- Criada migration incremental `008_study_planner.sql`; não foi executada no Supabase remoto.

### Verificações
- `npm run validate:all`: PASS com verificações adicionais do Caderno de Pesquisa e Planejador.
- Transpilação sintática TypeScript/TSX: 28 arquivos, zero diagnósticos.
- `npm run typecheck` e `npm run build`: não executados, pois `node_modules` está ausente.
- Testes reais de navegador, sincronização entre dispositivos, RLS remoto e migrations continuam pendentes.

## Expansion — Concept Studio — 2026-11-25

### Implementado nesta cópia de trabalho
- Nova área `Mapa de conceitos` integrada à navegação principal.
- Criação de mapas com título e pergunta orientadora.
- Inclusão de conceitos classificados como conceito, causa, evidência ou exemplo, com departamento e confiança declarada.
- Relações direcionais nomeadas, busca, indicadores de estrutura, remoção segura de nós/arestas, arquivamento e exportação Markdown.
- Persistência local isolada por identidade e sincronização em `student_learning_records` usando `concept_map`.
- Migration incremental 009 amplia a constraint de `record_type`; políticas RLS existentes não são modificadas.
- Documentação funcional em `ATLAS_CONCEPT_STUDIO.md`.

### Limites e validação
- Migration 009 foi criada no repositório, mas não aplicada ao Supabase.
- Typecheck semântico, build Next.js, testes reais de browser e teste de RLS permanecem pendentes até instalação de dependências e ambiente Supabase de teste.
- A representação do mapa usa cartões e relações textuais explícitas; editor de grafo livre/drag-and-drop fica para etapa posterior.
- Nenhuma publicação, alteração no banco remoto, commit ou push foi realizada.


## Expansion — Concept Studio — 2026-11-25

### Implementado nesta cópia de trabalho
- Nova área `Mapa de conceitos` integrada à navegação principal.
- Criação de mapas com título e pergunta orientadora.
- Inclusão de conceitos classificados como conceito, causa, evidência ou exemplo, com departamento e confiança declarada.
- Relações direcionais nomeadas, busca, indicadores de estrutura, remoção segura de nós/arestas, arquivamento e exportação Markdown.
- Persistência local isolada por identidade e sincronização em `student_learning_records` usando `concept_map`.
- Migration incremental 009 amplia a constraint de `record_type`; políticas RLS existentes não são modificadas.
- Documentação funcional em `ATLAS_CONCEPT_STUDIO.md`.

### Limites e validação
- Migration 009 foi criada no repositório, mas não aplicada ao Supabase.
- Typecheck semântico, build Next.js, testes reais de browser e teste de RLS permanecem pendentes até instalação de dependências e ambiente Supabase de teste.
- A representação do mapa usa cartões e relações textuais explícitas; editor de grafo livre/drag-and-drop fica para etapa posterior.
- Nenhuma publicação, alteração no banco remoto, commit ou push foi realizada.
