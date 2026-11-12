import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const checks = [];
const unique = (name, values, expected) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  checks.push({ name, count: values.length, unique: new Set(values).size, expected, ok: values.length === expected && duplicates.length === 0 });
};

const arcade = read("src/components/LearningArcade.tsx").split("const departmentShort")[0];
unique("Jogos e missões", [...arcade.matchAll(/\{id:\"([^\"]+)\"/g)].map((match) => match[1]), 42);
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
