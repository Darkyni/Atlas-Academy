"use client";

import { Award, BookOpen, Crown, Flame, Gem, LockKeyhole, Shield, Sparkles, Swords, Trophy } from "lucide-react";

type Branch = { id: string; title: string; completed: number; total: number; color: string; symbol: string };
type Props = { completed: number; total: number; branches: Branch[]; onOpenBranch: (id: string) => void; showBranches?: boolean };

const ranks = ["Iniciado do Conhecimento", "Explorador", "Pesquisador", "Estrategista", "Erudito", "Mestre do Atlas", "Guardião do Saber"];

export default function RpgCommandDeck({ completed, total, branches, onOpenBranch, showBranches = false }: Props) {
  // XP is derived from completed lessons, so it cannot be duplicated by refreshing the page.
  const xp = completed * 80 + Math.floor(completed / 5) * 120;
  const level = Math.floor(xp / 600) + 1;
  const currentLevelXp = xp % 600;
  const rank = ranks[Math.min(ranks.length - 1, Math.floor((level - 1) / 2))];
  const percent = total ? Math.round(completed / total * 100) : 0;
  const nextMilestone = Math.ceil((completed + 1) / 5) * 5;

  return <section className={`rpg-command-deck ${showBranches ? "rpg-command-deck-expanded" : ""}`} aria-label="Painel de progressão ATLAS">
    <div className="rpg-hud-main">
      <div className="rpg-emblem"><Shield size={22}/><span>ATLAS</span></div>
      <div className="rpg-player"><span className="rpg-kicker">SUA JORNADA · NÍVEL {level}</span><strong>{rank}</strong><small>{completed} de {total} conhecimentos registrados</small></div>
      <div className="rpg-xp-block"><div className="rpg-xp-label"><span><Sparkles size={13}/> EXPERIÊNCIA</span><b>{xp.toLocaleString("pt-BR")} XP</b></div><div className="rpg-xp-track"><i style={{ width: `${currentLevelXp / 600 * 100}%` }}/></div><small>{600 - currentLevelXp} XP para o próximo nível</small></div>
      <div className="rpg-completion"><div className="rpg-completion-ring" style={{ "--progress": `${percent}%` } as React.CSSProperties}><strong>{percent}%</strong></div><small>JORNADA</small></div>
    </div>
    {showBranches && <div className="rpg-quest-panel">
      <div className="rpg-quest-heading"><div><span className="rpg-kicker">MAPA DE PROGRESSÃO</span><h2>Seis territórios do conhecimento</h2><p>Cada departamento evolui por sua própria trilha. Avance estudando e concluindo aulas.</p></div><div className="rpg-quest-seal"><Crown size={19}/><span>MISSÃO<br/>PRINCIPAL</span></div></div>
      <div className="rpg-branch-grid">{branches.map((branch, index) => {
        const branchPercent = branch.total ? Math.round(branch.completed / branch.total * 100) : 0;
        const Icon = [Shield, Gem, Sparkles, BookOpen, Award, Flame][index] ?? Shield;
        return <button className="rpg-branch-card" key={branch.id} onClick={() => onOpenBranch(branch.id)} style={{ "--branch-color": branch.color } as React.CSSProperties}>
          <span className="rpg-branch-icon"><Icon size={19}/></span><span className="rpg-branch-copy"><strong>{branch.title}</strong><small>{branch.completed}/{branch.total} etapas dominadas</small></span><span className="rpg-branch-percent">{branchPercent}%</span><span className="rpg-branch-track"><i style={{ width: `${branchPercent}%` }}/></span><span className="rpg-branch-open">Explorar território <Swords size={13}/></span>
        </button>;
      })}</div>
      <div className="rpg-next-quest"><span className="rpg-quest-icon"><Trophy size={17}/></span><div><strong>Próximo marco: {nextMilestone} aulas concluídas</strong><small>Conclua aulas com atenção e avance sua experiência. O progresso é calculado a partir dos registros reais de conclusão.</small></div><span className="rpg-quest-reward">+120 XP<br/><small>marco</small></span></div>
    </div>}
  </section>;
}
