"use client";

import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, CheckCircle2, CircleHelp, Loader2, RefreshCw, Save, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Dimension = "explain" | "relate" | "question" | "apply" | "transfer";
type Responses = Record<Dimension, string>;
type Evaluation = {
  scores: Record<Dimension, number>;
  evidence: Record<Dimension, string>;
  gaps: Record<Dimension, string>;
  next_steps: string[];
  overall: string;
};
type Props = { courseId: string; courseTitle: string; lessonId: string; lessonTitle: string; objective: string; caseStudy: string; lessonContext: string; reflection: string };
type AttemptSummary = { evaluatedAt: string; average: number; scores: Record<Dimension, number> };

const dimensions: { id: Dimension; title: string; question: string; hint: string }[] = [
  { id: "explain", title: "Explicar", question: "Explique a ideia central desta aula com suas próprias palavras, como se estivesse ensinando alguém que nunca estudou o assunto.", hint: "Defina o conceito, explique como funciona e dê um exemplo." },
  { id: "relate", title: "Relacionar", question: "Relacione o tema desta aula a outro conceito, acontecimento ou área do conhecimento. Explique por que a conexão faz sentido.", hint: "Não basta citar dois assuntos: mostre a relação entre eles." },
  { id: "question", title: "Questionar", question: "Que pressuposto, limite, controvérsia ou contra-argumento merece ser considerado ao estudar este tema?", hint: "Apresente uma dúvida relevante e indique que evidência ajudaria a investigá-la." },
  { id: "apply", title: "Aplicar", question: "Use o que aprendeu para analisar ou resolver o estudo de caso apresentado nesta aula.", hint: "Mostre as etapas do raciocínio e justifique sua conclusão." },
  { id: "transfer", title: "Transferir", question: "Imagine uma situação diferente daquela estudada. Como você adaptaria o conhecimento desta aula para esse novo contexto?", hint: "Explique o que permanece válido e o que precisaria ser adaptado." }
];
const labels: Record<number, string> = { 0: "Não demonstrado", 1: "Inicial", 2: "Adequado", 3: "Avançado" };
const empty: Responses = { explain: "", relate: "", question: "", apply: "", transfer: "" };

