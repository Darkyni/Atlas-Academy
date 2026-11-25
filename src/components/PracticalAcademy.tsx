"use client";

import { getAtlasStorageKey } from "@/lib/atlas-storage";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck, House, Cpu, PackageCheck, AlertTriangle, Compass, ClipboardList, CheckCircle2,
  ChevronRight, RotateCcw, BookOpen, Target, Activity
} from "lucide-react";
import FieldOperationsCenter from "@/components/FieldOperationsCenter";

type TrackId = "survival" | "home" | "engineering";
type Lesson = { id: string; title: string; level: string; time: string; objective: string; sections: { heading: string; body: string }[]; actions: string[]; safety: string };
type Track = { id: TrackId; title: string; subtitle: string; icon: typeof ShieldCheck; accent: string; lessons: Lesson[] };

const tracks: Track[] = [
  {
    id: "survival", title: "ATLAS SURVIVAL", subtitle: "Preparação, resiliência e autonomia em situações adversas.", icon: ShieldCheck, accent: "survival",
    lessons: [
      { id: "surv-72", title: "Preparação para as primeiras 72 horas", level: "Fundamental", time: "35 min", objective: "Organizar prioridades familiares para atravessar uma interrupção temporária de serviços essenciais.", sections: [
        { heading: "A lógica das 72 horas", body: "As primeiras decisões devem reduzir exposição ao perigo, preservar comunicação e manter necessidades básicas. O prazo de 72 horas é uma referência de planejamento, não uma garantia de que a ajuda chegará nesse intervalo. Ajuste o plano à realidade local, às pessoas da casa, ao clima e às orientações oficiais." },
        { heading: "Prioridades", body: "1) Segurança imediata e informação confiável. 2) Água potável e meios seguros de obtê-la. 3) Medicamentos de uso habitual e primeiros socorros básicos. 4) Alimentação simples e pronta para consumo. 5) Iluminação, energia de reserva e comunicação. 6) Higiene, abrigo e organização familiar." },
        { heading: "Planejamento doméstico", body: "Defina ponto de encontro, contatos fora da região, rotas alternativas e responsabilidades. Mantenha cópias protegidas de documentos importantes, uma lista de contatos em papel e um inventário de necessidades especiais, sem divulgar publicamente dados sensíveis." }
      ], actions: ["Monte uma lista de contatos em papel e escolha um contato externo à sua região.", "Verifique lanternas, pilhas, carregadores e rádio; teste-os periodicamente.", "Separe documentos essenciais, medicamentos habituais e itens de higiene.", "Combine dois pontos de encontro: um próximo e outro fora do bairro."], safety: "Siga alertas da Defesa Civil e autoridades locais. Não permaneça em imóveis alagados, áreas com risco estrutural ou locais sob ordem de evacuação." },
      { id: "surv-water", title: "Água: reserva, consumo e segurança", level: "Fundamental", time: "30 min", objective: "Planejar uma reserva doméstica e reconhecer práticas seguras de tratamento de água.", sections: [
        { heading: "Dimensionamento inicial", body: "Uma referência de planejamento frequentemente usada em emergências é reservar ao menos 4 litros por pessoa por dia para beber e preparo básico de alimentos, ajustando para calor, esforço físico, idade, gravidez e condições de saúde. Isso não cobre necessariamente higiene e limpeza. Para 3 pessoas por 3 dias, a referência mínima de planejamento é 36 litros." },
        { heading: "Armazenamento", body: "Use recipientes próprios para água potável, limpos, íntegros, fechados e identificados com data. Guarde longe de combustíveis, produtos químicos, sol direto e fontes de contaminação. Faça rodízio conforme orientação sanitária e fabricante do recipiente." },
        { heading: "Tratamento", body: "Prefira água de fonte segura. Em dúvida, siga exatamente as orientações atualizadas do Ministério da Saúde ou da autoridade sanitária para fervura ou desinfecção. Não improvise dosagens de produtos químicos nem misture produtos de limpeza. Água com suspeita de contaminação química ou combustível não se torna segura por fervura." }
      ], actions: ["Calcule a reserva de água para o número real de moradores.", "Identifique recipientes adequados e um local seguro de armazenamento.", "Anote a fonte oficial local para instruções de tratamento em emergências.", "Planeje como descartar água contaminada sem expor pessoas ou animais."], safety: "Não use água com odor de combustível, solventes ou suspeita de contaminação química. Em surtos ou enchentes, siga orientações sanitárias oficiais." },
      { id: "surv-food", title: "Alimentação, abrigo e higiene", level: "Fundamental", time: "30 min", objective: "Organizar alimentos estáveis, higiene e conforto térmico sem criar riscos adicionais.", sections: [
        { heading: "Alimentos", body: "Priorize itens habituais, não perecíveis, de preparo simples e compatíveis com restrições alimentares. Inclua abridor manual quando necessário, utensílios, alimentação infantil ou especial e ração para animais. Faça rodízio pelo prazo de validade." },
        { heading: "Abrigo e clima", body: "Escolha cômodo seguro, ventilado e afastado de janelas danificadas. Em calor intenso, reduza esforço nas horas mais quentes e mantenha hidratação. Em frio, use camadas secas e ventilação adequada. Nunca use churrasqueira, fogareiro ou gerador em ambiente fechado: há risco de intoxicação por monóxido de carbono e incêndio." },
        { heading: "Higiene e saneamento", body: "Planeje lavagem das mãos, higiene menstrual, fraldas, descarte de resíduos e limpeza de superfícies. Separe água potável da água de limpeza. Evite contato direto com água de enchente e materiais perfurocortantes." }
      ], actions: ["Monte uma despensa rotativa com alimentos que a família já consome.", "Liste itens de higiene e descarte necessários por pessoa.", "Identifique um cômodo seguro e alternativas de ventilação.", "Inclua necessidades de crianças, idosos, pessoas com deficiência e animais."], safety: "Nunca opere combustão em interiores ou locais sem ventilação projetada. Não consuma alimentos que tiveram contato com água de enchente." },
      { id: "surv-firstaid", title: "Primeiros socorros e resposta inicial", level: "Intermediário", time: "40 min", objective: "Reconhecer limites do atendimento leigo e organizar resposta segura até a chegada de ajuda.", sections: [
        { heading: "Cena segura", body: "Antes de se aproximar, observe trânsito, eletricidade, fumaça, violência, estruturas instáveis e substâncias perigosas. Não se torne uma segunda vítima. Acione o serviço de emergência local e informe localização, número de pessoas e riscos." },
        { heading: "Avaliação e acionamento", body: "Verifique responsividade e respiração normal sem atrasar o chamado de emergência. Siga as instruções do atendente. Em parada cardiorrespiratória suspeita, peça um desfibrilador externo automático se disponível e siga as orientações do serviço de emergência e do equipamento." },
        { heading: "Kit e capacitação", body: "Um kit básico pode incluir luvas descartáveis, gaze, ataduras, curativos, tesoura sem ponta, solução fisiológica em embalagem apropriada e barreira para ventilação. Faça curso presencial de primeiros socorros; vídeos e textos não substituem treinamento prático." }
      ], actions: ["Registre os números oficiais de emergência da sua localidade.", "Confira validade e integridade dos itens do kit.", "Faça um curso reconhecido de primeiros socorros.", "Treine como comunicar endereço, ponto de referência e riscos."], safety: "Não administre medicamentos, não mova vítimas com suspeita de trauma grave salvo perigo imediato e não realize procedimentos invasivos sem formação." },
      { id: "surv-crisis", title: "Colapso de serviços, apagão e crise climática", level: "Intermediário", time: "35 min", objective: "Tomar decisões proporcionais diante de falhas de energia, comunicação e eventos climáticos.", sections: [
        { heading: "Apagão", body: "Desconecte equipamentos sensíveis se houver oscilação, mantenha geladeira fechada e use lanternas em vez de velas sempre que possível. Geradores devem ficar ao ar livre, longe de portas, janelas e entradas de ar, conforme manual e orientação técnica." },
        { heading: "Comunicação", body: "Economize bateria, mantenha um canal de contato combinado e acompanhe rádio ou alertas oficiais. Não compartilhe boatos, imagens sem contexto ou localização de pessoas vulneráveis." },
        { heading: "Eventos extremos", body: "Enchentes, deslizamentos, ondas de calor, vendavais e incêndios exigem respostas diferentes. Conheça os riscos do território, rotas de evacuação e alertas da Defesa Civil. Evacue quando orientado; não atravesse água corrente ou vias alagadas." }
      ], actions: ["Ative alertas oficiais de emergência disponíveis na sua região.", "Defina um plano de comunicação que funcione sem internet.", "Liste equipamentos que precisam de energia e alternativas seguras.", "Mapeie riscos próximos: cursos d'água, encostas, árvores e estruturas."], safety: "Não tente reparar rede elétrica, transformadores ou cabos caídos. Afaste-se e acione a concessionária e os serviços públicos." }
    ]
  },
  {
    id: "home", title: "ATLAS HOME LAB", subtitle: "Manutenção doméstica, diagnóstico e reparos conscientes.", icon: House, accent: "home",
    lessons: [
      { id: "home-diagnosis", title: "Diagnóstico antes do reparo", level: "Fundamental", time: "25 min", objective: "Adotar um método de observação, hipótese, teste seguro e registro.", sections: [
        { heading: "Método", body: "Descreva o sintoma sem presumir a causa. Registre quando começou, frequência, condições em que aparece e mudanças recentes. Separe fatos observados de hipóteses. Procure primeiro causas simples e reversíveis." },
        { heading: "Isolamento", body: "Antes de qualquer inspeção, avalie se há risco de choque, gás, incêndio, queda, pressão ou contaminação. Interrompa o uso e isole a área quando necessário. Não abra equipamentos energizados nem remova proteções." },
        { heading: "Decisão", body: "Compare custo, risco, garantia, ferramentas e competência necessária. Se o serviço envolver instalação elétrica fixa, gás, estrutura, telhado, refrigerante ou sistema pressurizado, procure profissional habilitado." }
      ], actions: ["Escolha um problema doméstico simples e descreva apenas sintomas observáveis.", "Liste três hipóteses e uma evidência que ajudaria a distingui-las.", "Identifique riscos e o limite entre inspeção visual e intervenção técnica.", "Registre peças, modelo e garantia antes de solicitar assistência."], safety: "Desligar um disjuntor não comprova ausência de tensão. Serviços em instalações fixas devem ser realizados por profissional qualificado, com procedimentos e instrumentos adequados." },
      { id: "home-hydraulic", title: "Hidráulica: vazamentos e manutenção simples", level: "Fundamental", time: "30 min", objective: "Identificar sinais de vazamento e realizar cuidados não invasivos.", sections: [
        { heading: "Sinais", body: "Observe manchas, mofo, ruído contínuo, queda de pressão e aumento inesperado do consumo. Feche torneiras e observe o hidrômetro conforme orientação da concessionária para ajudar a identificar consumo oculto." },
        { heading: "Prevenção", body: "Não force registros antigos. Saiba onde fica o registro geral e mantenha acesso desobstruído. Limpe arejadores removíveis conforme o fabricante e substitua vedantes simples apenas quando houver segurança e compatibilidade." },
        { heading: "Quando chamar", body: "Vazamento embutido, retorno de esgoto, água próxima de instalações elétricas, tubulação pressurizada danificada ou infiltração estrutural exige avaliação profissional." }
      ], actions: ["Localize e identifique o registro geral da residência.", "Inspecione visualmente sifões, flexíveis e pontos aparentes.", "Registre leitura do hidrômetro em período sem consumo.", "Documente vazamentos com fotos e data para acompanhar evolução."], safety: "Não trabalhe em tubulações próximas a fiação energizada. Em retorno de esgoto ou risco sanitário, evite contato e solicite assistência." },
      { id: "home-electric", title: "Eletricidade residencial: reconhecer riscos", level: "Fundamental", time: "35 min", objective: "Entender conceitos básicos e reconhecer situações que exigem eletricista.", sections: [
        { heading: "Conceitos", body: "Tensão é diferença de potencial, corrente é fluxo de carga e potência elétrica relaciona energia por unidade de tempo. Disjuntores e dispositivos diferenciais têm funções de proteção distintas; nunca devem ser substituídos por valores maiores para evitar desarmes." },
        { heading: "Sinais de alerta", body: "Cheiro de queimado, tomadas aquecidas, estalos, faíscas, choque em carcaças e desarmes repetidos indicam possível falha. Afaste pessoas, não toque no ponto suspeito e solicite avaliação profissional." },
        { heading: "Uso seguro", body: "Evite adaptadores em cascata, sobrecarga de tomadas e cabos danificados. Confira potência e tensão nominal dos aparelhos. Equipamentos de alta potência precisam de circuito compatível, dimensionado conforme normas e projeto." }
      ], actions: ["Faça um inventário de aparelhos e suas potências de placa.", "Identifique tomadas danificadas sem desmontá-las.", "Anote ocorrências de desarme, aquecimento ou cheiro incomum.", "Contrate profissional habilitado para avaliar circuitos e proteções."], safety: "Este módulo não ensina intervenção em circuitos energizados, dimensionamento para execução ou ligação no quadro. Não toque em fios expostos." },
      { id: "home-build", title: "Construção, fixação e marcenaria segura", level: "Intermediário", time: "35 min", objective: "Planejar pequenos projetos considerando material, carga, ferramenta e ambiente.", sections: [
        { heading: "Planejamento", body: "Meça duas vezes, identifique material da parede e localize tubulações e cabos antes de perfurar. Considere carga estática e dinâmica, pontos de fixação, umidade e corrosão. Não presuma que uma bucha serve para qualquer parede." },
        { heading: "Ferramentas", body: "Leia o manual, inspecione cabos e proteções e use óculos, proteção auditiva e fixação adequada da peça. Mantenha mãos fora da linha de corte e não improvise extensões ou dispositivos de segurança." },
        { heading: "Limites", body: "Intervenções em paredes estruturais, lajes, telhados, escadas, guarda-corpos e instalações embutidas exigem avaliação técnica. Em marcenaria, priorize gabaritos e dispositivos de fixação em vez de segurar peças pequenas com a mão." }
      ], actions: ["Desenhe um projeto simples com medidas e lista de materiais.", "Identifique o material da superfície e consulte o fabricante das fixações.", "Planeje a proteção individual e a área de trabalho.", "Faça uma lista de situações que exigem profissional."], safety: "Não perfure sem verificar possíveis tubulações e cabos. Não remova elementos estruturais nem trabalhe em altura sem treinamento e proteção apropriados." },
      { id: "home-climate", title: "Climatização e manutenção preventiva", level: "Intermediário", time: "30 min", objective: "Criar rotina de manutenção e reconhecer sinais de falha em equipamentos.", sections: [
        { heading: "Rotina", body: "Limpe filtros removíveis somente conforme manual, mantenha entradas e saídas de ar desobstruídas e observe ruídos, odores, drenagem e consumo. Registre datas e sintomas." },
        { heading: "Eficiência", body: "Sombreamento, vedação, ventilação adequada e ajuste razoável de temperatura podem reduzir carga térmica. Dimensionamento depende de área, insolação, ocupação, isolamento e características do ambiente." },
        { heading: "Refrigeração", body: "Circuitos frigorígenos usam fluidos sob pressão e exigem ferramentas, recolhimento e qualificação apropriados. Não perfure tubulações, não libere refrigerante e não tente completar carga por conta própria." }
      ], actions: ["Localize o manual e identifique filtros que o fabricante permite ao usuário limpar.", "Registre ruído, odor, drenagem e desempenho.", "Verifique se cortinas, portas e entradas de ar estão adequadas.", "Agende manutenção profissional se houver vazamento ou perda de desempenho."], safety: "Não manipule refrigerantes, capacitores, compressores ou componentes elétricos internos. Capacitores podem manter carga mesmo após desligamento." }
    ]
  },
  {
    id: "engineering", title: "ATLAS FIELD ENGINEERING", subtitle: "Mecânica, eletrônica, automação e prototipagem de baixa tensão.", icon: Cpu, accent: "engineering",
    lessons: [
      { id: "eng-systems", title: "Pensamento de engenharia e prototipagem", level: "Fundamental", time: "30 min", objective: "Transformar uma necessidade em requisitos, protótipo e teste verificável.", sections: [
        { heading: "Definir o problema", body: "Escreva quem enfrenta o problema, em qual contexto e qual resultado seria útil. Diferencie requisito funcional, restrição, risco e preferência. Evite escolher tecnologia antes de entender a necessidade." },
        { heading: "Ciclo de projeto", body: "Observe, formule requisitos, gere alternativas, construa um protótipo de baixo risco, teste com critérios mensuráveis e registre falhas. Uma falha bem documentada é informação para a próxima iteração." },
        { heading: "Validação", body: "Defina previamente o que significa funcionar: precisão, autonomia, custo, segurança, repetibilidade e facilidade de manutenção. Teste em ambiente controlado e não conecte protótipos a sistemas críticos." }
      ], actions: ["Escreva um problema em uma frase sem propor a solução.", "Defina três requisitos mensuráveis e duas restrições.", "Desenhe duas soluções alternativas.", "Escolha um teste seguro e um critério de aprovação."], safety: "Não use protótipos experimentais em equipamentos médicos, veículos em circulação, rede elétrica predial ou sistemas de segurança." },
      { id: "eng-circuit", title: "Eletrônica básica e circuitos de baixa tensão", level: "Fundamental", time: "35 min", objective: "Compreender tensão, corrente, resistência e leitura conceitual de circuitos simples.", sections: [
        { heading: "Grandezas", body: "A Lei de Ohm relaciona tensão, corrente e resistência: V = R × I, dentro das condições em que o componente se comporta aproximadamente de forma ôhmica. Potência elétrica pode ser calculada por P = V × I em corrente contínua." },
        { heading: "Componentes", body: "Resistores limitam corrente e dividem tensão; LEDs em geral precisam de limitação de corrente; interruptores controlam continuidade; sensores convertem grandezas físicas em sinais. Consulte sempre a folha de dados do componente." },
        { heading: "Aprendizagem segura", body: "Comece com kits educacionais alimentados por pilhas ou fontes isoladas de baixa tensão e corrente limitada. Confira polaridade e limites antes de conectar. Não use tomadas, fontes abertas ou baterias danificadas em experiências." }
      ], actions: ["Calcule a corrente ideal de um circuito de 5 V com resistor de 1 kΩ: 5 mA.", "Identifique polaridade e limite de corrente no datasheet de um LED.", "Desenhe um circuito em série com fonte de baixa tensão, resistor e LED.", "Registre tensão nominal, corrente máxima e dissipação dos componentes."], safety: "Somente circuitos educacionais isolados de baixa tensão. Não trabalhe com rede elétrica, fontes abertas, capacitores de alta energia ou baterias de lítio sem formação e proteção apropriadas." },
      { id: "eng-sensors", title: "Sensores, microcontroladores e automação", level: "Intermediário", time: "40 min", objective: "Projetar uma lógica simples de leitura de sensor e acionamento de saída de baixa tensão.", sections: [
        { heading: "Entradas e saídas", body: "Um microcontrolador lê entradas digitais ou analógicas e executa instruções. Sensores podem medir temperatura, luz, distância ou umidade; atuadores podem ser LEDs ou pequenos dispositivos compatíveis com a placa." },
        { heading: "Lógica", body: "Defina faixa normal, limiar, histerese e comportamento em falha. Um sistema responsável precisa lidar com sensor desconectado, leituras impossíveis, reinicialização e perda de energia." },
        { heading: "Protótipo", body: "Comece com LED indicador e sensor de baixa tensão. Registre leituras, compare com referência e teste em várias condições. Não controle cargas de rede diretamente por pinos de microcontrolador." }
      ], actions: ["Desenhe o fluxo: ler sensor → validar leitura → comparar limite → indicar estado.", "Defina o que fazer se o sensor retornar valor impossível.", "Registre dez leituras e calcule média e variação.", "Teste o sistema apenas com LED ou saída educacional isolada."], safety: "Não conecte microcontroladores diretamente a motores, tomadas ou cargas de rede. Interfaces de potência exigem projeto, isolamento e proteção adequados." },
      { id: "eng-energy", title: "Energia solar e armazenamento: dimensionamento conceitual", level: "Intermediário", time: "40 min", objective: "Estimar consumo diário e compreender limites de sistemas fotovoltaicos pequenos.", sections: [
        { heading: "Consumo", body: "Energia diária aproximada em Wh = potência em W × horas de uso. Some os equipamentos e considere perdas do sistema. Exemplo: uma lâmpada de 10 W por 5 horas consome 50 Wh por dia." },
        { heading: "Geração", body: "A geração depende da potência do painel, irradiação solar local, orientação, sombra, temperatura e perdas. Não dimensione apenas pela potência nominal anunciada." },
        { heading: "Baterias e proteção", body: "Baterias exigem compatibilidade química, tensão, corrente, BMS quando aplicável, fusíveis e instalação conforme fabricante. Sistemas conectados à rede e instalações permanentes devem ser projetados e executados por profissionais habilitados." }
      ], actions: ["Calcule o consumo diário de três aparelhos usando potência × horas.", "Converta Wh para kWh dividindo por 1.000.", "Pesquise dados oficiais de irradiação para a localidade do projeto.", "Liste perdas e proteções que precisam ser consideradas por um projetista."], safety: "Não monte bancos de baterias improvisados nem conecte inversores à rede. Sistemas fotovoltaicos e baterias de alta energia exigem projeto e instalação profissional." },
      { id: "eng-mech", title: "Mecânica, manutenção e diagnóstico", level: "Intermediário", time: "35 min", objective: "Entender sistemas mecânicos e aplicar diagnóstico baseado em evidências.", sections: [
        { heading: "Sistemas", body: "Máquinas transformam energia e transmitem movimento por eixos, engrenagens, correias, rolamentos e acoplamentos. Ruído, vibração, temperatura e folga podem indicar desgaste, desalinhamento ou lubrificação inadequada." },
        { heading: "Diagnóstico", body: "Registre condições de operação, histórico, frequência e mudança no sintoma. Compare com especificações do fabricante e não opere equipamento com proteção removida ou comportamento anormal." },
        { heading: "Veículos", body: "A manutenção de veículos deve seguir manual, intervalos e especificações. Freios, direção, suspensão, combustível e sistemas de alta tensão exigem profissionais e procedimentos adequados." }
      ], actions: ["Escolha uma máquina desligada e identifique entradas, saídas e transmissão de movimento.", "Registre ruídos ou vibrações sem remover proteções.", "Consulte o plano de manutenção do fabricante.", "Separe itens de inspeção visual do que exige oficina especializada."], safety: "Nunca faça manutenção em partes móveis, sistemas pressurizados, combustível ou veículo sustentado apenas por macaco. Use assistência qualificada." }
    ]
  }
];

