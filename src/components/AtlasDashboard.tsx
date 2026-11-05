"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowRight, Atom, BookOpen, Brain, Check, ChevronDown, Clock3,
  Compass, GraduationCap, Library, Menu, MessageSquareText, Search, Shield,
  Sparkles, X, Scale, Globe2, Code2, Landmark, Gamepad2
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const subjects = [
  { id: "politica", title: "Política e geopolítica", desc: "Poder, instituições e relações internacionais.", icon: Globe2, tag: "Sociedade" },
  { id: "direito", title: "Direito", desc: "Normas, direitos, Estado e pensamento jurídico.", icon: Scale, tag: "Instituições" },
  { id: "tecnologia", title: "Tecnologia", desc: "Computação, inteligência artificial e segurança.", icon: Code2, tag: "Inovação" },
  { id: "humanidades", title: "História, cultura e filosofia", desc: "Ideias e acontecimentos que moldaram o mundo.", icon: Landmark, tag: "Humanidades" },
  { id: "exatas", title: "Física e matemática", desc: "Lógica, modelos e compreensão da natureza.", icon: Atom, tag: "Ciências" },
  { id: "games", title: "Games e sistemas interativos", desc: "Mecânicas, simulação e sistemas complexos.", icon: Gamepad2, tag: "Criação" }
];

const schedule = [
  { day: "SEG", subject: "Política e geopolítica", lesson: "O que é poder político?", time: "35 min" },
  { day: "TER", subject: "Direito", lesson: "Estado, lei e Constituição", time: "40 min" },
  { day: "QUA", subject: "Tecnologia", lesson: "Como funciona um computador?", time: "35 min" },
  { day: "QUI", subject: "História, cultura e filosofia", lesson: "O nascimento do pensamento filosófico", time: "40 min" }
];

type NavKey = "Visão geral" | "Academia" | "Biblioteca" | "Tutor IA";

