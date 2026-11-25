"use client";

import { getAtlasStorageKey } from "@/lib/atlas-storage";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BatteryCharging, ClipboardList, Copy, Gauge, House,
  ShieldCheck, SlidersHorizontal, Target, Wrench, CheckCircle2, Droplets
} from "lucide-react";
import { loadStudentRecords, saveStudentRecord } from "@/lib/student-records";

type RiskItem = { id: string; name: string; likelihood: number; impact: number; note: string };
type MaintenanceItem = { id: string; asset: string; symptom: string; date: string; status: string; notes: string };
type OpsState = { risks: RiskItem[]; maintenance: MaintenanceItem[]; completed: string[] };
const STORAGE_KEY = "atlas-field-ops-v1";
const crisisSteps = [
  { id: "scene", label: "Observar riscos imediatos de um local seguro", order: 1 },
  { id: "people", label: "Verificar pessoas vulneráveis e necessidades urgentes", order: 2 },
  { id: "official", label: "Consultar alertas e instruções oficiais", order: 3 },
  { id: "plan", label: "Executar o plano familiar e comunicar o estado", order: 4 },
  { id: "repair", label: "Tentar reparar a rede elétrica ou atravessar a área de risco", order: 99 }
];
const initialState: OpsState = { risks: [], maintenance: [], completed: [] };
const preparednessItems = [
  "Água potável armazenada em recipientes adequados", "Lanternas e pilhas testadas", "Contatos e endereços importantes em papel",
  "Medicamentos habituais e documentos essenciais organizados", "Plano familiar de comunicação e encontro definido",
  "Alimentos estáveis e compatíveis com a rotina da casa", "Rotas de evacuação e alertas oficiais conhecidos", "Kit básico de primeiros socorros revisado"
];
const hazards = ["Calor extremo", "Alagamento", "Queda prolongada de energia", "Falha de abastecimento de água", "Infiltração ou vazamento", "Equipamento com ruído ou vibração anormal", "Sensor com leitura inconsistente", "Risco estrutural aparente"];

function riskLabel(score: number) {
  if (score >= 16) return { label: "Crítico", action: "Interrompa a atividade, afaste pessoas da área e acione os serviços ou profissionais competentes." };
  if (score >= 10) return { label: "Alto", action: "Priorize controle do risco e avaliação qualificada antes de retomar a atividade." };
  if (score >= 5) return { label: "Moderado", action: "Registre, acompanhe e adote medidas preventivas proporcionais." };
  return { label: "Baixo", action: "Mantenha prevenção e revise se as condições mudarem." };
}