// Extensão curricular aplicada: novos módulos aprofundam o ciclo observar → modelar → decidir → verificar.
const advancedFieldLessons: Record<TrackId, Lesson[]> = {
  survival: [
    { id: "surv-comms", title: "Comunicação familiar e continuidade", level: "Intermediário", time: "30 min", objective: "Desenhar um plano de comunicação redundante para falhas de internet e telefonia.", sections: [
      { heading: "Arquitetura de comunicação", body: "Um plano resiliente combina contatos memorizados, lista impressa, ponto de encontro e um contato de referência fora da área afetada. Combine horários de check-in e mensagens curtas para reduzir consumo de bateria e congestionamento." },
      { heading: "Informação confiável", body: "Priorize Defesa Civil, serviços públicos, concessionárias e canais oficiais. Registre data e hora das mensagens. Diferencie fato confirmado, relato não verificado e hipótese; não retransmita alertas sem origem." },
      { heading: "Privacidade e acessibilidade", body: "Considere pessoas que dependem de medicação, dispositivos, cuidadores, comunicação assistiva ou transporte especial. Compartilhe dados pessoais somente com contatos necessários e por canais adequados." }
    ], actions: ["Imprima contatos essenciais e endereços importantes.", "Defina um contato fora do município e dois pontos de encontro.", "Combine horários e formato de check-in.", "Teste um meio de receber alertas oficiais."], safety: "Não se aproxime de áreas isoladas, bloqueios ou operações de emergência para obter sinal ou informação." },
    { id: "surv-foodplan", title: "Planejamento alimentar e rotação de estoque", level: "Intermediário", time: "35 min", objective: "Organizar uma reserva alimentar compatível com consumo, validade e necessidades da casa.", sections: [
      { heading: "Consumo real", body: "Monte a reserva a partir de refeições que a família já consome. Considere restrições, alergias, crianças, idosos, animais, abridor manual, água para preparo e condições de armazenamento." },
      { heading: "Rotação", body: "Aplique primeiro que vence, primeiro que sai. Registre quantidade, validade e local. Evite comprar volumes que excedam a capacidade de armazenamento ou que não serão consumidos normalmente." },
      { heading: "Segurança alimentar", body: "Descarte alimentos com embalagem estufada, violada, sinais de contaminação ou exposição a enchente. Em falta de energia, siga orientações sanitárias para alimentos refrigerados; cheiro e aparência não garantem segurança." }
    ], actions: ["Liste sete refeições simples e habituais.", "Registre validade e quantidade dos itens de reserva.", "Separe alimentos especiais e para animais.", "Crie um ciclo mensal de conferência."], safety: "Não consuma alimentos expostos à água de enchente ou armazenados fora das condições seguras. Siga orientações da vigilância sanitária." },
    { id: "surv-climate", title: "Leitura de risco climático e evacuação", level: "Avançado", time: "40 min", objective: "Interpretar alertas, vulnerabilidades locais e gatilhos de decisão sem improvisar rotas perigosas.", sections: [
      { heading: "Risco territorial", body: "Mapeie encostas, cursos d'água, áreas baixas, árvores vulneráveis, drenagem e acessos. O risco resulta da combinação entre perigo, exposição e vulnerabilidade; a mesma chuva pode produzir impactos muito diferentes em bairros distintos." },
      { heading: "Gatilhos de decisão", body: "Defina antecipadamente quais alertas oficiais exigem preparar saída e quais exigem evacuação. Considere tempo para pessoas com mobilidade reduzida, animais e transporte. Não espere confirmação visual quando a autoridade ordenar evacuação." },
      { heading: "Depois do evento", body: "Não retorne até liberação oficial. Evite fios caídos, água parada, estruturas danificadas e locais com cheiro de gás. Registre danos de local seguro e acione os serviços competentes." }
    ], actions: ["Consulte mapas e alertas oficiais da região.", "Identifique rotas seguras indicadas pelas autoridades.", "Defina gatilhos familiares de preparação e saída.", "Inclua necessidades de acessibilidade e animais."], safety: "Nunca atravesse água corrente ou via alagada. Não entre em imóvel com dano estrutural, risco elétrico ou suspeita de gás." }
  ],
  home: [
    { id: "home-water", title: "Diagnóstico visual de umidade e infiltração", level: "Intermediário", time: "35 min", objective: "Documentar padrões de umidade sem intervenções invasivas ou contato com instalações perigosas.", sections: [
      { heading: "Padrão e contexto", body: "Registre localização, dimensão aproximada, evolução, clima, uso de água e relação com paredes externas, cobertura e áreas molhadas. Fotografias datadas e observações repetidas ajudam a separar coincidência de padrão." },
      { heading: "Hipóteses", body: "Condensação, entrada de chuva, falha de vedação e vazamento podem produzir sinais parecidos. Uma mancha isolada não identifica a causa. Compare ambientes e momentos sem remover revestimentos." },
      { heading: "Encaminhamento", body: "Se houver água perto de tomadas, cheiro de mofo intenso, dano estrutural, teto abaulado ou progressão rápida, afaste pessoas e procure avaliação qualificada." }
    ], actions: ["Fotografe a área de um ponto seguro com data.", "Registre chuva, uso e evolução do sintoma.", "Não perfure nem abra paredes para investigar.", "Solicite avaliação profissional quando houver risco ou persistência."], safety: "Não toque em tomadas molhadas, não suba em telhados e não remova revestimentos em áreas com suspeita de instalação elétrica ou estrutural." },
    { id: "home-maint", title: "Plano preventivo de manutenção residencial", level: "Intermediário", time: "30 min", objective: "Criar calendário de inspeções visuais e registros de manutenção baseados em fabricante e normas aplicáveis.", sections: [
      { heading: "Inventário", body: "Liste equipamentos, sistemas, fabricante, modelo, data de instalação, garantias e manuais. Guarde notas fiscais e contatos de assistência em local protegido." },
      { heading: "Periodicidade", body: "Use intervalos do fabricante e recomendações técnicas. Inspeções visuais simples podem identificar sinais precoces, mas não autorizam desmontagem, ajuste de gás, intervenção elétrica ou acesso a altura." },
      { heading: "Histórico", body: "Registre data, sintoma, profissional, serviço realizado, peça e próxima revisão. Um histórico consistente reduz diagnóstico repetido e facilita decisões de custo." }
    ], actions: ["Crie inventário dos principais equipamentos.", "Localize manuais e garantias.", "Registre data da última manutenção profissional.", "Agende revisão conforme manual e necessidade."], safety: "Instalações elétricas fixas, gás, telhados, estruturas, refrigeração e sistemas pressurizados devem ser avaliados por profissionais habilitados." },
    { id: "home-tools", title: "Ferramentas, medição e limites de competência", level: "Avançado", time: "40 min", objective: "Selecionar ferramentas de observação e reconhecer quando a medição exige instrumento ou profissional especializado.", sections: [
      { heading: "Ferramenta adequada", body: "Trena, nível, lanterna e câmera podem apoiar inspeções não invasivas. A ferramenta deve corresponder à pergunta: medir comprimento não revela integridade estrutural; observar temperatura não comprova ausência de falha elétrica." },
      { heading: "Qualidade da medição", body: "Registre unidade, instrumento, faixa, resolução, condições e repetição. Compare com especificações do fabricante e não trate leituras aproximadas como laudo." },
      { heading: "Decisão", body: "Quando o resultado pode afetar segurança, garantia ou conformidade, encaminhe para profissional qualificado. O objetivo do diagnóstico leigo é comunicar melhor o problema, não substituir a perícia." }
    ], actions: ["Monte uma lista de ferramentas de inspeção não invasiva.", "Anote faixa e resolução dos instrumentos disponíveis.", "Pratique registrar três medições repetidas de um objeto simples.", "Defina sinais que exigem interromper a inspeção e chamar especialista."], safety: "Não use multímetro em rede elétrica, não abra equipamentos e não faça medições em circuitos energizados sem formação e procedimentos apropriados." }
  ],
  engineering: [
    { id: "eng-data", title: "Aquisição de dados e validação de sensores", level: "Intermediário", time: "40 min", objective: "Avaliar qualidade de leituras por repetição, faixa, referência e tratamento de dados ausentes.", sections: [
      { heading: "Plano de medição", body: "Defina variável, unidade, faixa esperada, frequência, ambiente e critério de aceitação antes de coletar dados. Registre também condições de teste e versão do hardware e firmware." },
      { heading: "Validação", body: "Compare com uma referência conhecida, repita medições e observe desvio, ruído, saturação e valores impossíveis. Não descarte dados anômalos sem registrar o motivo." },
      { heading: "Falhas previsíveis", body: "Considere sensor desconectado, alimentação instável, erro de conversão, calibração, interferência e falha de comunicação. O sistema deve indicar estado inválido em vez de apresentar uma leitura falsa como normal." }
    ], actions: ["Defina unidade e faixa plausível para um sensor.", "Registre dez leituras em condições semelhantes.", "Calcule média e amplitude manualmente.", "Especifique o comportamento em leitura inválida."], safety: "Use placas educacionais e fontes isoladas de baixa tensão. Não conecte protótipos a equipamentos médicos, veículos em uso ou sistemas críticos." },
    { id: "eng-prototype", title: "Ciclo de prototipagem e documentação", level: "Avançado", time: "45 min", objective: "Planejar um protótipo verificável com requisitos, riscos, testes e critérios de aceitação.", sections: [
      { heading: "Requisitos", body: "Transforme uma necessidade em requisitos mensuráveis. Separe função principal, limites, ambiente, custo, manutenção, acessibilidade e falhas previsíveis." },
      { heading: "Experimento", body: "Altere uma variável por vez quando possível, documente configuração e resultados e compare com critério definido antes do teste. Um protótipo que funciona uma vez não comprova confiabilidade." },
      { heading: "Iteração", body: "Registre hipótese, mudança, versão, resultado e decisão. Preserve versões que funcionaram e mantenha um caminho para retornar a uma configuração segura." }
    ], actions: ["Escreva três requisitos mensuráveis.", "Desenhe o fluxo de entradas, processamento e saídas.", "Defina três falhas e respostas seguras.", "Crie uma ficha de teste com critério de aprovação."], safety: "Não faça testes destrutivos, de alta energia, com pressão, combustíveis ou em sistemas reais sem projeto, proteção e supervisão profissional." },
    { id: "eng-energy-audit", title: "Auditoria de consumo e eficiência energética", level: "Avançado", time: "40 min", objective: "Estimar consumo com dados de placa e tempo de uso e comparar cenários de eficiência.", sections: [
      { heading: "Estimativa", body: "Energia aproximada em kWh = potência em watts × horas de uso ÷ 1.000. A potência nominal pode diferir do consumo real, especialmente em equipamentos com ciclos, motores e controle eletrônico." },
      { heading: "Comparação", body: "Compare hábitos, eficiência, tarifa e custo de aquisição. Separe economia estimada de economia medida e registre o período observado." },
      { heading: "Decisão", body: "Priorize mudanças de baixo risco e manutenção conforme fabricante. Instalações, dimensionamento de circuitos e intervenções em quadros devem ser feitas por profissionais habilitados." }
    ], actions: ["Liste cinco equipamentos e potência de placa.", "Estime horas diárias e consumo em kWh.", "Compare dois cenários de uso.", "Registre limitações da estimativa."], safety: "Não abra quadros, tomadas ou equipamentos para medir consumo. Use dados de placa, medidores certificados apropriados e orientação técnica." }
  ]
};
for (const track of tracks) track.lessons.push(...advancedFieldLessons[track.id]);

