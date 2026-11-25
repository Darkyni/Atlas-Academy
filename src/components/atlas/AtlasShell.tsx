import type { ReactNode } from "react";
import {
  Brain, CalendarDays, Compass, GraduationCap, Library, BookOpen,
  MessageSquareText, Shield, Sparkles, Menu, Search, X, GitBranch, FileCheck2, Activity
} from "lucide-react";

export type AtlasNavKey =
  | "Visão geral"
  | "Academia"
  | "Plano de estudos"
  | "Biblioteca"
  | "Caderno de pesquisa"
  | "Mapa de conceitos"
  | "Portfólio de evidências"
  | "Inteligência acadêmica"
  | "Laboratório"
  | "Prática aplicada"
  | "Campo & Engenharia"
  | "Tutor IA";

type AtlasNavItem = { label: AtlasNavKey; icon: typeof Compass; group: string };
const navigation: AtlasNavItem[] = [
  { label: "Visão geral", icon: Compass, group: "ESPAÇO DE ESTUDO" },
  { label: "Academia", icon: GraduationCap, group: "ESPAÇO DE ESTUDO" },
  { label: "Plano de estudos", icon: CalendarDays, group: "ESPAÇO DE ESTUDO" },
  { label: "Biblioteca", icon: Library, group: "PESQUISA E PRÁTICA" },
  { label: "Caderno de pesquisa", icon: BookOpen, group: "PESQUISA E PRÁTICA" },
  { label: "Mapa de conceitos", icon: GitBranch, group: "PESQUISA E PRÁTICA" },
  { label: "Portfólio de evidências", icon: FileCheck2, group: "PESQUISA E PRÁTICA" },
  { label: "Inteligência acadêmica", icon: Activity, group: "PESQUISA E PRÁTICA" },
  { label: "Laboratório", icon: Brain, group: "PESQUISA E PRÁTICA" },
  { label: "Prática aplicada", icon: Sparkles, group: "PESQUISA E PRÁTICA" },
  { label: "Campo & Engenharia", icon: Shield, group: "PESQUISA E PRÁTICA" },
  { label: "Tutor IA", icon: MessageSquareText, group: "PESQUISA E PRÁTICA" },
];

export function AtlasSidebar({
  active, mobileOpen, onClose, onNavigate, children,
}: {
  active: AtlasNavKey;
  mobileOpen: boolean;
  onClose: () => void;
  onNavigate: (page: AtlasNavKey) => void;
  children: ReactNode;
}) {
  return (
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><img src="/atlas-mark.svg" alt="" width="42" height="42"/></div>
        <div><strong>ATLAS</strong><span>ACADEMY</span></div>
        <button className="icon-button close-mobile" onClick={onClose} aria-label="Fechar menu"><X size={18}/></button>
      </div>
      <div className="workspace-label">ACADEMIA PESSOAL · ESPAÇO PRIVADO</div>
      <nav className="main-nav" aria-label="Navegação principal">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const showGroup = index === 0 || navigation[index - 1].group !== item.group;
          return (
            <div key={item.label} className="nav-entry">
              {showGroup && <div className="nav-group-label">{item.group}</div>}
              <button className={`nav-item ${active === item.label ? "active" : ""}`} aria-current={active === item.label ? "page" : undefined} onClick={() => onNavigate(item.label)}>
                <Icon size={18}/><span>{item.label}</span>{active === item.label && <span className="nav-indicator"/>}
              </button>
            </div>
          );
        })}
      </nav>
      <div className="sidebar-bottom">{children}</div>
    </aside>
  );
}

export function AtlasTopbar({
  active, initials, onOpenMenu, onSearch, onOpenAccount,
}: {
  active: AtlasNavKey;
  initials: string;
  onOpenMenu: () => void;
  onSearch: () => void;
  onOpenAccount: () => void;
}) {
  return (
    <header className="topbar">
      <button className="icon-button menu-mobile" onClick={onOpenMenu} aria-label="Abrir menu"><Menu size={20}/></button>
      <div className="breadcrumb"><span className="breadcrumb-root">ATLAS</span><span>/</span>{active.toUpperCase()}</div>
      <div className="topbar-right">
        <button className="topbar-search" onClick={onSearch}><Search size={15}/><span>Explorar conteúdos</span><kbd>Ctrl K</kbd></button>
        <span className="status-dot" aria-hidden="true"/> <span className="environment-label">ESPAÇO PRIVADO</span>
        <button className="top-avatar" onClick={onOpenAccount} aria-label="Abrir conta">{initials}</button>
      </div>
    </header>
  );
}
