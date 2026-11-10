import { flashcards as lawCards } from "@/lib/resources";

export type StudyFlashcard = { id: string; department: string; front: string; back: string };
export const studyCards: StudyFlashcard[] = [
  ...lawCards.map((card, index) => ({ id: `law-${index + 1}`, department: "Direito e instituições", ...card })),
  {id:"eco-card-1",department:"Economia e Finanças",front:"O que é custo de oportunidade?",back:"É o valor da melhor alternativa abandonada quando uma escolha é feita."},
  {id:"eco-card-2",department:"Economia e Finanças",front:"Qual a diferença entre inflação e aumento isolado de preço?",back:"Inflação é o aumento persistente e generalizado do nível de preços; a alta isolada de um produto não basta para caracterizá-la."},
  {id:"eco-card-3",department:"Economia e Finanças",front:"O que o CET informa?",back:"O Custo Efetivo Total expressa o custo global de uma operação de crédito, incluindo encargos previstos."},
  {id:"eco-card-4",department:"Economia e Finanças",front:"O que é liquidez?",back:"É a facilidade de converter um ativo em dinheiro, considerando prazo e possíveis perdas."},
  {id:"eco-card-5",department:"Economia e Finanças",front:"O que a diversificação pode reduzir?",back:"Pode reduzir riscos específicos e concentração, mas não elimina riscos de mercado nem garante retorno."},
  {id:"eco-card-6",department:"Economia e Finanças",front:"Juros reais consideram o quê?",back:"Consideram o rendimento nominal descontado o efeito da inflação sobre o poder de compra."},
  {id:"tec-card-1",department:"Tecnologia e Inteligência Artificial",front:"O que é um algoritmo?",back:"Uma sequência finita e organizada de instruções para resolver uma classe de problemas."},
  {id:"tec-card-2",department:"Tecnologia e Inteligência Artificial",front:"O que é sobreajuste em IA?",back:"Quando um modelo se adapta demais aos dados de treinamento e perde capacidade de generalizar para novos exemplos."},
  {id:"tec-card-3",department:"Tecnologia e Inteligência Artificial",front:"Por que uma resposta de IA não é prova de verdade?",back:"Modelos generativos produzem saídas plausíveis, mas podem errar, inventar fontes ou omitir incertezas; informações importantes exigem verificação."},
  {id:"tec-card-4",department:"Tecnologia e Inteligência Artificial",front:"O que é phishing?",back:"Uma tentativa de fraude que usa mensagens ou páginas enganosas para obter dados ou induzir ações."},
  {id:"tec-card-5",department:"Tecnologia e Inteligência Artificial",front:"O que significa privilégio mínimo?",back:"Conceder a cada usuário ou sistema apenas as permissões necessárias para executar suas tarefas."},
  {id:"tec-card-6",department:"Tecnologia e Inteligência Artificial",front:"Quais são os três objetivos clássicos da segurança da informação?",back:"Confidencialidade, integridade e disponibilidade."},
  {id:"hist-card-1",department:"História e Geopolítica",front:"Estado e governo são sinônimos?",back:"Não. O Estado é uma estrutura política e jurídica duradoura; o governo dirige temporariamente suas instituições."},
  {id:"hist-card-2",department:"História e Geopolítica",front:"O que é soberania?",back:"Autoridade política suprema no âmbito interno e independência jurídica externa, exercida sob limites e compromissos."},
  {id:"hist-card-3",department:"História e Geopolítica",front:"O que é sistema internacional?",back:"Conjunto de atores, regras e relações que estruturam a política mundial."},
  {id:"hist-card-4",department:"História e Geopolítica",front:"Globalização é apenas comércio?",back:"Não. Envolve fluxos econômicos, políticos, tecnológicos, culturais, informacionais e humanos."},
  {id:"hist-card-5",department:"História e Geopolítica",front:"O que é interdependência?",back:"Situação em que atores dependem uns dos outros, gerando ganhos potenciais e vulnerabilidades recíprocas."},
  {id:"hist-card-6",department:"História e Geopolítica",front:"Por que PIB não mede sozinho o poder de um Estado?",back:"Porque poder também envolve capacidades militares, tecnológicas, diplomáticas, institucionais, demográficas e culturais."},
  {id:"fil-card-1",department:"Filosofia e Pensamento Crítico",front:"Qual a diferença entre ética e moral?",back:"Moral refere-se a valores e práticas de avaliação; ética investiga filosoficamente seus fundamentos e justificativas."},
  {id:"fil-card-2",department:"Filosofia e Pensamento Crítico",front:"O que caracteriza o consequencialismo?",back:"Avalia ações principalmente pelos resultados ou consequências que produzem."},
  {id:"fil-card-3",department:"Filosofia e Pensamento Crítico",front:"O que enfatiza a deontologia?",back:"Deveres, regras e limites morais que não devem ser ultrapassados apenas por resultados desejáveis."},
  {id:"fil-card-4",department:"Filosofia e Pensamento Crítico",front:"O que é epistemologia?",back:"Área da filosofia que investiga natureza, fontes, justificação e limites do conhecimento."},
  {id:"fil-card-5",department:"Filosofia e Pensamento Crítico",front:"Correlação demonstra causalidade?",back:"Não. Uma associação pode decorrer de fatores de confusão, coincidência ou direção causal diferente."},
  {id:"fil-card-6",department:"Filosofia e Pensamento Crítico",front:"O que é uma falácia?",back:"Um padrão de raciocínio que parece sustentar uma conclusão, mas contém um erro argumentativo relevante."},
  {id:"cie-card-1",department:"Ciências e Matemática",front:"Qual a diferença entre média e mediana?",back:"A média soma valores e divide pela quantidade; a mediana é o valor central de um conjunto ordenado."},
  {id:"cie-card-2",department:"Ciências e Matemática",front:"O que é viés de seleção?",back:"Distorção causada quando o processo de escolha da amostra favorece determinados grupos ou resultados."},
  {id:"cie-card-3",department:"Ciências e Matemática",front:"O que é hipótese científica?",back:"Uma proposição provisória que pode ser examinada e enfraquecida ou apoiada por evidências."},
  {id:"cie-card-4",department:"Ciências e Matemática",front:"O que é variável dependente?",back:"O resultado ou medida observada em uma investigação."},
  {id:"cie-card-5",department:"Ciências e Matemática",front:"Por que replicar estudos?",back:"Para avaliar a robustez dos resultados e verificar se achados podem ser obtidos novamente sob condições adequadas."},
  {id:"cie-card-6",department:"Ciências e Matemática",front:"O que é correlação?",back:"Uma medida de associação entre variáveis, que não demonstra por si só uma relação causal."},
  {id:"eco-card-7",department:"Economia e Finanças",front:"Por que comparar o CET de um empréstimo?",back:"Porque o CET reúne juros e encargos da operação e permite comparar melhor o custo global do crédito."},
  {id:"eco-card-8",department:"Economia e Finanças",front:"Diversificação elimina todo risco?",back:"Não. Ela reduz riscos específicos e concentração, mas não elimina riscos sistêmicos nem garante retorno."},
  {id:"eco-card-9",department:"Economia e Finanças",front:"O que o PIB per capita não mostra?",back:"Não revela como a renda é distribuída nem cobre sozinho saúde, educação, segurança e qualidade ambiental."},
  {id:"tec-card-7",department:"Tecnologia e Inteligência Artificial",front:"O que o DNS faz?",back:"Associa nomes de domínio a registros usados para localizar serviços na rede."},
  {id:"tec-card-8",department:"Tecnologia e Inteligência Artificial",front:"Por que HTTPS não garante que um site é legítimo?",back:"Ele protege a conexão com o domínio acessado, mas não prova que o domínio pertence à instituição esperada."},
  {id:"tec-card-9",department:"Tecnologia e Inteligência Artificial",front:"O que significa defesa em profundidade?",back:"Combinar camadas de controles, como MFA, atualização, menor privilégio, backups e monitoramento."},
  {id:"hist-card-7",department:"História e Geopolítica",front:"Qual a diferença entre causa estrutural e estopim?",back:"A causa estrutural cria condições de longo prazo; o estopim é o evento imediato que acelera uma crise."},
  {id:"hist-card-8",department:"História e Geopolítica",front:"O que é dissuasão?",back:"Estratégia de impedir uma ação ao tornar seus custos esperados muito altos, como na lógica nuclear da Guerra Fria."},
  {id:"hist-card-9",department:"História e Geopolítica",front:"Independência formal garante autonomia econômica?",back:"Não. Capacidades produtivas, financeiras, tecnológicas e institucionais também condicionam a autonomia."},
  {id:"fil-card-7",department:"Filosofia e Pensamento Crítico",front:"O que é a eudaimonia em Aristóteles?",back:"Uma vida humana realizada ou florescimento, alcançada por atividade racional conforme a virtude."},
  {id:"fil-card-8",department:"Filosofia e Pensamento Crítico",front:"O que é dúvida metódica?",back:"Um procedimento sistemático de questionamento usado para examinar os fundamentos das crenças."},
  {id:"fil-card-9",department:"Filosofia e Pensamento Crítico",front:"O que significa universalizar uma máxima em Kant?",back:"Perguntar se a regra subjetiva da ação poderia ser aceita como princípio geral sem contradição."},
  {id:"cie-card-7",department:"Ciências e Matemática",front:"Por que correlação não prova causalidade?",back:"Porque uma terceira variável, causalidade reversa ou coincidência pode explicar a associação observada."},
  {id:"cie-card-8",department:"Ciências e Matemática",front:"O que é taxa-base?",back:"A frequência ou probabilidade prévia de um evento na população antes de observar nova evidência."},
  {id:"cie-card-9",department:"Ciências e Matemática",front:"Um corpo em movimento circular com rapidez constante tem aceleração?",back:"Sim. A direção da velocidade muda continuamente, produzindo aceleração centrípeta."},
  {id:"law-card-10",department:"Direito e instituições",front:"Posse e propriedade são a mesma coisa?",back:"Não. Posse é uma situação de exercício de poderes de fato sobre o bem; propriedade é um direito real juridicamente reconhecido."},
  {id:"law-card-11",department:"Direito e instituições",front:"Qual a função da matrícula imobiliária?",back:"Individualizar o imóvel e concentrar os atos registrais relevantes, permitindo examinar titularidade, ônus e averbações."},
  {id:"eco-card-10",department:"Economia e Finanças",front:"Qual é a função da CVM?",back:"Regular e fiscalizar o mercado de valores mobiliários, protegendo seu funcionamento e os investidores dentro de suas competências."},
  {id:"eco-card-11",department:"Economia e Finanças",front:"O que é marcação a mercado?",back:"É a atualização do preço de um ativo conforme as condições atuais de negociação; pode gerar oscilação antes do vencimento."},
  {id:"tec-card-10",department:"Tecnologia e Inteligência Artificial",front:"O que o HTTPS protege?",back:"A comunicação entre cliente e servidor por criptografia, integridade e autenticação do servidor; não garante que o site seja confiável."},
  {id:"tec-card-11",department:"Tecnologia e Inteligência Artificial",front:"Quais são os três pilares clássicos da segurança da informação?",back:"Confidencialidade, integridade e disponibilidade."},
  {id:"hist-card-10",department:"História e Geopolítica",front:"Por que a Revolução Industrial foi um processo histórico amplo?",back:"Porque combinou mudanças tecnológicas, econômicas, institucionais, demográficas e sociais ao longo do tempo."},
  {id:"hist-card-11",department:"História e Geopolítica",front:"O que é vulnerabilidade estratégica em uma cadeia de suprimentos?",back:"Dependência de poucos fornecedores, rotas ou tecnologias que pode interromper o acesso a insumos essenciais."},
  {id:"fil-card-10",department:"Filosofia e Pensamento Crítico",front:"O que é validade em um argumento dedutivo?",back:"A conclusão decorre necessariamente das premissas; se as premissas forem verdadeiras, a conclusão não pode ser falsa."},
  {id:"fil-card-11",department:"Filosofia e Pensamento Crítico",front:"Crença verdadeira é suficiente para conhecimento?",back:"Não necessariamente. A epistemologia investiga também justificação, confiabilidade e o papel da sorte epistêmica."},
  {id:"cie-card-10",department:"Ciências e Matemática",front:"Quando a mediana é útil?",back:"Em distribuições assimétricas ou com valores extremos, pois é menos sensível a esses valores do que a média."},
  {id:"cie-card-11",department:"Ciências e Matemática",front:"Correlação prova causalidade?",back:"Não. Fatores de confusão, causalidade reversa ou coincidência podem explicar a associação observada."},
  {id:"law-card-12",department:"Direito e instituições",front:"Qual a importância de guardar protocolos em uma reclamação de consumo?",back:"Eles documentam a tentativa de solução, a cronologia e a comunicação com o fornecedor."},
  {id:"eco-card-12",department:"Economia e Finanças",front:"PIB maior significa que todas as famílias ficaram mais ricas?",back:"Não. O PIB é agregado e não mostra, sozinho, distribuição de renda ou bem-estar de cada família."},
  {id:"tec-card-12",department:"Tecnologia e Inteligência Artificial",front:"Para que servem condicionais em programação?",back:"Para escolher caminhos de execução com base em uma condição lógica."},
  {id:"hist-card-12",department:"História e Geopolítica",front:"A abolição legal eliminou automaticamente desigualdades?",back:"Não. A abolição não foi acompanhada de políticas suficientes para desfazer estruturas sociais e econômicas acumuladas."},
  {id:"fil-card-12",department:"Filosofia e Pensamento Crítico",front:"Eleições são suficientes para caracterizar democracia constitucional?",back:"Não. Também são necessários pluralismo, direitos, Estado de Direito, liberdade e mecanismos de controle do poder."},
  {id:"cie-card-12",department:"Ciências e Matemática",front:"Um objeto com velocidade constante precisa de força resultante?",back:"Não. Em movimento retilíneo uniforme, a aceleração e a força resultante são nulas no modelo newtoniano."},
];