const modes = [
  { id: "world", title: "WORLD SIMULATOR", detail: "Cenários progressivos para praticar decisões e consequências." },
  { id: "72h", title: "SURVIVAL 72H", detail: "Planejamento de água, comunicação, abrigo e necessidades." },
  { id: "diagnostic", title: "DIAGNOSTIC", detail: "Investigue sintomas, separe evidências e escolha o próximo passo seguro." },
  { id: "crisis", title: "CRISIS COMMAND", detail: "Priorize ações sob pressão e com informação incompleta." },
  { id: "engineering", title: "ENGINEERING CHALLENGES", detail: "Resolva problemas de projeto com critérios mensuráveis." },
  { id: "transfer", title: "KNOWLEDGE TRANSFER", detail: "Aplique um princípio aprendido em um contexto diferente." }
] as const;

const scenarios = [
  { title: "Apagão durante uma onda de calor", prompt: "A energia caiu no bairro. A temperatura está elevada, há crianças em casa e a internet móvel oscila. Qual deve ser sua primeira decisão?", options: ["Ligar um gerador dentro da garagem para manter o ar-condicionado.", "Verificar riscos imediatos, hidratação, alertas oficiais e plano de comunicação.", "Abrir o quadro elétrico para tentar religar a rede."], correct: 1, why: "A primeira resposta reduz risco imediato, protege pessoas vulneráveis e mantém informação confiável. Combustão em ambientes fechados pode causar intoxicação fatal; quadros elétricos não são área para intervenção leiga." },
  { title: "Vazamento próximo a uma tomada", prompt: "Você encontra água escorrendo pela parede e a área está molhada perto de uma tomada. O que fazer?", options: ["Tocar na tomada para verificar se está quente.", "Evitar a área, impedir acesso e chamar assistência; só interromper energia se isso puder ser feito de local seco e seguro.", "Abrir a tomada para localizar a origem."], correct: 1, why: "Água e eletricidade formam uma combinação perigosa. Não toque em tomadas ou equipamentos molhados. Se houver risco, afaste-se e acione profissionais e serviços competentes." },
  { title: "Sensor com leituras instáveis", prompt: "Um protótipo de baixa tensão apresenta leituras de temperatura que saltam de forma incoerente. Qual é o melhor próximo passo?", options: ["Aumentar a alimentação até estabilizar.", "Registrar leituras, verificar conexões com o sistema desligado e comparar com referência conhecida.", "Conectar o protótipo a um equipamento de rede para testar em uso real."], correct: 1, why: "Diagnóstico começa por evidências e testes controlados. Aumentar tensão ou integrar a sistemas reais sem entender a falha pode danificar componentes e criar riscos." },
  { title: "Reserva de água para uma família", prompt: "Quatro pessoas planejam uma reserva de referência para três dias, considerando 4 litros por pessoa por dia para beber e preparo básico. Qual volume inicial resulta desse cálculo?", options: ["12 litros.", "24 litros.", "48 litros."], correct: 2, why: "4 pessoas × 3 dias × 4 litros = 48 litros. A estimativa deve ser ajustada ao clima, esforço, saúde e necessidades de higiene; não representa toda a água necessária." },
  { title: "Transferir um princípio de engenharia", prompt: "Você aprendeu a validar um sensor com medições repetidas. Como transferir esse princípio para investigar uma infiltração doméstica?", options: ["Concluir pela primeira mancha observada.", "Registrar localização, evolução e condições em datas diferentes antes de formular hipóteses.", "Quebrar a parede imediatamente para procurar o vazamento."], correct: 1, why: "A transferência mantém o princípio — coletar evidências repetíveis antes de concluir — e o adapta a outro domínio. A intervenção invasiva só deve ocorrer após avaliação apropriada." },
  { title: "Prioridade em uma evacuação", prompt: "A Defesa Civil emite ordem de evacuação para sua área devido a risco de inundação. O que deve orientar sua decisão?", options: ["Esperar a água chegar à rua para confirmar.", "Seguir a rota e as instruções oficiais, levando apenas itens essenciais se houver tempo seguro.", "Atravessar uma via alagada para encurtar o caminho."], correct: 1, why: "Ordens oficiais de evacuação devem ser seguidas. Não atravesse água corrente ou vias alagadas; priorize pessoas e animais e não retorne até liberação das autoridades." }
];

