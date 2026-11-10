# ATLAS Academy — Build Status v0.9

## Objetivo
Corrigir os pontos relatados pelo estudante: jogos não visíveis/integrados ao laboratório, biblioteca misturada, laboratório simples, Tutor dependente de créditos de API, ausência de cadastro de estudante e identidade visual insatisfatória. Ampliar também aulas, materiais e dinâmicas.

## Implementado

### Jogos e desafios
- Catálogo ampliado de 18 para **30 missões únicas**, cinco por departamento.
- Incluídos desafios sobre LGPD, direito do consumidor, orçamento, diversificação, privacidade, testes de software, causalidade histórica, atores geopolíticos, reconstrução de argumentos, ética, porcentagem e desenho experimental.
- Corrigida a navegação Próxima missão para respeitar o filtro de disciplina; reiniciar pontuação também respeita o filtro ativo.
- Jogos acessíveis na navegação Desafios e incorporados como aba do Laboratório. Ao abrir no Laboratório, o filtro inicial acompanha a disciplina selecionada.

### Laboratório
- Reorganizado em três ferramentas: Revisão e casos, Testes dinâmicos e Jogos e simulações.
- Testes usam banco de cenários por disciplina, mostram feedback após cada resposta e apresentam resultado ao final.
- Revisão espaçada, cartões e caderno de reflexão mantidos.
- Adicionados 12 flashcards e 12 cenários formativos, dois de cada por disciplina.

### Biblioteca
- Agora renderiza seções separadas por disciplina, em vez de uma grade única com agrupamentos frágeis.
- Adicionados cartões de navegação rápida por matéria, contagem de recursos e filtros por tipo, busca e favoritos.
- Catálogo ampliado de 73 para **91 recursos** com novas fontes de livros abertos, vídeo, artigos, documentos e cursos.
- Upload de PDF ganhou seletor de disciplina. A categoria é persistida no campo `topic` existente como prefixo, sem exigir nova migration; ao carregar, o componente recupera a disciplina.
- Não foram adicionados PDFs protegidos nem links de download inventados. Recursos podem apontar para catálogos institucionais quando não há um arquivo específico aberto.

### Tutor ATLAS sem créditos
- `/api/tutor` substituído por um mecanismo local de orientação baseado em uma base de conhecimento incorporada ao projeto.
- Não chama OpenAI, Gemini ou outro provedor; não requer chave, créditos ou pagamento.
- Respostas incluem ideia central, exemplo, exercício, limites e caminho de aprofundamento.
- **Limite declarado na interface:** não é um modelo generativo de linguagem; responde bem aos tópicos incluídos na base e orienta perguntas abertas, mas não pode prometer conhecimento geral ilimitado ou pesquisa em tempo real.
- A avaliação de domínio em `/api/mastery` continua usando OpenAI opcionalmente; não é necessária para o Tutor.

### Cadastro e identidade visual
- Popover de estudante agora tem abas Entrar e Criar conta.
- Cadastro Supabase Auth com nome, e-mail e senha mínima de oito caracteres, com redirecionamento para o domínio atual e mensagem adequada quando confirmação por e-mail for exigida.
- Criada nova marca vetorial SVG em `public/atlas-mark.svg`, aplicada na barra lateral e como favicon.
- Nenhuma credencial ou segredo foi inserido no código.

### Currículo
- Acrescentadas 12 aulas avançadas (duas por departamento) e associadas aos cursos existentes.
- Tópicos: LGPD; direito do consumidor; PIB/produtividade; sistema financeiro/crédito/CET; APIs; bancos relacionais; Guerra Fria/descolonização; recursos estratégicos; legitimidade política; epistemologia social; probabilidade; método científico/desenho experimental.
- Total recalculado de **88 aulas** no currículo ativo: 40 aulas-base, 18 aulas de extensão e 30 aulas avançadas (incluindo as 12 novas). A contagem anterior de 91 aulas no relatório v0.8 não correspondia à montagem efetiva dos cursos; esta versão registra a contagem executável.
- Cada aula segue o modelo existente: objetivo, contexto, explicação, aplicação, termos, caso, questão comentada, reflexão e referências.

