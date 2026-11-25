import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type DepartmentIndexItem = { id: string; title: string };
type DepartmentProgressItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  completed: number;
  total: number;
};

export function EditorialDepartmentIndex({ departments }: { departments: DepartmentIndexItem[] }) {
  return (
    <aside className="editorial-index" aria-label="Estrutura da academia">
      <div className="editorial-index-top"><span>ATLAS / ÍNDICE ACADÊMICO</span><span>01—06</span></div>
      <div className="editorial-index-title">Seis áreas.<br/><em>Um repertório integrado.</em></div>
      <ol>
        {departments.map((department, index) => (
          <li key={department.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{department.title}</strong></li>
        ))}
      </ol>
      <div className="editorial-index-foot">ESTUDAR · RELACIONAR · APLICAR</div>
    </aside>
  );
}

export function DepartmentProgressRegister({
  departments,
  onSelect,
}: {
  departments: DepartmentProgressItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="department-register">
      {departments.map((department, index) => {
        const Icon = department.icon;
        const percentage = Math.round((department.completed / Math.max(1, department.total)) * 100);
        return (
          <button className="department-row" key={department.id} onClick={() => onSelect(department.id)}>
            <span className="department-number">{String(index + 1).padStart(2, "0")}</span>
            <span className={`department-symbol ${department.id}`}><Icon size={18}/></span>
            <span className="department-copy"><strong>{department.title}</strong><small>{department.description}</small></span>
            <span className="department-progress"><span>{department.completed}/{department.total} aulas</span><i><b style={{ width: `${percentage}%` }}/></i></span>
            <ArrowRight size={16}/>
          </button>
        );
      })}
    </div>
  );
}
