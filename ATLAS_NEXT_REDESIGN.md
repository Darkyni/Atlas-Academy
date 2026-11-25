# ATLAS Academy — Direção da reformulação integral

## Direção aprovada
- **Conceito:** híbrido autoral — biblioteca universitária contemporânea, caderno de pesquisa e plataforma editorial.
- **Densidade:** alta, com hierarquia tipográfica e espacial rigorosa. Mais informação útil por tela, sem sacrificar legibilidade.
- **Paleta:** azul-petróleo, marfim quente, grafite, verde-sálvia e dourado fosco.
- **Tipografia:** sans-serif para interface e leitura; serifada editorial para títulos e destaques.
- **Composição:** grid editorial, divisórias finas, superfícies planas, poucos níveis de elevação e movimento discreto.

## Arquitetura da experiência
1. Início: próxima sessão, retomar aula, revisões devidas e síntese de progresso.
2. Departamentos: cursos, módulos, níveis, duração, pré-requisitos e objetivos.
3. Aula: leitura focada, sumário, notas, referências, exemplos, exercícios e revisão.
4. Biblioteca: catálogo filtrável com metadados e acesso claramente identificado.
5. Laboratório: revisão espaçada, recuperação ativa, análise de fontes e simulações.
6. Progresso: competências demonstradas, lacunas, histórico, confiança versus desempenho e próximos passos.

## Mecânicas retiradas da interface principal
- HUD, personagem, níveis, XP e títulos.
- Troféus, territórios como metáfora de navegação, missões e linguagem de aventura.
- Pontuação ornamental sem relação com evidência de aprendizagem.

## Aprendizagem que deve permanecer
- Recuperação ativa e repetição espaçada.
- Avaliação nas cinco competências: explicar, relacionar, questionar, aplicar e transferir.
- Feedback com evidências, lacunas e recomendações de recuperação.
- Simulações e estudos de caso com objetivo pedagógico verificável.
- Histórico, autenticação e persistência por conta.

## Implementado em 25/11/2026
- Tokens visuais e camada `src/app/atlas-academic.css`.
- Shell e navegação modularizados em `src/components/atlas/AtlasShell.tsx`.
- Índice editorial e registro departamental em `src/components/atlas/DepartmentPanels.tsx`.
- Painel inicial reconstruído com próxima sessão, métricas, departamentos e ritmo semanal.
- Prática aplicada extraída para `src/components/PracticeCenter.tsx`; quatro formatos acadêmicos mantidos sem XP, troféus ou recompensas.
- Avaliação integradora renomeada e retirada da metáfora de batalha.
- Componentes de progressão RPG e mapa de territórios removidos do bundle.
- Chaves locais e registro Supabase da prática mantidos para preservar conclusões anteriores; campos antigos de XP são ignorados.

## Próximas etapas
1. Refatorar a página de leitura de aula para layout de estudo com sumário, navegação contextual e referências.
2. Redesenhar Biblioteca, Laboratório, avaliações, progresso, Tutor e Campo & Engenharia.
3. Consolidar componentes de formulários, tabelas, estados vazios, mensagens e acessibilidade.
4. Executar regressão funcional, responsividade, acessibilidade, typecheck e build em ambiente com dependências.
5. Validar autenticação e persistência com visitante e duas contas Supabase antes de qualquer deploy.

## Critérios de qualidade
- WCAG 2.2 AA como alvo mínimo.
- Texto corrido legível, foco visível, navegação por teclado e contraste adequado.
- Estados completos: hover, foco, pressionado, desabilitado, carregando, sucesso e erro.
- Testes em 360 px, 768 px, 1024 px e desktop amplo.
- Nenhuma funcionalidade removida sem equivalência funcional e regressão.

## Limites
A etapa atual não foi validada em navegador real. Typecheck e build dependem da instalação de Next.js, React, Lucide, Supabase e tipos Node, indisponíveis neste ambiente. Nenhuma migration, alteração remota ou implantação foi realizada.
