# ATLAS Academy — Ciclo 6: Inteligência acadêmica

## Objetivo
Converter as evidências registradas pelo estudante em diagnóstico descritivo e próximas ações de aprendizagem, sem transformar dados escassos em conclusões definitivas.

## Implementação
- Novo painel `Inteligência acadêmica` integrado à navegação principal.
- Leitura do Portfólio de evidências (armazenamento local e registros Supabase existentes).
- Médias por competência e departamento, número de amostras e dimensões sem evidência.
- Priorização da competência com menor média observada.
- Exercício de intervenção sugerido para cada uma das cinco competências.
- Exportação de relatório Markdown.
- Aviso explícito quando há menos de três produções ativas.
- Zero migration nova: reutiliza `evidence_portfolio` e políticas existentes.

## Limites deliberados
O painel não usa IA generativa, não presume que ausência de registro seja falta de conhecimento, não trata zero como nota baixa e não declara domínio definitivo. A recomendação é heurística e deve ser validada com nova produção e reavaliação.

## Verificação necessária
Executar `npm run validate:all`, instalar dependências e rodar `npm run typecheck`/`npm run build`; testar login, troca de conta, sincronização real Supabase, RLS e interface em navegador desktop/mobile. Não houve deploy nem alteração remota.
