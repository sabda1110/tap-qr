import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const directory = resolve(".output/public/assets");
const assets = readdirSync(directory);
const find = (pattern) => {
  const file = assets.find((name) => pattern.test(name));
  assert.ok(file, `Missing ${pattern}; run npm run build first`);
  return resolve(directory, file);
};
function dependencies(entry, visited = new Set()) {
  if (visited.has(entry)) return visited;
  visited.add(entry);
  const code = readFileSync(entry, "utf8");
  for (const [, name] of code.matchAll(/(?:from|import)\s*["']([^"']+\.js)["']/g)) {
    dependencies(resolve(dirname(entry), name), visited);
  }
  return visited;
}
const home = find(/^_locale\.index-.*\.js$/);
const locales = { id: find(/^id-.*\.js$/), en: find(/^en-.*\.js$/) };
const shared = dependencies(home);
assert.ok(!shared.has(locales.id) && !shared.has(locales.en), "Full locale catalogs must remain lazy");
for (const language of ["id", "en"]) {
  const closure = dependencies(locales[language], new Set(shared));
  const other = language === "id" ? "en" : "id";
  assert.ok(!closure.has(locales[other]), `${language} must not statically load ${other}`);
  const gzipBytes = [...closure].reduce((sum, file) => sum + gzipSync(readFileSync(file), { level: 9 }).length, 0);
  console.log(`${language} landing + active locale: ${(gzipBytes / 1024).toFixed(1)} KiB gzip across ${closure.size} JS chunks`);
}
console.log(`Lazy language catalogs: ${Object.values(locales).map((file) => basename(file)).join(", ")}`);
console.log("Static import estimates only; browser request timing and real-user Core Web Vitals need separate measurement.");
