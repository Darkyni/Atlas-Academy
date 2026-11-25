"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertCircle, ArrowDownToLine, BookOpen, BrainCircuit, CheckCircle2, Compass, RefreshCw, Target } from "lucide-react";
import { getAtlasStorageKey } from "@/lib/atlas-storage";
import { loadStudentRecords, loadStudentRecordsForUser, subscribeToStudentAuth } from "@/lib/student-records";

const STORAGE_KEY = "atlas-evidence-portfolio-v1";
const competencies = [
  { id: "explicar", name: "Explicar", action: "Produza uma explicação de 3 minutos sem consultar o material; depois compare com duas fontes." },
  { id: "relacionar", name: "Relacionar", action: "Construa um mapa conectando três conceitos e indique uma relação causal e uma possível exceção." },
  { id: "questionar", name: "Questionar", action: "Escreva cinco perguntas críticas, identifique pressupostos e procure uma evidência contrária." },
  { id: "aplicar", name: "Aplicar", action: "Resolva um caso prático novo, explicite o método e justifique cada decisão tomada." },
  { id: "transferir", name: "Transferir", action: "Aplique o mesmo princípio em uma área diferente e explique o que precisou ser adaptado." }
] as const;
type CompetencyId = typeof competencies[number]["id"];
type Evidence = { id: string; title: string; department: string; course?: string; scores: Record<CompetencyId, number>; updatedAt?: string; archived?: boolean };
const departments = ["Direito e Instituições", "Economia e Finanças", "Tecnologia e IA", "História e Geopolítica", "Filosofia e Pensamento Crítico", "Ciências e Matemática"];
function readLocal(): Evidence[] { try { const v = JSON.parse(localStorage.getItem(getAtlasStorageKey(STORAGE_KEY)) || "[]"); return Array.isArray(v) ? v.filter(x => x && typeof x.id === "string" && x.scores) : []; } catch { return []; } }
function merge(a: Evidence[], b: Evidence[]) { const map = new Map<string, Evidence>(); for (const x of [...a, ...b]) { const old = map.get(x.id); if (!old || Date.parse(x.updatedAt || "") >= Date.parse(old.updatedAt || "")) map.set(x.id, x); } return [...map.values()].filter(x => !x.archived); }
function mean(items: Evidence[], key: CompetencyId) { const values = items.map(x => Number(x.scores?.[key] || 0)).filter(x => x > 0); return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null; }

