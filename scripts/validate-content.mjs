import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const checks = [];
const unique = (name, values, expected) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  checks.push({ name, count: values.length, unique: new Set(values).size, expected, ok: values.length === expected && duplicates.length === 0 });
};

const arcade = read("src/components/LearningArcade.tsx");
unique("Territórios de jogos", [...arcade.matchAll(/\{id:\"(law|economy|tech|history|philosophy|science)\",name:/g)].map((match) => match[1]), 6);
unique("Modalidades de jogo", [...arcade.matchAll(/\{id:\"(wordhunt|investigation|connections|sequence)\",title:/g)].map((match) => match[1]), 4);
for (const [field, pattern] of [["terms", /terms:\[/g], ["pairs", /pairs:\[\[/g], ["caseTitle", /caseTitle:\"/g], ["sequenceTitle", /sequenceTitle:\"/g]]) {
  const count = [...arcade.matchAll(pattern)].length;
  checks.push({ name: `Conteúdo de jogo por território (${field})`, count, expected: 6, ok: count === 6 });
}
checks.push({ name: "Persistência local e sincronização de progresso", count: ["localStorage", "loadStudentRecords", "saveStudentRecord", "arcade_score"].filter((token) => arcade.includes(token)).length, expected: 4, ok: ["localStorage", "loadStudentRecords", "saveStudentRecord", "arcade_score"].every((token) => arcade.includes(token)) });
const resources = read("src/lib/resources.ts");
unique("Recursos da biblioteca", [...resources.matchAll(/id\s*:\s*\"([^\"]+)\"/g)].map((match) => match[1]), 97);
const advanced = read("src/lib/advanced-learning.ts");
unique("Aulas avançadas catalogadas", [...advanced.matchAll(/id:\"([a-z]+-\d+)\"/g)].map((match) => match[1]), 30);
const study = read("src/lib/atlas-study-data.ts");
const scenarios = [...study.matchAll(/\{id:\"(case-[^\"]+)\"/g)].map((match) => match[1]);
unique("Cenários de prática", scenarios, 24);
for (const path of ["src/app/globals.css", "src/app/rpg-world.css"]) {
  const css = read(path);
  checks.push({ name: `Chaves CSS balanceadas (${path})`, count: css.split("{").length - 1, expected: css.split("}").length - 1, ok: css.split("{").length === css.split("}").length });
}
const rpg = read("src/components/RpgProgression.tsx");
checks.push({ name: "Sistema RPG integrado", count: ["RpgCommandDeck", "RpgWorldMap", "RpgQuestBoard", "EXPERIÊNCIA DE DOMÍNIO"].filter((token) => rpg.includes(token)).length, expected: 4, ok: ["RpgCommandDeck", "RpgWorldMap", "RpgQuestBoard", "EXPERIÊNCIA DE DOMÍNIO"].every((token) => rpg.includes(token)) });
const tutor = read("src/app/api/tutor/route.ts");
checks.push({ name: "Tutor sem chamada de API externa", count: tutor.includes("api.openai.com") || tutor.includes("generativelanguage.googleapis.com") ? 1 : 0, expected: 0, ok: !tutor.includes("api.openai.com") && !tutor.includes("generativelanguage.googleapis.com") });

for (const item of checks) console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}: ${item.count} / esperado ${item.expected}`);
if (checks.some((item) => !item.ok)) process.exit(1);
console.log("Validação estática de conteúdo concluída.");
