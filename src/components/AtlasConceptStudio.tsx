"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDownToLine, ArrowRightLeft, BookOpen, GitBranch, Link2, Plus, Search, Trash2, X } from "lucide-react";
import { getAtlasStorageKey } from "@/lib/atlas-storage";
import { loadStudentRecords, loadStudentRecordsForUser, saveStudentRecord, saveStudentRecordForUser, subscribeToStudentAuth } from "@/lib/student-records";

type Department = "Direito e Instituições" | "Economia e Finanças" | "Tecnologia e IA" | "História e Geopolítica" | "Filosofia e Pensamento Crítico" | "Ciências e Matemática" | "Interdisciplinar";
type Concept = { id: string; label: string; description: string; department: Department; kind: "conceito" | "causa" | "evidência" | "exemplo"; confidence: number; createdAt: string };
type Relation = { id: string; from: string; to: string; label: string };
type ConceptMap = { id: string; title: string; question: string; department: Department; concepts: Concept[]; relations: Relation[]; createdAt: string; updatedAt: string; archived?: boolean };

const STORAGE_KEY = "atlas-concept-studio-v1";
const departments: Department[] = ["Direito e Instituições", "Economia e Finanças", "Tecnologia e IA", "História e Geopolítica", "Filosofia e Pensamento Crítico", "Ciências e Matemática", "Interdisciplinar"];
const kinds: Concept["kind"][] = ["conceito", "causa", "evidência", "exemplo"];
const relationExamples = ["depende de", "causa", "limita", "é evidência de", "contrasta com", "exemplifica", "influencia", "é parte de"];
const palette = ["#e9eee7", "#f1ede3", "#e8eef0", "#eee9ef"];

