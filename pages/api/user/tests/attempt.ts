import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (req as any).session;
  if (!session?.user?.id) return res.status(401).json({ error: 'Not authenticated' });
  const userId = session.user.id;
  const { testId } = req.query;

  if (req.method === 'POST') {
    const { score, passed, answers } = req.body;
    const id = testId as string;
    if (!id) return res.status(400).json({ error: 'testId required' });

    const rows = await query<any[]>(
      `INSERT INTO user_test_attempts (user_id, test_id, score, passed, answers)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id, test_id) DO UPDATE SET
         score = EXCLUDED.score,
         passed = EXCLUDED.passed,
         answers = EXCLUDED.answers,
         attempts = user_test_attempts.attempts + 1,
         last_attempt_at = now()
       RETURNING *`,
      [userId, id, score, passed ?? false, JSON.stringify(answers ?? [])]
    );
    return res.status(200).json(rows[0]);
  }

  if (req.method === 'GET') {
    const rows = await query<any[]>(
      'SELECT * FROM user_test_attempts WHERE user_id = $1 ORDER BY last_attempt_at DESC',
      [userId]
    );
    return res.status(200).json(rows);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