type ModeId = typeof modes[number]["id"];
const STORAGE = "atlas-practical-academy-v1";

export default function PracticalAcademy() {
  const [trackId, setTrackId] = useState<TrackId>("survival");
  const [lessonId, setLessonId] = useState<string>("surv-72");
  const [modeId, setModeId] = useState<ModeId>("world");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getAtlasStorageKey(STORAGE));
      if (raw) {
        const data = JSON.parse(raw) as { completed?: string[]; checklist?: string[] };
        setCompleted(Array.isArray(data.completed) ? data.completed : []);
        setChecklist(Array.isArray(data.checklist) ? data.checklist : []);
      }
    } catch { /* inicia em modo local vazio */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(getAtlasStorageKey(STORAGE), JSON.stringify({ completed, checklist })); }
      catch { /* mantém a sessão sem persistência se o navegador bloquear armazenamento */ }
    }
  }, [completed, checklist, loaded]);

  const track = tracks.find(item => item.id === trackId) ?? tracks[0];
  const lesson = track.lessons.find(item => item.id === lessonId) ?? track.lessons[0];
  const scenario = scenarios[scenarioIndex];
  const allActions = useMemo(() => tracks.flatMap(item => item.lessons.flatMap(lessonItem => lessonItem.actions.map((action, index) => ({ id: `${lessonItem.id}-${index}`, action, track: item.title })))), []);
  const doneCount = completed.length;
  function chooseTrack(id: TrackId) {
    const next = tracks.find(item => item.id === id)!;
    setTrackId(id); setLessonId(next.lessons[0].id);
  }
  function nextScenario() {
    setScenarioIndex(index => (index + 1) % scenarios.length);
    setChoice(null); setSubmitted(false);
  }

  return <section className="practical-academy page-section">
    <div className="practical-hero">
      <div><div className="eyebrow"><Compass size={14}/> ATLAS FIELD SYSTEMS · APRENDIZAGEM APLICADA</div><h1>Conhecimento que <em>funciona no mundo real.</em></h1><p>Prepare-se, diagnostique, construa e tome decisões melhores. Aprenda primeiro os princípios, pratique em cenários controlados e respeite os limites de segurança.</p></div>
      <div className="practical-stat"><ShieldCheck size={24}/><strong>{doneCount}/{tracks.reduce((sum, item) => sum + item.lessons.length, 0)}</strong><span>módulos concluídos</span></div>
    </div>

    <div className="practical-track-grid">
      {tracks.map(item => { const Icon = item.icon; return <button key={item.id} className={`practical-track ${trackId === item.id ? "selected" : ""} ${item.accent}`} onClick={() => chooseTrack(item.id)}><span className="practical-track-icon"><Icon size={22}/></span><strong>{item.title}</strong><small>{item.subtitle}</small><span className="practical-track-progress">{item.lessons.filter(l => completed.includes(l.id)).length} / {item.lessons.length} módulos <ChevronRight size={15}/></span></button>; })}
    </div>

    <div className="practical-content-grid">
      <aside className="practical-lesson-list"><div className="practical-section-label"><BookOpen size={15}/> TRILHA DE APRENDIZAGEM</div>{track.lessons.map((item, index) => <button key={item.id} className={`practical-lesson-link ${lesson.id === item.id ? "active" : ""}`} onClick={() => setLessonId(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><small>{item.level} · {item.time}</small></div>{completed.includes(item.id) && <CheckCircle2 size={16}/>}</button>)}</aside>
      <article className="practical-lesson">
        <div className="practical-lesson-meta"><span>{track.title}</span><span>{lesson.level} · {lesson.time}</span></div>
        <h2>{lesson.title}</h2><p className="practical-objective"><Target size={16}/>{lesson.objective}</p>
        {lesson.sections.map(section => <section className="practical-theory" key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}
        <div className="practical-actions"><h3><ClipboardList size={17}/> Atividade prática</h3>{lesson.actions.map((action, index) => { const id = `${lesson.id}-${index}`; return <label key={id} className="practical-check"><input type="checkbox" checked={checklist.includes(id)} onChange={e => setChecklist(old => e.target.checked ? [...old, id] : old.filter(value => value !== id))}/><span>{action}</span></label>; })}</div>
        <div className="practical-safety"><AlertTriangle size={18}/><div><strong>Limite de segurança</strong><p>{lesson.safety}</p></div></div>
        <button className="button button-dark practical-complete" onClick={() => setCompleted(old => old.includes(lesson.id) ? old.filter(id => id !== lesson.id) : [...old, lesson.id])}>{completed.includes(lesson.id) ? "Reabrir módulo" : "Marcar módulo estudado"} <CheckCircle2 size={16}/></button>
      </article>
    </div>

    <section className="practical-simulator">
      <div className="practical-sim-heading"><div><div className="eyebrow"><Activity size={14}/> SALA DE SIMULAÇÃO</div><h2>Treine decisões, não apenas respostas.</h2><p>Os cenários são educativos e não substituem treinamento presencial, profissionais ou orientações de emergência.</p></div><span className="practical-sim-count">{scenarioIndex + 1} / {scenarios.length}</span></div>
      <div className="practical-mode-grid">{modes.map(mode => <button key={mode.id} className={`practical-mode ${modeId === mode.id ? "active" : ""}`} onClick={() => { setModeId(mode.id); setScenarioIndex(modes.findIndex(item => item.id === mode.id)); setChoice(null); setSubmitted(false); }}><strong>{mode.title}</strong><small>{mode.detail}</small></button>)}</div>
      <div className="practical-scenario">
        <div className="practical-scenario-top"><span>{modes.find(m => m.id === modeId)?.title}</span><span>SIMULAÇÃO {String(scenarioIndex + 1).padStart(2, "0")}</span></div>
        <h3>{scenario.title}</h3><p>{scenario.prompt}</p>
        <div className="practical-options">{scenario.options.map((option, index) => <button key={option} disabled={submitted} className={`practical-option ${choice === index ? "chosen" : ""} ${submitted && index === scenario.correct ? "correct" : ""} ${submitted && choice === index && choice !== scenario.correct ? "incorrect" : ""}`} onClick={() => setChoice(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
        {submitted && <div className={`practical-feedback ${choice === scenario.correct ? "good" : "review"}`}><strong>{choice === scenario.correct ? "Boa decisão." : "Vamos revisar a prioridade."}</strong><p>{scenario.why}</p></div>}
        <div className="practical-scenario-actions"><button className="button button-outline" onClick={() => { setChoice(null); setSubmitted(false); }}><RotateCcw size={15}/> Reiniciar</button><button className="button button-dark" disabled={choice === null || submitted} onClick={() => setSubmitted(true)}>Analisar decisão <ChevronRight size={15}/></button><button className="button button-outline" onClick={nextScenario}>Próximo cenário <ChevronRight size={15}/></button></div>
      </div>
    </section>

    <FieldOperationsCenter/>

    <section className="practical-toolkit">
      <div><div className="eyebrow"><PackageCheck size={14}/> CHECKLIST DE AUTONOMIA</div><h2>Plano de preparação pessoal</h2><p>Marque tarefas concluídas. O progresso fica salvo neste navegador.</p></div>
      <div className="practical-toolkit-list">{allActions.slice(0, 12).map(item => <label key={item.id} className="practical-check"><input type="checkbox" checked={checklist.includes(item.id)} onChange={e => setChecklist(old => e.target.checked ? [...old, item.id] : old.filter(value => value !== item.id))}/><span><small>{item.track}</small>{item.action}</span></label>)}</div>
    </section>
  </section>;
}
