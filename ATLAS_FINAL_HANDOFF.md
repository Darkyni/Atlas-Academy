# ATLAS Academy — handoff de continuidade

**Data:** 2026-11-16  
**Pacote de origem:** `Atlas-Academy-extreme-upgrade-2026-11-16.zip`  
**Estado:** código-fonte reforçado localmente; não publicado.

## Mudanças desta rodada

1. Avaliação de domínio protegida por autenticação Supabase validada no servidor.
2. Limite inicial de cinco avaliações por minuto por usuário/instância, limite de entrada, validação estrita da resposta e timeout.
3. Cabeçalhos HTTP de segurança.
4. Progresso de aulas separado por conta/visitante no `localStorage`.
5. `.gitignore`, `.env.example`, CI e validadores agregados.
6. Documentação e status atualizados.
7. Corrigido o atualizador Windows que era referenciado pelo `.bat`, mas estava ausente; agora faz backup e preserva credenciais e diretórios locais.

## Comandos de verificação

```bash
npm install
npm run validate:all
npm run typecheck
npm run build
npm run start
```

## Portões obrigatórios antes de publicar

- Resolver qualquer erro real de typecheck e build em ambiente com dependências instaláveis.
- Testar login, cadastro, logout, recuperação de senha e troca entre contas no mesmo navegador.
- Testar avaliação por IA com sessão válida, sem sessão, sessão expirada, limite excedido, timeout e falha da API.
- Confirmar que `OPENAI_API_KEY` existe apenas no ambiente de servidor.
- Conferir RLS e aplicar somente migrations pendentes, após comparar o histórico do Supabase.
- Testar persistência em dois dispositivos e comportamento offline/local.
- Testar mobile, desktop, teclado, leitores de tela e `prefers-reduced-motion`.
- Só então atualizar GitHub e Vercel, verificar o commit implantado e executar smoke tests na URL de produção.

## Limitações conhecidas

- O rate limiter atual é em memória por instância; para aplicação distribuída, adotar Redis/serviço equivalente.
- Vários módulos continuam usando `localStorage` como modo offline; apenas as áreas explicitamente integradas às tabelas e migrations sincronizam em nuvem. Não afirmar sincronização global completa.
- A migration 006 não foi aplicada.
- Sem acesso ao projeto Supabase/Vercel e sem rede para instalar dependências neste ambiente, não é possível confirmar build, autenticação real, sincronização ou implantação.

## Segurança operacional

- Nenhum segredo incluído.
- Não inserir `service_role` em variáveis `NEXT_PUBLIC_*`.
- Não executar migrations antigas novamente.
- Não substituir produção antes de todos os portões acima passarem.
