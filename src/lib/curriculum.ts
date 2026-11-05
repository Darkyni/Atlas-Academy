export type Lesson = {
  id: string;
  title: string;
  duration: number;
  objective: string;
  sections: { heading: string; paragraphs: string[]; points?: string[] }[];
  keyTerms: { term: string; definition: string }[];
  caseStudy: string;
  question: { prompt: string; options: string[]; correct: number; explanation: string };
  reflection: string;
  references: string[];
};

export const lawCourse = {
  title: "Fundamentos do Direito",
  subtitle: "Compreenda o que é o Direito, por que as sociedades criam normas e como as instituições jurídicas organizam a vida coletiva.",
  level: "Iniciante",
  workload: "10 aulas · aproximadamente 6 horas",
  description: "Uma introdução progressiva ao pensamento jurídico. O curso parte de conceitos básicos e avança para Estado, Constituição, poderes, direitos fundamentais e primeiros contatos com os ramos do Direito.",
};

export const lawLessons: Lesson[] = [
{
 id:"direito-01", title:"O que é o Direito?", duration:35,
 objective:"Explicar o Direito como sistema de normas e instituição social, reconhecendo suas funções, limites e relações com a vida coletiva.",
 sections:[
  {heading:"1. Por que existe o Direito?", paragraphs:[
   "Pessoas vivem em grupos e dependem umas das outras. Essa convivência produz cooperação, mas também conflitos: disputas por bens, descumprimento de acordos, danos, diferenças de interesse e divergências sobre o que é justo. Toda sociedade desenvolve formas de orientar comportamentos e resolver conflitos.",
   "O Direito é uma dessas formas. Em sentido amplo, pode ser compreendido como um sistema institucionalizado de normas, princípios, procedimentos e instituições que organiza a convivência social, atribui direitos e deveres e oferece mecanismos para solucionar conflitos.",
   "O Direito não elimina os conflitos nem garante, por si só, uma sociedade justa. Ele cria critérios públicos para decidir como determinadas situações devem ser tratadas e estabelece procedimentos para que decisões não dependam apenas da força ou da vontade particular."
  ]},
  {heading:"2. Direito objetivo e direito subjetivo", paragraphs:[
   "Direito objetivo é o conjunto de normas jurídicas vigentes em uma comunidade política. Quando uma lei estabelece que determinada conduta é proibida ou que um contrato deve respeitar certos requisitos, estamos observando o Direito como conjunto de regras.",
   "Direito subjetivo é uma posição ou faculdade reconhecida a alguém pelo ordenamento jurídico. O direito de exigir o cumprimento de um contrato, por exemplo, é uma possibilidade atribuída a uma pessoa em razão das normas jurídicas.",
   "Os dois sentidos se relacionam: normas do Direito objetivo podem reconhecer posições jurídicas individuais, mas nem toda regra se resume a conceder uma vantagem particular. Há normas que organizam órgãos públicos, definem competências ou estabelecem procedimentos."
  ],points:["Direito objetivo: sistema de normas jurídicas.","Direito subjetivo: posição ou faculdade juridicamente protegida."]},
  {heading:"3. Funções e limites", paragraphs:[
   "Entre as funções do Direito estão organizar instituições, proteger bens e interesses, estabelecer responsabilidades, oferecer procedimentos de resolução de conflitos e criar previsibilidade. A previsibilidade importa porque permite que pessoas e organizações planejem suas ações conhecendo, dentro de limites, as consequências jurídicas possíveis.",
   "Também existem limites. Uma norma pode ser válida e ainda ser criticada por seus efeitos injustos. A existência de uma lei não encerra o debate moral, político ou constitucional sobre ela. Em um Estado constitucional, a produção e a aplicação das normas estão submetidas a competências, procedimentos e direitos fundamentais.",
   "Por isso, estudar Direito exige separar perguntas diferentes: a norma foi criada pela autoridade competente? Está em vigor? É compatível com normas superiores? Como deve ser interpretada? Quais efeitos produz na realidade?"
  ]},
  {heading:"4. Como pensar juridicamente", paragraphs:[
   "O raciocínio jurídico começa pela identificação dos fatos relevantes, passa pela seleção das normas aplicáveis e exige justificar a interpretação que conecta a regra ao caso. Não basta citar um artigo: é necessário explicar por que ele se aplica, quais condições precisam ser verificadas e se existem exceções ou normas concorrentes.",
   "Uma boa análise distingue fato, regra, interpretação e conclusão. Essa disciplina reduz afirmações precipitadas e torna os argumentos verificáveis."
  ]}
 ],
 keyTerms:[
  {term:"Norma jurídica",definition:"Regra ou princípio reconhecido pelo ordenamento jurídico, com efeitos institucionais e possibilidade de aplicação por autoridades competentes."},
  {term:"Ordenamento jurídico",definition:"Conjunto organizado de normas e princípios de uma comunidade política."},
  {term:"Direito objetivo",definition:"Direito entendido como sistema de normas."},
  {term:"Direito subjetivo",definition:"Faculdade ou posição jurídica atribuída e protegida pelo ordenamento."}
 ],
 caseStudy:"Imagine que duas pessoas assinam um contrato de compra e venda e uma delas deixa de cumprir a obrigação. A discordância não deve ser resolvida simplesmente pela força. O Direito oferece regras sobre contratos, provas, responsabilidades e procedimentos para que a parte prejudicada busque uma solução institucional. A análise concreta dependerá do contrato, dos fatos, das provas e das normas aplicáveis.",
 question:{prompt:"Qual alternativa melhor descreve o Direito objetivo?",options:["A vontade pessoal de quem tem mais poder.","O conjunto organizado de normas jurídicas de uma sociedade.","Qualquer regra moral seguida por uma pessoa.","A decisão isolada de um juiz, sem relação com outras normas."],correct:1,explanation:"Direito objetivo é o sistema de normas jurídicas. A decisão judicial deve dialogar com esse sistema, e regras morais não se tornam automaticamente normas jurídicas."},
 reflection:"Pense em uma situação cotidiana em que uma regra jurídica torna a convivência mais previsível. Que conflito poderia surgir se não existisse um procedimento público para resolvê-la?",
 references:["BRASIL. Constituição da República Federativa do Brasil de 1988.","REALE, Miguel. Lições Preliminares de Direito. Saraiva.","NADER, Paulo. Introdução ao Estudo do Direito. Forense."]
},
{
 id:"direito-02",title:"Direito, moral e justiça",duration:35,objective:"Distinguir normas jurídicas, normas morais e juízos de justiça sem tratar esses conceitos como sinônimos.",
 sections:[
 {heading:"1. Três perguntas diferentes",paragraphs:[
  "A moral reúne valores, convicções e critérios pelos quais pessoas e comunidades avaliam condutas como corretas ou incorretas. A justiça é uma ideia normativa usada para avaliar a distribuição de direitos, deveres, benefícios, encargos e o tratamento dado às pessoas. O Direito, por sua vez, é um sistema institucional de normas e procedimentos.",
  "Esses campos se relacionam, mas não coincidem. Uma atitude pode ser moralmente reprovável sem constituir ilícito jurídico. Também pode haver uma norma juridicamente válida cuja justiça seja objeto de crítica pública e filosófica."
 ]},
 {heading:"2. Diferenças importantes",paragraphs:[
  "Normas morais costumam orientar a consciência e a avaliação social. Sua sanção pode ser remorso, reprovação ou perda de confiança. Normas jurídicas são reconhecidas pelo ordenamento e podem ser aplicadas por instituições, com consequências previstas em procedimentos.",
  "A distinção não significa que o Direito seja indiferente à moral. Valores como dignidade, igualdade e liberdade influenciam constituições, leis e interpretações. O ponto é evitar a conclusão simplista de que tudo que é imoral é ilegal ou de que tudo que é legal é necessariamente justo."
 ],points:["Legalidade pergunta se algo está de acordo com o Direito vigente.","Legitimidade pergunta se o poder ou a decisão pode ser justificado.","Justiça avalia a correção do tratamento ou da distribuição."]},
 {heading:"3. Justiça como problema filosófico",paragraphs:[
  "Há diferentes teorias da justiça. Algumas enfatizam liberdade individual e proteção de direitos; outras destacam igualdade, necessidades, mérito, oportunidades ou condições materiais. Essas perspectivas podem entrar em tensão.",
  "Uma política pública, por exemplo, pode ser avaliada pela igualdade formal de tratamento, pelos resultados que produz ou pela atenção que dedica a grupos em situações diferentes. Uma análise séria explicita o critério utilizado em vez de apresentar uma preferência como se fosse uma conclusão inevitável."
 ]},
 {heading:"4. Como aplicar a distinção",paragraphs:[
  "Diante de um caso, pergunte: existe uma norma jurídica aplicável? Qual é a avaliação moral envolvida? Que concepção de justiça está sendo usada? Quais fatos ainda precisam ser conhecidos? Separar essas perguntas torna o debate mais claro e reduz confusões."
 ]}
 ],
 keyTerms:[{term:"Moral",definition:"Conjunto de valores e critérios de avaliação de condutas."},{term:"Justiça",definition:"Critério ou ideal normativo para avaliar tratamentos, direitos, deveres e distribuições."},{term:"Legalidade",definition:"Conformidade de uma conduta ou decisão com o Direito aplicável."},{term:"Legitimidade",definition:"Qualidade de um poder ou decisão que pode ser justificado perante critérios relevantes."}],
 caseStudy:"Uma pessoa encontra uma carteira e decide ficar com o dinheiro, embora ninguém descubra. A ausência de descoberta não resolve a questão moral. A eventual consequência jurídica depende dos fatos e das normas aplicáveis. O exemplo mostra que moralidade, possibilidade de punição e legalidade são perguntas diferentes.",
 question:{prompt:"Qual afirmação é conceitualmente mais cuidadosa?",options:["Tudo que é legal é automaticamente justo.","Toda reprovação moral corresponde a um crime.","Legalidade e justiça são critérios relacionados, mas distintos.","A moral não influencia nenhuma discussão jurídica."],correct:2,explanation:"Legalidade e justiça podem se relacionar, mas respondem a perguntas diferentes. O Direito também dialoga com valores morais e constitucionais."},
 reflection:"Você consegue lembrar de uma regra que considera juridicamente válida, mas cuja justiça é debatida? Quais critérios poderiam ser usados para avaliá-la?",
 references:["ARISTÓTELES. Ética a Nicômaco.","RAWLS, John. Uma Teoria da Justiça. Martins Fontes.","BOBBIO, Norberto. Teoria da Norma Jurídica. Edipro."]
},
{
 id:"direito-03",title:"Como surgiram os sistemas jurídicos",duration:40,objective:"Reconhecer que o Direito se transforma historicamente e compreender a passagem de costumes e autoridades tradicionais para sistemas jurídicos institucionalizados.",
 sections:[
 {heading:"1. Antes das codificações modernas",paragraphs:[
  "Sociedades humanas organizaram a convivência por costumes, tradições, decisões de autoridades, pactos e formas variadas de sanção. Não existiu uma única linha evolutiva universal: diferentes povos desenvolveram soluções próprias, influenciadas por religião, economia, organização política e relações de poder.",
  "Em comunidades pequenas, práticas compartilhadas podiam orientar disputas. À medida que sociedades se tornaram mais complexas, cresceu a necessidade de registrar decisões, definir competências e estabelecer procedimentos relativamente estáveis."
 ]},
 {heading:"2. Escrita, autoridade e registro",paragraphs:[
  "O registro escrito de normas tornou possível divulgar regras, preservar decisões e ampliar a capacidade administrativa de governos. Códigos antigos são fontes históricas importantes, mas não devem ser confundidos com códigos modernos: seus conteúdos, objetivos e concepções de pessoa e autoridade eram diferentes.",
  "O Código de Hamurabi, por exemplo, é frequentemente estudado como uma coleção de decisões e disposições associadas ao poder real na antiga Mesopotâmia. Sua análise exige contexto histórico; não é uma versão inicial da legislação contemporânea."
 ]},
 {heading:"3. Tradições jurídicas",paragraphs:[
  "A tradição romano-germânica, também chamada de civil law, atribui grande importância à legislação e à organização sistemática de normas. A tradição common law desenvolveu papel histórico relevante para precedentes judiciais, especialmente em países como Inglaterra e Estados Unidos. Na prática, sistemas atuais combinam legislação, decisões judiciais, princípios e instituições de maneiras próprias.",
  "O Brasil integra a tradição romano-germânica, mas decisões judiciais e precedentes têm importância crescente e juridicamente definida. Evite a simplificação de dizer que em países de civil law juízes nunca criam entendimentos relevantes ou que no common law não existem leis escritas."
 ]},
 {heading:"4. O Direito muda com a sociedade",paragraphs:[
  "Transformações econômicas, tecnológicas, culturais e políticas pressionam sistemas jurídicos. A industrialização, a urbanização, a expansão dos direitos sociais e a internet trouxeram problemas que exigiram novas normas e interpretações.",
  "A história do Direito ajuda a perceber que instituições são construções humanas. Isso não significa que qualquer mudança seja adequada: reformas precisam ser avaliadas por seus fundamentos, efeitos e compatibilidade com direitos e procedimentos."
 ]}
 ],
 keyTerms:[{term:"Costume jurídico",definition:"Prática social reiterada que pode adquirir relevância jurídica quando reconhecida pelo ordenamento."},{term:"Codificação",definition:"Organização sistemática de normas em um código."},{term:"Civil law",definition:"Tradição jurídica que atribui papel central à legislação e à sistematização normativa."},{term:"Common law",definition:"Tradição em que precedentes judiciais possuem papel histórico central, ao lado da legislação."}],
 caseStudy:"Uma plataforma digital cria uma forma nova de intermediar serviços. Regras antigas podem não responder claramente a todas as questões sobre responsabilidade, dados e relações de consumo. Legisladores, tribunais e órgãos reguladores precisam interpretar normas existentes e, quando cabível, desenvolver novas respostas institucionais.",
 question:{prompt:"Qual afirmação sobre tradições jurídicas é mais precisa?",options:["O Brasil não utiliza leis escritas porque segue o common law.","Civil law e common law são tradições históricas distintas, mas sistemas atuais podem combinar legislação e precedentes.","O common law não possui constituição nem legislação.","Todos os sistemas jurídicos surgiram da mesma sequência histórica."],correct:1,explanation:"As tradições diferem historicamente, mas não são blocos puros. Sistemas contemporâneos combinam fontes e instituições."},
 reflection:"Escolha uma tecnologia recente e identifique duas questões jurídicas que ela pode gerar. Por que regras antigas talvez precisem ser interpretadas ou atualizadas?",
 references:["DAVID, René. Os Grandes Sistemas do Direito Contemporâneo. Martins Fontes.","WOLKMER, Antonio Carlos. Fundamentos de História do Direito. Del Rey.","BRASIL. Constituição Federal de 1988."]
},
{
 id:"direito-04",title:"Estado, sociedade e ordenamento jurídico",duration:40,objective:"Definir Estado e seus elementos básicos, diferenciando Estado, governo, sociedade e nação.",
 sections:[
 {heading:"1. O que é Estado?",paragraphs:[
  "Estado é uma forma de organização política e jurídica que exerce autoridade soberana sobre uma população em determinado território. A definição reúne elementos que precisam ser analisados em conjunto: população, território, governo e soberania.",
  "População refere-se às pessoas vinculadas ao Estado em determinado território, conforme o contexto de análise. Território é o espaço sobre o qual a autoridade estatal exerce competências. Governo é o conjunto de órgãos e agentes que conduzem decisões políticas e administrativas. Soberania indica a autoridade suprema do Estado na ordem interna e sua independência jurídica externa, sujeita às obrigações internacionais assumidas."
 ]},
 {heading:"2. Estado não é o mesmo que governo",paragraphs:[
  "O Estado é uma estrutura institucional duradoura. Governos são temporários e mudam por eleições, sucessões ou outros procedimentos previstos. A troca de presidente, governador ou prefeito não significa que o Estado deixou de existir.",
  "Sociedade é o conjunto de relações e grupos humanos que convivem. Nação costuma designar uma comunidade ligada por elementos históricos, culturais, linguísticos ou identitários. Uma nação pode não possuir Estado próprio, e um Estado pode abrigar diferentes comunidades nacionais."
 ]},
 {heading:"3. Estado de Direito",paragraphs:[
  "No Estado de Direito, o exercício do poder público deve obedecer a normas e limites jurídicos. Autoridades não estão acima da Constituição e das leis. A atuação estatal precisa respeitar competências, direitos, procedimentos e mecanismos de controle.",
  "A ideia de Estado de Direito não se resume à existência de leis. Também importa saber como são produzidas, se protegem direitos, se há independência institucional e se o poder pode ser fiscalizado."
 ]},
 {heading:"4. O ordenamento jurídico",paragraphs:[
  "O ordenamento jurídico organiza normas de diferentes níveis e funções. No Brasil, a Constituição ocupa posição central e condiciona a validade das normas inferiores. Leis, decretos e atos administrativos devem respeitar as competências e limites estabelecidos pelas normas superiores.",
  "Conflitos entre normas exigem critérios de solução, como hierarquia, competência, especialidade e regras temporais, sempre considerados no contexto concreto. Não é correto resolver qualquer conflito usando apenas a regra de que a norma mais recente prevalece."
 ]}
 ],
 keyTerms:[{term:"Estado",definition:"Organização política e jurídica soberana, associada a população, território e governo."},{term:"Governo",definition:"Conjunto de autoridades e órgãos que dirige politicamente o Estado durante determinado período."},{term:"Soberania",definition:"Autoridade estatal suprema na ordem interna e independência jurídica externa, dentro das obrigações internacionais."},{term:"Estado de Direito",definition:"Modelo em que o poder público é limitado e organizado pelo Direito."}],
 caseStudy:"Após uma eleição, ocorre a substituição dos ocupantes do Poder Executivo. Serviços públicos, tribunais, leis e órgãos administrativos continuam funcionando. Isso ilustra a diferença entre a continuidade do Estado e a alternância do governo.",
 question:{prompt:"Qual alternativa diferencia corretamente Estado e governo?",options:["Estado e governo são expressões idênticas.","O governo é permanente e o Estado muda a cada eleição.","O Estado é a estrutura político-jurídica; o governo é a direção política temporária dessa estrutura.","O Estado existe apenas quando há eleições."],correct:2,explanation:"Governos mudam; a estrutura estatal permanece, ainda que possa passar por transformações institucionais."},
 reflection:"Por que é importante que serviços e instituições públicas continuem funcionando mesmo quando muda o governo?",
 references:["BRASIL. Constituição da República Federativa do Brasil de 1988.","DALLARI, Dalmo de Abreu. Elementos de Teoria Geral do Estado. Saraiva.","BONAVIDES, Paulo. Ciência Política. Malheiros."]
},
{
 id:"direito-05",title:"Constituição e hierarquia das normas",duration:40,objective:"Compreender a função da Constituição e a ideia de supremacia constitucional no ordenamento brasileiro.",
 sections:[
 {heading:"1. Constituição: fundamento da organização política",paragraphs:["A Constituição é a norma fundamental escrita que organiza o Estado, distribui competências, estabelece direitos e define limites ao exercício do poder. A Constituição Federal de 1988 é o marco central do ordenamento brasileiro contemporâneo.","Ela não trata apenas da estrutura dos órgãos públicos. Também estabelece fundamentos, objetivos, direitos e garantias fundamentais e parâmetros para a atuação estatal. Sua interpretação influencia todo o sistema jurídico."]},
 {heading:"2. Supremacia constitucional",paragraphs:["A supremacia constitucional significa que normas e atos inferiores devem ser compatíveis com a Constituição. Uma lei não pode validamente contrariar a Constituição. Existem mecanismos institucionais para controlar essa compatibilidade, entre eles o controle de constitucionalidade.","A análise não é simplesmente comparar frases isoladas. É necessário considerar competência legislativa, procedimento, direitos envolvidos, interpretação constitucional e decisões dos órgãos competentes."]},
 {heading:"3. Hierarquia e competência",paragraphs:["A Constituição ocupa o topo da ordem normativa interna. Abaixo dela existem diferentes espécies normativas, como emendas constitucionais, leis complementares, leis ordinárias, medidas provisórias, decretos legislativos, resoluções e atos infralegais. A posição e o alcance de cada espécie dependem da Constituição.","Nem toda relação entre normas é uma pirâmide simples. Competência e matéria são decisivas: uma norma pode ser inválida porque foi editada por autoridade sem competência, mesmo que seu conteúdo pareça razoável."]},
 {heading:"4. Constituição rígida e mudança",paragraphs:["A Constituição brasileira é rígida porque sua alteração exige procedimento mais difícil do que o processo legislativo ordinário. Emendas constitucionais precisam observar requisitos e limites previstos no próprio texto constitucional.","A rigidez busca estabilidade, mas não imobilidade. A Constituição pode ser atualizada por emendas, respeitados os limites constitucionais, inclusive as cláusulas pétreas."]}
 ],
 keyTerms:[{term:"Supremacia constitucional",definition:"Princípio segundo o qual a Constituição condiciona a validade das normas inferiores."},{term:"Controle de constitucionalidade",definition:"Mecanismos para verificar a compatibilidade de leis e atos normativos com a Constituição."},{term:"Emenda constitucional",definition:"Ato normativo que altera o texto constitucional segundo procedimento próprio."},{term:"Cláusula pétrea",definition:"Limite material ao poder de reforma constitucional previsto no art. 60, § 4º, da Constituição."}],
 caseStudy:"Um município edita uma regra sobre matéria que a Constituição atribui à competência legislativa da União. Mesmo que a regra pareça conveniente localmente, é necessário examinar a repartição constitucional de competências antes de considerá-la válida.",
 question:{prompt:"Por que uma lei deve respeitar a Constituição?",options:["Porque a Constituição é apenas uma recomendação política.","Porque a Constituição organiza o Estado e condiciona a validade das normas inferiores.","Porque leis ordinárias sempre podem alterar a Constituição.","Porque decretos municipais estão acima da Constituição."],correct:1,explanation:"A Constituição é parâmetro superior de organização e validade do ordenamento jurídico."},
 reflection:"Encontre no texto da Constituição um direito fundamental e pense em uma situação em que uma lei ou política pública deve respeitá-lo.",
 references:["BRASIL. Constituição Federal de 1988, especialmente arts. 1º a 5º e 60.","MENDES, Gilmar Ferreira; BRANCO, Paulo Gustavo Gonet. Curso de Direito Constitucional. Saraiva.","BARROSO, Luís Roberto. Curso de Direito Constitucional Contemporâneo. Saraiva."]
},
{
 id:"direito-06",title:"Os três Poderes e a separação de funções",duration:35,objective:"Identificar as funções típicas e atípicas dos Poderes Legislativo, Executivo e Judiciário no Brasil.",
 sections:[
 {heading:"1. Por que separar o poder?",paragraphs:["A concentração de poder em uma única autoridade aumenta o risco de arbitrariedade. A separação de Poderes distribui funções estatais entre órgãos distintos e cria mecanismos de controle recíproco.","No Brasil, Legislativo, Executivo e Judiciário são Poderes da União, independentes e harmônicos entre si, conforme o art. 2º da Constituição. A separação não significa isolamento absoluto."]},
 {heading:"2. Funções típicas",paragraphs:["O Legislativo elabora normas e fiscaliza a atuação do Executivo, nos termos constitucionais. O Executivo administra políticas públicas e executa leis. O Judiciário exerce jurisdição, solucionando conflitos e controlando a aplicação do Direito.","Cada Poder também pode exercer funções atípicas. O Legislativo administra sua estrutura e julga determinadas autoridades em hipóteses constitucionais. O Executivo edita atos normativos autorizados pela Constituição e decide processos administrativos. O Judiciário organiza seus serviços e administra seus órgãos."]},
 {heading:"3. Freios e contrapesos",paragraphs:["Freios e contrapesos são mecanismos pelos quais instituições limitam ou fiscalizam umas às outras. Exemplos incluem veto presidencial, apreciação legislativa, controle judicial de constitucionalidade e fiscalização contábil, financeira e orçamentária.","Esses mecanismos não autorizam qualquer Poder a substituir livremente os demais. Cada intervenção depende de competência e procedimento definidos pelo ordenamento."]}
 ],
 keyTerms:[{term:"Separação de Poderes",definition:"Distribuição das funções estatais entre órgãos independentes e harmônicos."},{term:"Função típica",definition:"Atividade que caracteriza predominantemente determinado Poder."},{term:"Freios e contrapesos",definition:"Mecanismos institucionais de controle recíproco do exercício do poder."}],
 caseStudy:"O Congresso aprova uma lei e o presidente pode sancioná-la ou vetá-la conforme o processo constitucional. Se houver controvérsia sobre a constitucionalidade da lei, o Judiciário poderá ser provocado nos termos processuais adequados. Cada atuação possui fundamento e limites próprios.",
 question:{prompt:"Qual é a ideia central dos freios e contrapesos?",options:["Permitir que um Poder controle todos os demais sem limites.","Impedir qualquer diálogo entre os Poderes.","Criar mecanismos de controle recíproco para limitar abusos e preservar o equilíbrio institucional.","Eliminar a independência dos Poderes."],correct:2,explanation:"O sistema busca evitar concentração e abuso de poder, respeitando competências constitucionais."},
 reflection:"Escolha uma notícia sobre atuação de um Poder e identifique qual competência constitucional está sendo exercida.",
 references:["BRASIL. Constituição Federal de 1988, arts. 2º, 44, 76 e 92.","SILVA, José Afonso da. Curso de Direito Constitucional Positivo. Malheiros."]
},
{
 id:"direito-07",title:"Direitos e garantias fundamentais",duration:40,objective:"Diferenciar direitos e garantias fundamentais e reconhecer sua função na proteção da pessoa e na limitação do poder.",
 sections:[
 {heading:"1. Direitos e garantias",paragraphs:["Direitos fundamentais são posições jurídicas essenciais reconhecidas pela Constituição, como liberdade, igualdade, privacidade, propriedade, educação e saúde. Garantias são instrumentos e mecanismos destinados a proteger esses direitos, como habeas corpus, mandado de segurança e devido processo legal.","A distinção é didática: direitos e garantias se complementam e podem aparecer conectados no mesmo dispositivo constitucional."]},
 {heading:"2. Características e dimensões",paragraphs:["Direitos fundamentais possuem historicidade: seu reconhecimento e conteúdo se desenvolvem ao longo do tempo. Também podem ter aplicabilidade imediata, conforme o art. 5º, § 1º, sem que isso signifique que todos tenham execução idêntica ou dispensem regulamentação em qualquer situação.","A classificação em dimensões é uma ferramenta de estudo. Em linhas gerais, a primeira dimensão envolve liberdades e limites ao Estado; a segunda, direitos sociais e prestações; a terceira, direitos de titularidade coletiva ou difusa. Essas categorias não devem ser tratadas como etapas que substituem umas às outras."]},
 {heading:"3. Colisões e ponderação",paragraphs:["Direitos fundamentais podem entrar em tensão em casos concretos, como liberdade de expressão e proteção da honra. A solução exige identificar os direitos envolvidos, o contexto, a base legal, a proporcionalidade e as circunstâncias específicas.","Não existe resposta automática que coloque sempre um direito acima de outro. A fundamentação precisa explicar por que uma restrição é adequada, necessária e proporcional em sentido estrito, quando esse exame for pertinente."]},
 {heading:"4. Proteção constitucional",paragraphs:["A Constituição prevê instrumentos judiciais e garantias processuais para proteger direitos. O habeas corpus protege a liberdade de locomoção contra ilegalidade ou abuso de poder; o mandado de segurança protege direito líquido e certo nas condições constitucionais e legais; o habeas data e o mandado de injunção têm finalidades específicas.","Conhecer a existência desses instrumentos é um primeiro passo. A utilização em um caso real exige examinar requisitos, legitimidade, prazos e orientação jurídica adequada."]}
 ],
 keyTerms:[{term:"Direito fundamental",definition:"Posição jurídica essencial reconhecida e protegida pela Constituição."},{term:"Garantia fundamental",definition:"Instrumento ou mecanismo destinado a assegurar a proteção de direitos."},{term:"Proporcionalidade",definition:"Critério de análise de restrições, usualmente estruturado em adequação, necessidade e proporcionalidade em sentido estrito."},{term:"Direito difuso",definition:"Direito transindividual de natureza indivisível, cujos titulares são indeterminados e ligados por circunstâncias de fato."}],
 caseStudy:"Uma publicação na internet critica a atuação de um agente público e inclui informações pessoais sem relação com o debate. A análise pode envolver liberdade de expressão, interesse público, privacidade e honra. É preciso examinar conteúdo, contexto e consequências, sem presumir que um direito sempre anule o outro.",
 question:{prompt:"Qual é a relação mais adequada entre direitos e garantias fundamentais?",options:["São conceitos idênticos em todos os contextos.","Direitos reconhecem posições protegidas; garantias oferecem instrumentos para sua proteção.","Garantias existem apenas para o Estado.","Direitos fundamentais não podem entrar em tensão."],correct:1,explanation:"Direitos e garantias são conceitos relacionados, mas distinguíveis: as garantias ajudam a proteger os direitos."},
 reflection:"Escolha dois direitos fundamentais que possam entrar em tensão em uma situação concreta. Que fatos seriam necessários para analisar o caso?",
 references:["BRASIL. Constituição Federal de 1988, art. 5º e seguintes.","SARLET, Ingo Wolfgang. A Eficácia dos Direitos Fundamentais. Livraria do Advogado.","MENDES; BRANCO. Curso de Direito Constitucional. Saraiva."]
},
{
 id:"direito-08",title:"Introdução ao Direito Civil",duration:35,objective:"Conhecer o papel do Direito Civil nas relações privadas e identificar pessoa, capacidade, bens e obrigações como conceitos introdutórios.",
 sections:[
 {heading:"1. O campo do Direito Civil",paragraphs:["O Direito Civil regula aspectos centrais da vida privada, como personalidade, capacidade, bens, obrigações, contratos, responsabilidade civil, família e sucessões. Ele fornece categorias para compreender relações entre pessoas e organizações.","O Código Civil brasileiro é a Lei nº 10.406/2002. Sua aplicação deve respeitar a Constituição e a legislação especial pertinente."]},
 {heading:"2. Pessoa e personalidade",paragraphs:["O Código Civil estabelece que toda pessoa é capaz de direitos e deveres na ordem civil. Personalidade jurídica é a aptidão para ser titular de direitos e deveres. Capacidade de exercício diz respeito à possibilidade de praticar pessoalmente atos da vida civil, observadas as regras legais.","Não se deve confundir personalidade com capacidade de exercício. A lei prevê situações em que a pessoa precisa de representação ou assistência para determinados atos."]},
 {heading:"3. Bens, obrigações e contratos",paragraphs:["Bens são objetos de relações jurídicas e podem receber classificações diferentes conforme sua natureza e regime. Obrigações são vínculos jurídicos que podem envolver prestação de dar, fazer ou não fazer.","Contratos são acordos de vontades que, respeitados os requisitos legais, criam, modificam ou extinguem relações jurídicas. A liberdade contratual existe dentro de limites como função social, boa-fé e normas cogentes."]},
 {heading:"4. Responsabilidade civil",paragraphs:["A responsabilidade civil trata do dever de reparar danos nas hipóteses previstas pelo ordenamento. Em linhas gerais, a análise pode envolver conduta, dano, nexo causal e culpa, quando exigida. Há hipóteses de responsabilidade objetiva, em que a culpa não é elemento necessário, conforme a lei.","A solução de um caso concreto depende de provas, enquadramento normativo e eventuais excludentes."]}
 ],
 keyTerms:[{term:"Personalidade jurídica",definition:"Aptidão para ser titular de direitos e deveres."},{term:"Capacidade de exercício",definition:"Aptidão para praticar pessoalmente atos da vida civil, segundo a lei."},{term:"Obrigação",definition:"Vínculo jurídico que envolve uma prestação devida."},{term:"Responsabilidade civil",definition:"Regime jurídico de reparação de danos nas hipóteses previstas em lei."}],
 caseStudy:"Uma loja vende um produto com defeito e o consumidor busca solução. A análise pode envolver contrato, Código de Defesa do Consumidor, responsabilidade pelo produto e provas da compra e do defeito. O Direito Civil fornece conceitos gerais, mas a legislação consumerista pode ser especialmente relevante.",
 question:{prompt:"O que é personalidade jurídica?",options:["A capacidade de votar em eleições.","A aptidão para ser titular de direitos e deveres.","A obrigação de assinar contratos pessoalmente.","A mesma coisa que maioridade penal."],correct:1,explanation:"Personalidade jurídica é a aptidão para titularizar direitos e deveres; não se confunde com capacidade de exercício."},
 reflection:"Pense em uma compra recente. Quais direitos e obrigações surgiram para consumidor e fornecedor?",
 references:["BRASIL. Código Civil (Lei nº 10.406/2002).","BRASIL. Código de Defesa do Consumidor (Lei nº 8.078/1990).","TARTUCE, Flávio. Manual de Direito Civil. Método."]
},
{
 id:"direito-09",title:"Introdução ao Direito Penal",duration:40,objective:"Compreender a finalidade do Direito Penal, os princípios limitadores do poder punitivo e a estrutura básica da análise de um crime.",
 sections:[
 {heading:"1. O que é Direito Penal?",paragraphs:["O Direito Penal define infrações penais e estabelece consequências jurídicas, dentro de limites constitucionais. Por envolver a possibilidade de restrição da liberdade, é uma das áreas em que o poder estatal precisa de controles especialmente rigorosos.","A política criminal discute quais condutas devem ser criminalizadas e quais respostas são adequadas. Nem todo comportamento socialmente reprovável deve ser tratado como crime."]},
 {heading:"2. Princípios limitadores",paragraphs:["O princípio da legalidade penal exige lei anterior que defina o crime e comine a pena. A Constituição também veda retroatividade da lei penal mais gravosa e admite retroatividade da lei mais benéfica, nos termos constitucionais.","Outros princípios relevantes incluem culpabilidade, intervenção mínima, lesividade e humanidade das penas. Eles ajudam a limitar o uso do poder punitivo e a orientar interpretação e legislação."]},
 {heading:"3. Estrutura analítica do crime",paragraphs:["Em uma formulação didática amplamente utilizada, crime é analisado a partir de fato típico, ilicitude e culpabilidade. Fato típico envolve conduta e demais elementos previstos no tipo penal; ilicitude examina se há contrariedade ao Direito ou causa de justificação; culpabilidade avalia a possibilidade de reprovação pessoal nos termos da teoria adotada.","Essa estrutura é um modelo de estudo. A aplicação depende do tipo penal, dos fatos provados, das teses defensivas e da interpretação jurídica."]},
 {heading:"4. Pena e garantias",paragraphs:["A pena não pode ser aplicada por mera suspeita ou reprovação social. A responsabilização exige processo com garantias, prova válida, contraditório, ampla defesa e decisão fundamentada. A presunção de inocência é uma garantia constitucional central.","O Direito Penal deve ser estudado sem confundir notícia, acusação, investigação e condenação. Cada etapa possui significado jurídico próprio."]}
 ],
 keyTerms:[{term:"Legalidade penal",definition:"Exigência de lei anterior para definir crime e estabelecer pena."},{term:"Tipicidade",definition:"Adequação do fato aos elementos de uma descrição legal de infração penal."},{term:"Ilicitude",definition:"Contrariedade do fato típico ao ordenamento, ausente causa de justificação."},{term:"Culpabilidade",definition:"Juízo de reprovação pessoal nos termos da teoria penal adotada."}],
 caseStudy:"Uma manchete informa que alguém foi investigado por determinado fato. A investigação não equivale a condenação. Para afirmar responsabilidade penal é necessário processo e decisão conforme as garantias constitucionais. O vocabulário usado ao relatar fatos importa para não antecipar culpa.",
 question:{prompt:"O princípio da legalidade penal exige que:",options:["Qualquer conduta reprovável possa ser punida.","A pena seja criada depois do fato por decisão administrativa.","Não haja crime nem pena sem lei anterior que os defina.","A investigação seja suficiente para condenar."],correct:2,explanation:"A legalidade penal exige lei anterior definidora do crime e da pena, limitando o poder punitivo."},
 reflection:"Ao ler uma notícia criminal, identifique se ela fala de suspeita, investigação, denúncia, julgamento ou condenação. Por que essa distinção é importante?",
 references:["BRASIL. Constituição Federal de 1988, art. 5º, XXXIX, XL, LV e LVII.","BRASIL. Código Penal (Decreto-Lei nº 2.848/1940).","BITENCOURT, Cezar Roberto. Tratado de Direito Penal. Saraiva."]
},
{
 id:"direito-10",title:"Como interpretar uma norma jurídica",duration:40,objective:"Aplicar um roteiro introdutório de interpretação jurídica, identificando texto, contexto, finalidade, sistema e fatos relevantes.",
 sections:[
 {heading:"1. Texto não é interpretação completa",paragraphs:["Interpretar uma norma é atribuir sentido ao texto jurídico para orientar sua aplicação. Palavras podem ter mais de um significado, e dispositivos precisam ser compreendidos no contexto do sistema em que estão inseridos.","O ponto de partida é o texto, mas a análise pode exigir contexto histórico, finalidade, relação com outras normas e princípios constitucionais. Nenhum método isolado resolve automaticamente todos os casos."]},
 {heading:"2. Métodos interpretativos",paragraphs:["A interpretação gramatical examina o sentido linguístico. A sistemática relaciona o dispositivo com outras normas. A histórica considera o contexto de elaboração. A teleológica investiga a finalidade da regra. A interpretação constitucional exige atenção à unidade da Constituição, aos direitos fundamentais e à repartição de competências.","Esses métodos podem ser combinados. O intérprete deve explicitar razões e evitar escolher apenas o argumento que confirma sua conclusão prévia."]},
 {heading:"3. Fatos e enquadramento",paragraphs:["A aplicação do Direito exige reconstruir os fatos com base em evidências. Uma regra pode ser clara, mas não se aplicar se os pressupostos fáticos não estiverem presentes. Por isso, é necessário distinguir o que foi comprovado, o que é alegado e o que permanece incerto.","Em uma análise organizada, separe: questão jurídica; fatos relevantes; normas candidatas; interpretação; aplicação aos fatos; conclusão e limites da conclusão."]},
 {heading:"4. Um roteiro de análise",paragraphs:["Comece formulando a pergunta jurídica em uma frase. Depois identifique os fatos indispensáveis e as informações ausentes. Localize as normas relevantes em fontes oficiais. Leia o dispositivo completo e seu contexto. Compare interpretações possíveis e justifique a conclusão.","Em trabalhos acadêmicos, cite a fonte e a versão consultada. Em situações reais, especialmente quando há prazos, patrimônio ou liberdade envolvidos, procure orientação profissional qualificada."]}
 ],
 keyTerms:[{term:"Interpretação gramatical",definition:"Análise do significado linguístico do texto normativo."},{term:"Interpretação sistemática",definition:"Leitura da norma em relação ao conjunto do ordenamento."},{term:"Interpretação teleológica",definition:"Análise orientada pela finalidade da norma."},{term:"Enquadramento jurídico",definition:"Relação fundamentada entre fatos relevantes e normas aplicáveis."}],
 caseStudy:"Uma regra municipal usa a expressão 'estabelecimento aberto ao público'. Para aplicá-la a um serviço oferecido apenas por agendamento, é necessário examinar o texto, a finalidade, o contexto normativo e as características reais da atividade. Não basta escolher intuitivamente um significado.",
 question:{prompt:"Qual é a melhor prática ao interpretar uma norma?",options:["Ler apenas uma frase isolada e ignorar o restante do sistema.","Escolher a interpretação que favorece a opinião pessoal.","Combinar texto, contexto, finalidade, sistema e fatos, justificando a conclusão.","Presumir que toda palavra jurídica possui um único sentido."],correct:2,explanation:"A interpretação responsável considera diferentes elementos e apresenta razões verificáveis para a conclusão."},
 reflection:"Escolha um artigo da Constituição ou de uma lei. Escreva uma pergunta que ajude a identificar seu alcance e quais fatos seriam necessários para aplicá-lo.",
 references:["BRASIL. Constituição Federal de 1988.","MAXIMILIANO, Carlos. Hermenêutica e Aplicação do Direito. Forense.","BARROSO, Luís Roberto. Interpretação e Aplicação da Constituição. Saraiva."]
}
];