export default function MasteryAssessment(props: Props) {
  const storageKey = `atlas-mastery-${props.lessonId}`;
  const [responses, setResponses] = useState<Responses>(empty);
  const [confidence, setConfidence] = useState(2);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evaluatedAt, setEvaluatedAt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<AttemptSummary[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setResponses({ ...empty, ...(parsed.responses || {}) });
        setConfidence(Number.isInteger(parsed.confidence) ? parsed.confidence : 2);
        setEvaluation(parsed.evaluation || null);
        setEvaluatedAt(parsed.evaluatedAt || null);
        setHistory(Array.isArray(parsed.history) ? parsed.history.slice(0, 10) : []);
      } else {
        setResponses(empty); setConfidence(2); setEvaluation(null); setEvaluatedAt(null); setHistory([]);
      }
    } catch { setResponses(empty); setConfidence(2); setEvaluation(null); setEvaluatedAt(null); setHistory([]); }
    setMessage(""); setSaved(false);
  }, [storageKey]);

  useEffect(() => {
    let active = true;
    async function loadCloudHistory() {
      if (!supabase) return;
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) return;
        const { data, error } = await supabase.from("mastery_assessments")
          .select("evaluation,evaluated_at").eq("user_id", auth.user.id).eq("lesson_id", props.lessonId)
          .order("evaluated_at", { ascending: false }).limit(10);
        if (error || !data || !active) return;
        const cloudHistory: AttemptSummary[] = data.flatMap((row) => {
          const result = row.evaluation as Evaluation | null;
          if (!result?.scores) return [];
          const values = Object.values(result.scores);
          if (values.length !== 5 || values.some(value => !Number.isInteger(value) || value < 0 || value > 3)) return [];
          return [{ evaluatedAt: row.evaluated_at, average: Number((values.reduce((sum, value) => sum + value, 0) / 5).toFixed(1)), scores: result.scores }];
        });
        if (cloudHistory.length) setHistory(current => {
          const merged = [...cloudHistory, ...current].filter((item, index, list) => list.findIndex(other => other.evaluatedAt === item.evaluatedAt) === index)
            .sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime()).slice(0, 10);
          return merged;
        });
      } catch { /* histórico local continua disponível */ }
    }
    void loadCloudHistory();
    return () => { active = false; };
  }, [props.lessonId]);

  const completed = useMemo(() => dimensions.filter(item => responses[item.id].trim().length >= 40).length, [responses]);
  const average = evaluation ? Number((Object.values(evaluation.scores).reduce<number>((sum, score) => sum + Number(score), 0) / 5).toFixed(1)) : null;

  async function evaluate() {
    if (completed !== 5) { setMessage("Responda às cinco dimensões com pelo menos 40 caracteres em cada campo."); return; }
    setBusy(true); setMessage(""); setSaved(false);
    try { localStorage.setItem(storageKey, JSON.stringify({ responses, confidence, evaluation: null, evaluatedAt: null, history })); } catch { /* mantém as respostas na tela mesmo sem armazenamento */ }
    try {
      const response = await fetch("/api/mastery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ course: props.courseTitle, lesson: props.lessonTitle, objective: props.objective, context: props.lessonContext, responses }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível avaliar suas respostas.");
      const nextEvaluation = data.evaluation as Evaluation;
      const nextDate = data.evaluatedAt as string;
      const nextAverage = Number((Object.values(nextEvaluation.scores).reduce((sum, score) => sum + score, 0) / 5).toFixed(1));
      const nextHistory = [{ evaluatedAt: nextDate, average: nextAverage, scores: nextEvaluation.scores }, ...history].slice(0, 10);
      setEvaluation(nextEvaluation); setEvaluatedAt(nextDate); setHistory(nextHistory);
      try { localStorage.setItem(storageKey, JSON.stringify({ responses, confidence, evaluation: nextEvaluation, evaluatedAt: nextDate, history: nextHistory })); setSaved(true); } catch { /* a avaliação continua visível na sessão */ }
      if (supabase) {
        try {
          const { data: auth } = await supabase.auth.getUser();
          if (auth.user) {
            const { error } = await supabase.from("mastery_assessments").insert({ user_id: auth.user.id, course_id: props.courseId, lesson_id: props.lessonId, responses, confidence, evaluation: nextEvaluation, evaluated_at: nextDate });
            if (error) setMessage("Avaliação concluída. O salvamento na nuvem não foi confirmado; a cópia local foi mantida. Verifique se a migration 004 foi aplicada.");
          } else setMessage("Avaliação concluída e salva neste navegador. Entre na sua conta para associar tentativas ao seu perfil.");
        } catch { setMessage("Avaliação concluída e salva localmente, mas a sincronização com o Supabase falhou."); }
      } else setMessage("Avaliação concluída e salva neste navegador. A sincronização em nuvem depende do Supabase configurado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao avaliar.");
    } finally { setBusy(false); }
  }

  function saveDraft() {
    setEvaluation(null); setEvaluatedAt(null);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ responses, confidence, evaluation: null, evaluatedAt: null, history }));
      setSaved(true);
      setMessage("Rascunho salvo localmente. Ele ainda não foi avaliado e não representa domínio comprovado.");
    } catch {
      setSaved(false);
      setMessage("Não foi possível salvar no armazenamento deste navegador.");
    }
  }

  return <section className="mastery-assessment" aria-labelledby="mastery-title">
    <div className="mastery-heading"><div><div className="eyebrow">PROVA DE MAESTRIA · 5 ATRIBUTOS INTELECTUAIS</div><h2 id="mastery-title">Demonstre o que seu personagem realmente domina.</h2><p>Responda sem copiar a aula. A avaliação assistida por IA examina evidências específicas em cada competência. O resultado é formativo, não uma certificação definitiva.</p></div><div className="mastery-emblem"><BrainCircuit size={24}/></div></div>
    <div className="mastery-context"><strong>Objetivo da aula</strong><p>{props.objective}</p><strong>Desafio de aplicação</strong><p>{props.caseStudy}</p><strong>Pergunta para reflexão</strong><p>{props.reflection}</p></div>
    <div className="mastery-overview"><span>{completed}/5 respostas preparadas</span><div><i style={{ width: `${completed / 5 * 100}%` }}/></div><small>Escreva pelo menos 40 caracteres por dimensão. Prefira respostas fundamentadas a textos longos sem argumento.</small></div>
    <div className="mastery-prompts">{dimensions.map((item, index) => <label className="mastery-prompt" key={item.id}>
      <span className="mastery-index">0{index + 1}</span><div className="mastery-prompt-copy"><strong>{item.title}</strong><p>{item.question}</p><small>{item.hint}</small><textarea rows={4} maxLength={2500} value={responses[item.id]} onChange={event => { const next = { ...responses, [item.id]: event.target.value }; setResponses(next); setEvaluation(null); setEvaluatedAt(null); setSaved(false); try { localStorage.setItem(storageKey, JSON.stringify({ responses: next, confidence, evaluation: null, evaluatedAt: null, history })); } catch { /* armazenamento local opcional */ } }} placeholder="Desenvolva seu raciocínio aqui..."/><span className="mastery-char-count">{responses[item.id].length}/2.500 caracteres</span></div>
      {evaluation && <div className="mastery-dimension-result"><strong>{labels[evaluation.scores[item.id]]} · {evaluation.scores[item.id]}/3</strong><p>{evaluation.evidence[item.id]}</p>{evaluation.gaps[item.id] && <small>Para avançar: {evaluation.gaps[item.id]}</small>}</div>}
    </label>)}</div>
    <div className="mastery-confidence"><label htmlFor={`confidence-${props.lessonId}`}>Antes de ver o resultado, como você avalia sua própria compreensão?</label><select id={`confidence-${props.lessonId}`} value={confidence} disabled={!!evaluation} onChange={event => { const next = Number(event.target.value); setConfidence(next); setSaved(false); try { localStorage.setItem(storageKey, JSON.stringify({ responses, confidence: next, evaluation, evaluatedAt, history })); } catch { /* armazenamento local opcional */ } }}><option value={0}>Muito baixa</option><option value={1}>Baixa</option><option value={2}>Moderada</option><option value={3}>Alta</option></select><small>A confiança é registrada separadamente e não aumenta sua pontuação.</small></div>
    <div className="mastery-actions"><button type="button" className="button button-outline" onClick={saveDraft}><Save size={14}/> Salvar rascunho</button><button type="button" className="button button-dark" disabled={busy || completed !== 5} onClick={evaluate}>{busy ? <><Loader2 size={15} className="spin"/> Avaliando respostas...</> : <><Sparkles size={15}/> Avaliar minhas competências</>}</button></div>
    {message && <p className="mastery-message" role="status">{message}</p>}
    {saved && !message && <p className="mastery-message" role="status">{evaluation ? "Avaliação salva localmente." : "Rascunho salvo localmente."}</p>}
    {evaluation && <div className="mastery-result"><div className="mastery-result-top"><div><div className="eyebrow">RESULTADO FORMATIVO</div><h3>{average}/3 de média nas cinco competências</h3><p>{evaluation.overall}</p></div><div className="mastery-score"><strong>{average}</strong><span>de 3</span></div></div><div className="mastery-score-grid">{dimensions.map(item=><div key={item.id}><span>{item.title}</span><strong>{evaluation.scores[item.id]}/3</strong><i><b style={{ width: `${evaluation.scores[item.id] / 3 * 100}%` }}/></i></div>)}</div><div className="mastery-next"><strong><CircleHelp size={15}/> Próximos passos recomendados</strong><ul>{evaluation.next_steps.map((step,index)=><li key={`${index}-${step}`}>{step}</li>)}</ul></div><p className="mastery-disclaimer"><CheckCircle2 size={14}/> Avaliação formativa assistida por IA. Compare o feedback com as referências da aula e questione eventuais interpretações inadequadas. Confiança declarada: {confidence}/3. {evaluatedAt ? `Data: ${new Date(evaluatedAt).toLocaleString("pt-BR")}.` : ""}</p><button className="button button-outline" type="button" onClick={()=>{setEvaluation(null);setEvaluatedAt(null);try{localStorage.setItem(storageKey,JSON.stringify({responses,confidence,evaluation:null,evaluatedAt:null,history}));}catch{/* armazenamento local opcional */}setMessage("Você pode revisar suas respostas e realizar uma nova tentativa.");}}><RefreshCw size={14}/> Revisar respostas e tentar novamente</button></div>}
    {history.length > 0 && <div className="mastery-history"><strong>Histórico desta aula</strong><p>Últimas {history.length} avaliações registradas neste navegador.</p><div>{history.map((attempt, index) => <div key={`${attempt.evaluatedAt}-${index}`}><span>{new Date(attempt.evaluatedAt).toLocaleDateString("pt-BR")}</span><strong>{attempt.average.toFixed(1)}/3</strong><small>Explicar {attempt.scores.explain} · Relacionar {attempt.scores.relate} · Questionar {attempt.scores.question} · Aplicar {attempt.scores.apply} · Transferir {attempt.scores.transfer}</small></div>)}</div></div>}
  </section>;
}
