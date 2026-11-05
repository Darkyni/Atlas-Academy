# ATLAS Academy — Starter 0.1

Fundação independente de uma academia digital pessoal para aprendizagem, pesquisa e desenvolvimento intelectual.

## Requisitos
- Node.js 20.9 ou superior
- npm
- Projeto Supabase próprio para login e persistência
- Chave de API OpenAI para habilitar o tutor

## Executar localmente
1. Extraia o ZIP.
2. Abra a pasta no terminal.
3. Execute `npm install`.
4. Copie `.env.example` para `.env.local`.
5. Preencha as variáveis do Supabase. Para ativar o tutor, adicione também `OPENAI_API_KEY`.
6. Execute `npm run dev`.
7. Acesse `http://localhost:3000`.

A interface abre em modo demonstrativo sem Supabase. O tutor só responde quando a chave de API estiver configurada.

## Supabase
1. Crie um projeto Supabase novo para o ATLAS. Não reutilize automaticamente o banco de outro projeto.
2. Abra o SQL Editor.
3. Execute `supabase/schema.sql`.
4. Copie Project URL e a chave anon/public para `.env.local`.
5. Nunca exponha a chave `service_role` no navegador nem em variáveis `NEXT_PUBLIC_`.

## Inteligência artificial
A rota `src/app/api/tutor/route.ts` chama a API Responses no servidor. Configure `OPENAI_API_KEY` e, opcionalmente, `OPENAI_MODEL`. A chave não é enviada ao navegador.

## Publicação na Vercel
1. Crie um repositório Git novo para o ATLAS e envie o conteúdo desta pasta.
2. Importe o repositório na Vercel.
3. Cadastre na Vercel as mesmas variáveis configuradas em `.env.local`.
4. Faça o deploy.

## O que esta primeira versão entrega
- Dashboard responsivo com identidade própria.
- Navegação entre Visão geral, Academia, Biblioteca e Tutor IA.
- Catálogo inicial de seis áreas de conhecimento.
- Planejamento semanal interativo com progresso demonstrativo no navegador.
- Tela de acesso Supabase (login).
- Rota segura de servidor preparada para tutor com IA.
- Esquema SQL inicial com perfis, disciplinas, cursos, aulas, progresso, sessões e anotações.
- Políticas RLS para separar dados pessoais por usuário.

## Limites conhecidos do starter
O progresso da tela inicial ainda é demonstrativo e local; não é sincronizado com o banco. A tela de acesso inicial contempla login, mas o fluxo completo de cadastro, recuperação de senha e gestão de conta ainda precisa ser implementado. O currículo contém áreas e exemplos de trilhas, não um acervo completo de aulas. O tutor precisa de chave de API e ainda não possui histórico persistido nem busca em fontes externas.