## Arquivos alterados
- `src/components/LearningArcade.tsx` — 30 jogos, filtro inicial por disciplina e navegação filtrada.
- `src/components/LearningLab.tsx` — abas integradas, teste dinâmico e jogos dentro do laboratório.
- `src/components/ResourceLibrary.tsx` — seções por disciplina, filtros, classificação de PDFs enviados.
- `src/app/api/tutor/route.ts` — tutor local sem API externa.
- `src/components/AtlasDashboard.tsx` — cadastro, novo logo, copy do tutor e associação das novas aulas.
- `src/lib/advanced-learning.ts` — 12 novas aulas.
- `src/lib/atlas-study-data.ts` — 12 flashcards e 12 cenários.
- `src/lib/resources.ts` — 18 recursos novos, total 91.
- `src/app/globals.css` — estilos da biblioteca, laboratório, cadastro e logo.
- `public/atlas-mark.svg`, `src/app/layout.tsx`, `.env.example`, `env.example`, `README.md`, `package.json`.

## Verificações realizadas
- Transpilação sintática TypeScript/TSX: 20 arquivos, zero diagnósticos de sintaxe.
- `npm run validate:content`: aprovado — 30 jogos, 91 recursos, 30 aulas avançadas, 24 cenários, CSS balanceado e tutor sem chamada externa.
- Teste isolado do endpoint local `/api/tutor`: três perguntas de assuntos diferentes retornaram respostas estruturadas com status 200 e modo `free-local`.
- Jogos: 30 IDs, 30 únicos, cinco por departamento.
- Aulas avançadas: 30 IDs na base, todos únicos; 12 novos IDs 17/18 conectados ao currículo.
- Recursos: 91 IDs, todos únicos.
- CSS: validar contagem de chaves após as alterações.
- ZIP será submetido a teste de integridade após compactação.

## Limitações e dependências externas
- `npm install --ignore-scripts --no-audit --no-fund` excedeu o limite de execução do ambiente. Não foi possível instalar Next.js, React, Lucide e Supabase. Por isso `npm run typecheck`, `npm run build`, testes de navegador e integração real não puderam ser executados. O `tsc` sem dependências acusa módulos ausentes e não constitui uma validação de build.
- Cadastro real depende de `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, e-mail/senha habilitado no Supabase e Site URL/Redirect URLs configurados. O código não pode criar a conta sem essa configuração do projeto.
- Upload de PDFs exige a migration/bucket acadêmico já existente no Supabase. A nova classificação usa o campo `topic` existente, sem migration adicional.
- Tutor local é gratuito e não consome créditos, mas não é um LLM generativo. Expansão da base de conhecimento continua necessária.
- Avaliação de domínio assistida por modelo continua opcional e usa `OPENAI_API_KEY`; isso não afeta o Tutor.
- Jogos, flashcards e anotações do laboratório permanecem no navegador; sincronização completa com Supabase é pendência.
- Os vídeos são encaminhados para páginas oficiais, playlists e cursos; nem todo item possui player incorporado.
- Nenhum deploy foi realizado ou confirmado.

## Próximas etapas antes de produção
1. Instalar dependências em ambiente com acesso ao registry npm e executar `npm run validate:content`, `npm run typecheck` e `npm run build`.
2. Testar signup/login com o Supabase real, incluindo confirmação de e-mail e URLs de retorno.
3. Testar os 30 jogos, os testes dinâmicos, a filtragem da biblioteca e upload de PDF em navegador desktop e celular.
4. Verificar os links de cada recurso e adicionar PDFs de acesso aberto específicos por disciplina quando a instituição disponibilizar arquivos diretos.
5. Sincronizar resultados, notas e flashcards no Supabase com RLS e políticas verificadas.
6. Expandir o Tutor local ou oferecer integração opcional com modelo executado localmente pelo estudante, mantendo uma experiência sem cobrança.