export default function FieldOperationsCenter() {
  const [tab, setTab] = useState<"resilience" | "risk" | "maintenance" | "puzzle" | "bench">("resilience");
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(3);
  const [liters, setLiters] = useState(4);
  const [state, setState] = useState<OpsState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [riskName, setRiskName] = useState(hazards[0]);
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);
  const [riskNote, setRiskNote] = useState("");
  const [asset, setAsset] = useState("");
  const [symptom, setSymptom] = useState("");
  const [maintenanceStatus, setMaintenanceStatus] = useState("Observação segura possível");
  const [maintenanceNotes, setMaintenanceNotes] = useState("");
  const [voltage, setVoltage] = useState("5");
  const [current, setCurrent] = useState("0.01");
  const [resistance, setResistance] = useState("500");
  const [solveFor, setSolveFor] = useState<"voltage" | "current" | "resistance">("resistance");
  const [copyMessage, setCopyMessage] = useState("");
  const [puzzleOrder, setPuzzleOrder] = useState<string[]>([]);
  const [puzzleResult, setPuzzleResult] = useState<"success" | "review" | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      let local = initialState;
      try {
        const raw = localStorage.getItem(getAtlasStorageKey(STORAGE_KEY));
        if (raw) local = { ...initialState, ...JSON.parse(raw) };
      } catch { /* mantém estado vazio */ }
      const cloud = await loadStudentRecords<OpsState>("field_ops");
      const remote = cloud.workspace;
      if (!cancelled) {
        setState({
          risks: [...(local.risks || []), ...(remote?.risks || []).filter(item => !(local.risks || []).some(existing => existing.id === item.id))],
          maintenance: [...(local.maintenance || []), ...(remote?.maintenance || []).filter(item => !(local.maintenance || []).some(existing => existing.id === item.id))],
          completed: Array.from(new Set([...(local.completed || []), ...(remote?.completed || [])]))
        });
        setLoaded(true);
      }
    }
    void hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(getAtlasStorageKey(STORAGE_KEY), JSON.stringify(state)); } catch { /* fallback de sessão */ }
    void saveStudentRecord("field_ops", "workspace", state);
  }, [state, loaded]);

  const waterTotal = people * days * liters;
  const riskScore = likelihood * impact;
  const riskAssessment = riskLabel(riskScore);
  const ohmResult = useMemo(() => {
    const v = Number(voltage), i = Number(current), r = Number(resistance);
    if (solveFor === "voltage") return Number.isFinite(i * r) && i >= 0 && r >= 0 ? `${(i * r).toFixed(3)} V` : "Valores inválidos";
    if (solveFor === "current") return r > 0 && v >= 0 ? `${(v / r).toFixed(6)} A · ${(v / r * 1000).toFixed(3)} mA` : "A resistência deve ser maior que zero";
    return i > 0 && v >= 0 ? `${(v / i).toFixed(2)} Ω` : "A corrente deve ser maior que zero";
  }, [voltage, current, resistance, solveFor]);

  function addRisk() {
    const item: RiskItem = { id: `risk-${Date.now()}`, name: riskName, likelihood, impact, note: riskNote.trim() };
    setState(old => ({ ...old, risks: [item, ...old.risks].slice(0, 40) }));
    setRiskNote("");
  }
  function addMaintenance() {
    if (!asset.trim() || !symptom.trim()) return;
    const item: MaintenanceItem = { id: `maint-${Date.now()}`, asset: asset.trim(), symptom: symptom.trim(), date: new Date().toISOString().slice(0, 10), status: maintenanceStatus, notes: maintenanceNotes.trim() };
    setState(old => ({ ...old, maintenance: [item, ...old.maintenance].slice(0, 60) }));
    setAsset(""); setSymptom(""); setMaintenanceNotes("");
  }
  async function copyPlan() {
    const text = `ATLAS · PLANO DE RESERVA\nPessoas: ${people}\nDias: ${days}\nReferência: ${liters} L/pessoa/dia\nÁgua para beber e preparo básico: ${waterTotal} L\n\nChecklist:\n${preparednessItems.map((item, index) => `${state.completed.includes(item) ? "[x]" : "[ ]"} ${item}`).join("\n")}\n\nObservação: a estimativa não inclui necessariamente higiene, limpeza ou necessidades especiais.`;
    try { await navigator.clipboard.writeText(text); setCopyMessage("Plano copiado."); }
    catch { setCopyMessage("Não foi possível copiar neste navegador."); }
  }

  return <section className="field-ops" aria-labelledby="field-ops-title">
    <div className="field-ops-heading">
      <div><div className="eyebrow"><Activity size={14}/> ATLAS OPERATIONS · FERRAMENTAS DE CAMPO</div><h2 id="field-ops-title">Centro de operações</h2><p>Transforme conteúdo em planos, registros e cálculos verificáveis. Os registros ficam no armazenamento deste navegador e, quando há conta ATLAS configurada, podem ser sincronizados pela tabela protegida por RLS após a migration 006. O armazenamento local não é criptografado pelo aplicativo; não insira senhas nem dados altamente sensíveis.</p></div>
      <div className="field-ops-live"><span/> WORKSPACE PESSOAL</div>
    </div>
    <div className="field-ops-tabs" role="group" aria-label="Selecionar ferramenta de operações">
      <button type="button" aria-pressed={tab === "resilience"} className={tab === "resilience" ? "active" : ""} onClick={() => setTab("resilience")}><ShieldCheck size={16}/> Resiliência</button>
      <button type="button" aria-pressed={tab === "risk"} className={tab === "risk" ? "active" : ""} onClick={() => setTab("risk")}><Target size={16}/> Matriz de riscos</button>
      <button type="button" aria-pressed={tab === "maintenance"} className={tab === "maintenance" ? "active" : ""} onClick={() => setTab("maintenance")}><Wrench size={16}/> Manutenção</button>
      <button type="button" aria-pressed={tab === "puzzle"} className={tab === "puzzle" ? "active" : ""} onClick={() => setTab("puzzle")}><Target size={16}/> Puzzle de crise</button>
      <button type="button" aria-pressed={tab === "bench"} className={tab === "bench" ? "active" : ""} onClick={() => setTab("bench")}><Gauge size={16}/> Bancada técnica</button>
    </div>

    {tab === "resilience" && <div className="field-ops-panel resilience-panel">
      <div className="field-ops-panel-copy"><div className="eyebrow">01 · PLANEJAMENTO DE AUTONOMIA</div><h3>Dimensionador de reserva de água</h3><p>Estimativa inicial para beber e preparar alimentos. Não representa a necessidade total de água doméstica.</p>
        <div className="field-ops-input-grid"><label>Pessoas na residência<input type="number" min="1" max="30" value={people} onChange={e => setPeople(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}/></label><label>Dias de autonomia<input type="number" min="1" max="30" value={days} onChange={e => setDays(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}/></label><label>Litros por pessoa/dia<input type="number" min="1" max="20" step="0.5" value={liters} onChange={e => setLiters(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}/></label></div>
        <div className="field-ops-result"><Droplets size={22}/><div><span>RESERVA DE REFERÊNCIA</span><strong>{waterTotal.toLocaleString("pt-BR")} L</strong><small>{people} pessoas × {days} dias × {liters} L</small></div></div>
      </div>
      <div className="field-ops-checks"><div className="eyebrow">CHECKLIST DE PRONTIDÃO</div>{preparednessItems.map(item => <label key={item}><input type="checkbox" checked={state.completed.includes(item)} onChange={e => setState(old => ({ ...old, completed: e.target.checked ? [...old.completed, item] : old.completed.filter(value => value !== item) }))}/><span>{item}</span></label>)}<div className="field-ops-check-footer"><span>{preparednessItems.filter(item => state.completed.includes(item)).length}/{preparednessItems.length} concluídos</span><button type="button" onClick={copyPlan}><Copy size={14}/> Copiar plano</button></div>{copyMessage && <small role="status">{copyMessage}</small>}</div>
    </div>}

    {tab === "risk" && <div className="field-ops-panel">
      <div className="field-ops-panel-copy"><div className="eyebrow">02 · ANÁLISE PREVENTIVA</div><h3>Matriz de probabilidade × impacto</h3><p>Ferramenta de triagem educativa para organizar riscos observados. Não substitui laudo técnico, análise profissional ou protocolo de emergência.</p>
        <div className="field-ops-input-grid"><label>Perigo observado<select value={riskName} onChange={e => setRiskName(e.target.value)}>{hazards.map(item => <option key={item}>{item}</option>)}</select></label><label>Probabilidade · 1 a 5<input type="number" min="1" max="5" value={likelihood} onChange={e => setLikelihood(Math.max(1, Math.min(5, Number(e.target.value) || 1)))}/></label><label>Impacto · 1 a 5<input type="number" min="1" max="5" value={impact} onChange={e => setImpact(Math.max(1, Math.min(5, Number(e.target.value) || 1)))}/></label></div>
        <label className="field-ops-wide-label">Contexto observado<textarea rows={2} value={riskNote} onChange={e => setRiskNote(e.target.value)} placeholder="Registre fatos observáveis, local e condições. Evite conclusões sem evidências."/></label>
        <div className={`field-ops-risk-result level-${riskScore >= 16 ? "critical" : riskScore >= 10 ? "high" : riskScore >= 5 ? "medium" : "low"}`}><div><span>PONTUAÇÃO {likelihood} × {impact}</span><strong>{riskScore}/25 · {riskAssessment.label}</strong><small>{riskAssessment.action}</small></div><button type="button" onClick={addRisk}>Registrar avaliação</button></div>
      </div>
      <div className="field-ops-history"><div className="eyebrow">HISTÓRICO RECENTE</div>{state.risks.length === 0 ? <p>Nenhuma avaliação registrada.</p> : state.risks.slice(0, 8).map(item => <div className="field-ops-history-row" key={item.id}><span>{item.name}</span><strong>{item.likelihood * item.impact}/25</strong><small>{riskLabel(item.likelihood * item.impact).label}</small></div>)}</div>
    </div>}

    {tab === "maintenance" && <div className="field-ops-panel">
      <div className="field-ops-panel-copy"><div className="eyebrow">03 · MANUTENÇÃO BASEADA EM EVIDÊNCIAS</div><h3>Diário de inspeção e sintomas</h3><p>Registre o que observou antes de decidir por reparos. Não abra equipamentos, remova proteções ou intervenha em sistemas energizados, pressurizados ou com gás.</p>
        <div className="field-ops-input-grid"><label>Equipamento ou local<input value={asset} onChange={e => setAsset(e.target.value)} placeholder="Ex.: torneira da cozinha"/></label><label>Estado da inspeção<select value={maintenanceStatus} onChange={e => setMaintenanceStatus(e.target.value)}><option>Observação segura possível</option><option>Equipamento fora de uso</option><option>Área isolada / acesso impedido</option><option>Encaminhado a profissional</option></select></label></div>
        <label className="field-ops-wide-label">Sintoma observado<input value={symptom} onChange={e => setSymptom(e.target.value)} placeholder="Ex.: gotejamento lento na conexão visível"/></label>
        <label className="field-ops-wide-label">Notas e contexto<textarea rows={2} value={maintenanceNotes} onChange={e => setMaintenanceNotes(e.target.value)} placeholder="Quando começou? Em que condições aparece? O que mudou recentemente?"/></label>
        <button type="button" className="field-ops-primary" disabled={!asset.trim() || !symptom.trim()} onClick={addMaintenance}><ClipboardList size={15}/> Salvar registro</button>
      </div>
      <div className="field-ops-history"><div className="eyebrow">CADERNO DE MANUTENÇÃO</div>{state.maintenance.length === 0 ? <p>Seus registros aparecerão aqui.</p> : state.maintenance.slice(0, 8).map(item => <article className="field-ops-maintenance-entry" key={item.id}><div><strong>{item.asset}</strong><small>{item.date} · {item.status}</small></div><p>{item.symptom}</p>{item.notes && <small>{item.notes}</small>}</article>)}</div>
    </div>}

    {tab === "puzzle" && <div className="field-ops-panel field-ops-puzzle-panel">
      <div className="field-ops-panel-copy"><div className="eyebrow">05 · CRISIS COMMAND · PUZZLE DE SEQUÊNCIA</div><h3>Reconstrua a resposta segura</h3><p>Um apagão ocorre durante uma onda de calor. Organize quatro decisões em uma ordem coerente. Toque nas peças para montar a sequência; o objetivo é priorizar segurança, pessoas e informação confiável.</p>
        <div className="field-ops-puzzle-pieces">{crisisSteps.filter(step => !puzzleOrder.includes(step.id)).map(step => <button type="button" key={step.id} onClick={() => { setPuzzleOrder(old => [...old, step.id]); setPuzzleResult(null); }}><span>＋</span>{step.label}</button>)}</div>
        <div className="field-ops-puzzle-track"><div className="eyebrow">SUA ORDEM DE AÇÃO · {puzzleOrder.length}/4</div>{puzzleOrder.length === 0 ? <p>Adicione a primeira decisão para iniciar a sequência.</p> : puzzleOrder.map((id, index) => { const step = crisisSteps.find(item => item.id === id)!; return <button type="button" key={id} onClick={() => { setPuzzleOrder(old => old.filter(value => value !== id)); setPuzzleResult(null); }}><span>{index + 1}</span>{step.label}<small>Remover</small></button>; })}</div>
        <div className="field-ops-puzzle-actions"><button type="button" className="field-ops-primary" disabled={puzzleOrder.length !== 4 || Boolean(puzzleResult)} onClick={() => { const correct = puzzleOrder.every((id, index) => crisisSteps.find(step => step.id === id)?.order === index + 1); setPuzzleResult(correct ? "success" : "review"); if (correct) setState(old => ({ ...old, completed: Array.from(new Set([...old.completed, "puzzle-crisis-sequence"])) })); }}><CheckCircle2 size={15}/> Validar sequência</button><button type="button" className="field-ops-secondary" onClick={() => { setPuzzleOrder([]); setPuzzleResult(null); }}>Reiniciar puzzle</button></div>
        {puzzleResult && <div className={`field-ops-puzzle-feedback ${puzzleResult}`}><strong>{puzzleResult === "success" ? "Sequência reconstruída." : "A ordem precisa ser revista."}</strong><p>{puzzleResult === "success" ? "Você priorizou avaliação segura, proteção de pessoas, informação oficial e comunicação. Essa ordem reduz exposição a riscos evitáveis." : "Reavalie a prioridade: não tente consertar a rede, não se aproxime de riscos e não deixe de verificar pessoas vulneráveis e orientações oficiais."}</p></div>}
      </div>
      <aside className="field-ops-safety"><ShieldCheck size={20}/><strong>Princípio de comando</strong><p>Uma boa resposta começa por evitar novas vítimas. Não transforme um problema de infraestrutura em uma emergência adicional. Em risco real, siga as autoridades e os serviços de emergência.</p></aside>
    </div>}

    {tab === "bench" && <div className="field-ops-panel bench-panel">
      <div className="field-ops-panel-copy"><div className="eyebrow">04 · ENGENHARIA EDUCACIONAL</div><h3>Bancada de Lei de Ohm</h3><p>Calcule uma grandeza a partir das outras duas em circuitos resistivos simples de corrente contínua.</p>
        <div className="field-ops-input-grid"><label>Tensão · V<input type="number" min="0" step="any" value={voltage} onChange={e => setVoltage(e.target.value)}/></label><label>Corrente · A<input type="number" min="0" step="any" value={current} onChange={e => setCurrent(e.target.value)}/></label><label>Resistência · Ω<input type="number" min="0" step="any" value={resistance} onChange={e => setResistance(e.target.value)}/></label></div>
        <label className="field-ops-wide-label">Qual grandeza calcular?<select value={solveFor} onChange={e => setSolveFor(e.target.value as typeof solveFor)}><option value="voltage">Tensão (V = R × I)</option><option value="current">Corrente (I = V ÷ R)</option><option value="resistance">Resistência (R = V ÷ I)</option></select></label>
        <div className="field-ops-result"><BatteryCharging size={22}/><div><span>RESULTADO CALCULADO</span><strong>{ohmResult}</strong><small>Modelo ideal simplificado; confira limites e datasheets.</small></div></div>
      </div>
      <aside className="field-ops-safety"><AlertTriangle size={20}/><strong>Limite de segurança</strong><p>Use este cálculo somente para estudo e circuitos educacionais isolados de baixa tensão. Não aplique em tomadas, instalações prediais, fontes abertas, capacitores de alta energia ou baterias danificadas. Projeto e montagem reais exigem componentes adequados, proteção e supervisão competente.</p></aside>
    </div>}
    <div className="field-ops-footnote"><SlidersHorizontal size={14}/> <span>Dados: {loaded ? "carregados" : "carregando"} · Armazenamento local com tentativa de sincronização autenticada · Armazenamento local não criptografado; evite senhas e dados sensíveis.</span></div>
  </section>;
}