function parse(raw: string | null): ConceptMap[] {
  try {
    const data: unknown = JSON.parse(raw || "[]");
    return Array.isArray(data) ? data.filter((item): item is ConceptMap => !!item && typeof item === "object" && typeof (item as ConceptMap).id === "string" && Array.isArray((item as ConceptMap).concepts) && Array.isArray((item as ConceptMap).relations)) : [];
  } catch { return []; }
}
function merge(...sets: ConceptMap[][]) {
  const byId = new Map<string, ConceptMap>();
  for (const item of sets.flat()) { const old = byId.get(item.id); if (!old || Date.parse(item.updatedAt) >= Date.parse(old.updatedAt)) byId.set(item.id, item); }
  return [...byId.values()].sort((a,b) => Date.parse(b.updatedAt)-Date.parse(a.updatedAt));
}
function uid(prefix: string) { return typeof crypto !== "undefined" && "randomUUID" in crypto ? `${prefix}-${crypto.randomUUID()}` : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

export default function AtlasConceptStudio() {
  const [maps, setMaps] = useState<ConceptMap[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showMapEditor, setShowMapEditor] = useState(false);
  const [showConceptEditor, setShowConceptEditor] = useState(false);
  const [mapTitle, setMapTitle] = useState("");
  const [mapQuestion, setMapQuestion] = useState("");
  const [mapDepartment, setMapDepartment] = useState<Department>("Interdisciplinar");
  const [conceptLabel, setConceptLabel] = useState("");
  const [conceptDescription, setConceptDescription] = useState("");
  const [conceptDepartment, setConceptDepartment] = useState<Department>("Interdisciplinar");
  const [conceptKind, setConceptKind] = useState<Concept["kind"]>("conceito");
  const [conceptConfidence, setConceptConfidence] = useState(3);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [relationLabel, setRelationLabel] = useState("influencia");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      let local: ConceptMap[] = [];
      try { local = parse(window.localStorage.getItem(getAtlasStorageKey(STORAGE_KEY))); } catch { /* storage unavailable */ }
      const cloud = Object.values(await loadStudentRecords<ConceptMap>("concept_map"));
      const result = merge(local, cloud);
      if (cancelled) return;
      setMaps(result); setActiveId(result.find(item => !item.archived)?.id ?? null); setLoaded(true);
      for (const item of result) void saveStudentRecord("concept_map", item.id, item);
    }
    void hydrate(); return () => { cancelled = true; };
  }, []);

  useEffect(() => subscribeToStudentAuth(userId => {
    let local: ConceptMap[] = [];
    try { local = parse(window.localStorage.getItem(getAtlasStorageKey(STORAGE_KEY))); } catch { /* storage unavailable */ }
    void loadStudentRecordsForUser<ConceptMap>("concept_map", userId).then(cloud => {
      const result = merge(local, Object.values(cloud)); setMaps(result); setActiveId(result.find(item => !item.archived)?.id ?? null);
      for (const item of result) void saveStudentRecordForUser("concept_map", item.id, item, userId);
    });
  }), []);

  useEffect(() => { if (loaded) try { window.localStorage.setItem(getAtlasStorageKey(STORAGE_KEY), JSON.stringify(maps)); } catch { /* storage unavailable */ } }, [maps, loaded]);

  const activeMaps = useMemo(() => maps.filter(item => !item.archived), [maps]);
  const current = activeMaps.find(item => item.id === activeId) ?? activeMaps[0] ?? null;
  const visibleMaps = activeMaps.filter(item => `${item.title} ${item.question} ${item.department}`.toLowerCase().includes(query.toLowerCase()));
  const relationCount = current?.relations.length ?? 0;
  const conceptCount = current?.concepts.length ?? 0;
  const crossDepartmentCount = current ? new Set(current.concepts.map(item => item.department)).size : 0;
  const graphRows = current ? Math.max(1, Math.ceil(current.concepts.length / 3)) : 1;
  const graphHeight = graphRows * 180;

  function persist(updated: ConceptMap) {
    setMaps(old => merge(old, [updated])); setActiveId(updated.id);
    void saveStudentRecord("concept_map", updated.id, updated);
  }
  function createMap(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const now = new Date().toISOString();
    const item: ConceptMap = { id: uid("map"), title: mapTitle.trim(), question: mapQuestion.trim(), department: mapDepartment, concepts: [], relations: [], createdAt: now, updatedAt: now };
    persist(item); setShowMapEditor(false); setMapTitle(""); setMapQuestion(""); setNotice("Mapa conceitual criado.");
  }
  function addConcept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!current) return;
    const now = new Date().toISOString();
    const concept: Concept = { id: uid("concept"), label: conceptLabel.trim(), description: conceptDescription.trim(), department: conceptDepartment, kind: conceptKind, confidence: conceptConfidence, createdAt: now };
    persist({ ...current, concepts: [...current.concepts, concept], updatedAt: now });
    setConceptLabel(""); setConceptDescription(""); setConceptKind("conceito"); setConceptConfidence(3); setShowConceptEditor(false); setNotice("Conceito adicionado ao mapa.");
  }
  function addRelation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!current || !from || !to || from === to) return;
    if (current.relations.some(item => item.from === from && item.to === to && item.label === relationLabel)) { setNotice("Essa relação já existe no mapa."); return; }
    persist({ ...current, relations: [...current.relations, { id: uid("relation"), from, to, label: relationLabel }, ], updatedAt: new Date().toISOString() });
    setFrom(""); setTo(""); setNotice("Relação registrada.");
  }
  function removeConcept(id: string) {
    if (!current) return;
    persist({ ...current, concepts: current.concepts.filter(item => item.id !== id), relations: current.relations.filter(item => item.from !== id && item.to !== id), updatedAt: new Date().toISOString() });
    setNotice("Conceito e relações associadas removidos.");
  }
  function removeRelation(id: string) {
    if (!current) return;
    persist({ ...current, relations: current.relations.filter(item => item.id !== id), updatedAt: new Date().toISOString() });
  }
  function archiveMap(item: ConceptMap) {
    const updated = { ...item, archived: true, updatedAt: new Date().toISOString() };
    setMaps(old => merge(old, [updated])); setActiveId(activeMaps.find(map => map.id !== item.id)?.id ?? null); void saveStudentRecord("concept_map", item.id, updated);
  }
  function exportMap() {
    if (!current) return;
    const byId = new Map<string, Concept>(current.concepts.map(item => [item.id, item]));
    const markdown = [`# ${current.title}`, `**Pergunta orientadora:** ${current.question || "Não definida"}`, `**Departamento:** ${current.department}`, "", "## Conceitos", ...current.concepts.map(item => `### ${item.label}\n- Tipo: ${item.kind}\n- Área: ${item.department}\n- Confiança: ${item.confidence}/5\n- ${item.description || "Sem descrição"}`), "", "## Relações", ...current.relations.map(item => `- ${byId.get(item.from)?.label ?? "?"} **${item.label}** ${byId.get(item.to)?.label ?? "?"}`)].join("\n");
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${current.title.toLowerCase().replace(/[^a-z0-9]+/g,"-") || "atlas-mapa"}.md`; anchor.click(); URL.revokeObjectURL(url);
  }

  return <section className="page-section concept-studio">
    <div className="concept-heading"><div><div className="eyebrow">SÍNTESE · RELAÇÕES · TRANSFERÊNCIA</div><h1>Mapa de <em>conceitos.</em></h1><p className="page-intro">Organize ideias, explicite relações causais e conecte departamentos. Um mapa é uma hipótese visual do que você compreendeu — revise-o à medida que aprende.</p></div><div className="concept-heading-actions"><button className="button button-outline" onClick={exportMap} disabled={!current}><ArrowDownToLine size={15}/> Exportar mapa</button><button className="button button-dark" onClick={() => setShowMapEditor(true)}><Plus size={15}/> Novo mapa</button></div></div>
    <div className="concept-layout">
      <aside className="concept-library"><div className="concept-library-head"><div><div className="eyebrow">SEU ACERVO</div><strong>Mapas de conhecimento</strong></div><span>{activeMaps.length}</span></div><label className="concept-search"><Search size={14}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar mapas"/></label>
        {visibleMaps.length ? visibleMaps.map(item => <button key={item.id} className={`concept-map-choice ${current?.id === item.id ? "active" : ""}`} onClick={() => setActiveId(item.id)}><span>{item.department}</span><strong>{item.title}</strong><small>{item.concepts.length} conceitos · {item.relations.length} relações</small></button>) : <div className="concept-library-empty">Nenhum mapa encontrado.</div>}
      </aside>
      {current ? <div className="concept-workspace">
        <header className="concept-map-header"><div><div className="eyebrow">{current.department.toUpperCase()} · MAPA DE CONHECIMENTO</div><h2>{current.title}</h2>{current.question && <p><strong>Pergunta orientadora</strong> {current.question}</p>}</div><button className="concept-archive" onClick={() => archiveMap(current)} title="Arquivar mapa"><Trash2 size={15}/></button></header>
        <div className="concept-metrics"><div><span>CONCEITOS</span><strong>{conceptCount}</strong></div><div><span>RELAÇÕES EXPLÍCITAS</span><strong>{relationCount}</strong></div><div><span>ÁREAS CONECTADAS</span><strong>{crossDepartmentCount}</strong></div><div><span>DENSIDADE RELACIONAL</span><strong>{conceptCount > 1 ? `${Math.round(relationCount / (conceptCount * (conceptCount - 1)) * 100)}%` : "—"}</strong></div></div>
        <div className="concept-toolbar"><div><strong>Estrutura do conhecimento</strong><span>Selecione os conceitos e examine como se relacionam.</span></div><button className="button button-dark" onClick={() => { setConceptDepartment(current.department); setShowConceptEditor(true); }}><Plus size={15}/> Adicionar conceito</button></div>
        {current.concepts.length ? <div className="concept-canvas" aria-label="Mapa visual de conceitos">
          <div className="concept-canvas-caption"><GitBranch size={14}/> GRAFO DE CONHECIMENTO · {current.concepts.length} NÓS · {current.relations.length} LIGAÇÕES</div>
          <div className="concept-graph" style={{ height: `${graphHeight}px` }}>
            <svg className="concept-graph-lines" viewBox={`0 0 900 ${graphHeight}`} preserveAspectRatio="none" role="img" aria-label="Ligações direcionais entre os conceitos">
              <defs><marker id="atlas-concept-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#8b9a8e"/></marker></defs>
              {current.relations.map(relation => {
                const sourceIndex = current.concepts.findIndex(item => item.id === relation.from);
                const targetIndex = current.concepts.findIndex(item => item.id === relation.to);
                if (sourceIndex < 0 || targetIndex < 0) return null;
                const x1 = 150 + (sourceIndex % 3) * 300; const y1 = 90 + Math.floor(sourceIndex / 3) * 180;
                const x2 = 150 + (targetIndex % 3) * 300; const y2 = 90 + Math.floor(targetIndex / 3) * 180;
                const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2;
                return <g key={relation.id}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9aa99b" strokeWidth="2" markerEnd="url(#atlas-concept-arrow)"/><text x={mx} y={my - 8} textAnchor="middle">{relation.label}</text></g>;
              })}
            </svg>
            <div className="concept-graph-grid" style={{ gridTemplateRows: `repeat(${graphRows}, 180px)` }}>{current.concepts.map((concept,index) => <article className="concept-node" key={concept.id} style={{ background: palette[index % palette.length] }}><div className="concept-node-top"><span>{concept.kind.toUpperCase()}</span><button onClick={() => removeConcept(concept.id)} aria-label={`Remover ${concept.label}`}><X size={13}/></button></div><h3>{concept.label}</h3><p>{concept.description || "Adicione uma explicação para registrar o significado deste conceito."}</p><div className="concept-node-bottom"><span>{concept.department}</span><strong>{concept.confidence}/5</strong></div></article>)}</div>
          </div>
        </div> : <div className="concept-empty"><div><GitBranch size={25}/></div><strong>Comece pelos conceitos essenciais.</strong><p>Adicione ideias-chave, causas, evidências ou exemplos. Depois, conecte os elementos para explicar como o assunto funciona.</p><button className="button button-dark" onClick={() => { setConceptDepartment(current.department); setShowConceptEditor(true); }}><Plus size={15}/> Adicionar primeiro conceito</button></div>}
        <section className="concept-relations"><div className="concept-section-head"><div><div className="eyebrow">ARGUMENTAÇÃO VISUAL</div><h3>Relações entre conceitos</h3></div><span>{current.relations.length} RELAÇÕES</span></div>
          {current.concepts.length >= 2 && <form className="concept-relation-form" onSubmit={addRelation}><label>Conceito de origem<select value={from} onChange={event => setFrom(event.target.value)} required><option value="">Selecione...</option>{current.concepts.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Relação<select value={relationLabel} onChange={event => setRelationLabel(event.target.value)}>{relationExamples.map(item => <option key={item}>{item}</option>)}</select></label><label>Conceito de destino<select value={to} onChange={event => setTo(event.target.value)} required><option value="">Selecione...</option>{current.concepts.filter(item => item.id !== from).map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><button className="button button-dark" disabled={!from || !to || from === to}><Link2 size={14}/> Conectar</button></form>}
          {current.relations.length ? <div className="concept-relation-list">{current.relations.map(relation => { const a = current.concepts.find(item => item.id === relation.from); const b = current.concepts.find(item => item.id === relation.to); return <div key={relation.id}><strong>{a?.label ?? "Conceito removido"}</strong><span>{relation.label}</span><ArrowRightLeft size={14}/><strong>{b?.label ?? "Conceito removido"}</strong><button onClick={() => removeRelation(relation.id)} aria-label="Remover relação"><X size={13}/></button></div>; })}</div> : <p className="concept-no-relations">Ainda não há relações. Conecte dois conceitos com uma afirmação clara: “A influencia B”, “A é evidência de B” ou “A contrasta com B”.</p>}
        </section>
        <div className="concept-method"><BookOpen size={17}/><div><strong>Teste de consistência</strong><p>Leia cada ligação como uma frase completa. Se a relação não puder ser defendida com uma explicação ou evidência, ela ainda é uma hipótese — não uma conclusão.</p></div></div>
      </div> : <div className="concept-first-map"><div><GitBranch size={28}/></div><h2>Construa seu primeiro mapa.</h2><p>Comece com uma pergunta que você queira responder e organize os conceitos necessários para explicá-la.</p><button className="button button-dark" onClick={() => setShowMapEditor(true)}><Plus size={15}/> Criar mapa conceitual</button></div>}
    </div>
    {notice && <div className="concept-notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso"><X size={13}/></button></div>}
    {showMapEditor && <div className="research-editor-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setShowMapEditor(false); }}><form className="research-editor" onSubmit={createMap}><div className="research-editor-head"><div><div className="eyebrow">ESTÚDIO DE CONCEITOS</div><h2>Novo mapa conceitual</h2></div><button type="button" className="icon-button" onClick={() => setShowMapEditor(false)} aria-label="Fechar"><X size={18}/></button></div><label>Título do mapa<input value={mapTitle} onChange={event => setMapTitle(event.target.value)} placeholder="Ex.: Como a inflação afeta o crédito?" required maxLength={100}/></label><label>Pergunta orientadora<input value={mapQuestion} onChange={event => setMapQuestion(event.target.value)} placeholder="Qual problema este mapa pretende explicar?" maxLength={220}/></label><label>Departamento<select value={mapDepartment} onChange={event => setMapDepartment(event.target.value as Department)}>{departments.map(item => <option key={item}>{item}</option>)}</select></label><div className="research-editor-actions"><button type="button" className="button button-outline" onClick={() => setShowMapEditor(false)}>Cancelar</button><button className="button button-dark"><Plus size={15}/> Criar mapa</button></div></form></div>}
    {showConceptEditor && current && <div className="research-editor-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setShowConceptEditor(false); }}><form className="research-editor" onSubmit={addConcept}><div className="research-editor-head"><div><div className="eyebrow">{current.title}</div><h2>Adicionar conceito</h2></div><button type="button" className="icon-button" onClick={() => setShowConceptEditor(false)} aria-label="Fechar"><X size={18}/></button></div><label>Nome do conceito<input value={conceptLabel} onChange={event => setConceptLabel(event.target.value)} placeholder="Ex.: Taxa básica de juros" required maxLength={90}/></label><label>Explicação breve<textarea value={conceptDescription} onChange={event => setConceptDescription(event.target.value)} placeholder="Defina o conceito e explique sua função no tema..." rows={4} maxLength={900}/></label><div className="research-form-grid"><label>Departamento<select value={conceptDepartment} onChange={event => setConceptDepartment(event.target.value as Department)}>{departments.map(item => <option key={item}>{item}</option>)}</select></label><label>Natureza<select value={conceptKind} onChange={event => setConceptKind(event.target.value as Concept["kind"])}>{kinds.map(item => <option key={item}>{item}</option>)}</select></label></div><fieldset className="research-confidence"><legend>Confiança atual neste conceito</legend><div>{[1,2,3,4,5].map(value => <button type="button" key={value} className={conceptConfidence === value ? "active" : ""} onClick={() => setConceptConfidence(value)}><strong>{value}</strong><small>{["Inicial", "Baixa", "Parcial", "Segura", "Aplicável"][value-1]}</small></button>)}</div></fieldset><div className="research-editor-actions"><button type="button" className="button button-outline" onClick={() => setShowConceptEditor(false)}>Cancelar</button><button className="button button-dark"><Plus size={15}/> Adicionar conceito</button></div></form></div>}
  </section>;
}
