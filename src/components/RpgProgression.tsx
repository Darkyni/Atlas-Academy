"use client";

import { useEffect, useState } from "react";
import { Activity, Atom, BookOpen, Brain, Crown, Globe2, Landmark, LockKeyhole, Scale, ShieldCheck, Sparkles, Swords, Trophy, Zap, Code2 } from "lucide-react";

type Department = { id: string; title: string; desc: string; lessons: { id: string }[] };

const icons = [Scale, Activity, Code2, Globe2, Landmark, Atom];
const accents = ["law", "economy", "technology", "history", "philosophy", "science"];

export function RpgCommandDeck({ completed, total }: { completed: number; total: number }) {
  const xp = completed * 100 + Math.floor(completed / 3) * 50;
  const level = Math.floor(xp / 600) + 1;
  const currentLevelXp = xp % 600;
  const progress = Math.round((currentLevelXp / 600) * 100);
  const titles = ["Aprendiz", "Explorador", "Pesquisador", "Estrategista", "Erudito", "Mestre do Saber"];
  const title = titles[Math.min(titles.length - 1, Math.floor((level - 1) / 3))];
  return <section className="rpg-command-deck" aria-label="Progresso do personagem">
    <div className="rpg-avatar-seal"><Crown size={20}/><span>{String(level).padStart(2,"0")}</span></div>
    <div className="rpg-player-info"><span className="rpg-kicker">PERSONAGEM · CLASSE DO CONHECIMENTO</span><strong>{title}</strong><small>Nível {level} <i/> {completed} jornadas concluídas</small></div>
    <div className="rpg-xp-block"><div className="rpg-xp-label"><span><Zap size={13}/> EXPERIÊNCIA DE DOMÍNIO</span><strong>{xp.toLocaleString("pt-BR")} XP</strong></div><div className="rpg-xp-track"><i style={{width:`${progress}%`}}/></div><small>{currentLevelXp} / 600 XP para o próximo nível</small></div>
    <div className="rpg-deck-total"><Trophy size={17}/><strong>{completed}/{total}</strong><small>aulas dominadas</small></div>
  </section>;
}

export function RpgWorldMap({ departments, completedIds, onSelect }: { departments: Department[]; completedIds: string[]; onSelect: (id: string) => void }) {
  const totalDone = departments.reduce((sum,d) => sum + d.lessons.filter(l => completedIds.includes(l.id)).length, 0);
  return <section className="rpg-world-section" aria-labelledby="rpg-world-title">
    <div className="rpg-section-heading"><div><span className="rpg-kicker">O MUNDO DO CONHECIMENTO · SEIS TERRITÓRIOS</span><h2 id="rpg-world-title">Escolha sua próxima expedição</h2><p>Cada território desenvolve uma árvore de habilidades própria. O progresso vem de concluir aulas e demonstrar compreensão.</p></div><span className="rpg-world-counter"><Globe2 size={16}/>{totalDone} marcos conquistados</span></div>
    <div className="rpg-world-map">
      <div className="rpg-map-orbit orbit-a"/><div className="rpg-map-orbit orbit-b"/><div className="rpg-map-core"><BookOpen size={24}/><strong>ATLAS</strong><small>ÁRVORE DO SABER</small></div>
      <div className="rpg-territory-grid">{departments.map((d,index)=>{
        const Icon=icons[index] || BookOpen; const done=d.lessons.filter(l=>completedIds.includes(l.id)).length; const pct=Math.round(done/Math.max(1,d.lessons.length)*100); const accent=accents[index] || "law";
        return <button type="button" key={d.id} className={`rpg-territory rpg-${accent}`} onClick={()=>onSelect(d.id)}>
          <span className="rpg-territory-top"><span>REGIÃO 0{index+1}</span><span className="rpg-territory-glyph"><Icon size={20}/></span></span>
          <strong>{d.title}</strong><small>{d.desc}</small>
          <span className="rpg-territory-progress"><i style={{width:`${pct}%`}}/></span>
          <span className="rpg-territory-foot"><span>{done} / {d.lessons.length} aulas</span><span>{pct}%</span></span>
          <span className="rpg-territory-enter">ENTRAR NA REGIÃO <Swords size={13}/></span>
        </button>;
      })}</div>
    </div>
  </section>;
}

