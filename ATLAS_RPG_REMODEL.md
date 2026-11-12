# ATLAS Academy — RPG Learning World

## Objetivo desta remodelação

O ATLAS passa a apresentar a experiência acadêmica como uma jornada de RPG: territórios de conhecimento, personagem, níveis, experiência, missões, conquistas e provas de domínio. A gamificação deve orientar o estudante para a aprendizagem ativa, não premiar tempo de tela.

## O que mudou nesta edição

- Identidade visual integrada em azul-petróleo, verde-sálvia, grafite, marfim e dourado discreto.
- HUD de personagem visível em todas as áreas, com título, nível e experiência.
- XP calculado a partir de aulas concluídas. Uma aula só pode ser concluída após a verificação da resposta correta existente na aula.
- Mapa com seis territórios e progresso independente por departamento.
- Diário de missões ligado à conclusão de aulas, revisão espaçada e desafios/testes.
- Salão de conquistas com marcos de progressão.
- Avaliação integradora do curso apresentada como desafio final/chefe de fase, liberada após 70% das aulas concluídas.
- Avaliação de maestria destacando cinco competências: Explicar, Relacionar, Questionar, Aplicar e Transferir.
- Biblioteca, laboratório, tutor, cursos, aulas e desafios receberam uma linguagem visual comum.
- Layout responsivo e respeito a `prefers-reduced-motion`.

## Como a progressão funciona nesta edição

- 100 XP por aula concluída, após a verificação de aprendizagem.
- Bônus de 50 XP a cada três aulas concluídas.
- Novo nível a cada 600 XP.
- Títulos evoluem conforme o nível.
- O progresso por território é calculado com base nas aulas concluídas daquele departamento.
- Emblemas são liberados em 1, 5, 15 e 30 aulas concluídas.
- A prova final do curso permanece bloqueada até o estudante concluir pelo menos 70% das aulas daquele curso.

A experiência e o nível são derivados dos registros de conclusão já existentes. Esta edição não cria uma nova tabela SQL nem altera as migrations do Supabase.

## Preservação

Foram preservados os conteúdos de cursos, aulas, recursos, desafios, API do tutor, avaliações, registros de estudante, autenticação e migrations do Supabase. Não foram introduzidas chaves privadas ou serviços pagos.

## Verificações executadas

- Validação estática do conteúdo: aprovada para 42 missões, 97 recursos, 30 aulas avançadas e 24 cenários.
- Verificação de balanceamento de chaves CSS: aprovada nos dois arquivos CSS.
- Transpilação sintática TypeScript/TSX: 23 arquivos sem diagnósticos de sintaxe.

## Verificações pendentes

A instalação de dependências não terminou dentro do limite de execução deste ambiente. Por isso, `npm run typecheck`, `npm run build`, testes no navegador, autenticação real e sincronização Supabase ainda precisam ser verificados no Codespaces antes do deploy. Não publicar enquanto essas etapas não forem concluídas.

## Aplicação

1. Faça backup da branch atual.
2. Extraia este pacote sobre a raiz do repositório, preservando `.git`, `.env`, `.env.local` e `node_modules`.
3. Execute `npm install`.
4. Execute `npm run validate:content`, `npm run typecheck` e `npm run build`.
5. Revise o diff e teste login, progresso, aulas, biblioteca, laboratório, desafios e tutor.
6. Só então faça commit e push para a branch conectada ao Vercel.
