# ATLAS Academy

Academia pessoal multidisciplinar para estudar, conectar ideias e aplicar conhecimento.

## Experiência v0.8 — Atlas Cognitivo
- Página inicial com Cartografia do Saber, núcleo geométrico 3D em CSS, profundidade visual e cartões com interação em perspectiva.
- Seis departamentos com trilhas de aulas, materiais e referências organizados por área.
- Currículo ampliado para **91 aulas**: seis novas aulas avançadas, uma por departamento, com teoria, conceitos, aplicação, estudo de caso, exercício comentado, reflexão e fontes.
- Biblioteca organizada por disciplina, com filtros por tipo de material e curadoria de 73 recursos.
- Área de jogos ampliada de 6 para **18 missões**, com casos, cálculos, sequências de raciocínio e verificações conceituais, além de pistas e feedback explicativo.
- Laboratório com revisão espaçada, flashcards, cenários e anotações.
- Respeito à preferência de movimento reduzido e foco visível nos controles.

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
npm run typecheck
npm run build
```

Configure variáveis de ambiente conforme `.env.example`. Nunca exponha chaves privadas no navegador ou no repositório.

## Curadoria audiovisual
Os materiais de vídeo abrem em páginas oficiais, cursos e playlists de instituições como USP, Senado Federal, MEC, UNIVESP, Arquivo Nacional, Canal Futura, Harvard CS50 e CVM. Em alguns casos, o ATLAS direciona a um catálogo ou playlist para o estudante selecionar a aula pertinente, não a um vídeo único incorporado.

## Persistência e limites
A pontuação dos jogos é salva no armazenamento local do navegador. A sincronização em nuvem desses resultados ainda não está implementada. Nenhuma dependência nova ou migration Supabase foi adicionada nesta versão.

Consulte `ATLAS_BUILD_STATUS.md` para o relatório técnico, validações e pendências conhecidas.
