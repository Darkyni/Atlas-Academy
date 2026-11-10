"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Brain, CheckCircle2, RotateCw, Sparkles, CalendarClock,
  NotebookPen, Layers, BookOpen, AlertCircle, Gamepad2, ClipboardCheck, Trophy
} from "lucide-react";
import { studyCards, practiceScenarios } from "@/lib/atlas-study-data";
import LearningArcade from "@/components/LearningArcade";
import { loadStudentRecords, loadStudentRecordsForUser, saveStudentRecord, saveStudentRecordForUser, subscribeToStudentAuth } from "@/lib/student-records";

type Grade = "again" | "hard" | "good" | "easy";
type ReviewRecord = { dueAt: number; interval: number; repetitions: number; lapses: number; lastGrade: Grade };
type ReviewMap = Record<string, ReviewRecord>;
const STORAGE_KEY = "atlas-spaced-review-v1";
const NOTES_KEY = "atlas-study-notes-v1";
const TEST_HISTORY_KEY = "atlas-dynamic-test-history-v1";
type TestAttempt = { department: string; score: number; total: number; completedAt: string };
const departments = ["Todos", "Direito e instituições", "Economia e Finanças", "Tecnologia e Inteligência Artificial", "História e Geopolítica", "Filosofia e Pensamento Crítico", "Ciências e Matemática"];
function mergeTestHistory(...groups: TestAttempt[][]): TestAttempt[] {
  const unique = new Map<string, TestAttempt>();
  for (const attempt of groups.flat()) unique.set(`${attempt.department}-${attempt.completedAt}`, attempt);
  return [...unique.values()].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 10);
}

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
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [lastTestSummary, setLastTestSummary] = useState<string>("");
  const [testHistory, setTestHistory] = useState<TestAttempt[]>([]);
  const [activeTool, setActiveTool] = useState<"review" | "test" | "games">("review");
  const [testIndex, setTestIndex] = useState(0);
  const [testChoice, setTestChoice] = useState<number | null>(null);
  const [testAnswers, setTestAnswers] = useState<Array<{ id: string; correct: boolean }>>([]);
  const [testFinished, setTestFinished] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{ correct: boolean; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      let local: ReviewMap = {};
      let localNotes: Record<string, string> = {};
      let localTests: TestAttempt[] = [];
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) local = JSON.parse(saved);
        const notes = window.localStorage.getItem(NOTES_KEY);
        if (notes) localNotes = JSON.parse(notes);
        const tests = window.localStorage.getItem(TEST_HISTORY_KEY);
        if (tests) localTests = JSON.parse(tests);
      } catch { /* armazenamento local indisponível */ }
      const [cloudReviews, cloudNotes, cloudTests] = await Promise.all([
        loadStudentRecords<ReviewRecord>("flashcard_review"),
        loadStudentRecords<{ text: string }>("study_note"),
        loadStudentRecords<TestAttempt>("dynamic_test")
      ]);
      const mergedReviews = { ...cloudReviews, ...local };
      const mergedNotes = { ...Object.fromEntries(Object.entries(cloudNotes).map(([key, value]) => [key, value.text || ""])), ...localNotes };
      const mergedTests = mergeTestHistory(localTests, Object.values(cloudTests));
      if (!cancelled) {
        setReviewState(mergedReviews);
        setNotesMap(mergedNotes);
        setTestHistory(mergedTests);
        setNotesLoaded(true);
      }
      for (const [id, record] of Object.entries(local)) void saveStudentRecord("flashcard_review", id, record);
      for (const [departmentName, text] of Object.entries(localNotes)) void saveStudentRecord("study_note", departmentName, { text, updatedAt: new Date().toISOString() });
      for (const attempt of localTests) void saveStudentRecord("dynamic_test", `${attempt.department}-${attempt.completedAt}`, attempt);
    }
    void hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => subscribeToStudentAuth(userId => {
    let localReviews: ReviewMap = {};
    let localNotes: Record<string, string> = {};
    try {
      localReviews = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      localNotes = JSON.parse(window.localStorage.getItem(NOTES_KEY) || "{}");
    } catch { /* armazenamento local indisponível */ }
    void Promise.all([
      loadStudentRecordsForUser<ReviewRecord>("flashcard_review", userId),
      loadStudentRecordsForUser<{ text: string }>("study_note", userId),
      loadStudentRecordsForUser<TestAttempt>("dynamic_test", userId)
    ]).then(([cloudReviews, cloudNotes, cloudTests]) => {
      setReviewState({ ...cloudReviews, ...localReviews });
      const cloudNoteMap = Object.fromEntries(Object.entries(cloudNotes).map(([key, value]) => [key, value.text || ""]));
      setNotesMap({ ...cloudNoteMap, ...localNotes });
      let localTests: TestAttempt[] = [];
      try { localTests = JSON.parse(window.localStorage.getItem(TEST_HISTORY_KEY) || "[]"); }
      catch { /* histórico local indisponível */ }
      setTestHistory(mergeTestHistory(localTests, Object.values(cloudTests)));
      setNotesLoaded(true);
      for (const [id, record] of Object.entries(localReviews)) void saveStudentRecordForUser("flashcard_review", id, record, userId);
      for (const [key, text] of Object.entries(localNotes)) void saveStudentRecordForUser("study_note", key, { text, updatedAt: new Date().toISOString() }, userId);
      for (const attempt of localTests) void saveStudentRecordForUser("dynamic_test", `${attempt.department}-${attempt.completedAt}`, attempt, userId);
    });
  }), []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewState)); }
    catch { /* armazenamento local indisponível */ }
  }, [reviewState]);

  useEffect(() => {
    if (!notesLoaded) return;
    setNote(notesMap[department] || "");
    setNoteSaved(false);
  }, [department, notesMap, notesLoaded]);

  useEffect(() => {
    if (!notesLoaded) return;
    try { window.localStorage.setItem(NOTES_KEY, JSON.stringify(notesMap)); }
    catch { /* armazenamento local indisponível */ }
  }, [notesMap, notesLoaded]);

  useEffect(() => {
    try { window.localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(testHistory.slice(0, 10))); }
    catch { /* armazenamento local indisponível */ }
  }, [testHistory]);

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
  const testQuestions = useMemo(() => practiceScenarios.filter(item => department === "Todos" || item.department === department).slice(0, 6), [department]);
  const currentTestQuestion = testQuestions[testIndex];

  function changeDepartment(value: string) {
    setDepartment(value);
    setCardIndex(0);
    setFlipped(false);
    setScenarioChoice(null);
    setScenarioIndex(0);
    setShowScenarioFeedback(false);
    setTestIndex(0); setTestChoice(null); setTestAnswers([]); setTestFinished(false); setTestFeedback(null); setLastTestSummary("");
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
    const nextRecord: ReviewRecord = {
      dueAt: Date.now() + interval * 24 * 60 * 60 * 1000,
      interval, repetitions,
      lapses: (previous?.lapses || 0) + (grade === "again" ? 1 : 0),
      lastGrade: grade
    };
    setReviewState(current => ({ ...current, [card.id]: nextRecord }));
    void saveStudentRecord("flashcard_review", card.id, nextRecord);
    setCardIndex(current => reviewMode ? 0 : Math.min(current + 1, Math.max(0, cardsToStudy.length - 1)));
    setFlipped(false);
  }

  function saveNote() {
    setNotesMap(current => ({ ...current, [department]: note }));
    void saveStudentRecord("study_note", department, { text: note, updatedAt: new Date().toISOString() });
    setNoteSaved(true);
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

    <div className="lab-mode-tabs" role="tablist" aria-label="Ferramentas do laboratório">
      <button type="button" role="tab" aria-selected={activeTool === "review"} className={activeTool === "review" ? "active" : ""} onClick={() => setActiveTool("review")}><Brain size={16}/> Revisão e casos</button>
      <button type="button" role="tab" aria-selected={activeTool === "test"} className={activeTool === "test" ? "active" : ""} onClick={() => setActiveTool("test")}><ClipboardCheck size={16}/> Testes dinâmicos</button>
      <button type="button" role="tab" aria-selected={activeTool === "games"} className={activeTool === "games" ? "active" : ""} onClick={() => setActiveTool("games")}><Gamepad2 size={16}/> Jogos e simulações</button>
    </div>

    {activeTool === "games" && <div className="lab-games-embed"><LearningArcade initialDepartment={department} /></div>}

    {activeTool === "test" && <article className="lab-panel dynamic-test-panel">
      <div className="lab-panel-head"><div><div className="eyebrow">04 · AVALIAÇÃO FORMATIVA</div><h2>Teste dinâmico por disciplina</h2></div><ClipboardCheck size={22}/></div>
      <p>Responda a uma sequência de questões contextualizadas. Ao final, veja seu resultado e revise os pontos que precisam de atenção.</p>
      {!testFinished && currentTestQuestion ? <>
        <div className="dynamic-test-progress"><span>QUESTÃO {testIndex + 1} DE {testQuestions.length}</span><div><i style={{ width: `${((testIndex + 1) / testQuestions.length) * 100}%` }}/></div></div>
        <div className="dynamic-test-topic">{currentTestQuestion.department} · {currentTestQuestion.title}</div>
        <h3>{currentTestQuestion.prompt}</h3>
        <div className="scenario-options">{currentTestQuestion.options.map((option, index) => <button key={option.label} disabled={Boolean(testFeedback)} className={`scenario-option ${testChoice === index ? "selected" : ""} ${testFeedback && option.correct ? "scenario-correct" : ""}`} onClick={() => setTestChoice(index)}><span>{String.fromCharCode(65 + index)}</span>{option.label}</button>)}</div>
        {testFeedback && <div className={`scenario-feedback ${testFeedback.correct ? "good" : "needs-work"}`}><strong>{testFeedback.correct ? "Resposta correta." : "Vamos revisar."}</strong><p>{testFeedback.text}</p></div>}
        {!testFeedback ? <button className="button button-dark" disabled={testChoice === null} onClick={() => { const picked = currentTestQuestion.options[testChoice!]; setTestAnswers(old => [...old, { id: currentTestQuestion.id, correct: picked.correct }]); setTestFeedback({ correct: picked.correct, text: picked.feedback }); }}>Confirmar resposta <ArrowRight size={14}/></button> : <button className="button button-dark" onClick={() => { if (testIndex + 1 >= testQuestions.length) { setTestFinished(true); const correctCount = testAnswers.filter(item => item.correct).length; const completedAt = new Date().toISOString(); const summary = `${correctCount}/${testAnswers.length} respostas corretas`; const attempt: TestAttempt = { department, score: correctCount, total: testAnswers.length, completedAt }; setLastTestSummary(summary); setTestHistory(old => [attempt, ...old].slice(0, 10)); void saveStudentRecord("dynamic_test", `${department}-${completedAt}`, attempt); } else setTestIndex(old => old + 1); setTestChoice(null); setTestFeedback(null); }}> {testIndex + 1 >= testQuestions.length ? "Ver resultado" : "Próxima questão"} <ArrowRight size={14}/></button>}
      </> : testFinished ? <div className="dynamic-test-result"><Trophy size={30}/><strong>{testAnswers.filter(item => item.correct).length} de {testAnswers.length} respostas corretas</strong><span>{Math.round((testAnswers.filter(item => item.correct).length / Math.max(1, testAnswers.length)) * 100)}% de aproveitamento · {department}</span><p>Use o resultado como diagnóstico: retorne às aulas e aos cartões dos temas em que teve dificuldade. {lastTestSummary && `Resultado desta tentativa: ${lastTestSummary}.`}</p><button className="button button-dark" onClick={() => { setTestIndex(0); setTestChoice(null); setTestAnswers([]); setTestFinished(false); setTestFeedback(null); }}>Refazer teste</button>{testHistory.length > 0 && <div className="lab-test-history"><strong>Histórico recente</strong>{testHistory.slice(0, 4).map((attempt, index) => <span key={`${attempt.completedAt}-${index}`}>{attempt.department}: {attempt.score}/{attempt.total} · {new Date(attempt.completedAt).toLocaleDateString("pt-BR")}</span>)}</div>}</div> : <div className="review-empty"><strong>Não há questões cadastradas para esta seleção.</strong><span>Escolha outra disciplina para continuar.</span></div>}
    </article>}

    {activeTool === "review" && <>
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
        <p className="lab-hint">O intervalo é ajustado conforme sua resposta: erros voltam mais cedo; respostas fáceis recebem intervalos maiores. Os registros ficam salvos neste navegador e, com login e a migration 005, são sincronizados na sua conta.</p>
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
      <div className="study-note-actions"><span>{noteSaved ? "Anotação salva neste navegador e sincronizada quando há conta e banco configurados." : "Anotações organizadas por departamento."}</span><button className="button button-dark" onClick={saveNote}>Salvar reflexão <BookOpen size={14}/></button></div>
    </article>

    <div className="lab-reading-note"><Brain size={18}/><div><strong>O método por trás do laboratório</strong><p>O ATLAS combina recuperação ativa, prática distribuída, feedback e elaboração. Não basta reler: tente recuperar a ideia, explique com suas palavras, confira e retorne ao tema em intervalos progressivos.</p></div></div>
    </>}
  </section>;
}
