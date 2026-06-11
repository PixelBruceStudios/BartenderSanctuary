const fs = require('fs');
const code = fs.readFileSync('/home/skicmi/bartender-sanctuary-app/scripts/seed-school.cjs', 'utf8');
const match = code.match(/const CATEGORIES = (\[.*?\]);\s*\nasync function seed/s);
if (!match) { console.error('no match'); process.exit(1); }
const data = eval(match[1]);

const lines = [];
lines.push("-- Bartender Sanctuary School Seed");
lines.push("-- Paste into Neon SQL Editor: https://console.neon.tech");
lines.push("BEGIN;");
lines.push("");

// Categories - self-contained
for (const cat of data) {
  const slug = cat.slug;
  const title = cat.title.replace(/'/g, "''");
  const desc = (cat.description || '').replace(/'/g, "''");
  const icon = cat.icon;
  const so = cat.sort_order;
  lines.push(`INSERT INTO categories (slug, title, description, icon, sort_order) VALUES ('${slug}', '${title}', '${desc}', '${icon}', ${so}) ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, icon=EXCLUDED.icon;`);
}
lines.push("");

// Techniques - self-contained subqueries
for (const cat of data) {
  for (const tech of cat.techniques) {
    const slug = tech.slug;
    const title = tech.title.replace(/'/g, "''");
    const desc = (tech.description || '').replace(/'/g, "''");
    const so = tech.sort_order;
    lines.push(`INSERT INTO techniques (category_id, slug, title, description, sort_order) SELECT id, '${slug}', '${title}', '${desc}', ${so} FROM categories WHERE slug = '${cat.slug}' ON CONFLICT (category_id, slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description;`);
  }
}
lines.push("");

// Lessons - self-contained subqueries
for (const cat of data) {
  for (const tech of cat.techniques) {
    for (const lesson of tech.lessons) {
      const slug = lesson.slug;
      const title = lesson.title.replace(/'/g, "''");
      const desc = (lesson.description || '').replace(/'/g, "''");
      const dur = lesson.duration;
      const diff = lesson.difficulty;
      const content = (lesson.content || '').replace(/'/g, "''");
      const so = lesson.sort_order;
      lines.push(`INSERT INTO lessons (technique_id, slug, title, description, duration, difficulty, content, sort_order) SELECT t.id, '${slug}', '${title}', '${desc}', '${dur}', '${diff}', '${content}', ${so} FROM techniques t JOIN categories c ON t.category_id = c.id WHERE c.slug = '${cat.slug}' AND t.slug = '${tech.slug}' ON CONFLICT (technique_id, slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, duration=EXCLUDED.duration, difficulty=EXCLUDED.difficulty, content=EXCLUDED.content;`);
    }
  }
}
lines.push("");
lines.push("COMMIT;");

const sql = lines.join("\n");
fs.writeFileSync('/home/skicmi/bartender-sanctuary-app/scripts/seed-school.sql', sql);

const catCount = data.length;
const techCount = data.reduce((a, c) => a + c.techniques.length, 0);
const lessonCount = data.reduce((a, c) => a + c.techniques.reduce((b, t) => b + t.lessons.length, 0), 0);
console.log(`Generated SQL: ${catCount} categories, ${techCount} techniques, ${lessonCount} lessons`);
console.log(`File: /home/skicmi/bartender-sanctuary-app/scripts/seed-school.sql`);
console.log(`Size: ${sql.length} bytes`);
