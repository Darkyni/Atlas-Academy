import { readFileSync, existsSync } from "node:fs";
const source = readFileSync(new URL("../src/lib/resources.ts", import.meta.url), "utf8");
const urls = [...source.matchAll(/url\s*:\s*"([^"]+)"/g)].map((match) => match[1]);
const ids = [...source.matchAll(/id\s*:\s*"([^"]+)"/g)].map((match) => match[1]);
const invalid = urls.filter((value) => {
  if (value.startsWith("/")) return !existsSync(new URL(`../public${value}`, import.meta.url));
  try { return !["http:", "https:"].includes(new URL(value).protocol); } catch { return true; }
});
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
console.log(`${invalid.length ? "FAIL" : "PASS"} Destinos dos recursos: ${urls.length} verificados; ${invalid.length} inválidos ou ausentes.`);
console.log(`${duplicateIds.length ? "FAIL" : "PASS"} IDs dos recursos: ${ids.length} verificados; ${duplicateIds.length} duplicados.`);
if (invalid.length) console.log(invalid.join("\n"));
if (duplicateIds.length) console.log(duplicateIds.join("\n"));
if (invalid.length || duplicateIds.length) process.exit(1);
