// scripts/extract-data.mjs
// Usage: node scripts/extract-data.mjs > /tmp/sanctuary-data.json
// Reads data/school.ts and data/cocktails.ts, strips TS types, extracts exports as JSON.

import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDir = path.resolve(__dirname, '..');
const dataDir = path.join(appDir, 'data');

function stripTypes(src) {
  // Remove interface declarations
  src = src.replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\n\}/g, '');
  // Remove type aliases
  src = src.replace(/export\s+type\s+\w+\s*=[\s\S]*?;/g, '');
  // Remove variable type annotations: const x: Type = ...  OR  const x: Type[] = ...
  src = src.replace(/:\s*(Category|Cocktail|Technique|Lesson|string|number|boolean|any|Source\[\]|JSON|Record<string, unknown>|Source|Category\[\]|Technique\[\])\b/g, '');
  // Remove interface references inside type annotations (aggressive fallback)
  src = src.replace(/<\s*\{[^}]*\}\s*>/g, '');
  return src;
}

function extractExport(src, name) {
  // Match: export const name = ... or export const name: Type = ...
  const re = new RegExp(`export\\s+const\\s+${name}(?:\\s*:[^=]*)?\\s*=\\s*([\\s\\S]*?)\\s*;\\s*(?=export|$)`, '');
  const m = src.match(re);
  if (!m) return null;
  let expr = m[1].trim();
  // Unwrap nested parens from TS -> JS
  while (expr.startsWith('(') && expr.endsWith(')')) {
    expr = expr.slice(1, -1).trim();
  }
  return expr;
}

function loadAndExtract(file, names) {
  const full = fs.readFileSync(file, 'utf8');
  const js = stripTypes(full);
  const out = {};
  for (const name of names) {
    const expr = extractExport(js, name);
    if (!expr) {
      console.error(`Could not find export: ${name} in ${file}`);
      console.error('Available exports:', js.match(/export\s+const\s+\w+/g)?.slice(0, 10));
      process.exit(1);
    }
    // eslint-disable-next-line no-eval
    out[name] = eval(`(${expr})`);
  }
  return out;
}

const school = loadAndExtract(path.join(dataDir, 'school.ts'), ['schoolCategories']);
const cocktails = loadAndExtract(path.join(dataDir, 'cocktails.ts'), ['cocktails', 'allBases', 'allMods']);

// Emit the arrays as JSON to stdout (one JSON object, multiple top-level keys)
const payload = {
  schoolCategories: school.schoolCategories,
  cocktails: cocktails.cocktails,
  allBases: cocktails.allBases,
  allMods: cocktails.allMods,
};

process.stdout.write(JSON.stringify(payload, null, 2));
