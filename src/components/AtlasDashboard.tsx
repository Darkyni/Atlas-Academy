"use client";

import { useEffect, useState } from "react";
import {
  Activity, ArrowRight, Atom, BookOpen, Brain, Check, ChevronDown, Clock3,
  Compass, GraduationCap, Library, Menu, MessageSquareText, Search, Shield,
  Sparkles, X, Scale, Globe2, Code2, Landmark
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { lawCourse, lawLessons } from "@/lib/curriculum";
import { expandedCourses, type AcademyCourse } from "@/lib/expanded-curriculum";
import "@/lib/extended-lessons";
import { learningResources } from "@/lib/resources";
import LessonWorkbench from "@/components/LessonWorkbench";
import CourseAssessment from "@/components/CourseAssessment";
import ResourceLibrary from "@/components/ResourceLibrary";
import LearningLab from "@/components/LearningLab";

const subjects = [
  { id: "direito", title: "Direito e instituições", desc: "Normas, direitos, Estado e pensamento jurídico.", icon: Scale, tag: "Instituições" },
  { id: "economia-financas", title: "Economia e finanças", desc: "Mercados, dinheiro, crédito e decisões econômicas.", icon: Activity, tag: "Economia" },
  { id: "tecnologia-ia", title: "Tecnologia e inteligência artificial", desc: "Computação, IA, redes e segurança digital.", icon: Code2, tag: "Inovação" },
  { id: "historia-geopolitica", title: "História e geopolítica", desc: "Processos históricos, poder e relações internacionais.", icon: Globe2, tag: "Humanidades" },
  { id: "filosofia-pensamento", title: "Filosofia e pensamento crítico", desc: "Lógica, conhecimento, ética e argumentação.", icon: Landmark, tag: "Filosofia" },
  { id: "ciencias-matematica", title: "Ciências e matemática", desc: "Raciocínio quantitativo, física e método científico.", icon: Atom, tag: "Ciências" }
];

const allCourses: AcademyCourse[] = [
  { id: "direito", department: "Direito e instituições", ...lawCourse, outcomes: ["Compreender o Direito como sistema normativo e instituição social.", "Reconhecer a estrutura do Estado e da Constituição.", "Distinguir direitos, deveres e ramos jurídicos."], lessons: lawLessons },
  ...expandedCourses
];

const courseModuleLabels = ["Fundamentos e linguagem", "Mecanismos e modelos", "Aplicação e aprofundamento", "Síntese e extensão"];

const schedule = [
  { day: "SEG", subject: "Economia e finanças", lesson: "Escassez e custo de oportunidade", time: "40 min", courseId: "economia-financas", lessonId: "eco-01" },
  { day: "TER", subject: "Direito e instituições", lesson: "O que é o Direito?", time: "35 min", courseId: "direito", lessonId: "direito-01" },
  { day: "QUA", subject: "Tecnologia e IA", lesson: "Como funciona um computador?", time: "45 min", courseId: "tecnologia-ia", lessonId: "tec-01" },
  { day: "QUI", subject: "História e geopolítica", lesson: "Estados e soberania", time: "45 min", courseId: "historia-geopolitica", lessonId: "his-02" },
  { day: "SEX", subject: "Filosofia e pensamento crítico", lesson: "Argumentos e validade lógica", time: "45 min", courseId: "filosofia-pensamento", lessonId: "fil-02" },
  { day: "SÁB", subject: "Ciências e matemática", lesson: "Proporções e porcentagens", time: "45 min", courseId: "ciencias-matematica", lessonId: "cie-01" }
];

type NavKey = "Visão geral" | "Academia" | "Biblioteca" | "Laboratório" | "Tutor IA";

export default function AtlasDashboard() {
  const [active, setActive] = useState<NavKey>("Visão geral");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [tutorArea, setTutorArea] = useState("Interdisciplinar");
  const [answer, setAnswer] = useState("");
  const [tutorError, setTutorError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const selectedCourse = allCourses.find(course => course.id === selectedCourseId) ?? allCourses[0];
  const selectedLesson = allCourses.flatMap(course => course.lessons).find(lesson => lesson.id === selectedLessonId) ?? null;
  const selectedLessonIndex = selectedCourse.lessons.findIndex(lesson => lesson.id === selectedLessonId);
  const relatedResources = selectedLesson ? learningResources.filter(resource => resource.lessonIds?.includes(selectedLesson.id) || resource.department === selectedCourse.department).slice(0, 4) : [];

  useEffect(() => {
    let cancelled = false;
    async function loadProgress() {
      let savedIds: string[] = [];
      try {
        const saved = window.localStorage.getItem("atlas-law-completed-lessons");
        if (saved) savedIds = JSON.parse(saved);
      } catch { /* armazenamento local indisponível */ }
      if (supabase) {
        try {
          const { data: auth } = await supabase.auth.getUser();
          if (auth.user) {
            const { data, error } = await supabase.from("student_lesson_progress")
              .select("lesson_id").eq("user_id", auth.user.id).eq("completed", true);
            if (!error) {
              const cloudIds = data?.map(item => item.lesson_id) || [];
              const localOnlyIds = savedIds.filter(id => !cloudIds.includes(id));
              savedIds = [...new Set([...savedIds, ...cloudIds])];
              if (localOnlyIds.length) {
                await supabase.from("student_lesson_progress").upsert(localOnlyIds.map(lesson_id => ({
                  user_id: auth.user!.id, lesson_id,
                  course_id: allCourses.find(course => course.lessons.some(lesson => lesson.id === lesson_id))?.id || "direito",
                  completed: true, score: 100,
                  completed_at: new Date().toISOString(), updated_at: new Date().toISOString()
                })), { onConflict: "user_id,lesson_id" });
              }
            }
          }
        } catch { /* mantém a cópia local se a sincronização estiver indisponível */ }
      }
      if (!cancelled) {
        setCompletedLessons(savedIds);
        setProgressLoaded(true);
      }
    }
    void loadProgress();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    try { window.localStorage.setItem("atlas-law-completed-lessons", JSON.stringify(completedLessons)); }
    catch { /* armazenamento local indisponível */ }
  }, [completedLessons, progressLoaded]);

  function openCourse(id: string) {
    setSelectedCourseId(id);
    setSelectedLessonId(null);
    setQuizChoice(null);
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openLesson(id: string) {
    setSelectedLessonId(id);
    setQuizChoice(null);
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function finishLesson() {
    if (!selectedLessonId) return;
    setCompletedLessons(old => old.includes(selectedLessonId) ? old : [...old, selectedLessonId]);
    if (supabase) {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user) {
          await supabase.from("student_lesson_progress").upsert({
            user_id: auth.user.id,
            lesson_id: selectedLessonId,
            course_id: selectedCourse.id,
            completed: true,
            score: 100,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id,lesson_id" });
        }
      } catch { /* a conclusão local permanece disponível */ }
    }
  }


  const completedScheduleCount = schedule.filter(item => completedLessons.includes(item.lessonId)).length;
  const totalLessonsCount = allCourses.reduce((sum, course) => sum + course.lessons.length, 0);
  const completedAllCount = allCourses.reduce((sum, course) => sum + course.lessons.filter(lesson => completedLessons.includes(lesson.id)).length, 0);
  const completedAllMinutes = allCourses.reduce((sum, course) => sum + course.lessons.filter(lesson => completedLessons.includes(lesson.id)).reduce((minutes, lesson) => minutes + lesson.duration, 0), 0);
  const progress = Math.round((completedAllCount / Math.max(1, totalLessonsCount)) * 100);
  const nextSchedule = schedule.find(item => !completedLessons.includes(item.lessonId)) || schedule[0];

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
          context: `Estudante iniciante em formação interdisciplinar. Área prioritária: ${tutorArea}. Explique progressivamente, conecte conceitos a exemplos concretos e indique quando um tema exigir conhecimento prévio.`
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
    if (!error) {
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        const { data } = await supabase.from("student_lesson_progress").select("lesson_id").eq("user_id", auth.user.id).eq("completed", true);
        const cloudIds = data?.map(item => item.lesson_id) || [];
        const localOnlyIds = completedLessons.filter(id => !cloudIds.includes(id));
        if (data?.length) setCompletedLessons(old => [...new Set([...old, ...cloudIds])]);
        if (localOnlyIds.length) {
          await supabase.from("student_lesson_progress").upsert(localOnlyIds.map(lesson_id => ({
            user_id: auth.user!.id, lesson_id,
            course_id: allCourses.find(course => course.lessons.some(lesson => lesson.id === lesson_id))?.id || "direito",
            completed: true, score: 100,
            completed_at: new Date().toISOString(), updated_at: new Date().toISOString()
          })), { onConflict: "user_id,lesson_id" });
        }
      }
    }
    setAuthMessage(error ? error.message : "Acesso realizado com sucesso.");
  }

  const nav: { label: NavKey; icon: typeof Compass }[] = [
    { label: "Visão geral", icon: Compass },
    { label: "Academia", icon: GraduationCap },
    { label: "Biblioteca", icon: Library },
    { label: "Laboratório", icon: Brain },
    { label: "Tutor IA", icon: MessageSquareText }
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
          <div className="content-stage" key={`${active}-${selectedCourseId}-${selectedLessonId ?? "course-index"}`}>
          {active === "Visão geral" && <>
            <section className="welcome-row">
              <div><div className="eyebrow">SUA JORNADA DE APRENDIZAGEM</div><h1>Conhecimento se constrói.<br/><em>Um dia de cada vez.</em></h1><p>Um espaço para estudar com intenção, conectar ideias e desenvolver autonomia intelectual.</p></div>
              <div className="welcome-stamp"><span>EST.</span><strong>2026</strong><small>LEARN · THINK · APPLY</small></div>
            </section>

            <section className="daily-card">
              <div className="daily-copy"><div className="eyebrow light">SUA PRÓXIMA SESSÃO · {nextSchedule.subject.toUpperCase()}</div><h2>{nextSchedule.lesson}</h2><p>Continue sua trilha interdisciplinar com uma aula, uma questão comentada e uma aplicação prática.</p><div className="daily-meta"><span><Clock3 size={15}/> {nextSchedule.time}</span><span><BookOpen size={15}/> Estudo orientado</span></div></div>
              <div className="daily-action"><div className="session-index">{nextSchedule.day} <span>·</span> PRÓXIMA AULA</div><button className="button button-light" onClick={() => {setActive("Academia");openCourse(nextSchedule.courseId);openLesson(nextSchedule.lessonId);}}>Começar aula <ArrowRight size={16}/></button></div>
            </section>

            <section className="metrics-grid">
              <div className="metric-card"><div className="metric-head"><span>AULAS CONCLUÍDAS</span><Check size={16}/></div><strong>{completedAllCount}<small> / {totalLessonsCount}</small></strong><div className="metric-foot">Em todos os departamentos</div></div>
              <div className="metric-card"><div className="metric-head"><span>PROGRESSO GERAL</span><Activity size={16}/></div><strong>{progress}<small>%</small></strong><div className="progress-track"><span style={{width: `${progress}%`}}/></div></div>
              <div className="metric-card"><div className="metric-head"><span>TEMPO ESTIMADO</span><Clock3 size={16}/></div><strong>{completedAllMinutes}<small> min</small></strong><div className="metric-foot">Duração das aulas concluídas</div></div>
            </section>

            <section className="section-block">
              <div className="section-heading"><div><div className="eyebrow">CURRÍCULO INTERDISCIPLINAR</div><h2>Campos do conhecimento</h2></div><button className="text-button" onClick={() => setActive("Academia")}>Ver academia <ArrowRight size={15}/></button></div>
              <div className="subject-grid">{subjects.map(s => {const Icon=s.icon; return <button className="subject-card" key={s.id} onClick={() => { openCourse(s.id); setActive("Academia"); }}><div className={`subject-icon ${s.id}`}><Icon size={20}/></div><span className="subject-tag">{s.tag}</span><h3>{s.title}</h3><p>{s.desc}</p><span className="card-arrow"><ArrowRight size={16}/></span></button>;})}</div>
            </section>

            <section className="section-block lower-grid">
              <div className="schedule-panel"><div className="section-heading compact"><div><div className="eyebrow">PLANEJAMENTO</div><h2>Ritmo da semana</h2></div><span className="small-count">{completedScheduleCount} DE {schedule.length}</span></div>
                <div className="schedule-list">{schedule.map(item => <button key={item.day} className={`schedule-row ${completedLessons.includes(item.lessonId) ? "is-done" : ""}`} onClick={() => { setActive("Academia"); openCourse(item.courseId); openLesson(item.lessonId); }}><span className="day-chip">{item.day}</span><span className="schedule-info"><strong>{item.lesson}</strong><small>{item.subject}</small></span><span className="schedule-time">{item.time}</span><span className="check-circle">{completedLessons.includes(item.lessonId) && <Check size={13}/>}</span></button>)}</div>
              </div>
              <div className="principle-panel"><div className="principle-icon"><Sparkles size={20}/></div><div className="eyebrow">PRINCÍPIO ATLAS</div><h2>Aprender não é acumular informações.</h2><p>É construir modelos mentais, testar ideias e saber usar o que você aprendeu em situações novas.</p><span>01 — COMPREENDER ANTES DE MEMORIZAR</span></div>
            </section>
          </>}

          {active === "Academia" && <section className="page-section">
            {selectedLesson ? <>
              <button className="text-button lesson-back" onClick={() => setSelectedLessonId(null)}><ArrowRight size={14} className="back-arrow"/> Voltar ao curso</button>
              <div className="eyebrow">{selectedCourse.department.toUpperCase()} · AULA {String(selectedLessonIndex + 1).padStart(2,"0")}</div>
              <h1>{selectedLesson.title}</h1>
              <p className="page-intro">{selectedLesson.objective}</p>
              <div className="lesson-meta"><span><Clock3 size={14}/>{selectedLesson.duration} minutos</span><span><BookOpen size={14}/> Nível {selectedCourse.level.toLowerCase()}</span><span><GraduationCap size={14}/>{selectedCourse.title}</span></div>
              <article className="lesson-paper">
                <div className="lesson-callout"><strong>Antes de começar</strong><p>{selectedLesson.objective}</p></div>
                {selectedLesson.sections.map((section,index)=><section className="lesson-content-section" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}{section.points && <ul>{section.points.map(point=><li key={point}>{point}</li>)}</ul>}</section>)}
                <section className="lesson-content-section"><h2>Estudo de caso</h2><p>{selectedLesson.caseStudy}</p></section>
                <section className="lesson-content-section"><h2>Conceitos essenciais</h2><div className="term-grid">{selectedLesson.keyTerms.map(term=><div className="term-card" key={term.term}><strong>{term.term}</strong><p>{term.definition}</p></div>)}</div></section>
                <section className="quiz-panel"><div className="eyebrow">VERIFICAÇÃO DE APRENDIZAGEM</div><h2>{selectedLesson.question.prompt}</h2><div className="quiz-options">{selectedLesson.question.options.map((option,index)=><button key={option} className={`quiz-option ${quizSubmitted && index===selectedLesson.question.correct ? "correct" : ""} ${quizSubmitted && quizChoice===index && index!==selectedLesson.question.correct ? "incorrect" : ""} ${quizChoice===index ? "chosen" : ""}`} onClick={()=>{setQuizChoice(index);setQuizSubmitted(false);}}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div><button className="button button-dark" disabled={quizChoice===null} onClick={()=>setQuizSubmitted(true)}>Conferir resposta</button>{quizSubmitted && <div className={`quiz-feedback ${quizChoice===selectedLesson.question.correct ? "right" : "wrong"}`}><strong>{quizChoice===selectedLesson.question.correct ? "Resposta correta." : "Vamos revisar esse ponto."}</strong><p>{selectedLesson.question.explanation}</p></div>}</section>
                <section className="lesson-content-section reflection-box"><h2>Para refletir</h2><p>{selectedLesson.reflection}</p></section>
                <section className="lesson-content-section"><h2>Referências para aprofundamento</h2><ul>{selectedLesson.references.map(ref=><li key={ref}>{ref}</li>)}</ul></section>
                {relatedResources.length>0 && <section className="lesson-content-section related-resources"><h2>Materiais relacionados</h2><p>Continue o estudo em fontes oficiais, livros e materiais acadêmicos selecionados para esta área.</p><div>{relatedResources.map(resource=><a key={resource.id} href={resource.url} target="_blank" rel="noreferrer"><strong>{resource.title}</strong><span>{resource.institution} · {resource.kind}</span></a>)}</div></section>}
                <LessonWorkbench lessonId={selectedLesson.id} reflectionPrompt={selectedLesson.reflection} casePrompt={selectedLesson.caseStudy}/>
                <div className="lesson-completion"><div><strong>{completedLessons.includes(selectedLesson.id) ? "Aula marcada como concluída" : "Terminou esta aula?"}</strong><p>Conclua depois de estudar o conteúdo e responder à questão de verificação.</p></div><button className="button button-dark" onClick={finishLesson} disabled={completedLessons.includes(selectedLesson.id) || !quizSubmitted || quizChoice!==selectedLesson.question.correct}>{completedLessons.includes(selectedLesson.id) ? <><Check size={15}/> Concluída</> : <>Marcar como concluída <ArrowRight size={15}/></>}</button></div>
              </article>
            </> : selectedCourseId ? <>
              <button className="text-button lesson-back" onClick={() => setSelectedCourseId(null)}><ArrowRight size={14} className="back-arrow"/> Todos os departamentos</button>
              <div className="eyebrow">{selectedCourse.department.toUpperCase()} · TRILHA INTRODUTÓRIA</div>
              <h1>{selectedCourse.title}</h1><p className="page-intro">{selectedCourse.subtitle}</p>
              <div className="course-feature"><div><div className="eyebrow light">CURSO · {selectedCourse.level.toUpperCase()}</div><h2>{selectedCourse.title}</h2><p>{selectedCourse.description}</p><div className="course-feature-meta"><span><BookOpen size={14}/>{selectedCourse.workload}</span><span><GraduationCap size={14}/>{selectedCourse.level}</span></div></div><div className="course-feature-mark">A.</div></div>
              <div className="course-progress"><div><strong>Seu percurso</strong><span>{selectedCourse.lessons.filter(lesson=>completedLessons.includes(lesson.id)).length} de {selectedCourse.lessons.length} aulas concluídas</span></div><div className="progress-track"><span style={{width:`${selectedCourse.lessons.filter(lesson=>completedLessons.includes(lesson.id)).length/selectedCourse.lessons.length*100}%`}}/></div></div>
              <div className="course-layout"><div className="course-main"><div className="section-heading"><div><div className="eyebrow">PROGRAMA DO CURSO</div><h2>Sequência de aprendizagem</h2></div><span className="small-count">{selectedCourse.lessons.length} AULAS</span></div><div className="lesson-list">{selectedCourse.lessons.map((lesson,index)=><div key={lesson.id}>{index%3===0&&<div className="course-module-label"><span>MÓDULO {Math.floor(index/3)+1}</span><strong>{courseModuleLabels[Math.min(Math.floor(index/3),courseModuleLabels.length-1)]}</strong></div>}<button className="lesson-list-item" onClick={()=>openLesson(lesson.id)}><span className={`lesson-number ${completedLessons.includes(lesson.id)?"done":""}`}>{completedLessons.includes(lesson.id)?<Check size={14}/>:String(index+1).padStart(2,"0")}</span><span className="lesson-list-copy"><strong>{lesson.title}</strong><small>{lesson.objective}</small></span><span className="lesson-duration">{lesson.duration} min</span><ArrowRight size={16}/></button></div>)}</div></div><aside className="course-aside"><div className="eyebrow">RESULTADOS DE APRENDIZAGEM</div><h3>Ao concluir, você deverá conseguir:</h3><ul>{selectedCourse.outcomes.map(outcome=><li key={outcome}>{outcome}</li>)}</ul><div className="course-aside-stat"><strong>{selectedCourse.lessons.length}</strong><span>aulas estruturadas</span></div><div className="course-aside-stat"><strong>1</strong><span>questão comentada por aula</span></div></aside></div>
              <CourseAssessment courseId={selectedCourse.id} lessons={selectedCourse.lessons} completedCount={selectedCourse.lessons.filter(lesson=>completedLessons.includes(lesson.id)).length}/>
            </> : <>
              <div className="eyebrow">CURRÍCULO E FORMAÇÃO</div><h1>Academia</h1><p className="page-intro">Seis departamentos, cursos progressivos e aprendizagem conectada. Escolha uma área para abrir sua trilha de estudos.</p>
              <div className="search-box"><Search size={18}/><input placeholder="Buscar departamento ou curso..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
              <div className="subject-grid academy-grid">{allCourses.filter(course => `${course.title} ${course.department} ${course.description}`.toLowerCase().includes(query.toLowerCase())).map(course=>{
                const subject = subjects.find(item=>item.id===course.id) ?? subjects[0]; const Icon=subject.icon;
                const done=course.lessons.filter(lesson=>completedLessons.includes(lesson.id)).length;
                return <button className="subject-card academy-subject" key={course.id} onClick={()=>openCourse(course.id)}><div className={`subject-icon ${course.id}`}><Icon size={20}/></div><span className="subject-tag">{course.department}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-footer"><span>{course.lessons.length} aulas · {course.level}</span><span>{done}/{course.lessons.length} concluídas</span></div><span className="card-arrow"><ArrowRight size={16}/></span></button>;
              })}</div>
            </>}
            {!selectedLesson && !selectedCourseId && <div className="section-block course-catalog-note"><div className="eyebrow">ESTRUTURA ACADÊMICA</div><h2>Aprender com profundidade e conexão</h2><p className="page-intro">Cada aula combina explicação teórica, conceitos essenciais, estudo de caso, questão comentada, reflexão e referências. A Biblioteca reúne fontes por departamento e o Laboratório oferece revisão espaçada e desafios aplicados.</p></div>}
          </section>}

          {active === "Biblioteca" && <ResourceLibrary/>}

          {active === "Laboratório" && <LearningLab/>}

          {active === "Tutor IA" && <section className="page-section tutor-page"><div className="eyebrow">ASSISTENTE ACADÊMICO</div><h1>Tutor ATLAS</h1><p className="page-intro">Faça perguntas, peça explicações e investigue conceitos com orientação didática.</p><div className="tutor-layout"><div className="tutor-intro"><div className="tutor-orb"><Brain size={30}/></div><h2>Um parceiro para pensar melhor.</h2><p>O tutor deve explicar fundamentos, comparar perspectivas, propor exemplos e ajudar você a testar o próprio entendimento.</p><div className="tutor-capabilities"><span><Check size={14}/> Explicações passo a passo</span><span><Check size={14}/> Exemplos e analogias</span><span><Check size={14}/> Perguntas de verificação</span></div></div><form className="tutor-chat" onSubmit={askTutor}><div className="chat-header"><span className="online-dot"/> TUTOR ACADÊMICO <span className="chat-model">ATLAS AI</span></div><div className="chat-body">{answer ? <div className="answer-bubble">{answer}</div> : tutorError ? <div className="error-bubble">{tutorError}</div> : <div className="chat-placeholder"><MessageSquareText size={25}/><strong>O que você gostaria de compreender?</strong><span>Experimente perguntar sobre um conceito, acontecimento ou problema.</span></div>}</div><label className="tutor-area-label">Área de aprofundamento<select value={tutorArea} onChange={event=>setTutorArea(event.target.value)}><option>Interdisciplinar</option><option>Direito e instituições</option><option>Economia e Finanças</option><option>Tecnologia e Inteligência Artificial</option><option>História e Geopolítica</option><option>Filosofia e Pensamento Crítico</option><option>Ciências e Matemática</option></select></label><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Digite sua pergunta..." rows={3}/><div className="chat-footer"><span>Confira informações importantes em fontes confiáveis.</span><button className="button button-dark" disabled={loading || !question.trim()}>{loading ? "Consultando..." : "Enviar pergunta"} <ArrowRight size={15}/></button></div></form></div></section>}
          </div>
          <footer className="footer"><span>ATLAS ACADEMY</span><span>CONHECIMENTO EM CONSTRUÇÃO · 2026</span></footer>
        </div>
      </section>
    </main>
  );
}
