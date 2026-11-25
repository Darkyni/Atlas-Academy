import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const checks = [];
const unique = (name, values, expected) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  checks.push({ name, count: values.length, unique: new Set(values).size, expected, ok: values.length === expected && duplicates.length === 0 });
};

const arcade = read("src/components/PracticeCenter.tsx");
unique("Departamentos da prática aplicada", [...arcade.matchAll(/\{id:\"(law|economy|tech|history|philosophy|science)\",name:/g)].map((match) => match[1]), 6);
unique("Formatos de prática", [...arcade.matchAll(/\{id:\"(wordhunt|investigation|connections|sequence)\",title:/g)].map((match) => match[1]), 4);
for (const [field, pattern] of [["terms", /terms:\[/g], ["pairs", /pairs:\[\[/g], ["caseTitle", /caseTitle:\"/g], ["sequenceTitle", /sequenceTitle:\"/g]]) {
  const count = [...arcade.matchAll(pattern)].length;
  checks.push({ name: `Conteúdo de prática por departamento (${field})`, count, expected: 6, ok: count === 6 });
}
checks.push({ name: "Persistência local e sincronização de progresso", count: ["localStorage", "loadStudentRecords", "saveStudentRecord", "arcade_score"].filter((token) => arcade.includes(token)).length, expected: 4, ok: ["localStorage", "loadStudentRecords", "saveStudentRecord", "arcade_score"].every((token) => arcade.includes(token)) });
const resources = read("src/lib/resources.ts");
unique("Recursos da biblioteca", [...resources.matchAll(/id\s*:\s*\"([^\"]+)\"/g)].map((match) => match[1]), 97);
const advanced = read("src/lib/advanced-learning.ts");
unique("Aulas avançadas catalogadas", [...advanced.matchAll(/id:\"([a-z]+-\d+)\"/g)].map((match) => match[1]), 30);
const study = read("src/lib/atlas-study-data.ts");
const scenarios = [...study.matchAll(/\{id:\"(case-[^\"]+)\"/g)].map((match) => match[1]);
unique("Cenários de prática", scenarios, 24);
for (const path of ["src/app/globals.css", "src/app/atlas-academic.css"]) {
  const css = read(path);
  checks.push({ name: `Chaves CSS balanceadas (${path})`, count: css.split("{").length - 1, expected: css.split("}").length - 1, ok: css.split("{").length === css.split("}").length });
}
const dashboard = read("src/components/AtlasDashboard.tsx");
const practice = read("src/components/PracticeCenter.tsx");
const assessment = read("src/components/CourseAssessment.tsx");
const shell = read("src/components/atlas/AtlasShell.tsx");
const departmentPanels = read("src/components/atlas/DepartmentPanels.tsx");
const legacyRpgTokens = ["RpgCommandDeck", "RpgWorldMap", "RpgQuestBoard", "RpgAchievementHall", "XP", "Trophy", "Mapa de exploração", "Escolha seu território", "Salão de desafios", "chefe de fase", "resultado da batalha", "concluir batalha", "desafio final da região"];
const combinedUi = `${dashboard}\n${practice}\n${assessment}`.toLowerCase();
const rpgResidue = legacyRpgTokens.filter((token) => token === "XP" ? /\bxp\b/i.test(combinedUi) : combinedUi.includes(token.toLowerCase()));
checks.push({ name: "Interface acadêmica sem camada RPG", count: rpgResidue.length, expected: 0, ok: rpgResidue.length === 0 });
checks.push({ name: "Shell e painéis acadêmicos modularizados", count: ["AtlasSidebar", "AtlasTopbar"].every(token => shell.includes(token)) && ["EditorialDepartmentIndex", "DepartmentProgressRegister"].every(token => departmentPanels.includes(token)) ? 4 : 0, expected: 4, ok: ["AtlasSidebar", "AtlasTopbar"].every(token => shell.includes(token)) && ["EditorialDepartmentIndex", "DepartmentProgressRegister"].every(token => departmentPanels.includes(token)) });
checks.push({ name: "Prática aplicada preserva quatro modalidades", count: ["wordhunt", "investigation", "connections", "sequence"].filter((token) => practice.includes(`id:"${token}"`)).length, expected: 4, ok: ["wordhunt", "investigation", "connections", "sequence"].every((token) => practice.includes(`id:"${token}"`)) });
const signInBlock = dashboard.slice(dashboard.indexOf("async function signIn"), dashboard.indexOf("async function signOut"));
checks.push({ name: "Login não migra progresso de visitante para conta", count: /localOnlyIds|completedLessons\.filter/.test(signInBlock) ? 0 : 1, expected: 1, ok: !/localOnlyIds|completedLessons\.filter/.test(signInBlock) });
checks.push({ name: "Pesquisa global alcança currículo e aulas", count: ["atlas-search-dialog", "globalSearchQuery", "Ctrl K"].filter(token => dashboard.includes(token) || shell.includes(token)).length, expected: 3, ok: ["atlas-search-dialog", "globalSearchQuery", "Ctrl K"].every(token => dashboard.includes(token) || shell.includes(token)) });
checks.push({ name: "Leitura de aula possui índice de navegação", count: ["lesson-reading-layout", "lesson-outline", "id=\"verificacao\"", "id=\"referencias\""].filter(token => dashboard.includes(token)).length, expected: 4, ok: ["lesson-reading-layout", "lesson-outline", "id=\"verificacao\"", "id=\"referencias\""].every(token => dashboard.includes(token)) });
const tutor = read("src/app/api/tutor/route.ts");
checks.push({ name: "Tutor sem chamada de API externa", count: tutor.includes("api.openai.com") || tutor.includes("generativelanguage.googleapis.com") ? 1 : 0, expected: 0, ok: !tutor.includes("api.openai.com") && !tutor.includes("generativelanguage.googleapis.com") });


const field = read("src/components/PracticalAcademy.tsx");
unique("Módulos Campo & Engenharia", [...field.matchAll(/id:\s*"(surv-[a-z0-9-]+|home-[a-z0-9-]+|eng-[a-z0-9-]+)"/g)].map((match) => match[1]), 24);
const operations = read("src/components/FieldOperationsCenter.tsx");
const operationFeatures = ["dimensionador", "Matriz de probabilidade", "Diário de inspeção", "Bancada de Lei de Ohm", "Reconstrua a resposta segura", "localStorage", "saveStudentRecord"];
checks.push({ name: "Centro de Operações: ferramentas e persistência", count: operationFeatures.filter((token) => operations.toLowerCase().includes(token.toLowerCase())).length, expected: operationFeatures.length, ok: operationFeatures.every((token) => operations.toLowerCase().includes(token.toLowerCase())) });
const migration = read("supabase/migrations/006_field_operations_records.sql");
checks.push({ name: "Migration incremental de registros de campo", count: migration.includes("'field_ops'") && migration.includes("check (record_type in") ? 1 : 0, expected: 1, ok: migration.includes("'field_ops'") && migration.includes("check (record_type in") });

const notebook = read("src/components/AtlasResearchNotebook.tsx");
const notebookTokens = ["síntese", "pergunta", "hipótese", "fonte", "conexão", "nextReviewAt", "reviewCount", "saveStudentRecord", "getAtlasStorageKey", "exportNotebook"];
checks.push({ name: "Caderno de pesquisa: tipos, revisão e persistência", count: notebookTokens.filter(token => notebook.includes(token)).length, expected: notebookTokens.length, ok: notebookTokens.every(token => notebook.includes(token)) });
const notebookMigration = read("supabase/migrations/007_research_notebook.sql");
checks.push({ name: "Migration incremental do Caderno de Pesquisa", count: notebookMigration.includes("'research_entry'") && notebookMigration.includes("drop constraint if exists") ? 1 : 0, expected: 1, ok: notebookMigration.includes("'research_entry'") && notebookMigration.includes("drop constraint if exists") });
const planner = read("src/components/AtlasStudyPlanner.tsx");
const plannerTokens = ["study_plan", "getAtlasStorageKey", "loadStudentRecords", "saveStudentRecord", "onOpenLesson", "completed", "duration", "planner-week"];
checks.push({ name: "Planejador semanal: edição, progresso e sincronização", count: plannerTokens.filter(token => planner.includes(token)).length, expected: plannerTokens.length, ok: plannerTokens.every(token => planner.includes(token)) });
const plannerMigration = read("supabase/migrations/008_study_planner.sql");
checks.push({ name: "Migration incremental do Planejador", count: plannerMigration.includes("'study_plan'") && plannerMigration.includes("drop constraint if exists") ? 1 : 0, expected: 1, ok: plannerMigration.includes("'study_plan'") && plannerMigration.includes("drop constraint if exists") });

const conceptStudio = read("src/components/AtlasConceptStudio.tsx");
const conceptMigration = read("supabase/migrations/009_concept_maps.sql");
checks.push({ name: "Estúdio de conceitos integrado à navegação", count: read("src/components/atlas/AtlasShell.tsx").includes('"Mapa de conceitos"') && read("src/components/AtlasDashboard.tsx").includes("<AtlasConceptStudio/>") ? 1 : 0, expected: 1, ok: read("src/components/atlas/AtlasShell.tsx").includes('"Mapa de conceitos"') && read("src/components/AtlasDashboard.tsx").includes("<AtlasConceptStudio/>") });
checks.push({ name: "Mapa conceitual inclui nós, relações, busca e exportação", count: ["addConcept", "addRelation", "removeConcept", "removeRelation", "exportMap", "relationExamples"].filter(token => conceptStudio.includes(token)).length, expected: 6, ok: ["addConcept", "addRelation", "removeConcept", "removeRelation", "exportMap", "relationExamples"].every(token => conceptStudio.includes(token)) });
checks.push({ name: "Migration 009 habilita concept_map sem recriar tabela", count: conceptMigration.includes("'concept_map'") && conceptMigration.includes("alter table public.student_learning_records") && !/drop\s+table/i.test(conceptMigration) ? 1 : 0, expected: 1, ok: conceptMigration.includes("'concept_map'") && conceptMigration.includes("alter table public.student_learning_records") && !/drop\s+table/i.test(conceptMigration) });

const evidence = read("src/components/AtlasEvidencePortfolio.tsx");
const evidenceTokens = ["evidence_portfolio", "getAtlasStorageKey", "loadStudentRecords", "saveStudentRecord", "explicar", "relacionar", "questionar", "aplicar", "transferir", "exportPortfolio", "archive"];
checks.push({ name: "Portfólio de evidências: rubrica, persistência e exportação", count: evidenceTokens.filter(token => evidence.includes(token)).length, expected: evidenceTokens.length, ok: evidenceTokens.every(token => evidence.includes(token)) });
const evidenceMigration = read("supabase/migrations/010_evidence_portfolio.sql");
checks.push({ name: "Migration 010 habilita portfólio sem recriar tabela", count: evidenceMigration.includes("'evidence_portfolio'") && evidenceMigration.includes("alter table public.student_learning_records") && !/drop\s+table/i.test(evidenceMigration) ? 1 : 0, expected: 1, ok: evidenceMigration.includes("'evidence_portfolio'") && evidenceMigration.includes("alter table public.student_learning_records") && !/drop\s+table/i.test(evidenceMigration) });

for (const item of checks) console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}: ${item.count} / esperado ${item.expected}`);
if (checks.some((item) => !item.ok)) process.exit(1);
console.log("Validação estática de conteúdo concluída.");