export function RpgQuestBoard({ completed, total, onAcademy, onLab, onChallenges }: { completed: number; total: number; onAcademy: () => void; onLab: () => void; onChallenges: () => void }) {
  const [practiceDone, setPracticeDone] = useState({ review: false, challenge: false });
  useEffect(() => {
    try {
      const reviews = JSON.parse(window.localStorage.getItem("atlas-spaced-review-v1") || "{}");
      const tests = JSON.parse(window.localStorage.getItem("atlas-dynamic-test-history-v1") || "[]");
      const arcade = JSON.parse(window.localStorage.getItem("atlas-arcade-scores-v2") || "{}");
      setPracticeDone({ review: Object.keys(reviews).length > 0, challenge: tests.length > 0 || Object.values(arcade).some(Boolean) });
    } catch { /* o quadro continua funcional sem armazenamento local */ }
  }, []);
  const quests = [
    {name:"Primeiro capítulo",desc:"Conclua uma aula e demonstre compreensão na verificação.",done:completed>=1,reward:"+100 XP por aula",action:"Abrir academia",onClick:onAcademy,Icon:BookOpen},
    {name:"Mente em treinamento",desc:"Revise ao menos um cartão com recuperação ativa.",done:practiceDone.review,reward:"Revisão espaçada",action:"Ir ao laboratório",onClick:onLab,Icon:Brain},
    {name:"Prova de coragem",desc:"Finalize um teste ou vença um desafio aplicado.",done:practiceDone.challenge,reward:"Aplicação prática",action:"Entrar nos desafios",onClick:onChallenges,Icon:ShieldCheck}
  ];
  const ratio=Math.round(completed/Math.max(1,total)*100);
  return <section className="rpg-quest-board">
    <div className="rpg-quest-intro"><span className="rpg-kicker">DIÁRIO DE MISSÕES</span><h2>Missões que desenvolvem domínio</h2><p>Não basta acumular pontos. Avance ao estudar, recuperar informações e aplicar ideias em situações novas.</p><div className="rpg-quest-progress"><div><span>JORNADA ACADÊMICA</span><strong>{ratio}%</strong></div><i><b style={{width:`${ratio}%`}}/></i></div></div>
    <div className="rpg-quest-list">{quests.map(({name,desc,done,reward,action,onClick,Icon})=><article className={`rpg-quest ${done?"is-complete":""}`} key={name}><span className="rpg-quest-icon"><Icon size={18}/></span><div className="rpg-quest-copy"><strong>{name}</strong><p>{desc}</p><small>{done?"MISSÃO CONCLUÍDA":reward}</small></div><button type="button" onClick={onClick}>{done?"Concluída":action}</button></article>)}</div>
  </section>;
}


export function RpgAchievementHall({ completed }: { completed: number }) {
  const awards = [
    { at: 1, name: "Primeiro passo", detail: "A primeira aula concluída", Icon: Sparkles },
    { at: 5, name: "Explorador", detail: "Cinco conhecimentos consolidados", Icon: Globe2 },
    { at: 15, name: "Estudioso", detail: "Quinze aulas concluídas", Icon: Brain },
    { at: 30, name: "Arquiteto do saber", detail: "Trinta etapas dominadas", Icon: Crown }
  ];
  return <section className="rpg-achievement-hall" aria-label="Conquistas do personagem">
    <div className="rpg-achievement-heading"><div><span className="rpg-kicker">SALÃO DE CONQUISTAS</span><h2>Marcos da sua jornada</h2></div><span>{awards.filter(a => completed >= a.at).length}/{awards.length} emblemas</span></div>
    <div className="rpg-achievement-grid">{awards.map(({at,name,detail,Icon})=>{
      const earned=completed>=at;
      return <article className={`rpg-achievement ${earned?"earned":"locked"}`} key={name}><span className="rpg-achievement-icon">{earned?<Icon size={19}/>:<LockKeyhole size={17}/>}</span><div><strong>{name}</strong><small>{detail}</small></div><b>{earned?"CONQUISTADO":`EM ${at} AULAS`}</b></article>;
    })}</div>
  </section>;
}
