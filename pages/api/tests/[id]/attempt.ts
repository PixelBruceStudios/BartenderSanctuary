import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (req as any).session;
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const userId = session.user.id;

  if (req.method === 'POST') {
    const { score, passed, answers, session_id } = req.body;

    // Persist attempt tied to the logged-in user
    await query(
      `INSERT INTO test_attempts (test_id, user_id, session_id, score, passed, answers)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [req.query.id as string, userId, session_id || 'anon', score, passed ?? false, JSON.stringify(answers ?? [])]
    );

    // Update user_lesson_progress if this is a lesson-scope test
    const testRows: any[] = await query('SELECT scope, lesson_id, passing_score FROM tests WHERE id = $1', [req.query.id as string]);
    if (testRows.length > 0) {
      const t: any = testRows[0];
      if (t.scope === 'lesson') {
        const lessonId: string = t.lesson_id;
        const passingScore: number = t.passing_score;
        const lessonPassed = passed && score >= (passingScore ?? 70);

        // Read previous score so we don't overwrite a good score with a worse one
        const existingRows: any = (await query(
          'SELECT lesson_test_score FROM user_lesson_progress WHERE user_id = $1 AND lesson_id = $2',
          [userId, lessonId]
        )) as any[];
        const prevScore: number | null = existingRows.length > 0 ? existingRows[0].lesson_test_score : null;
        const finalScore = lessonPassed ? score : (prevScore ?? score);

        await query(
          `INSERT INTO user_lesson_progress (user_id, lesson_id, lesson_test_passed, lesson_test_score)
           VALUES ($1,$2,$3,$4)
           ON CONFLICT (user_id, lesson_id)
           DO UPDATE SET lesson_test_passed = EXCLUDED.lesson_test_passed,
                         lesson_test_score = EXCLUDED.lesson_test_score,
                         updated_at = now()`,
          [userId, lessonId, lessonPassed, finalScore]
        );
      }
    }

    return res.status(201).json({ ok: true });
  }

  if (req.method === 'GET') {
    const { session_id } = req.query;
    const rows = (await query<any[]>(
      `SELECT * FROM test_attempts WHERE test_id = $1 AND user_id = $2 ORDER BY created_at DESC LIMIT 1`,
      [req.query.id as string, userId]
    )) as any[];
    if (!rows.length) return res.status(200).json({ passed: false, attempt: null });
    const attempt = rows[0];
    return res.status(200).json({ passed: attempt.passed, attempt });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
