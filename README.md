# ATLAS Academy — versão acadêmica inicial

Academia digital pessoal para aprendizagem interdisciplinar. Esta versão acrescenta o primeiro curso didático navegável ao projeto.

## Requisitos
- Node.js 20.9 ou superior
- npm
- Projeto Supabase próprio para login
- Chave de API OpenAI para habilitar o tutor

## Executar localmente
1. Extraia o ZIP.
2. Abra a pasta `Atlas-Academy-main` no terminal.
3. Execute `npm install`.
4. Copie `.env.example` para `.env.local`.
5. Preencha as variáveis do Supabase. Para ativar o tutor, adicione também `OPENAI_API_KEY`.
6. Execute `npm run dev`.
7. Acesse `http://localhost:3000`.

A interface abre em modo demonstrativo sem Supabase. O tutor só responde quando a chave de API estiver configurada.

## Supabase
1. Use um projeto Supabase próprio para o ATLAS.
2. Abra o SQL Editor e execute `supabase/schema.sql`.
3. Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Nunca exponha a chave `service_role` no navegador nem em variáveis `NEXT_PUBLIC_`.

## Inteligência artificial
A rota `src/app/api/tutor/route.ts` chama a API Responses no servidor. Configure `OPENAI_API_KEY` e, opcionalmente, `OPENAI_MODEL`. A chave não é enviada ao navegador.

## Publicação na Vercel
1. Envie o conteúdo extraído desta pasta para o repositório GitHub.
2. Na Vercel, importe o repositório.
3. Cadastre as variáveis do `.env.local` em **Settings → Environment Variables**.
4. Faça um novo deploy.

## O que esta versão entrega
- Dashboard responsivo e navegação principal.
- Primeiro curso navegável: **Fundamentos do Direito**.
- Dez aulas introdutórias com objetivos, explicações, exemplos, estudos de caso, conceitos essenciais, questões de múltipla escolha, reflexão e referências bibliográficas.
- Verificação de resposta com explicação.
- Biblioteca com referências utilizadas no curso.
- Marcação de conclusão de aula após resposta correta.
- Progresso das aulas do curso salvo no armazenamento local do navegador.
- Login Supabase e rota server-side preparada para tutor IA.

## Limites desta versão
- O conteúdo do curso está armazenado no projeto (arquivo `src/lib/curriculum.ts`), não é carregado dinamicamente do Supabase.
- O progresso das aulas de Fundamentos do Direito é salvo localmente no navegador. **Ainda não sincroniza entre dispositivos nem com `lesson_progress` no Supabase.**
- O progresso semanal da Visão geral continua demonstrativo.
- O login contempla entrada de usuários já cadastrados; cadastro, recuperação de senha e gestão completa de conta ainda precisam ser implementados.
- O tutor depende de `OPENAI_API_KEY`; o histórico ainda não é persistido e não há busca externa automática.
- Os outros cinco departamentos estão identificados, mas seus cursos ainda serão desenvolvidos.
- O conteúdo é educacional e introdutório, não substitui aconselhamento jurídico nem a consulta às versões atualizadas das fontes oficiais.

## Organização principal
- `src/lib/curriculum.ts`: conteúdo estruturado das aulas do primeiro curso.
- `src/components/AtlasDashboard.tsx`: navegação, curso, aula, questionário e progresso local.
- `src/app/globals.css`: identidade visual e estilos responsivos.
- `supabase/schema.sql`: estrutura inicial do banco e políticas de segurança.