export type PracticeScenario = {
  id: string; department: string; title: string; prompt: string;
  options: { label: string; correct: boolean; feedback: string }[];
  takeaway: string;
};
export const practiceScenarios: PracticeScenario[] = [
  {id:"case-law",department:"Direito e instituições",title:"Conflito contratual",prompt:"Uma pessoa afirma que pagou por um serviço, mas a outra parte nega ter recebido. Existem mensagens e comprovante bancário. Qual deve ser o primeiro passo de uma análise responsável?",options:[
    {label:"Identificar fatos, documentos, cronologia e autenticidade das provas.",correct:true,feedback:"Correto. Primeiro reconstrua os fatos e avalie as evidências antes de selecionar normas e formular conclusões."},
    {label:"Decidir com base apenas na opinião pessoal.",correct:false,feedback:"Opinião pode gerar hipótese, mas não substitui fatos, provas, normas e fundamentação."},
    {label:"Permitir que a parte mais forte imponha a solução.",correct:false,feedback:"A força privada não substitui os mecanismos institucionais de resolução de conflitos."}
  ],takeaway:"Separe fatos, provas, normas aplicáveis, interpretação e conclusão. O exemplo é educacional, não orientação jurídica para caso concreto."},
  {id:"case-econ",department:"Economia e Finanças",title:"Escolha financeira",prompt:"Você tem uma dívida com juros elevados, uma reserva pequena e a possibilidade de comprar um equipamento para trabalhar. Qual é a melhor análise inicial?",options:[
    {label:"Comparar juros da dívida, reserva necessária, retorno possível e custo de oportunidade.",correct:true,feedback:"Isso. A decisão depende do custo da dívida, risco, urgência e alternativas; não existe resposta universal."},
    {label:"Comprar o equipamento porque todo investimento sempre dá retorno.",correct:false,feedback:"O retorno é incerto. É preciso avaliar demanda, custos, prazo e riscos."},
    {label:"Ignorar a taxa da dívida e olhar apenas o valor da parcela.",correct:false,feedback:"A parcela não revela sozinha o custo total. Prazo, CET e capacidade de pagamento importam."}
  ],takeaway:"Decisões financeiras devem ser comparadas por custo total, risco, liquidez, prazo e alternativas abandonadas."},
  {id:"case-tech",department:"Tecnologia e Inteligência Artificial",title:"Alerta de segurança",prompt:"Você recebe uma mensagem urgente do banco com um link para confirmar uma compra. O endereço parece semelhante ao oficial. O que fazer?",options:[
    {label:"Não usar o link; acessar o aplicativo ou endereço oficial por conta própria e verificar o alerta.",correct:true,feedback:"Correto. Evite o canal recebido e confirme por um caminho independente e confiável."},
    {label:"Clicar rapidamente porque a mensagem usa o logotipo do banco.",correct:false,feedback:"Logotipos podem ser copiados. Aparência visual não autentica o remetente."},
    {label:"Enviar o código de autenticação para o atendente.",correct:false,feedback:"Códigos de autenticação são secretos e não devem ser compartilhados."}
  ],takeaway:"Urgência, links parecidos e pedidos de códigos são sinais de alerta. Use senhas únicas e autenticação multifator."},
  {id:"case-history",department:"História e Geopolítica",title:"Dependência estratégica",prompt:"Um país depende de um único fornecedor estrangeiro para um componente essencial. Uma crise interrompe o abastecimento. Qual dimensão deve ser investigada?",options:[
    {label:"Concentração, estoques, fornecedores alternativos, capacidade interna e custo de substituição.",correct:true,feedback:"Boa análise. Isso permite avaliar a vulnerabilidade e as opções reais de resposta."},
    {label:"Apenas a personalidade do chefe de governo.",correct:false,feedback:"Lideranças importam, mas a vulnerabilidade também depende de estrutura produtiva, logística e relações externas."},
    {label:"Somente o tamanho territorial do país.",correct:false,feedback:"Território isolado não mede dependência tecnológica nem capacidade de substituição."}
  ],takeaway:"Geopolítica exige análise multidimensional: geografia, recursos, tecnologia, instituições, logística e poder de barganha."},
  {id:"case-phil",department:"Filosofia e Pensamento Crítico",title:"Decisão ética com dados",prompt:"Uma empresa quer monitorar dados privados para reduzir fraudes. Qual análise é filosoficamente mais cuidadosa?",options:[
    {label:"Avaliar eficácia, proporcionalidade, privacidade, riscos de abuso e alternativas menos invasivas.",correct:true,feedback:"Correto. O dilema envolve consequências, direitos, deveres e distribuição dos riscos."},
    {label:"Aceitar a medida porque qualquer redução de fraude justifica tudo.",correct:false,feedback:"Resultados desejáveis não eliminam limites de direitos, proporcionalidade e legitimidade."},
    {label:"Rejeitar a medida apenas porque tecnologia é sempre ruim.",correct:false,feedback:"A conclusão precisa de razões e comparação de alternativas, não de generalização."}
  ],takeaway:"Explicite valores em tensão, pessoas afetadas, evidências, consequências e critérios de justificação."},
  {id:"case-science",department:"Ciências e Matemática",title:"Pesquisa e amostragem",prompt:"Uma enquete aberta em uma rede social recebe 20 mil respostas e aponta apoio de 80% a uma proposta. O que é preciso verificar?",options:[
    {label:"Como os participantes foram selecionados e se a amostra representa a população-alvo.",correct:true,feedback:"Exato. Muitas respostas não corrigem automaticamente o viés de seleção."},
    {label:"Apenas aumentar a quantidade de casas decimais.",correct:false,feedback:"Precisão numérica não resolve problemas de representatividade."},
    {label:"Concluir que a proposta tem apoio de 80% de toda a população.",correct:false,feedback:"A amostra voluntária pode diferir sistematicamente da população."}
  ],takeaway:"Avalie população, método de seleção, pergunta, período, fonte e incerteza antes de generalizar."},
  {id:"case-law-contract",department:"Direito e instituições",title:"Contrato e prova",prompt:"Uma pessoa afirma que pagou por um serviço, mas a outra parte nega. Há comprovante e mensagens. Qual sequência de análise é mais responsável?",options:[
    {label:"Organizar cronologia, verificar documentos e autenticidade, identificar obrigações e só então avaliar normas aplicáveis.",correct:true,feedback:"Correto. A análise começa pela reconstrução dos fatos e pela qualidade das evidências, não por uma conclusão antecipada."},
    {label:"Escolher a versão de quem parece mais convincente.",correct:false,feedback:"A impressão pessoal não substitui prova, regras aplicáveis e fundamentação."},
    {label:"Concluir que o comprovante resolve qualquer questão, sem examinar o contrato.",correct:false,feedback:"O comprovante é relevante, mas contexto, finalidade, partes e obrigações também precisam ser examinados."}
  ],takeaway:"Raciocínio jurídico responsável separa fatos, provas, normas, interpretação e conclusão."},
  {id:"case-econ-budget",department:"Economia e Finanças",title:"Orçamento com renda variável",prompt:"Uma pessoa recebe comissões variáveis e tem despesas fixas mensais. Como deve estruturar o orçamento?",options:[
    {label:"Usar uma base conservadora de renda, provisionar despesas irregulares e criar reserva para meses fracos.",correct:true,feedback:"Isso reduz o risco de comprometer renda futura com base em meses excepcionalmente bons."},
    {label:"Planejar sempre pelo maior mês de comissão.",correct:false,feedback:"O melhor mês pode não se repetir e criar compromissos difíceis de sustentar."},
    {label:"Ignorar datas de vencimento e observar apenas o total anual.",correct:false,feedback:"Fluxo de caixa depende de quando o dinheiro entra e sai, não apenas do total agregado."}
  ],takeaway:"Orçamento realista considera variabilidade, datas, provisões e margem de segurança."},
  {id:"case-tech-network",department:"Tecnologia e Inteligência Artificial",title:"Site inacessível",prompt:"Um site não abre em um computador, mas funciona no celular. Qual é o diagnóstico inicial mais útil?",options:[
    {label:"Verificar conexão, DNS, horário/certificado, navegador e rede, isolando uma variável por vez.",correct:true,feedback:"Boa abordagem. Testes controlados ajudam a localizar se o problema está no dispositivo, rede, DNS ou serviço."},
    {label:"Desativar o antivírus e ignorar avisos do navegador.",correct:false,feedback:"Desativar proteções pode aumentar o risco e não identifica a causa."},
    {label:"Formatar o computador imediatamente.",correct:false,feedback:"É uma medida desproporcional antes de investigar causas simples e reversíveis."}
  ],takeaway:"Diagnóstico técnico começa por hipóteses verificáveis e isolamento de variáveis."},
  {id:"case-history-source",department:"História e Geopolítica",title:"Fonte histórica em disputa",prompt:"Um discurso oficial afirma que toda a população apoiava uma decisão política. O que um historiador deveria fazer?",options:[
    {label:"Confrontar o discurso com fontes de origens diferentes e investigar autoria, finalidade e grupos ausentes.",correct:true,feedback:"Correto. Crítica e triangulação de fontes ajudam a reconhecer perspectiva, silêncio e limites do registro."},
    {label:"Aceitar o discurso porque foi produzido pelo governo.",correct:false,feedback:"Uma fonte oficial é relevante, mas não representa automaticamente toda a sociedade."},
    {label:"Descartar o documento sem examiná-lo.",correct:false,feedback:"A crítica não significa rejeição automática; significa compreender o que a fonte pode sustentar."}
  ],takeaway:"Fontes históricas devem ser contextualizadas e confrontadas, não aceitas nem descartadas automaticamente."},
  {id:"case-phil-evidence",department:"Filosofia e Pensamento Crítico",title:"Opinião e evidência",prompt:"Em uma discussão, alguém afirma que uma política funciona porque conhece uma pessoa que se beneficiou dela. Qual resposta é mais rigorosa?",options:[
    {label:"Reconhecer o relato como exemplo, mas pedir evidências mais amplas e examinar explicações alternativas.",correct:true,feedback:"Isso. Um caso pode ilustrar ou gerar hipótese, mas não demonstra sozinho efeito geral ou causalidade."},
    {label:"Aceitar a conclusão porque a pessoa é conhecida.",correct:false,feedback:"Proximidade pessoal não garante representatividade nem causalidade."},
    {label:"Rejeitar o relato como necessariamente falso.",correct:false,feedback:"O relato pode ser verdadeiro, mas seu alcance probatório é limitado."}
  ],takeaway:"A força de uma conclusão deve ser proporcional à qualidade e ao alcance das evidências."},
  {id:"case-science-graph",department:"Ciências e Matemática",title:"Gráfico e interpretação",prompt:"Um gráfico mostra um aumento visual muito grande, mas o eixo vertical começa em 95 em vez de zero. O que fazer?",options:[
    {label:"Verificar escala, unidade, período e valores absolutos antes de avaliar a magnitude da mudança.",correct:true,feedback:"Correto. A escala pode ampliar visualmente diferenças pequenas; a leitura exige contexto e valores."},
    {label:"Concluir que a mudança é enorme porque a barra parece alta.",correct:false,feedback:"A aparência visual sem escala pode distorcer a interpretação."},
    {label:"Ignorar todos os gráficos que não começam em zero.",correct:false,feedback:"Escalas truncadas podem ser úteis em alguns contextos, desde que sejam explícitas e interpretadas corretamente."}
  ],takeaway:"Leia eixos, unidades, escalas e fontes antes de inferir magnitude ou tendência."},
];

