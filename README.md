# ATLAS Academy — Academic v7

Academia digital pessoal para aprendizagem interdisciplinar. Esta versão amplia o primeiro curso com uma biblioteca multimídia curada, envio de PDFs privados e um laboratório de aprendizagem ativa.

## Requisitos
- Node.js 20.9 ou superior
- npm
- Projeto Supabase próprio para login e envio de arquivos
- Chave de API OpenAI para habilitar o tutor

## Executar localmente
1. Extraia o ZIP.
2. Abra a pasta `Atlas-Academy-main` no terminal.
3. Execute `npm install`.
4. Copie `.env.example` para `.env.local`.
5. Preencha as variáveis do Supabase. Para ativar o tutor, adicione também `OPENAI_API_KEY`.
6. Execute `npm run dev`.
7. Acesse `http://localhost:3000`.

A interface abre em modo demonstrativo sem Supabase. O envio de PDFs privados requer usuário autenticado, bucket e migração acadêmica configurados. O tutor só responde quando a chave de API estiver configurada.

## Supabase
1. Use o projeto Supabase criado para o ATLAS.
2. Abra o SQL Editor e execute `supabase/schema.sql` se ainda não tiver executado o schema inicial.
3. Depois execute uma única vez `supabase/migrations/002_learning_library.sql`.
4. Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel.
5. Nunca exponha a chave `service_role` no navegador nem em variáveis `NEXT_PUBLIC_`.

A migração cria tabelas para materiais, anotações, tentativas de atividades e favoritos, além do bucket privado `atlas-library`. O envio de PDFs usa caminhos iniciados pelo ID do usuário e políticas RLS; arquivos pessoais não ficam públicos. Limite de upload: 50 MB por PDF.

## Inteligência artificial
A rota `src/app/api/tutor/route.ts` chama a API Responses no servidor. Configure `OPENAI_API_KEY` e, opcionalmente, `OPENAI_MODEL`. A chave não é enviada ao navegador.

## Publicação na Vercel
1. Envie o conteúdo extraído desta pasta para o repositório GitHub, substituindo os arquivos correspondentes e mantendo a estrutura.
2. A Vercel deverá iniciar um novo deploy após o commit.
3. Confira as variáveis em **Settings → Environment Variables**.
4. Se executar a migração SQL depois do deploy, o envio de PDF passa a estar disponível sem precisar publicar novamente, desde que as variáveis do Supabase já estejam corretas.

## O que esta versão entrega
- Dashboard responsivo e navegação principal.
- Primeiro curso navegável: **Fundamentos do Direito**, com dez aulas estruturadas.
- Questões com feedback explicativo e marcação de conclusão.
- Biblioteca pesquisável com legislação oficial, artigos acadêmicos, páginas de repositórios, livros indicados e portais de vídeo.
- Envio de PDFs pessoais para bucket privado do Supabase, após executar a migração e entrar na conta.
- Laboratório de aprendizagem com oito flashcards e estudo de caso interativo.
- Progresso dos flashcards e conclusão de aulas armazenados localmente no navegador.
- Migração de banco para materiais, anotações, tentativas e favoritos.

## Limites conhecidos
- A curadoria editorial inicial está concentrada em Fundamentos do Direito; os outros departamentos ainda precisam de cursos e acervos próprios.
- Os materiais externos são links para as fontes originais. Livros comerciais são indicados por catálogo editorial, não redistribuídos em PDF.
- Os flashcards e progresso das aulas desta versão ficam no navegador; a migração prepara a persistência futura no Supabase, mas ainda não sincroniza essas atividades automaticamente.
- O envio de PDFs pessoais grava o arquivo e seus metadados no Supabase; o catálogo curado continua versionado no código nesta etapa.
- O login contempla entrada de usuários já cadastrados; cadastro, recuperação de senha e gestão completa de conta ainda precisam ser implementados.
- O tutor depende de `OPENAI_API_KEY`; o histórico ainda não é persistido e não há busca externa automática.
- O conteúdo é educacional e introdutório, não substitui aconselhamento jurídico nem a consulta às versões atualizadas das fontes oficiais.

## Organização principal
- `src/lib/curriculum.ts`: conteúdo estruturado das aulas.
- `src/lib/resources.ts`: curadoria de materiais e conjunto de flashcards.
- `src/components/AtlasDashboard.tsx`: navegação e painel principal.
- `src/components/ResourceLibrary.tsx`: busca, filtros e envio de PDFs pessoais.
- `src/components/LearningLab.tsx`: flashcards e estudo de caso.
- `src/app/globals.css`: identidade visual e estilos responsivos.
- `supabase/schema.sql`: estrutura inicial do banco.
- `supabase/migrations/002_learning_library.sql`: recursos da biblioteca e bucket privado.

## Expansão curricular — ATLAS Academy 0.3

A Academia agora reúne seis departamentos:

- Direito e instituições — curso Fundamentos do Direito (trilha original).
- Economia e Finanças — Fundamentos de Economia e Educação Financeira.
- Tecnologia e Inteligência Artificial — Fundamentos da Computação, IA e Segurança Digital.
- História e Geopolítica — História Mundial e Formação da Ordem Geopolítica.
- Filosofia e Pensamento Crítico — Fundamentos da Filosofia, Lógica e Ética.
- Ciências e Matemática — Matemática, Física e Método Científico.

