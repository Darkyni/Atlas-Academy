# ATLAS Academy — versão 0.4 · domínio e aprendizagem formativa

Plataforma pessoal de formação multidisciplinar em Next.js, React, TypeScript e Supabase. Esta versão parte da estrutura acadêmica v7 e acrescenta uma avaliação formativa explícita das cinco competências de aprendizagem: explicar, relacionar, questionar, aplicar e transferir.

## Requisitos
- Node.js 20.9 ou superior
- npm
- Projeto Supabase para autenticação e persistência em nuvem
- Chave `OPENAI_API_KEY` no servidor para avaliação formativa por IA e Tutor ATLAS

## Executar localmente
1. Extraia o projeto e abra a pasta `Atlas-Academy-main`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Para habilitar o Tutor e a avaliação por competências, configure `OPENAI_API_KEY` no ambiente do servidor. Opcionalmente, configure `OPENAI_MODEL`.
6. Execute `npm run dev` e acesse `http://localhost:3000`.

Sem Supabase, o conteúdo público continua acessível em modo demonstrativo. Rascunhos e avaliações concluídas ficam no armazenamento local. Sem `OPENAI_API_KEY`, o ATLAS não atribui nota automatizada: permite salvar o rascunho e informa que a avaliação por IA não está configurada.

## Conteúdo acadêmico atual
A estrutura curricular disponível contém seis trilhas introdutórias e 55 aulas:
- Direito e instituições — 10 aulas.
- Economia e Finanças — 9 aulas.
- Tecnologia e Inteligência Artificial — 9 aulas.
- História e Geopolítica — 9 aulas.
- Filosofia e Pensamento Crítico — 9 aulas.
- Ciências e Matemática — 9 aulas.

A biblioteca possui 44 registros curados distribuídos pelas seis áreas. Os links apontam para instituições, repositórios e fontes originais. A inclusão no catálogo não garante disponibilidade permanente, idioma específico ou licença de redistribuição; confira a página de origem. O ATLAS não redistribui obras protegidas por direitos autorais.

**Escopo honesto:** são trilhas introdutórias ampliadas, não cursos completos de nível superior nem cobertura exaustiva de todas as subáreas listadas no plano de longo prazo. A expansão curricular deve continuar em ciclos de revisão e aprofundamento.

## Avaliação por competências — novo na v0.4
Em cada aula, o painel “Você consegue usar o que aprendeu?” solicita cinco respostas discursivas:
1. Explicar — reconstruir o conceito com as próprias palavras.
2. Relacionar — conectar ideias e justificar a relação.
3. Questionar — identificar pressupostos, limites e evidências.
4. Aplicar — analisar o estudo de caso.
5. Transferir — adaptar o conhecimento a uma situação nova.

Com `OPENAI_API_KEY` configurada, a rota de servidor `/api/mastery` avalia cada dimensão de 0 a 3, apresenta evidências, lacunas e próximos passos. É uma avaliação formativa assistida por IA, não uma certificação nem um julgamento infalível. A confiança declarada pelo estudante é registrada separadamente e não altera a pontuação. Sem a chave, não há pontuação simulada.

As respostas e o resultado são guardados localmente. Quando o estudante está autenticado e a migração 004 foi aplicada, uma cópia da tentativa é registrada no Supabase sob RLS por usuário.

## Supabase — cuidado com migrations
Não execute novamente `supabase/schema.sql`, `002_learning_library.sql` ou `003_student_progress.sql` se já foram aplicadas no projeto.

Para habilitar o histórico em nuvem das avaliações por competência desta versão:
1. Abra o Supabase SQL Editor.
2. Confira se a tabela `mastery_assessments` já existe.
3. Se ainda não existir, execute uma única vez `supabase/migrations/004_mastery_assessments.sql`.
4. Confira se RLS está habilitado e se as políticas `mastery_assessments_select_own` e `mastery_assessments_insert_own` existem.

A migração 004 é incremental e não apaga dados anteriores. Não é necessária para usar a avaliação com armazenamento local.

## Variáveis de ambiente
- `NEXT_PUBLIC_SUPABASE_URL`: URL pública do projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave anon/public do Supabase.
- `OPENAI_API_KEY`: segredo exclusivamente do servidor; nunca use prefixo `NEXT_PUBLIC_`.
- `OPENAI_MODEL`: opcional; padrão `gpt-4.1-mini`.

Nunca exponha `service_role` no navegador ou no repositório.

## Publicação
1. Substitua os arquivos do repositório pelos arquivos desta pasta, mantendo os diretórios.
2. Faça commit e push no GitHub.
3. Aguarde a Vercel concluir um novo deploy.
4. Configure as variáveis de ambiente no projeto Vercel e faça redeploy quando alterar variáveis.
5. Execute a migration 004 apenas se desejar histórico de avaliações no Supabase e após confirmar que ainda não foi aplicada.

Gerar o ZIP não publica o site. O deploy só pode ser confirmado no painel da Vercel.

## Arquivos principais desta atualização
- `src/components/MasteryAssessment.tsx`: interface de resposta, resultado e histórico local.
- `src/app/api/mastery/route.ts`: avaliação estruturada no servidor, validação de entrada e resposta.
- `supabase/migrations/004_mastery_assessments.sql`: persistência opcional de avaliações com RLS.
- `src/components/AtlasDashboard.tsx`: integração do mecanismo à página de cada aula.
- `src/lib/resources.ts`: ampliação da curadoria de Filosofia e Pensamento Crítico.
- `src/app/globals.css`: refinamento visual, estados interativos e acessibilidade de movimento.

## Limitações conhecidas
- A avaliação por IA depende de `OPENAI_API_KEY`, disponibilidade da API e limites da conta. A IA pode errar; revise o feedback com o material e as referências.
- O histórico em nuvem de avaliações exige autenticação e migration 004. Sem isso, a persistência é local ao navegador.
- O cadastro e a recuperação de senha não foram ampliados nesta atualização.
- A avaliação integradora de curso continua sendo objetiva/múltipla escolha; o novo mecanismo discursivo por competências está associado a cada aula.
- A cobertura curricular continua introdutória. Novos cursos e módulos avançados exigem produção e revisão pedagógica próprias.
