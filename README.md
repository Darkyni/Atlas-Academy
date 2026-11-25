# ATLAS Academy — Knowledge & Operations

Academia pessoal multidisciplinar para estudar, conectar ideias e aplicar conhecimento. O projeto utiliza Next.js 15, React 19, TypeScript e Supabase opcional para autenticação e sincronização dos registros do estudante.

> **Direção acadêmica autoral (25/11/2026):** interface híbrida editorial-tecnológica, densa e orientada ao estudo. A camada RPG foi retirada da navegação e da prática aplicada; atividades de evocação, análise de evidências, relações conceituais e raciocínio procedimental permanecem como exercícios acadêmicos com progresso persistente. A leitura das aulas agora inclui índice contextual e a pesquisa global permite localizar aulas pelo teclado (Ctrl/⌘ + K). Consulte `ATLAS_BUILD_STATUS.md` para o escopo e as validações.

## O que está incluído

### Currículo por disciplina e nível

O currículo ativo reúne **115 aulas estruturadas** em seis departamentos:

| Departamento | Aulas | Organização |
|---|---:|---|
| Direito e instituições | 20 | Fundamentos, intermediário e avançado |
| Economia e finanças | 19 | Fundamentos, intermediário e avançado |
| Tecnologia e IA | 19 | Fundamentos, intermediário e avançado |
| História e geopolítica | 19 | Fundamentos, intermediário e avançado |
| Filosofia e pensamento crítico | 19 | Fundamentos, intermediário e avançado |
| Ciências e matemática | 19 | Fundamentos, intermediário e avançado |

Cada aula inclui objetivo, explicação em seções, conceitos essenciais, estudo de caso, questão comentada, reflexão e referências. A classificação por nível aparece dentro de cada departamento.

### Biblioteca por disciplina

A Biblioteca possui **97 recursos**, agrupados por departamento e filtráveis por PDF, legislação, artigo, vídeo, livro e curso. Inclui seis cadernos PDF autorais do ATLAS, um por departamento, com explicações, casos, exercícios e gabarito comentado. Cada item identifica instituição/autoria, tipo, assunto, descrição e origem. O catálogo não redistribui obras protegidas. Alguns itens encaminham para páginas de catálogo ou playlists institucionais, e não para um PDF ou vídeo individual.

O estudante pode enviar PDFs próprios para um bucket privado do Supabase. Isso exige autenticação, o bucket `atlas-library` e a migration acadêmica já existente.

### Campo, autonomia e engenharia aplicada

A navegação **Campo & Engenharia** reúne três trilhas novas, com 24 módulos progressivos (oito por trilha):
- **ATLAS SURVIVAL:** preparação para 72 horas, água, alimentação, abrigo, higiene, primeiros socorros e resposta a apagões e eventos extremos.
- **ATLAS HOME LAB:** diagnóstico, hidráulica, segurança elétrica, construção/marcenaria e climatização.
- **ATLAS FIELD ENGINEERING:** pensamento de engenharia, eletrônica de baixa tensão, sensores, automação, energia solar e diagnóstico mecânico.

Inclui 24 módulos progressivos (oito por trilha), atividades práticas com checklist, checklist pessoal e seis formatos de simulação e aplicação: análise de ambiente, preparação para 72 horas, diagnóstico orientado, resposta a cenários de crise, exercícios de engenharia e transferência de conhecimento. Os conteúdos delimitam explicitamente quando é necessário procurar profissionais habilitados e não ensinam intervenções perigosas em rede elétrica, gás, sistemas pressurizados, refrigerantes ou baterias de alta energia. O Centro de Operações acrescenta dimensionador de água, checklist de prontidão, matriz de risco, diário de manutenção, exercício de análise sequencial de crise e calculadora educacional da Lei de Ohm. Os registros ficam no navegador e podem sincronizar por conta autenticada após a migration incremental 006; sem ela, o salvamento local continua disponível.

### Laboratório e prática aplicada

- **42 atividades educativas**, sete por disciplina, com casos, cálculos e verificações conceituais.
- Exercícios de prática também disponíveis dentro do Laboratório.
- **24 cenários de prática** para raciocínio aplicado.
- Revisão espaçada de flashcards, com intervalos ajustados pela autoavaliação.
- Testes dinâmicos por disciplina, feedback por questão e histórico recente de tentativas.
- Caderno de reflexão organizado por departamento.
- Favoritos da Biblioteca, revisões, anotações e pontuações podem sincronizar após login e migration 005.

### Tutor ATLAS gratuito

O Tutor utiliza recuperação de conteúdo do currículo e da Biblioteca, sem API paga, chave externa ou créditos. Ele busca aulas relacionadas à pergunta e apresenta explicações, conceitos, exemplos, questões e fontes. **Não é um LLM generativo** e não responde com conhecimento ilimitado nem pesquisa a internet em tempo real. Para temas atuais, jurídicos individualizados ou de alto impacto, confira as fontes primárias.

