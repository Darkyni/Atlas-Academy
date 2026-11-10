# ATLAS Academy

Academia pessoal multidisciplinar para estudar, conectar ideias e aplicar conhecimento.

## Experiência v0.9 — Laboratório e Biblioteca por Disciplina
- **30 jogos e missões** na área Desafios e também dentro do Laboratório, com filtro por disciplina, pistas, feedback, cálculos, estudos de caso e ordenação de etapas.
- Laboratório reorganizado em três espaços: revisão espaçada e casos, testes dinâmicos por matéria e jogos/simulações.
- **Biblioteca com 91 recursos catalogados**, agora agrupados em seções próprias por cada uma das seis disciplinas, com filtro por tipo (PDF, legislação, artigo, vídeo, livro e curso), busca, favoritos e envio de PDF classificado por matéria.
- **Tutor ATLAS gratuito e sem API externa**: usa uma base didática local incorporada ao projeto, sem chave, créditos ou cobrança. Ele oferece explicações guiadas para conceitos presentes na base; não é um LLM generativo e não substitui pesquisa ou fontes primárias para questões específicas.
- Cadastro de estudante com alternância Entrar/Criar conta via Supabase Auth, nome, e-mail e senha com mínimo de oito caracteres. A confirmação por e-mail depende das configurações de autenticação do projeto Supabase.
- Nova marca vetorial ATLAS em SVG, usada na barra lateral e como ícone do navegador.
- **88 aulas no currículo ativo**, com mais 12 aulas avançadas (duas por disciplina) sobre LGPD, direito do consumidor, PIB e produtividade, crédito e CET, APIs, bancos relacionais, Guerra Fria, recursos estratégicos, legitimidade política, epistemologia social, probabilidade e desenho experimental.
- 12 flashcards novos e 12 novos cenários para prática e avaliação formativa.

## Departamentos
1. Direito e Instituições
2. Economia e Finanças
3. Tecnologia e Inteligência Artificial
4. História e Geopolítica
5. Filosofia e Pensamento Crítico
6. Ciências e Matemática

## Executar localmente

```bash
npm install
npm run dev
```

## Verificar

```bash
npm run validate:content
npm run typecheck
npm run build
```

## Configuração Supabase

Defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no ambiente local e na Vercel. No painel Supabase, habilite cadastro por e-mail/senha e configure o Site URL e os Redirect URLs do domínio local e publicado. Se a confirmação por e-mail estiver ativa, o estudante precisa confirmar o endereço antes do primeiro login.

O cadastro, login, armazenamento privado de PDFs e sincronização de progresso dependem do Supabase estar configurado. Sem essas variáveis, o projeto permanece em modo de demonstração e não cria contas reais.

## Tutor gratuito e avaliação de domínio

O endpoint `/api/tutor` não chama OpenAI nem outro provedor pago. Ele consulta uma base de conhecimento local e gera uma orientação estruturada sem consumir créditos externos. A resposta é limitada aos tópicos cobertos pela base; perguntas muito específicas devem ser aprofundadas na Biblioteca.

`OPENAI_API_KEY` permanece opcional somente para a avaliação de domínio assistida por modelo em `/api/mastery`. Essa avaliação não é necessária para usar o Tutor ATLAS.

## Biblioteca e curadoria audiovisual

Materiais são agrupados por disciplina e identificados por tipo. A curadoria usa páginas institucionais e acadêmicas, incluindo Planalto, Senado, STJ, Banco Central, CVM, IBGE, IPEA, USP, Harvard CS50, MDN, OWASP, Biblioteca Nacional, FGV CPDOC, Stanford Encyclopedia of Philosophy, OpenStax, PhET e Canal Futura. Links abrem no portal de origem; quando um catálogo ou playlist é indicado, o estudante escolhe a aula ou edição adequada. Livros protegidos são referenciados, não redistribuídos ilegalmente.

PDFs enviados pelo estudante são classificados pela disciplina escolhida e armazenados em bucket privado do Supabase, conforme as políticas RLS e Storage da migração acadêmica existente.

## Persistência e limites

A pontuação dos jogos, revisões e anotações do laboratório continuam no armazenamento local do navegador. A sincronização integral desses dados com Supabase ainda não foi implementada. O Tutor gratuito é uma base didática local e não possui capacidade generativa aberta. Nenhuma migration foi alterada nesta versão.

Consulte `ATLAS_BUILD_STATUS.md` para validações e pendências conhecidas.
