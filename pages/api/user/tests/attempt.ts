import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth(req, res);
  const userId = session?.user?.id;

  if (req.method === 'POST') {
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { testId, score, passed, answers } = req.body;
    if (!testId) return res.status(400).json({ error: 'testId required' });

    await query(
      `INSERT INTO user_test_progress (user_id, test_id, passed, best_score, attempts, last_attempt_at)
       VALUES ($1,$2,$3,$4,1,now())
       ON CONFLICT (user_id, test_id) DO UPDATE SET
         passed = EXCLUDED.passed,
         best_score = GREATEST(user_test_progress.best_score, $4),
         attempts = user_test_progress.attempts + 1,
         last_attempt_at = now()`,
      [userId, testId, !!passed, score ?? 0]
    );

    // Update lesson progress
    const testRows: any[] = await query(
      'SELECT scope, lesson_id, passing_score FROM tests WHERE id = $1', [testId]
    );
    if (testRows.length > 0) {
      const t = testRows[0];
      if (t.scope === 'sublesson') {
        const subs: any[] = await query('SELECT id FROM tests WHERE lesson_id = $1 AND scope = $2', [t.lesson_id, 'sublesson']);
        if (subs.length > 0) {
          const allPassed = await Promise.all(
            subs.map((s: any) =>
              query('SELECT passed FROM user_test_progress WHERE user_id = $1 AND test_id = $2', [userId, s.id])
                .then((rows: any[]) => rows.length > 0 && rows[0].passed)
                .catch(() => false)
            )
          );
          await query(
            `INSERT INTO user_lesson_progress (user_id, lesson_id, all_subtests_passed, overall_progress)
             VALUES ($1,$2,$3,$4)
             ON CONFLICT (user_id, lesson_id) DO UPDATE SET
               all_subtests_passed = EXCLUDED.all_subtests_passed,
               overall_progress = EXCLUDED.overall_progress,
               updated_at = now()`,
            [userId, t.lesson_id, allPassed.every(Boolean), allPassed.every(Boolean) ? 50 : 0]
          );
        }
      }
      if (t.scope === 'lesson' && passed && (score ?? 0) >= (t.passing_score ?? 70)) {
        await query(
          `INSERT INTO user_lesson_progress (user_id, lesson_id, full_test_passed, overall_progress)
           VALUES ($1,$2,$3,100)
           ON CONFLICT (user_id, lesson_id) DO UPDATE SET
             full_test_passed = true, overall_progress = 100, updated_at = now()`,
          [userId, t.lesson_id]
        );
      }
    }
    return res.status(201).json({ ok: true });
  }

  if (req.method === 'GET') {
    const rows = await query<any[]>('SELECT * FROM user_test_progress WHERE user_id = $1 ORDER BY last_attempt_at DESC', [userId]);
    return res.status(200).json(rows);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