### Conta e segurança

- Cadastro e login por e-mail/senha via Supabase Auth.
- Fluxo de recuperação e redefinição de senha.
- Progresso de aulas sincronizado na tabela `student_lesson_progress`.
- Migrations incrementais `005_student_learning_records.sql` e `006_field_operations_records.sql` para registros acadêmicos, prática aplicada, favoritos e Centro de Operações. A 006 amplia a constraint de tipos de registro; deve ser revisada e executada somente se ainda estiver pendente.
- Políticas RLS limitam registros ao usuário autenticado.
- A avaliação por IA exige sessão Supabase válida, token Bearer, limites de entrada e validação da resposta; há uma limitação inicial de cinco solicitações por minuto por usuário e por instância do servidor. Em produção distribuída, configure também um limitador compartilhado (Redis/serviço equivalente) para impor o limite globalmente.
- Cabeçalhos HTTP de segurança reduzem exposição a framing, MIME sniffing e permissões desnecessárias.
- O progresso de aulas no armazenamento local é separado por ID de usuário para evitar misturar sessões de contas diferentes no mesmo navegador.

Sem variáveis do Supabase, o conteúdo acadêmico permanece acessível em modo de demonstração e os registros ficam no navegador. Cadastro, upload e sincronização entre dispositivos exigem Supabase configurado e migrations correspondentes executadas.

## Executar localmente

Requisitos: Node.js 22 ou compatível com Next.js 15 e npm.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Verificações

```bash
npm run validate:all
npm run typecheck
npm run build
```

O workflow `.github/workflows/ci.yml` executa validação de conteúdo, verificação de tipos e build em pushes e pull requests para `main`.

## Configuração do Supabase

1. Crie ou utilize o projeto Supabase do ATLAS.
2. Em Authentication → Providers, habilite Email.
3. Em Authentication → URL Configuration, configure o Site URL e Redirect URLs para o domínio local e o domínio Vercel.
4. Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas variáveis de ambiente locais e da Vercel.
5. Confirme que as migrations anteriores usadas pelo projeto já foram aplicadas. **Não execute novamente migrations antigas.**
6. Inspecione o schema e o histórico de migrations; depois execute somente as migrations incrementais ainda pendentes. A migration `006_field_operations_records.sql` amplia o tipo de registro permitido para o Centro de Operações. Inspecione o histórico antes de executá-la; não reexecute migrations antigas.

A migration 005 cria `student_learning_records`, com RLS e políticas por usuário; a 006 amplia os tipos de registro aceitos sem apagar registros nem remover políticas existentes. Não coloque `service_role` no navegador nem no repositório.

### Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha as variáveis necessárias:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_API_KEY` é opcional e usada somente pela avaliação de domínio assistida por modelo em `/api/mastery`. O Tutor ATLAS não depende dela.

## Atualizar o GitHub e a Vercel

- Para copiar tudo em lote no Windows, extraia o ZIP e dê dois cliques em `ATUALIZAR-ATLAS.bat`. Ele pede o caminho da pasta local clonada, verifica se é um repositório Git, avisa sobre alterações não commitadas, cria backup dos arquivos que serão substituídos e preserva `.git`, arquivos `.env*` locais (exceto `.env.example`), `node_modules`, `.next` e `.vercel`. O script não faz commit, push ou deploy.
- Alternativamente, copie o **conteúdo da raiz deste pacote** para a raiz do repositório clonado.
- Preserve a pasta `.git` local e o arquivo `.env.local`; não envie segredos ao GitHub.
- Inclua também os arquivos ocultos, especialmente `.github/workflows/ci.yml`.
- Faça commit e push para a branch de produção configurada na Vercel (normalmente `main`).
- No painel da Vercel, confirme o repositório conectado, Production Branch, Root Directory (`.`), último commit e resultado do build.
- Se o deploy mostrar uma versão antiga, confira o commit implantado e faça Redeploy do último commit após corrigir a configuração. Não considere o site atualizado até confirmar a nova implantação e testar a URL publicada.

Consulte `DEPLOYMENT_CHECKLIST.md`, `ATLAS_BUILD_STATUS.md` e `ATLAS_FIELD_SYSTEMS.md`.


## Atualização — Estúdio de Conceitos (25/11/2026)

A navegação agora inclui o **Mapa de conceitos**, um espaço para criar mapas de conhecimento, adicionar conceitos classificados (conceito, causa, evidência ou exemplo), explicitar relações direcionais entre ideias, acompanhar confiança declarada e exportar o resultado em Markdown. Os mapas são persistidos localmente em namespace por identidade e sincronizados com `student_learning_records` quando a migration `009_concept_maps.sql` estiver aplicada. Consulte `ATLAS_CONCEPT_STUDIO.md` e `ATLAS_BUILD_STATUS.md` para escopo, validação e limitações.
