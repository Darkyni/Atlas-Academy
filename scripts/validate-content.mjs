import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const checks = [];
const unique = (name, values, expected) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  checks.push({ name, count: values.length, unique: new Set(values).size, expected, ok: values.length === expected && duplicates.length === 0 });
};

const arcade = read("src/components/LearningArcade.tsx").split("const departmentShort")[0];
unique("Jogos e missões", [...arcade.matchAll(/\{id:\"([^\"]+)\"/g)].map((match) => match[1]), 30);
const resources = read("src/lib/resources.ts");
unique("Recursos da biblioteca", [...resources.matchAll(/id\s*:\s*\"([^\"]+)\"/g)].map((match) => match[1]), 91);
const advanced = read("src/lib/advanced-learning.ts");
unique("Aulas avançadas catalogadas", [...advanced.matchAll(/id:\"([a-z]+-\d+)\"/g)].map((match) => match[1]), 30);
const study = read("src/lib/atlas-study-data.ts");
const scenarios = [...study.matchAll(/\{id:\"(case-[^\"]+)\"/g)].map((match) => match[1]);
unique("Cenários de prática", scenarios, 24);
const css = read("src/app/globals.css");
checks.push({ name: "Chaves CSS balanceadas", count: css.split("{").length - 1, expected: css.split("}").length - 1, ok: css.split("{").length === css.split("}").length });
const tutor = read("src/app/api/tutor/route.ts");
checks.push({ name: "Tutor sem chamada de API externa", count: tutor.includes("api.openai.com") || tutor.includes("generativelanguage.googleapis.com") ? 1 : 0, expected: 0, ok: !tutor.includes("api.openai.com") && !tutor.includes("generativelanguage.googleapis.com") });

for (const item of checks) console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}: ${item.count} / esperado ${item.expected}`);
if (checks.some((item) => !item.ok)) process.exit(1);
console.log("Validação estática de conteúdo concluída.");
