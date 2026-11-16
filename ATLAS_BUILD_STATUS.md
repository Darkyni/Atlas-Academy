# ATLAS Academy — Build Status

## Current package

RPG Learning World remodel — 2026-11-12.

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
