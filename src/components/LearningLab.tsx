"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Brain, CheckCircle2, RotateCw, Sparkles, CalendarClock,
  NotebookPen, Layers, BookOpen, AlertCircle
} from "lucide-react";
import { studyCards, practiceScenarios } from "@/lib/atlas-study-data";

type Grade = "again" | "hard" | "good" | "easy";
type ReviewRecord = { dueAt: number; interval: number; repetitions: number; lapses: number; lastGrade: Grade };
type ReviewMap = Record<string, ReviewRecord>;
const STORAGE_KEY = "atlas-spaced-review-v1";
const NOTES_KEY = "atlas-study-notes-v1";
const departments = ["Todos", "Direito e instituições", "Economia e Finanças", "Tecnologia e Inteligência Artificial", "História e Geopolítica", "Filosofia e Pensamento Crítico", "Ciências e Matemática"];

export default function LearningLab() {
  const [department, setDepartment] = useState("Todos");
  const [reviewState, setReviewState] = useState<ReviewMap>({});
  const [reviewMode, setReviewMode] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [showScenarioFeedback, setShowScenarioFeedback] = useState(false);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setReviewState(JSON.parse(saved));
    } catch { /* armazenamento local indisponível */ }
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewState)); }
    catch { /* armazenamento local indisponível */ }
  }, [reviewState]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(NOTES_KEY) || "{}");
      setNote(saved[department] || "");
      setNoteSaved(false);
    } catch { setNote(""); }
  }, [department]);

  const departmentCards = useMemo(
    () => studyCards.filter(card => department === "Todos" || card.department === department),
    [department]
  );
  const dueCards = useMemo(
    () => departmentCards.filter(card => !reviewState[card.id] || reviewState[card.id].dueAt <= Date.now()),
    [departmentCards, reviewState]
  );
  const cardsToStudy = reviewMode ? dueCards : departmentCards;
  const card = cardsToStudy[Math.min(cardIndex, Math.max(0, cardsToStudy.length - 1))];
  const mastered = Object.keys(reviewState).filter(id => reviewState[id].repetitions >= 3).length;
  const scenarioDepartment = department === "Todos" ? "Direito e instituições" : department;
  const departmentScenarios = practiceScenarios.filter(item => item.department === scenarioDepartment);
  const scenario = departmentScenarios[scenarioIndex % Math.max(1, departmentScenarios.length)] || practiceScenarios[0];

  function changeDepartment(value: string) {
    setDepartment(value);
    setCardIndex(0);
    setFlipped(false);
    setScenarioChoice(null);
    setScenarioIndex(0);
    setShowScenarioFeedback(false);
  }

  function gradeCard(grade: Grade) {
    if (!card) return;
    const previous = reviewState[card.id];
    const repetitions = grade === "again" ? 0 : (previous?.repetitions || 0) + 1;
    const oldInterval = previous?.interval || 0;
    let interval = 1;
    if (grade === "again") interval = 1 / 96; // 15 minutos
    if (grade === "hard") interval = Math.max(1, Math.round((oldInterval || 1) * 1.2));
    if (grade === "good") interval = oldInterval === 0 ? 1 : Math.min(60, Math.round(oldInterval * 2.2));
    if (grade === "easy") interval = oldInterval === 0 ? 3 : Math.min(90, Math.round(oldInterval * 3.2));
    setReviewState(current => ({
      ...current,
      [card.id]: {
        dueAt: Date.now() + interval * 24 * 60 * 60 * 1000,
        interval, repetitions,
        lapses: (previous?.lapses || 0) + (grade === "again" ? 1 : 0),
        lastGrade: grade
      }
    }));
    setCardIndex(current => reviewMode ? 0 : Math.min(current + 1, Math.max(0, cardsToStudy.length - 1)));
    setFlipped(false);
  }

  function saveNote() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(NOTES_KEY) || "{}");
      saved[department] = note;
      window.localStorage.setItem(NOTES_KEY, JSON.stringify(saved));
      setNoteSaved(true);
    } catch { setNoteSaved(false); }
  }

  return <section className="page-section learning-lab">
    <div className="eyebrow">APRENDIZAGEM ATIVA · REVISÃO ADAPTATIVA</div>
    <h1>Laboratório de aprendizagem</h1>
    <p className="page-intro">Pratique a recuperação de memória, revise no momento adequado e teste sua capacidade de aplicar conceitos em situações reais.</p>

    <div className="lab-department-picker">
      <label htmlFor="lab-department">Área de estudo</label>
      <select id="lab-department" value={department} onChange={event => changeDepartment(event.target.value)}>
        {departments.map(item => <option key={item} value={item}>{item}</option>)}
      </select>
    </div>

    <div className="lab-stats">
      <div><Layers size={18}/><strong>{departmentCards.length}</strong><span>cartões nesta trilha</span></div>
      <div><CalendarClock size={18}/><strong>{dueCards.length}</strong><span>revisões pendentes</span></div>
      <div><CheckCircle2 size={18}/><strong>{mastered}</strong><span>cartões consolidados</span></div>
    </div>

    <div className="lab-grid">
      <article className="lab-panel flashcard-panel">
        <div className="lab-panel-head">
          <div><div className="eyebrow">01 · RECUPERAÇÃO ATIVA</div><h2>Revisão espaçada</h2></div>
          <span className="lab-counter">{reviewMode ? "REVISAR" : "EXPLORAR"}</span>
        </div>
        <div className="review-mode-switch">
          <button className={reviewMode ? "active" : ""} onClick={() => {setReviewMode(true);setCardIndex(0);setFlipped(false);}}>Revisões pendentes</button>
          <button className={!reviewMode ? "active" : ""} onClick={() => {setReviewMode(false);setCardIndex(0);setFlipped(false);}}>Todos os cartões</button>
        </div>
        {card ? <>
          <div className="flashcard-progress"><span style={{width:`${Math.min(100,((cardIndex+1)/Math.max(1,cardsToStudy.length))*100)}%`}}/></div>
          <button className={`flashcard ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped(value => !value)} aria-label="Virar cartão">
            <span>{flipped ? "RESPOSTA" : "PERGUNTA"}</span>
            <strong>{flipped ? card.back : card.front}</strong>
            <small><RotateCw size={13}/> Clique para virar</small>
          </button>
          <div className="flashcard-meta"><span>{card.department}</span><span>{cardIndex + 1} de {cardsToStudy.length}</span></div>
          {flipped ? <div className="review-grades">
            <p>Como foi recuperar a resposta sem consultar?</p>
            <div>
              <button className="grade-again" onClick={() => gradeCard("again")}>Não lembrei</button>
              <button className="grade-hard" onClick={() => gradeCard("hard")}>Difícil</button>
              <button className="grade-good" onClick={() => gradeCard("good")}>Lembrei</button>
              <button className="grade-easy" onClick={() => gradeCard("easy")}>Fácil</button>
            </div>
          </div> : <p className="lab-hint">Tente formular a resposta antes de virar. Depois avalie honestamente o esforço de recuperação.</p>}
        </> : <div className="review-empty"><CheckCircle2 size={25}/><strong>Nenhuma revisão pendente nesta área.</strong><span>Você concluiu a fila por enquanto. Volte mais tarde ou explore todos os cartões.</span><button className="button button-outline" onClick={() => setReviewMode(false)}>Explorar cartões</button></div>}
        <p className="lab-hint">O intervalo é ajustado conforme sua resposta: erros voltam mais cedo; respostas fáceis recebem intervalos maiores. Os registros ficam salvos neste navegador.</p>
      </article>

      <article className="lab-panel case-panel">
        <div className="eyebrow">02 · RACIOCÍNIO APLICADO</div>
        <h2>{scenario.title}</h2>
        <p>{scenario.prompt}</p>
        <div className="scenario-options">{scenario.options.map((option,index) => <button key={option.label} className={`scenario-option ${scenarioChoice === index ? "selected" : ""} ${showScenarioFeedback && option.correct ? "scenario-correct" : ""}`} onClick={() => {setScenarioChoice(index);setShowScenarioFeedback(false);}}><span>{String.fromCharCode(65+index)}</span>{option.label}</button>)}</div>
        <button className="button button-dark" disabled={scenarioChoice === null} onClick={() => setShowScenarioFeedback(true)}>Analisar minha escolha <ArrowRight size={14}/></button>
        {showScenarioFeedback && scenarioChoice !== null && <div className={`scenario-feedback ${scenario.options[scenarioChoice].correct ? "good" : "needs-work"}`}><strong>{scenario.options[scenarioChoice].correct ? "Boa análise." : "Vamos aprofundar o raciocínio."}</strong><p>{scenario.options[scenarioChoice].feedback}</p><p><b>Conceito central:</b> {scenario.takeaway}</p></div>}
        <div className="scenario-switch"><span>Pratique outro cenário nesta área ou escolha um departamento.</span><select value={scenario.department} onChange={event => changeDepartment(event.target.value)}>{departments.filter(item => item !== "Todos").map(item => <option key={item} value={item}>{item}</option>)}</select><button className="button button-outline" onClick={() => {setScenarioIndex(value => value + 1);setScenarioChoice(null);setShowScenarioFeedback(false);}}>Novo desafio <ArrowRight size={13}/></button></div>
      </article>
    </div>

    <article className="lab-panel study-notes-panel">
      <div className="lab-panel-head"><div><div className="eyebrow">03 · ELABORAÇÃO</div><h2>Caderno de reflexão</h2></div><NotebookPen size={20}/></div>
      <p>Registre uma explicação com suas próprias palavras, uma dúvida ou uma conexão entre áreas. Escrever ajuda a perceber o que ainda não está claro.</p>
      <textarea value={note} onChange={event => {setNote(event.target.value);setNoteSaved(false);}} rows={4} placeholder="O que aprendi? O que ainda não compreendi? Como esse conceito se conecta com outra área?"/>
      <div className="study-note-actions"><span>{noteSaved ? "Anotação salva neste navegador." : "Anotações organizadas por departamento."}</span><button className="button button-dark" onClick={saveNote}>Salvar reflexão <BookOpen size={14}/></button></div>
    </article>

    <div className="lab-reading-note"><Brain size={18}/><div><strong>O método por trás do laboratório</strong><p>O ATLAS combina recuperação ativa, prática distribuída, feedback e elaboração. Não basta reler: tente recuperar a ideia, explique com suas palavras, confira e retorne ao tema em intervalos progressivos.</p></div></div>
  </section>;
}