export default function AtlasAcademicIntelligence() {
  const [items, setItems] = useState<Evidence[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState("");
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => { const local = readLocal(); const cloud = Object.values(await loadStudentRecords<Evidence>("evidence_portfolio")); if (cancelled) return; setItems(merge(local, cloud)); setLoaded(true); setRefreshedAt(new Date().toLocaleString("pt-BR")); };
    void hydrate();
    const unsubscribe = subscribeToStudentAuth(userId => { const local = readLocal(); void loadStudentRecordsForUser<Evidence>("evidence_portfolio", userId).then(cloud => { if (!cancelled) { setItems(merge(local, Object.values(cloud))); setRefreshedAt(new Date().toLocaleString("pt-BR")); } }); });
    return () => { cancelled = true; unsubscribe(); };
  }, []);
  const analysis = useMemo(() => competencies.map(c => ({ ...c, score: mean(items, c.id), samples: items.filter(x => Number(x.scores?.[c.id] || 0) > 0).length })).sort((a, b) => (a.score ?? -1) - (b.score ?? -1)), [items]);
  const departmentsAnalysis = useMemo(() => departments.map(name => ({ name, count: items.filter(x => x.department === name).length, score: (() => { const rows = items.filter(x => x.department === name); const vals = rows.flatMap(x => competencies.map(c => Number(x.scores?.[c.id] || 0)).filter(v => v > 0)); return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null; })() })).sort((a, b) => (a.score ?? 99) - (b.score ?? 99)), [items]);
  const weakest = analysis.find(x => x.score !== null);
  const unmeasured = analysis.filter(x => x.score === null);
  const avgValues = analysis.map(x => x.score).filter((x): x is number => x !== null);
  const overall = avgValues.length ? avgValues.reduce((a, b) => a + b, 0) / avgValues.length : null;
  const insufficient = items.length < 3;
  function exportReport() { const lines = ["# Relatório de inteligência acadêmica — ATLAS", `Gerado em ${new Date().toLocaleString("pt-BR")}`, "", `Evidências consideradas: ${items.length}`, `Índice descritivo: ${overall === null ? "sem dados" : `${overall.toFixed(2)} / 3`}`, "", "## Competências", ...analysis.map(x => `- ${x.name}: ${x.score === null ? "sem dados" : `${x.score.toFixed(2)} / 3`} (${x.samples} evidências)`), "", "## Plano de intervenção sugerido", ...(weakest ? [`Prioridade: ${weakest.name}`, weakest.action] : ["Registre evidências avaliadas no Portfólio para gerar recomendações." ]), "", "## Distribuição por departamento", ...departmentsAnalysis.map(x => `- ${x.name}: ${x.count} evidências; média ${x.score === null ? "sem dados" : x.score.toFixed(2)}`), "", "Observação: indicadores descritivos baseados apenas nas evidências registradas; não representam avaliação psicométrica nem domínio definitivo."];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = "atlas-relatorio-inteligencia-academica.md"; a.click(); URL.revokeObjectURL(url); }
  if (!loaded) return <section className="page-section intelligence-page"><div className="eyebrow">ANÁLISE DE APRENDIZAGEM</div><h1>Inteligência <em>acadêmica.</em></h1><p className="page-intro">Consolidando suas evidências de aprendizagem…</p></section>;
  return <section className="page-section intelligence-page">
    <div className="intelligence-heading"><div><div className="eyebrow">ANÁLISE · DIAGNÓSTICO · PRÓXIMOS PASSOS</div><h1>Inteligência <em>acadêmica.</em></h1><p className="page-intro">Transforme produções registradas em sinais de aprendizagem. O painel identifica lacunas observáveis e sugere intervenções práticas — sem confundir atividade concluída com domínio.</p></div><button className="button button-outline" onClick={exportReport} disabled={!items.length}><ArrowDownToLine size={15}/> Exportar relatório</button></div>
    <div className="intelligence-overview"><div><span>EVIDÊNCIAS ATIVAS</span><strong>{items.length}</strong><small>Registros considerados</small></div><div><span>ÍNDICE DESCRITIVO</span><strong>{overall === null ? "—" : overall.toFixed(2)}<small>/ 3</small></strong><small>Não é nota nem certificação</small></div><div><span>COMPETÊNCIA PRIORITÁRIA</span><strong>{weakest?.name || "Aguardando dados"}</strong><small>{weakest ? `${weakest.score?.toFixed(2)} / 3 · ${weakest.samples} evidências` : "Avalie produções no portfólio"}</small></div><div><span>DIMENSÕES SEM DADOS</span><strong>{unmeasured.length}</strong><small>Precisam de evidências avaliadas</small></div></div>
    {insufficient && <div className="intelligence-notice"><AlertCircle size={17}/><p><strong>Diagnóstico preliminar.</strong> {items.length === 0 ? "Ainda não há produções ativas no Portfólio de evidências." : `Há apenas ${items.length} produção(ões) ativa(s). Registre pelo menos três evidências em contextos diferentes para reduzir conclusões precipitadas.`} Os resultados abaixo são hipóteses de estudo, não um julgamento definitivo.</p></div>}
    <div className="intelligence-section-head"><div><div className="eyebrow">01 · PERFIL DE COMPETÊNCIAS</div><h2>O que suas produções demonstram</h2></div><span>{refreshedAt ? `Atualizado ${refreshedAt}` : ""}</span></div>
    <div className="intelligence-competencies">{analysis.map((x, i) => <article key={x.id} className={i === 0 && x.score !== null ? "priority" : ""}><div className="intelligence-competency-top"><span>{x.name}</span><strong>{x.score === null ? "—" : x.score.toFixed(2)}</strong></div><div className="intelligence-track"><i style={{ width: `${(x.score || 0) / 3 * 100}%` }}/></div><small>{x.score === null ? "Sem evidência avaliada" : `${x.samples} evidência(s) com pontuação`}</small></article>)}</div>
    <div className="intelligence-columns"><section className="intelligence-panel"><div className="eyebrow">02 · INTERVENÇÃO ADAPTATIVA</div><h2><Target size={19}/> Próximo movimento recomendado</h2>{weakest ? <><p className="intelligence-lead">Priorize <strong>{weakest.name}</strong>, atualmente a dimensão com menor média entre as competências avaliadas.</p><div className="intelligence-action"><span>EXERCÍCIO SUGERIDO</span><p>{weakest.action}</p></div><small>Após realizar o exercício, registre uma nova produção no Portfólio e avalie novamente a competência. Compare evidências em vez de depender apenas da memória.</small></> : <div className="intelligence-empty"><BookOpen size={23}/><p>Registre e avalie uma produção no Portfólio para receber uma intervenção baseada em evidências.</p></div>}</section>
      <section className="intelligence-panel"><div className="eyebrow">03 · COBERTURA CURRICULAR</div><h2><Compass size={19}/> Distribuição por departamento</h2><div className="intelligence-departments">{departmentsAnalysis.map(x=><div key={x.name}><span>{x.name}</span><strong>{x.count}</strong><small>{x.score === null ? "Sem avaliação" : `Média ${x.score.toFixed(1)} / 3`}</small></div>)}</div></section></div>
    <div className="intelligence-method"><BrainCircuit size={19}/><p><strong>Como interpretar:</strong> o painel utiliza apenas avaliações explícitas do Portfólio. Pontuação zero significa “sem evidência suficiente” e não é tratada como desempenho baixo. Amostras pequenas, áreas sem produção e diferenças de dificuldade limitam comparações. A recomendação é uma próxima ação de estudo, não uma decisão automatizada sobre sua capacidade.</p></div>
  </section>;
}
