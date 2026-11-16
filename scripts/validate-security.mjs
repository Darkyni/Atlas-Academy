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
  ["Progresso local separado por usuário", read("src/components/AtlasDashboard.tsx").includes('atlas-law-completed-lessons:${studentId ?? "guest"}')],
  ["Variáveis de ambiente não são versionadas", existsSync(new URL("../.gitignore", import.meta.url)) && read(".gitignore").includes(".env.*")],
  ["Atualizador Windows preserva Git e credenciais locais", existsSync(new URL("./update-atlas.ps1", import.meta.url)) && read("scripts/update-atlas.ps1").includes(".git") && read("scripts/update-atlas.ps1").includes(".env.*") && read("scripts/update-atlas.ps1").includes("ATLAS-backup-" )],
  ["Migration de campo é incremental", read("supabase/migrations/006_field_operations_records.sql").includes("alter table public.student_learning_records") && !/drop\s+table/i.test(read("supabase/migrations/006_field_operations_records.sql"))],
];
for (const [name, ok] of checks) console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
console.log("Verificações estáticas de segurança concluídas.");
