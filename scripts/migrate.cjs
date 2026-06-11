#!/usr/bin/env node
// scripts/migrate.cjs
// Usage:
//   node scripts/migrate.cjs --dry-run
//   node scripts/migrate.cjs --clear --import
//   node scripts/migrate.cjs --import          (upsert, safe to re-run)
//
// Migrates categories+techniques (no lessons) and cocktails from TS data files
// into Postgres. Safe to re-run: uses ON CONFLICT DO UPDATE.
// Lessons are intentionally left empty — add via /api/lessons.

const fs = require('fs');
const path = require('path');

const appDir = path.resolve(__dirname, '..');
const dataDir = path.join(appDir, 'data');

const DB_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const { Client } = require('pg');

function loadExport(filePath, exportName) {
  const src = fs.readFileSync(filePath, 'utf8');

  // Remove interface / type declarations (safe to delete)
  let text = src.replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\n\}/g, '');
  text = text.replace(/export\s+type\s+\w+\s*=[\s\S]*?;/g, '');

  // Remove variable type annotations: `: SomeType` or `: SomeType[]`
  text = text.replace(/:\s*(Category|Cocktail|Technique|Lesson|string|number|boolean|any|Source\[\])\b/g, '');

  // Find the export line and extract the array literal by walking brackets
  const headerRe = new RegExp('export\\s+const\\s+' + exportName + '(?:\\s*:[^=]*)?(?:\\s*\\[[^\\]]*\\])?\\s*=\\s*');
  const headerMatch = text.match(headerRe);
  if (!headerMatch) {
    console.error(`Could not find export header: ${exportName} in ${filePath}`);
    console.error('File prefix:\n' + text.slice(0, 300));
    process.exit(1);
  }

  const startSearch = headerMatch.index + headerMatch[0].length;
  const arrStart = text.indexOf('[', startSearch);
  if (arrStart === -1) {
    console.error(`No array start found for ${exportName}`);
    process.exit(1);
  }

  let depth = 0;
  let inStr = false;
  let strChar = '';
  for (let i = arrStart; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === strChar) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strChar = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        const expr = text.slice(arrStart, i + 1);
        // eslint-disable-next-line no-eval
        return eval('(' + expr + ')');
      }
    }
  }

  console.error(`Unclosed array for ${exportName}`);
  process.exit(1);
}

async function migrate(dryRun = false, clear = false) {
  const categories = loadExport(path.join(dataDir, 'school.ts'), 'schoolCategories');
  const cocktails = loadExport(path.join(dataDir, 'cocktails.ts'), 'cocktails');

  const cocktailRows = cocktails.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.story || c.description || '',
    image_url: c.image_url || '',
    ingredients: JSON.stringify(c.ingredients || []),
    instructions: JSON.stringify(c.instructions || []),
    glass_type: c.glass || c.glass_type || '',
    garnish: c.garnish || '',
    difficulty: c.difficulty || 'Beginner',
    origin: c.origin || '',
  }));

  const rows = categories.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    description: cat.description || '',
    icon: cat.icon || '',
    sort_order: 0,
    techniques: (cat.techniques || []).map((tech, idx) => ({
      slug: tech.slug,
      title: tech.title,
      description: tech.description || '',
      sort_order: idx,
    })),
  }));

  if (dryRun) {
    console.log(`[DRY RUN] Would migrate:`);
    console.log(`  ${rows.length} categories (${rows.reduce((a, c) => a + c.techniques.length, 0)} techniques)`);
    console.log(`  ${cocktailRows.length} cocktails`);
    rows.forEach((r) => {
      console.log(`  category: ${r.slug} (${r.techniques.length} techniques)`);
    });
    if (cocktailRows.length) {
      console.log(`  first cocktail: ${cocktailRows[0].slug} — ${cocktailRows[0].name}`);
    }
    return;
  }

  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  if (clear) {
    console.log('Clearing existing content...');
    await client.query('DELETE FROM sources;');
    await client.query('DELETE FROM lessons;');
    await client.query('DELETE FROM techniques;');
    await client.query('DELETE FROM categories;');
    await client.query('DELETE FROM cocktails;');
  }

  const catIds = {};
  for (const row of rows) {
    const catRes = await client.query(
      `INSERT INTO categories (slug, title, description, icon, sort_order)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, icon=EXCLUDED.icon
       RETURNING id`,
      [row.slug, row.title, row.description, row.icon, row.sort_order]
    );
    const catId = catRes.rows[0].id;
    catIds[row.slug] = catId;

    for (const tech of row.techniques) {
      await client.query(
        `INSERT INTO techniques (category_id, slug, title, description, sort_order)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (category_id, slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description`,
        [catId, tech.slug, tech.title, tech.description, tech.sort_order]
      );
    }
  }

  for (const row of cocktailRows) {
    await client.query(
      `INSERT INTO cocktails (slug, name, description, image_url, ingredients, instructions, glass_type, garnish, difficulty, origin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (slug) DO UPDATE SET
         name=EXCLUDED.name,
         description=EXCLUDED.description,
         image_url=EXCLUDED.image_url,
         ingredients=EXCLUDED.ingredients,
         instructions=EXCLUDED.instructions,
         glass_type=EXCLUDED.glass_type,
         garnish=EXCLUDED.garnish,
         difficulty=EXCLUDED.difficulty,
         origin=EXCLUDED.origin`,
      [row.slug, row.name, row.description, row.image_url, row.ingredients, row.instructions, row.glass_type, row.garnish, row.difficulty, row.origin]
    );
  }

  await client.end();
  console.log(`✓ Migrated ${rows.length} categories + ${cocktailRows.length} cocktails into Postgres.`);
  console.log(`  Lessons tables left empty — use /api/lessons to add.`);
}

(async () => {
  const args = process.argv.slice(2);
  const flags = {
    dryRun: args.includes('--dry-run'),
    clear: args.includes('--clear'),
    import_: args.includes('--import') || args.length === 0,
  };

  try {
    if (flags.dryRun) await migrate(true, false);
    else if (flags.import_) await migrate(false, flags.clear);
    else {
      console.log('Usage: node scripts/migrate.cjs [--dry-run] [--clear] [--import]');
      console.log('  --dry-run  show plan without writing');
      console.log('  --clear    delete existing rows before inserting');
      console.log('  --import   run migration (default if no flags)');
    }
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();
