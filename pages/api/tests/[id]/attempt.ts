import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { auth } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: any = await getServerSession(req, res, auth);
  if (!session?.user?.id) return res.status(401).json({ error: 'Not authenticated' });

  const userId = session.user.id;
  const testId = req.query.id as string;

  if (req.method === 'POST') {
    const { score, passed, answers } = req.body;

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

    const testRows: any[] = await query(
      'SELECT scope, lesson_id, passing_score FROM tests WHERE id = $1',
      [testId]
    );
    if (testRows.length > 0) {
      const t = testRows[0];
      const lessonId: string = t.lesson_id;
      const passingScore: number = t.passing_score;

      if (t.scope === 'sublesson') {
        const subs: any[] = await query(
          'SELECT id FROM tests WHERE lesson_id = $1 AND scope = $2',
          [lessonId, 'sublesson']
        );
        if (subs.length > 0) {
          const allPassed = await Promise.all(
            subs.map((s: any) =>
              query('SELECT passed FROM user_test_progress WHERE user_id = $1 AND test_id = $2', [userId, s.id])
                .then((rows: any[]) => rows.length > 0 && rows[0].passed)
                .catch(() => false)
            )
          );
          const allDone = allPassed.every(Boolean);
          await query(
            `INSERT INTO user_lesson_progress (user_id, lesson_id, all_subtests_passed, overall_progress)
             VALUES ($1,$2,$3,$4)
             ON CONFLICT (user_id, lesson_id) DO UPDATE SET
               all_subtests_passed = EXCLUDED.all_subtests_passed,
               overall_progress = EXCLUDED.overall_progress,
               updated_at = now()`,
            [userId, lessonId, allDone, allDone ? 50 : 0]
          );
        }
      }

      if (t.scope === 'lesson' && passed && (score ?? 0) >= (passingScore ?? 70)) {
        await query(
          `INSERT INTO user_lesson_progress (user_id, lesson_id, full_test_passed, overall_progress)
           VALUES ($1,$2,$3,100)
           ON CONFLICT (user_id, lesson_id) DO UPDATE SET
             full_test_passed = EXCLUDED.full_test_passed,
             overall_progress = 100,
             updated_at = now()`,
          [userId, lessonId, true]
        );
      }
    }

    return res.status(201).json({ ok: true });
  }

  if (req.method === 'GET') {
    const rows = (await query<any[]>(
      `SELECT * FROM user_test_progress WHERE test_id = $1 AND user_id = $2 ORDER BY last_attempt_at DESC LIMIT 1`,
      [testId, userId]
    )) as any[];
    if (!rows.length) return res.status(200).json({ passed: false, attempt: null });
    return res.status(200).json({ passed: rows[0].passed, attempt: rows[0] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
