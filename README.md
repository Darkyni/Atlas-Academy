# ATLAS Academy — Academic v2

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


## Identidade visual — atualização editorial

Esta atualização refina a interface com uma paleta de marfim, azul-petróleo, verde-sálvia e dourado fosco. O foco é oferecer contraste, hierarquia tipográfica, áreas de leitura confortáveis, feedback de interação e movimento discreto.

- Preserva as páginas, componentes, autenticação e integração Supabase existentes.
- Não exige nova migração SQL nem alterações no banco.
- Inclui estados de foco visíveis, interações hover/active e respeito a `prefers-reduced-motion`.
- A aparência pode depender do carregamento das fontes Google Fonts; há fontes de sistema como fallback.

Após substituir os arquivos no GitHub, aguarde a implantação automática na Vercel e confira o resultado em desktop e celular.