studyCards.push(
  {id:"law-card-14",department:"Direito e instituições",front:"O que a boa-fé objetiva exige em uma relação contratual?",back:"Padrões de lealdade, informação, cooperação e proteção da confiança, conforme o contexto e o regime jurídico."},
  {id:"law-card-15",department:"Direito e instituições",front:"Quais elementos são investigados na responsabilidade civil?",back:"Conduta ou fato juridicamente relevante, dano, nexo causal e, quando exigida, culpa; também se examinam excludentes."},
  {id:"eco-card-13",department:"Economia e Finanças",front:"Como calcular a taxa real exata?",back:"(1 + taxa nominal) ÷ (1 + inflação) − 1. A subtração simples é apenas uma aproximação."},
  {id:"eco-card-14",department:"Economia e Finanças",front:"Diversificação elimina todo risco?",back:"Não. Pode reduzir riscos específicos e concentração, mas não elimina risco sistêmico nem garante retorno."},
  {id:"tech-card-13",department:"Tecnologia e Inteligência Artificial",front:"Quais são os elementos básicos de um algoritmo?",back:"Entradas, sequência finita de instruções, decisões/repetições quando necessárias e saídas verificáveis."},
  {id:"tech-card-14",department:"Tecnologia e Inteligência Artificial",front:"Por que uma saída de IA precisa ser verificada?",back:"Modelos podem errar, alucinar, refletir vieses e não compreender adequadamente o contexto ou a atualidade dos fatos."},
  {id:"history-card-13",department:"História e Geopolítica",front:"Por que a colonização deve ser estudada por múltiplas perspectivas?",back:"Porque envolveu povos indígenas, agentes coloniais, africanos escravizados, resistências, negociações e estruturas econômicas diversas."},
  {id:"history-card-14",department:"História e Geopolítica",front:"A Guerra Fria foi apenas uma disputa entre EUA e URSS?",back:"Não. A rivalidade das superpotências interagiu com conflitos locais, descolonização e projetos próprios de outros países."},
  {id:"philo-card-13",department:"Filosofia e Pensamento Crítico",front:"Qual a diferença entre consequencialismo, deontologia e virtudes?",back:"Consequencialismo enfatiza resultados; deontologia, deveres e princípios; ética das virtudes, caráter e hábitos."},
  {id:"philo-card-14",department:"Filosofia e Pensamento Crítico",front:"O que é um espantalho argumentativo?",back:"Distorcer a posição adversária para torná-la mais fácil de atacar, em vez de responder à tese real."},
  {id:"science-card-13",department:"Ciências e Matemática",front:"Uma amostra grande é necessariamente representativa?",back:"Não. Viés de seleção, cobertura incompleta e não resposta podem distorcer resultados mesmo em amostras grandes."},
  {id:"science-card-14",department:"Ciências e Matemática",front:"Como calcular consumo elétrico aproximado?",back:"Potência em quilowatts multiplicada pelo tempo em horas resulta em consumo em kWh."}
);
