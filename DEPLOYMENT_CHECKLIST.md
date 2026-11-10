# ATLAS — checklist de publicação

## Antes de copiar os arquivos

- [ ] Baixar o pacote v1.0.0 completo.
- [ ] Fazer backup da pasta atual do repositório.
- [ ] Extrair o ZIP para uma pasta temporária.
- [ ] Dar dois cliques em `ATUALIZAR-ATLAS.bat` e informar o caminho da pasta local clonada, ou executar `scripts/update-atlas.ps1` no PowerShell.
- [ ] Preservar `.git` e `.env.local` locais.
- [ ] Não enviar chaves privadas, tokens ou arquivos `.env.local` ao GitHub.
- [ ] Confirmar que `package.json` informa `1.0.0`.
- [ ] Confirmar que `src/lib/capstone-lessons.ts`, `src/lib/student-records.ts`, `supabase/migrations/005_student_learning_records.sql` e `.github/workflows/ci.yml` foram copiados.

## Antes do push

Execute localmente, se houver Node/npm disponíveis:

```bash
npm install
npm run validate:content
npm run typecheck
npm run build
```

- [ ] Corrigir qualquer erro antes do push.
- [ ] Fazer commit com mensagem `feat: ATLAS Academy v1.0.0`.
- [ ] Enviar para a branch de produção da Vercel.

## Supabase

- [ ] Confirmar Email Auth habilitado.
- [ ] Configurar Site URL e Redirect URLs, incluindo `/?recovery=1` no domínio publicado.
- [ ] Confirmar que migrations 002, 003 e 004 aplicadas anteriormente não serão executadas novamente.
- [ ] Conferir histórico de migrations.
- [ ] Aplicar apenas migration 005 se ainda não existir.
- [ ] Testar cadastro, confirmação de e-mail, login, recuperação e redefinição de senha.
- [ ] Testar políticas RLS com duas contas diferentes.

## Vercel

- [ ] Projeto conectado a `Darkyni/Atlas-Academy`.
- [ ] Production Branch correta (esperado `main`, confirmar no painel).
- [ ] Root Directory apontando para a raiz do repositório.
- [ ] Framework Next.js e comandos de build padrão.
- [ ] Variáveis públicas do Supabase configuradas no ambiente Production.
- [ ] Abrir Deployments e conferir que o deployment mais recente corresponde ao commit enviado.
- [ ] Se necessário, usar Redeploy no commit correto; não confiar apenas na mensagem de push.

## Teste de aceitação no site publicado

- [ ] Dashboard exibe 115 aulas no currículo total.
- [ ] Abrir cada um dos seis departamentos e alternar Fundamentos, Intermediário e Avançado.
- [ ] Biblioteca apresenta seções independentes para as seis disciplinas e filtros por tipo.
- [ ] Abrir alguns links e confirmar que levam à instituição e ao material descritos.
- [ ] Laboratório filtra flashcards e cenários pela disciplina.
- [ ] Teste dinâmico completa uma sessão e apresenta resultado.
- [ ] Desafios mostra 42 missões, sete por disciplina.
- [ ] Respostas de jogos apresentam explicação e ficam registradas.
- [ ] Tutor responde sem `OPENAI_API_KEY` e identifica que é recuperação de conteúdo, não LLM.
- [ ] Cadastro, login e recuperação de senha funcionam.
- [ ] Notas, favoritos, revisões e resultados sincronizam entre dois navegadores/dispositivos após login e migration 005.
- [ ] Verificar layout em celular e computador, navegação por teclado e `prefers-reduced-motion`.

**Regra de conclusão:** só considerar publicado depois de verificar o deployment e percorrer os fluxos acima. Arquivos no GitHub, README ou ZIP não comprovam que o deployment ativo foi atualizado.