Cada um dos cinco cursos adicionados nesta etapa possui quatro aulas estruturadas com explicações, conceitos essenciais, estudo de caso, questão comentada, reflexão e referências. O catálogo permite abrir cada departamento e acompanhar as aulas concluídas no estado local já utilizado pelo projeto. Esta etapa não exige nova migração do Supabase.

Próximas expansões pedagógicas: ampliar cada trilha em módulos, aprofundar avaliações, associar materiais multimídia por aula e integrar tentativas/progresso de forma persistente ao Supabase.


## ATLAS Academy v6 — expansão acadêmica e aprendizagem adaptativa

### O que mudou
- Os cinco departamentos interdisciplinares agora possuem 6 aulas cada; o curso introdutório de Direito permanece preservado.
- A Biblioteca reúne curadoria multidisciplinar de fontes oficiais, universidades, organizações internacionais e plataformas abertas, com filtros por departamento e tipo de material.
- É possível salvar materiais para consulta posterior no navegador.
- O Laboratório passou a reunir cartões de todas as áreas, revisão espaçada com quatro níveis de dificuldade, estudos de caso por departamento e caderno de reflexão.
- A agenda semanal abre a aula correspondente e o indicador semanal usa conclusões reais de aulas, em vez de marcações independentes.
- A conclusão de aulas pode ser sincronizada entre dispositivos quando a migração 003 estiver aplicada e o estudante estiver autenticado.
- O progresso e as anotações do Laboratório continuam com armazenamento local como alternativa quando a conta ou a conexão não estiver disponível.

### Atualização do Supabase — executar uma vez
1. Abra o painel do projeto Supabase.
2. Entre em **SQL Editor**.
3. Abra o arquivo `supabase/migrations/003_student_progress.sql` deste repositório.
4. Copie todo o conteúdo e execute uma única vez.
5. Não execute novamente `schema.sql` nem a migração `002_learning_library.sql`.

A migração cria apenas a tabela `student_lesson_progress`, com Row Level Security para que cada usuário leia e altere somente suas próprias conclusões de aula. Não é necessário compartilhar chaves secretas nem alterar as variáveis de ambiente existentes.

### Limites importantes
- Favoritos, cartões de revisão e caderno de reflexão ficam no navegador atual. A sincronização em nuvem desses recursos pode ser adicionada em uma etapa posterior.
- Os materiais externos permanecem hospedados nas instituições de origem. O ATLAS não redistribui livros protegidos por direitos autorais.
- A biblioteca é uma curadoria inicial: confirme a disponibilidade, idioma, licença e atualização de cada material na página de origem.


## ATLAS Academy v7 — aprofundamento curricular e prática ativa

### Ampliação dos cursos
- Direito e instituições: 10 aulas preservadas.
- Economia e Finanças: 9 aulas, com crédito, investimentos e indicadores macroeconômicos adicionados.
- Tecnologia e Inteligência Artificial: 9 aulas, com redes, algoritmos e cibersegurança adicionados.
- História e Geopolítica: 9 aulas, com revoluções, guerras mundiais, Guerra Fria e interdependência adicionadas.
- Filosofia e Pensamento Crítico: 9 aulas, com Platão e Aristóteles, epistemologia e filosofia política adicionadas.
- Ciências e Matemática: 9 aulas, com estatística, probabilidade e física adicionadas.
- Total: 55 aulas distribuídas em seis departamentos. Os cursos foram organizados em módulos progressivos de fundamentos, mecanismos e aplicação.

### Novos mecanismos funcionais
- Oficina de aprendizagem em cada aula: checklist de teoria, estudo de caso, recuperação ativa e reflexão; caderno individual e autoavaliação de domínio.
- Avaliação integradora por curso, liberada após concluir pelo menos 70% das aulas, com seleção de questões, correção comentada, nota e melhor resultado salvo no navegador.
- Laboratório ampliado com 53 cartões de estudo e 12 cenários práticos, com alternância de desafios por departamento.
- Materiais relacionados aparecem dentro das aulas quando há recursos associados à disciplina ou ao assunto.
- Painel geral calcula aulas concluídas e duração estimada das aulas concluídas em todos os departamentos.

### Materiais e fontes
A biblioteca foi ampliada com referências abertas e institucionais, incluindo OpenStax, Harvard CS50, ANPD, Stanford Encyclopedia of Philosophy, Internet Encyclopedia of Philosophy, PhET, IBGE, Our World in Data e ONU. Os links apontam para as fontes de origem; o ATLAS não redistribui obras protegidas. Verifique idioma, licença, edição e atualização na página original.

### Dados e compatibilidade
- Nenhuma nova migração SQL é necessária nesta versão.
- A sincronização das conclusões de aula continua dependendo da migração `003_student_progress.sql` já incluída na versão anterior e de autenticação Supabase.
- Notas da oficina, autoavaliações, melhor nota das avaliações, cartões e favoritos permanecem salvos no navegador atual. Ainda não são sincronizados entre dispositivos.
- O conteúdo curricular foi tipado e verificado; a instalação das dependências excedeu o tempo disponível nesta execução, portanto o build Next.js completo ainda precisa ser confirmado pelo deploy da Vercel.
