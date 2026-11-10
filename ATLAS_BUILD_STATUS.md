# ATLAS Academy — Build Status v1.0.0

Data do pacote: 10/11/2026.

## Diagnóstico importante do estado publicado

Na inspeção pública desta sessão:
- O repositório `Darkyni/Atlas-Academy` apresenta `package.json` versão `0.9.0` e README que descreve a biblioteca e os jogos v0.9.
- A URL pública Vercel associada ao repositório (`https://atlas-academy-psi.vercel.app`) ainda entrega uma página que informa **0 / 55 aulas**, com hero e textos da versão anterior.
- Portanto, o conteúdo atual do repositório e o deployment público não estão alinhados. Não é correto afirmar que a versão 0.9 já está publicada no site.

O pacote v1.0.0 deste trabalho é uma consolidação local e **não foi enviado ao GitHub nem implantado na Vercel**.

## Auditoria da base recebida

Base: `ATLAS-Academy-v0.9-Laboratorio-Biblioteca.zip`.

Stack identificada: Next.js 15, React 19, TypeScript, Supabase JS 2.50, componentes React em `src/components`, currículo em `src/lib` e API route do Tutor em `src/app/api/tutor/route.ts`.

Limitações encontradas na base:
- O Tutor local consultava uma lista pequena de palavras-chave, sem recuperar aulas completas.
- Cadastro e login existiam, mas não havia fluxo de recuperação/redefinição de senha.
- A Biblioteca tinha 91 itens e já estava agrupada por departamento no componente recebido; precisava ser validada no deployment real.
- O Laboratório já tinha revisão, cenários e jogos, mas notas, revisões e pontuação dependiam principalmente do localStorage.
- Havia uma migration 004 para avaliações de domínio, mas a base não continha sincronização genérica para todos os registros do Laboratório.
- Os cursos tinham aulas classificadas por listas de extensão e avançadas, mas a interface não permitia filtrar claramente os níveis.
- A documentação de versões anteriores informava contagem de aulas divergente da composição efetiva do currículo.

## Implementações realizadas nesta versão

### Currículo
- Criado `src/lib/capstone-lessons.ts` com 12 aulas avançadas novas, duas por departamento.
- Temas: diligência imobiliária e LGPD; política monetária e VPL; redes web e OSINT responsável; historiografia e ordem internacional; epistemologia e vieses; funções matemáticas e análise dimensional.
- Integradas às trilhas ativas por departamento.
- Interface do curso agora permite filtrar Fundamentos, Intermediário e Avançado.
- Contagem calculada a partir das fontes de currículo: **115 aulas únicas** — 20 em Direito e 19 em cada um dos outros cinco departamentos.

### Jogos e laboratório
- Jogos ampliados de 30 para **42 missões únicas**, sete por departamento.
- Os novos desafios abordam oferta ao consumidor, competências federativas, CET, diversificação, controle de acesso, SQL injection, descolonização, geoeconomia, causalidade, princípio da caridade, probabilidade condicional e energia elétrica.
- Mantida a integração dos jogos dentro do Laboratório.
- Pontuações dos jogos passam a ser persistidas localmente e podem sincronizar por conta Supabase.
- Revisões de flashcards e anotações do caderno podem sincronizar por conta.
- Resultados de testes dinâmicos são gravados localmente e na tabela de registros quando Supabase está configurado; histórico recente aparece no resultado.
- Favoritos da Biblioteca podem sincronizar por conta, com fallback local.

### Biblioteca
- Preservados os 91 recursos do catálogo v0.9 e acrescentados seis cadernos PDF autorais, um por departamento. Total: **97 recursos**.
- Distribuição verificada: Direito 19; Economia 16; Tecnologia 15; História 15; Filosofia 15; Ciências 17.
- PDFs em `public/materiais/`: método jurídico; finanças pessoais; computação, segurança e IA; historiografia e geopolítica; filosofia e pensamento crítico; ciências e matemática. Cada caderno tem exemplos, estudo de caso, exercícios, gabarito e referências.
- Favoritos passam a suportar sincronização por conta, além do armazenamento local.
- Mantidos os filtros por tipo, busca, agrupamento disciplinar e upload privado de PDF.

### Tutor
- O endpoint agora recupera conteúdo de aulas iniciais, intermediárias, avançadas e capstone, além de relacionar recursos da Biblioteca.
- A resposta apresenta objetivo, explicação, conceitos, estudo de caso, questão, reflexão e fontes quando há correspondência suficiente.
- Continua sem API paga, sem chave e sem créditos.
- Limite explícito: é um mecanismo local de recuperação e composição de conteúdo, não um LLM generativo nem uma busca web em tempo real.

