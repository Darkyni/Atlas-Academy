# ATLAS Field Systems

## Escopo implementado

A extensão adiciona uma área independente na navegação principal chamada **Campo & Engenharia**.

### ATLAS SURVIVAL
1. Preparação para as primeiras 72 horas
2. Água: reserva, consumo e segurança
3. Alimentação, abrigo e higiene
4. Primeiros socorros e resposta inicial
5. Colapso de serviços, apagão e crise climática

### ATLAS HOME LAB
1. Diagnóstico antes do reparo
2. Hidráulica: vazamentos e manutenção simples
3. Eletricidade residencial: reconhecer riscos
4. Construção, fixação e marcenaria segura
5. Climatização e manutenção preventiva

### ATLAS FIELD ENGINEERING
1. Pensamento de engenharia e prototipagem
2. Eletrônica básica e circuitos de baixa tensão
3. Sensores, microcontroladores e automação
4. Energia solar e armazenamento: dimensionamento conceitual
5. Mecânica, manutenção e diagnóstico

## Formatos de aprendizagem aplicada
- Simulação de ambiente e análise de cenários
- Preparação para 72 horas
- Diagnóstico orientado
- Resposta a cenários de crise
- Exercícios de engenharia
- Transferência de conhecimento
- Checklists de preparação e acompanhamento
- Marcação de módulos estudados
- Persistência local no navegador em `atlas-practical-academy-v1`

## Limites e pendências
- Os cenários são exercícios educativos, não protocolos operacionais de emergência.
- Os checklists e módulos concluídos ainda não sincronizam com o Supabase.
- A extensão não adiciona tutoria generativa dedicada nem uma biblioteca multimídia exclusiva; reutiliza a navegação e infraestrutura acadêmica existentes.
- Não foram adicionadas migrações SQL.
- Antes de publicar, executar instalação de dependências, typecheck, build e testes manuais em desktop e celular.


## Upgrade ATLAS Operations

A edição Operations amplia as três trilhas para oito módulos cada e inclui o Centro de Operações com quatro ferramentas: dimensionador de reserva de água, checklist de prontidão, matriz probabilidade × impacto, diário de manutenção e bancada de Lei de Ohm. Os formulários validam entradas, os registros têm limites de tamanho e são mantidos localmente; quando Supabase está configurado, há tentativa de sincronização em `student_learning_records` usando o tipo `field_ops`.

Para sincronização, revisar e executar somente a migration incremental `supabase/migrations/006_field_operations_records.sql` se ainda não aplicada. A migration amplia a constraint de `record_type` sem remover registros ou alterar políticas RLS existentes. Não executar automaticamente em produção.

A matriz de risco é uma triagem educativa e não um laudo. A bancada de Ohm é exclusivamente didática para circuitos isolados de baixa tensão. O diário de manutenção registra observações; não orienta desmontagem ou intervenção em instalações perigosas.
