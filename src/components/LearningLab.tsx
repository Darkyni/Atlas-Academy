"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Brain, CheckCircle2, RotateCw, Scale, Sparkles } from "lucide-react";
import { flashcards } from "@/lib/resources";

const scenarioOptions = [
  { id: "facts", label: "Identificar os fatos e as provas", detail: "Correto. A análise começa pela reconstrução cuidadosa dos fatos relevantes, sem presumir o que ainda não foi demonstrado." },
  { id: "opinion", label: "Decidir com base apenas na opinião pessoal", detail: "Uma opinião pode iniciar uma hipótese, mas não substitui fatos, normas aplicáveis, interpretação justificada e procedimento adequado." },
  { id: "force", label: "Permitir que a parte mais forte imponha a solução", detail: "Isso substitui a solução institucional pela força privada e ignora os mecanismos jurídicos de resolução de conflitos." }
];

export default function LearningLab() {
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [scenarioChoice, setScenarioChoice] = useState<string | null>(null);
  const [showScenarioFeedback, setShowScenarioFeedback] = useState(false);
  const card = flashcards[cardIndex];
  const scenario = useMemo(() => scenarioOptions.find(option => option.id === scenarioChoice), [scenarioChoice]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("atlas-known-flashcards");
      if (saved) setKnown(JSON.parse(saved));
    } catch { /* armazenamento local indisponível */ }
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem("atlas-known-flashcards", JSON.stringify(known)); }
    catch { /* armazenamento local indisponível */ }
  }, [known]);

  function moveCard(direction: number) {
    setCardIndex(current => (current + direction + flashcards.length) % flashcards.length);
    setFlipped(false);
  }

  function markKnown() {
    setKnown(current => current.includes(cardIndex) ? current : [...current, cardIndex]);
    moveCard(1);
  }

  return <section className="page-section learning-lab">
    <div className="eyebrow">APRENDIZAGEM ATIVA</div>
    <h1>Laboratório de aprendizagem</h1>
    <p className="page-intro">Treine a recuperação de conceitos, teste seu raciocínio e aplique o que estudou em situações-problema.</p>

    <div className="lab-stats">
      <div><Brain size={18}/><strong>{flashcards.length}</strong><span>flashcards no conjunto</span></div>
      <div><CheckCircle2 size={18}/><strong>{known.length}</strong><span>conceitos que você já domina</span></div>
      <div><Sparkles size={18}/><strong>{Math.round(known.length / flashcards.length * 100)}%</strong><span>marcados como conhecidos</span></div>
    </div>

    <div className="lab-grid">
      <article className="lab-panel flashcard-panel">
        <div className="lab-panel-head"><div><div className="eyebrow">01 · RECUPERAÇÃO ATIVA</div><h2>Cartões de memória</h2></div><span className="lab-counter">{cardIndex + 1} / {flashcards.length}</span></div>
        <button className={`flashcard ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped(value => !value)} aria-label="Virar cartão">
          <span>{flipped ? "RESPOSTA" : "PERGUNTA"}</span>
          <strong>{flipped ? card.back : card.front}</strong>
          <small><RotateCw size={13}/> Clique para virar</small>
        </button>
        <div className="flashcard-actions">
          <button className="button button-outline" onClick={() => moveCard(-1)}>Anterior</button>
          <button className="button button-outline" onClick={() => moveCard(1)}>Próximo</button>
          <button className="button button-dark" onClick={markKnown} disabled={!flipped}>Sei responder <CheckCircle2 size={14}/></button>
        </div>
        <p className="lab-hint">Tente responder mentalmente antes de virar o cartão. Marque como conhecido somente quando conseguir explicar com suas próprias palavras.</p>
      </article>

      <article className="lab-panel case-panel">
        <div className="eyebrow">02 · RACIOCÍNIO APLICADO</div>
        <h2>Estudo de caso: conflito contratual</h2>
        <p>Uma pessoa afirma que pagou por um serviço, mas a outra parte nega ter recebido o valor. Existem mensagens, um comprovante bancário e versões divergentes. Antes de concluir quem tem razão, qual deve ser o primeiro passo de uma análise responsável?</p>
        <div className="scenario-options">{scenarioOptions.map(option => <button key={option.id} className={`scenario-option ${scenarioChoice === option.id ? "selected" : ""} ${showScenarioFeedback && option.id === "facts" ? "scenario-correct" : ""}`} onClick={() => { setScenarioChoice(option.id); setShowScenarioFeedback(false); }}><span>{option.id === "facts" ? "A" : option.id === "opinion" ? "B" : "C"}</span>{option.label}</button>)}</div>
        <button className="button button-dark" disabled={!scenarioChoice} onClick={() => setShowScenarioFeedback(true)}>Analisar minha escolha <ArrowRight size={14}/></button>
        {showScenarioFeedback && scenario && <div className={`scenario-feedback ${scenario.id === "facts" ? "good" : "needs-work"}`}><strong>{scenario.id === "facts" ? "Boa análise." : "Vamos ajustar o raciocínio."}</strong><p>{scenario.detail}</p><p><b>Próximo passo:</b> organizar a cronologia, verificar autenticidade e pertinência dos documentos, identificar obrigações e só então examinar as normas aplicáveis. O exemplo é educacional, não uma orientação para caso concreto.</p></div>}
      </article>
    </div>
    <div className="lab-reading-note"><Scale size={18}/><div><strong>Como usar o laboratório</strong><p>Faça uma tentativa sem consultar o material, confira a explicação e retorne à aula para preencher lacunas. O objetivo não é decorar frases, mas reconstruir o raciocínio.</p></div></div>
  </section>;
}