### Conta e persistência
- Adicionado fluxo de recuperação por e-mail (`resetPasswordForEmail`), atualização de senha (`updateUser`) e saída da conta (`signOut`).
- Perfil lateral passa a exibir nome/e-mail quando há sessão autenticada.
- Adicionado helper `src/lib/student-records.ts` para operações autenticadas.
- Criada migration incremental `005_student_learning_records.sql`, com tabela por usuário, tipos de registro controlados, índice e políticas RLS idempotentes.
- A migration 005 não altera nem remove as tabelas anteriores. Deve ser aplicada manualmente somente depois de verificar que ainda não foi aplicada.
- O modo sem Supabase continua funcionando com armazenamento local, mas não sincroniza entre dispositivos.

### Qualidade e entrega
- Adicionado workflow `.github/workflows/ci.yml` para validação de conteúdo, typecheck e build em `main` e pull requests.
- Atualizado `README.md`, criado `DEPLOYMENT_CHECKLIST.md` e incrementada versão para `1.0.0`.
- O pacote é gerado com os arquivos diretamente na raiz do ZIP, pronto para copiar sobre a raiz do repositório.

## Arquivos novos/alterados relevantes

- `src/lib/capstone-lessons.ts` (novo)
- `public/materiais/*.pdf` (seis cadernos originais por disciplina)
- `src/lib/student-records.ts` (novo)
- `supabase/migrations/005_student_learning_records.sql` (novo)
- `.github/workflows/ci.yml` (novo)
- `src/components/AtlasDashboard.tsx`
- `src/components/LearningArcade.tsx`
- `src/components/LearningLab.tsx`
- `src/components/ResourceLibrary.tsx`
- `src/app/api/tutor/route.ts`
- `src/app/globals.css`
- `scripts/validate-content.mjs`
- `scripts/update-atlas.ps1`
- `ATUALIZAR-ATLAS.bat`
- `package.json`
- `README.md`

## Validações executadas neste ambiente

- `node scripts/validate-content.mjs`: aprovado.
- 22 arquivos TypeScript/TSX transpilados sem erros de sintaxe.
- Checagem estrutural de tipos com declarações temporárias para dependências externas ausentes: sem erros. Isso não substitui o `npm run typecheck` com as dependências reais.
- Rota do Tutor exercitada isoladamente com conteúdo real do currículo em seis perguntas, uma por departamento; respostas relevantes foram recuperadas.
- 42 IDs de jogos únicos; sete por disciplina.
- 97 IDs de recursos únicos; 15 a 19 por disciplina.
- Seis PDFs autorais validados com `pdfinfo` e extração de texto (`pdftotext`), três páginas A4 cada.
- 30 aulas avançadas anteriores únicas.
- 12 aulas capstone novas únicas, duas por disciplina.
- 115 IDs de aulas únicos na composição curricular.
- 24 cenários de prática únicos.
- Verificação estática de trilhas por nível, recuperação de senha, recuperação do Tutor, ausência de API paga, migration RLS e persistência.
- Chaves CSS balanceadas.
- Integridade do ZIP verificada após geração.

## O que não foi possível validar

- `npm install --ignore-scripts --no-audit --no-fund --prefer-offline` excedeu o limite de execução deste ambiente.
- Sem dependências instaladas, não foi possível executar `npm run typecheck`, `npm run build` ou testes reais no navegador.
- A integração Supabase não foi executada contra o projeto real; cadastro, reset, Storage, RLS e sincronização dependem das variáveis e da migration 005 no painel Supabase.
- Não foi possível executar o deploy ou alterar o projeto Vercel diretamente.
- O workflow de CI foi adicionado para executar essas verificações em GitHub Actions depois do push.

## Próximas ações obrigatórias

1. Copiar todos os arquivos do pacote para a raiz do repositório, preservando `.git` e `.env.local`.
2. Fazer commit e push para a branch de produção.
3. Conferir GitHub Actions e corrigir falhas de typecheck/build.
4. Conferir a configuração do projeto Vercel e o commit efetivamente implantado. O deployment observado ainda mostrava 55 aulas, portanto não considerar publicado antes de atualizar e verificar.
5. Inspecionar histórico do Supabase e aplicar migration 005 somente se ausente.
6. Testar cadastro, login, recuperação, upload, jogos, notas, favoritos, revisão e sincronização com duas contas/dispositivos.
7. Validar a curadoria de links em navegador e revisar fontes específicas que apontam para catálogos/portais em vez de documentos individuais.

## Critério de conclusão

Esta versão representa uma implementação local consolidada, não uma publicação verificada. O projeto só deve ser declarado concluído depois de `validate:content`, typecheck, build, testes funcionais, verificação de RLS e confirmação visual do deployment atualizado.
