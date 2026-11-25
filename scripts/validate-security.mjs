import { readFileSync, existsSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const checks = [
  ["A chave OpenAI permanece no servidor", read("src/app/api/mastery/route.ts").includes("process.env.OPENAI_API_KEY") && !read("src/components/MasteryAssessment.tsx").includes("OPENAI_API_KEY")],
  ["Avaliação exige token Bearer", read("src/app/api/mastery/route.ts").includes('authorization.startsWith("Bearer ")')],
  ["Sessão é validada no Supabase", read("src/app/api/mastery/route.ts").includes("authClient.auth.getUser(token)")],
  ["Avaliação tem limite por usuário", read("src/app/api/mastery/route.ts").includes("RATE_LIMIT = 5") && read("src/app/api/mastery/route.ts").includes("consumeRateLimit(auth.user.id)")],
  ["Payload tem limites de tamanho", read("src/app/api/mastery/route.ts").includes("24_000") && read("src/app/api/mastery/route.ts").includes("2500")],
  ["Saída de IA passa por validação", read("src/app/api/mastery/route.ts").includes("isEvaluation(parsed)")],
  ["Cabeçalhos de segurança configurados", ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"].every((header) => read("next.config.ts").includes(header))],
  ["Progresso das aulas separado por usuário", read("src/components/AtlasDashboard.tsx").includes('atlas-law-completed-lessons:${studentId ?? "guest"}') && !read("src/components/AtlasDashboard.tsx").includes('window.localStorage.getItem("atlas-law-completed-lessons")')],
  ["Armazenamento local de módulos usa namespace por conta", ["LearningLab.tsx", "ResourceLibrary.tsx", "FieldOperationsCenter.tsx", "MasteryAssessment.tsx", "LessonWorkbench.tsx", "CourseAssessment.tsx", "PracticalAcademy.tsx", "PracticeCenter.tsx"].every((file) => read(`src/components/${file}`).includes("getAtlasStorageKey("))],
  ["Chaves locais nunca são importadas automaticamente para outra conta", read("src/lib/atlas-storage.ts").includes("not imported") && read("src/lib/atlas-storage.ts").includes("identity-unresolved") && read("src/lib/atlas-storage.ts").includes("identity-unresolved")],
  ["Troca de identidade encerra estado em memória", read("src/lib/supabase.ts").includes("window.location.reload()")],
  ["Variáveis de ambiente não são versionadas", existsSync(new URL("../.gitignore", import.meta.url)) && read(".gitignore").includes(".env.*")],
  ["Atualizador Windows preserva Git e credenciais locais", existsSync(new URL("./update-atlas.ps1", import.meta.url)) && read("scripts/update-atlas.ps1").includes(".git") && read("scripts/update-atlas.ps1").includes(".env.*") && read("scripts/update-atlas.ps1").includes("ATLAS-backup-" )],
  ["Migration de campo é incremental", read("supabase/migrations/006_field_operations_records.sql").includes("alter table public.student_learning_records") && !/drop\s+table/i.test(read("supabase/migrations/006_field_operations_records.sql"))],
  ["Estúdio de conceitos usa namespace local e registro Supabase", read("src/components/AtlasConceptStudio.tsx").includes("getAtlasStorageKey(STORAGE_KEY)") && read("src/components/AtlasConceptStudio.tsx").includes('saveStudentRecord("concept_map"')],
  ["Migration de mapas preserva tabela e tipo permitido", read("supabase/migrations/009_concept_maps.sql").includes("'concept_map'") && read("supabase/migrations/009_concept_maps.sql").includes("alter table public.student_learning_records") && !/drop\s+table/i.test(read("supabase/migrations/009_concept_maps.sql"))],
  ["Portfólio de evidências usa namespace e persistência por usuário", read("src/components/AtlasEvidencePortfolio.tsx").includes("getAtlasStorageKey(STORAGE_KEY)") && read("src/components/AtlasEvidencePortfolio.tsx").includes('saveStudentRecord("evidence_portfolio"')],
  ["Portfólio integrado à navegação e ao dashboard", read("src/components/atlas/AtlasShell.tsx").includes("Portfólio de evidências") && read("src/components/AtlasDashboard.tsx").includes("<AtlasEvidencePortfolio/>")],
  ["Migration 010 amplia tipos sem recriar tabela", read("supabase/migrations/010_evidence_portfolio.sql").includes("'evidence_portfolio'") && read("supabase/migrations/010_evidence_portfolio.sql").includes("alter table public.student_learning_records") && !/drop\s+table/i.test(read("supabase/migrations/010_evidence_portfolio.sql"))],
  ["Inteligência acadêmica analisa evidências e propõe intervenção", ["evidence_portfolio", "Priorize", "competencies", "Exportar relatório"].every(token => read("src/components/AtlasAcademicIntelligence.tsx").includes(token))],
  ["Diagnóstico evita inferir fracasso de pontuação ausente", read("src/components/AtlasAcademicIntelligence.tsx").includes("Sem evidência avaliada") && read("src/components/AtlasAcademicIntelligence.tsx").includes("não é nota") && read("src/components/AtlasAcademicIntelligence.tsx").includes("insufficient")],
  ["Inteligência acadêmica integrada à navegação", read("src/components/atlas/AtlasShell.tsx").includes("Inteligência acadêmica") && read("src/components/AtlasDashboard.tsx").includes("<AtlasAcademicIntelligence/>")],
];
for (const [name, ok] of checks) console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
const unscopedLocalStorageFiles = [
  "src/components/LearningLab.tsx", "src/components/ResourceLibrary.tsx",
  "src/components/FieldOperationsCenter.tsx", "src/components/MasteryAssessment.tsx",
  "src/components/LessonWorkbench.tsx", "src/components/CourseAssessment.tsx",
  "src/components/PracticalAcademy.tsx", "src/components/PracticeCenter.tsx",
  "src/components/PracticeCenter.tsx"
].filter((path) => /localStorage\.(?:getItem|setItem|removeItem)\((?!getAtlasStorageKey)/m.test(read(path)));
if (unscopedLocalStorageFiles.length) {
  console.error(`FAIL Chaves locais sem namespace: ${unscopedLocalStorageFiles.join(", ")}`);
  process.exit(1);
}
console.log("Verificações estáticas concluídas; avisos não equivalem a testes de autenticação ou RLS.");