export default function AtlasDashboard() {
  const [active, setActive] = useState<NavKey>("Visão geral");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>(["QUA"]);
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tutorError, setTutorError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const filtered = useMemo(
    () => subjects.filter(s => `${s.title} ${s.desc}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const progress = Math.round((completed.length / schedule.length) * 100);

  async function askTutor(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true); setAnswer(""); setTutorError("");
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context: "Estudante iniciante em formação interdisciplinar. Áreas: política, direito, tecnologia, humanidades, exatas e sistemas interativos."
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não foi possível consultar o tutor.");
      setAnswer(data.answer);
    } catch (err) {
      setTutorError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally { setLoading(false); }
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setAuthMessage("Configure as variáveis do Supabase para habilitar o acesso.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword
    });
    setAuthMessage(error ? error.message : "Acesso realizado com sucesso.");
  }

  const nav: { label: NavKey; icon: typeof Compass }[] = [
    { label: "Visão geral", icon: Compass },
    { label: "Academia", icon: GraduationCap },
    { label: "Biblioteca", icon: Library },
    { label: "Tutor IA", icon: Brain }
  ];

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">A.</div>
          <div><strong>ATLAS</strong><span>ACADEMY</span></div>
          <button className="icon-button close-mobile" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={18}/></button>
        </div>
        <div className="workspace-label">AMBIENTE PESSOAL</div>
        <nav className="main-nav">
          {nav.map(item => {
            const Icon = item.icon;
            return <button key={item.label} className={`nav-item ${active === item.label ? "active" : ""}`} onClick={() => { setActive(item.label); setMobileOpen(false); }}>
              <Icon size={18}/><span>{item.label}</span>{active === item.label && <span className="nav-indicator"/>}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><Shield size={16}/><span>Seu espaço de aprendizagem, sob seu controle.</span></div>
          <button className="profile-button" onClick={() => setShowAuth(v => !v)}>
            <div className="avatar">A</div><div><strong>Estudante</strong><span>{isSupabaseConfigured ? "Acessar conta" : "Modo de demonstração"}</span></div><ChevronDown size={15}/>
          </button>
          {showAuth && <form className="auth-popover" onSubmit={signIn}>
            <strong>Acessar sua conta</strong>
            <input type="email" placeholder="E-mail" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required/>
            <input type="password" placeholder="Senha" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required/>
            <button className="button button-dark" type="submit">Entrar</button>
            {authMessage && <small>{authMessage}</small>}
          </form>}
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button className="icon-button menu-mobile" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={20}/></button>
          <div className="breadcrumb">ATLAS <span>/</span> {active.toUpperCase()}</div>
          <div className="topbar-right"><span className="status-dot"/> <span>AMBIENTE DE ESTUDO</span><div className="top-avatar">A</div></div>
        </header>

        <div className="content">
          {active === "Visão geral" && <>
            <section className="welcome-row">
              <div><div className="eyebrow">SUA JORNADA DE APRENDIZAGEM</div><h1>Conhecimento se constrói.<br/><em>Um dia de cada vez.</em></h1><p>Um espaço para estudar com intenção, conectar ideias e desenvolver autonomia intelectual.</p></div>
              <div className="welcome-stamp"><span>EST.</span><strong>2026</strong><small>LEARN · THINK · APPLY</small></div>
            </section>

            <section className="daily-card">
              <div className="daily-copy"><div className="eyebrow light">SUA PRÓXIMA SESSÃO</div><h2>O que é poder político?</h2><p>Entenda como o poder se organiza, se legitima e influencia a vida em sociedade.</p><div className="daily-meta"><span><Clock3 size={15}/> 35 minutos</span><span><BookOpen size={15}/> Fundamentos</span></div></div>
              <div className="daily-action"><div className="session-index">AULA 01 <span>·</span> POLÍTICA</div><button className="button button-light" onClick={() => setActive("Academia")}>Entrar na academia <ArrowRight size={16}/></button></div>
            </section>

            <section className="metrics-grid">
              <div className="metric-card"><div className="metric-head"><span>SESSÕES CONCLUÍDAS</span><Check size={16}/></div><strong>{completed.length}<small> / {schedule.length}</small></strong><div className="metric-foot">Nesta semana · demonstração</div></div>
              <div className="metric-card"><div className="metric-head"><span>PROGRESSO SEMANAL</span><Activity size={16}/></div><strong>{progress}<small>%</small></strong><div className="progress-track"><span style={{width: `${progress}%`}}/></div></div>
              <div className="metric-card"><div className="metric-head"><span>TEMPO DE ESTUDO</span><Clock3 size={16}/></div><strong>{completed.length * 35}<small> min</small></strong><div className="metric-foot">Tempo estimado · demonstração</div></div>
            </section>

            <section className="section-block">
              <div className="section-heading"><div><div className="eyebrow">CURRÍCULO INTERDISCIPLINAR</div><h2>Campos do conhecimento</h2></div><button className="text-button" onClick={() => setActive("Academia")}>Ver academia <ArrowRight size={15}/></button></div>
              <div className="subject-grid">{subjects.map(s => {const Icon=s.icon; return <button className="subject-card" key={s.id} onClick={() => setActive("Academia")}><div className={`subject-icon ${s.id}`}><Icon size={20}/></div><span className="subject-tag">{s.tag}</span><h3>{s.title}</h3><p>{s.desc}</p><span className="card-arrow"><ArrowRight size={16}/></span></button>;})}</div>
            </section>

            <section className="section-block lower-grid">
              <div className="schedule-panel"><div className="section-heading compact"><div><div className="eyebrow">PLANEJAMENTO</div><h2>Ritmo da semana</h2></div><span className="small-count">{completed.length} DE {schedule.length}</span></div>
                <div className="schedule-list">{schedule.map(item => <button key={item.day} className={`schedule-row ${completed.includes(item.day) ? "is-done" : ""}`} onClick={() => setCompleted(old => old.includes(item.day) ? old.filter(x=>x!==item.day) : [...old,item.day])}><span className="day-chip">{item.day}</span><span className="schedule-info"><strong>{item.lesson}</strong><small>{item.subject}</small></span><span className="schedule-time">{item.time}</span><span className="check-circle">{completed.includes(item.day) && <Check size={13}/>}</span></button>)}</div>
              </div>
              <div className="principle-panel"><div className="principle-icon"><Sparkles size={20}/></div><div className="eyebrow">PRINCÍPIO ATLAS</div><h2>Aprender não é acumular informações.</h2><p>É construir modelos mentais, testar ideias e saber usar o que você aprendeu em situações novas.</p><span>01 — COMPREENDER ANTES DE MEMORIZAR</span></div>
            </section>
          </>}

          {active === "Academia" && <section className="page-section"><div className="eyebrow">CURRÍCULO</div><h1>Academia</h1><p className="page-intro">Explore os campos de conhecimento e construa uma formação interdisciplinar.</p><div className="search-box"><Search size={18}/><input placeholder="Buscar disciplina..." value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="subject-grid academy-grid">{filtered.map(s=>{const Icon=s.icon;return <article className="subject-card academy-subject" key={s.id}><div className={`subject-icon ${s.id}`}><Icon size={20}/></div><span className="subject-tag">{s.tag}</span><h3>{s.title}</h3><p>{s.desc}</p><div className="course-footer"><span>Trilha introdutória · em construção</span><button onClick={()=>setActive("Tutor IA")} aria-label={`Estudar ${s.title}`}><ArrowRight size={17}/></button></div></article>;})}</div></section>}

          {active === "Biblioteca" && <section className="page-section"><div className="eyebrow">RECURSOS E REFERÊNCIAS</div><h1>Biblioteca</h1><p className="page-intro">Um acervo organizado para apoiar suas aulas, pesquisas e projetos.</p><div className="library-feature"><Library size={28}/><div><h2>Seu acervo começa aqui.</h2><p>A estrutura está preparada para receber livros, artigos, vídeos, documentos e fichamentos. O catálogo editorial será construído junto com o currículo.</p></div></div><div className="empty-state"><BookOpen size={24}/><strong>Nenhum recurso cadastrado ainda</strong><span>Os materiais serão organizados por disciplina, tema e nível de aprofundamento.</span></div></section>}

          {active === "Tutor IA" && <section className="page-section tutor-page"><div className="eyebrow">ASSISTENTE ACADÊMICO</div><h1>Tutor ATLAS</h1><p className="page-intro">Faça perguntas, peça explicações e investigue conceitos com orientação didática.</p><div className="tutor-layout"><div className="tutor-intro"><div className="tutor-orb"><Brain size={30}/></div><h2>Um parceiro para pensar melhor.</h2><p>O tutor deve explicar fundamentos, comparar perspectivas, propor exemplos e ajudar você a testar o próprio entendimento.</p><div className="tutor-capabilities"><span><Check size={14}/> Explicações passo a passo</span><span><Check size={14}/> Exemplos e analogias</span><span><Check size={14}/> Perguntas de verificação</span></div></div><form className="tutor-chat" onSubmit={askTutor}><div className="chat-header"><span className="online-dot"/> TUTOR ACADÊMICO <span className="chat-model">ATLAS AI</span></div><div className="chat-body">{answer ? <div className="answer-bubble">{answer}</div> : tutorError ? <div className="error-bubble">{tutorError}</div> : <div className="chat-placeholder"><MessageSquareText size={25}/><strong>O que você gostaria de compreender?</strong><span>Experimente perguntar sobre um conceito, acontecimento ou problema.</span></div>}</div><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Digite sua pergunta..." rows={3}/><div className="chat-footer"><span>Confira informações importantes em fontes confiáveis.</span><button className="button button-dark" disabled={loading || !question.trim()}>{loading ? "Consultando..." : "Enviar pergunta"} <ArrowRight size={15}/></button></div></form></div></section>}
          <footer className="footer"><span>ATLAS ACADEMY</span><span>CONHECIMENTO EM CONSTRUÇÃO · 2026</span></footer>
        </div>
      </section>
    </main>
  );
}
