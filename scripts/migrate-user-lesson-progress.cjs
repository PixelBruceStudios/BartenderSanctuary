#!/usr/bin/env node
// scripts/migrate-user-lesson-progress.cjs
// One-time fix: align user_lesson_progress columns with API code.
// Current API uses: all_subtests_passed, full_test_passed, overall_progress
// Old schema had: sublesson_tests_passed, sublesson_tests_total, lesson_test_passed, lesson_test_score
//
// Usage:
//   node scripts/migrate-user-lesson-progress.cjs --dry-run
//   node scripts/migrate-user-lesson-progress.cjs --apply

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const passPath = path.join(process.env.HOME || '', 'Desktop', 'NeonDbPass');
const dbPass = fs.readFileSync(passPath, 'utf8').trim();

const envPath = path.join(__dirname, '..', '.env.local');
let connectionString = 'postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const m = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (m) connectionString = m[1];
}
if (connectionString.includes('***')) {
  connectionString = connectionString.replace('***', dbPass);
}

const dryRun = process.argv.includes('--dry-run');
const apply = process.argv.includes('--apply');

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    // 1. Check current columns
    const cols = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'user_lesson_progress'
      ORDER BY ordinal_position
    `);
    const existing = new Set(cols.rows.map(r => r.column_name));
    console.log('Current user_lesson_progress columns:', Array.from(existing).join(', ') || '(none)');

    const needed = ['all_subtests_passed', 'full_test_passed', 'overall_progress'];
    const old = ['sublesson_tests_passed', 'sublesson_tests_total', 'lesson_test_passed', 'lesson_test_score'];
    const missing = needed.filter(c => !existing.has(c));
    const hasOld = old.filter(c => existing.has(c));

    if (missing.length === 0 && hasOld.length === 0) {
      console.log('Schema already matches API. Nothing to do.');
      return;
    }

    if (dryRun) {
      console.log('[DRY RUN] Would apply:');
      if (hasOld.length) console.log(`  - Drop legacy columns: ${hasOld.join(', ')}`);
      if (missing.length) console.log(`  - Add missing columns: ${missing.join(', ')}`);
      console.log('  - Backfill overall_progress from lesson_test_passed where possible');
      return;
    }

    if (!apply) {
      console.log('Pass --apply to run the migration.');
      return;
    }

    // 2. Backfill data from legacy columns if present
    if (hasOld.length) {
      console.log('Backfilling from legacy columns...');
      await client.query(`
        UPDATE user_lesson_progress ulp
        SET
          all_subtests_passed = COALESCE(
            (ul.lesson_test_score >= 50),
            false
          ),
          full_test_passed = COALESCE(ul.lesson_test_passed, false),
          overall_progress = CASE
            WHEN ul.lesson_test_passed = true THEN 100
            WHEN ul.lesson_test_score >= 50 THEN 50
            ELSE COALESCE(ul.overall_progress, 0)
          END
        FROM (
          SELECT id, lesson_test_passed, lesson_test_score, overall_progress
          FROM user_lesson_progress
          WHERE lesson_test_passed IS NOT NULL
             OR lesson_test_score IS NOT NULL
             OR overall_progress IS NOT NULL
        ) ul
        WHERE ulp.id = ul.id
      `);
      console.log('  Backfill complete.');
    }

    // 3. Drop legacy columns if they exist
    if (hasOld.length) {
      console.log('Dropping legacy columns...');
      for (const col of hasOld) {
        await client.query(`ALTER TABLE user_lesson_progress DROP COLUMN IF EXISTS ${col}`);
      }
      console.log('  Legacy columns dropped.');
    }

    // 4. Add missing columns
    if (missing.length) {
      console.log('Adding missing columns...');
      for (const col of missing) {
        if (col === 'overall_progress') {
          await client.query(`ALTER TABLE user_lesson_progress ADD COLUMN IF NOT EXISTS overall_progress INTEGER NOT NULL DEFAULT 0`);
        } else {
          await client.query(`ALTER TABLE user_lesson_progress ADD COLUMN IF NOT EXISTS ${col} BOOLEAN NOT NULL DEFAULT false`);
        }
      }
      console.log('  Missing columns added.');
    }

    // 5. Verify final state
    const finalCols = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'user_lesson_progress'
      ORDER BY ordinal_position
    `);
    console.log('Final columns:', finalCols.rows.map(r => r.column_name).join(', '));
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
