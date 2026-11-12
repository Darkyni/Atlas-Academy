# ATLAS Academy — RPG Edition 1.1.0

## O que mudou

- HUD de personagem em todas as áreas do dashboard.
- Nível, patente, XP acumulado e barra para o próximo nível.
- Mapa com seis territórios do conhecimento na visão geral.
- Cartões por departamento com progresso real e atalho para abrir a trilha.
- Identidade visual transversal em azul-petróleo, grafite, marfim e dourado.
- Ajustes responsivos para telas menores e respeito à preferência por movimento reduzido.

## Como a progressão funciona nesta versão

- 80 XP por aula concluída.
- Bônus de 120 XP a cada cinco aulas concluídas.
- Um nível a cada 600 XP.
- XP é calculado a partir do progresso de aulas já existente. Não é uma segunda fonte de dados e não exige migration Supabase.
- XP não mede domínio acadêmico: a avaliação de domínio existente continua separada.

## Aplicação no Codespaces

1. Faça backup da branch atual antes de substituir arquivos.
2. Envie este ZIP para o Codespaces (arraste o arquivo para o explorador de arquivos ou use o upload do editor).
3. No terminal, confirme o nome do ZIP com `ls -lh`.
4. Extraia o pacote em uma pasta temporária e confira o conteúdo antes de copiar para a raiz do repositório.
5. Preserve `.git`, `.env`, `.env.local` e quaisquer variáveis secretas.
6. Revise `git status --short`, faça commit e push somente depois de conferir o diff.
7. Aguarde o GitHub Actions e o deployment Vercel; confirme o commit publicado antes de considerar o site atualizado.

## Verificações

Execute:

```bash
npm install
npm run validate:content
npm run typecheck
npm run build
```

A instalação de dependências não concluiu no ambiente em que este pacote foi preparado. Por isso, typecheck e build completos ainda precisam ser executados no Codespaces/CI.
