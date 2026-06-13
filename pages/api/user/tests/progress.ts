import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TypeScript: session typing depends on module augmentation in [...nextauth].ts
  const session = await getServerSession(req, res, auth);
  const userId = (session as any)?.user?.id;

  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  if (req.method === 'GET') {
    const { lesson_id } = req.query;
    if (lesson_id && typeof lesson_id === 'string') {
      const rows = await query<any[]>(
        'SELECT * FROM user_lesson_progress WHERE user_id = $1 AND lesson_id = $2',
        [userId, lesson_id]
      );
      return res.status(200).json(rows[0] || { all_subtests_passed: false, full_test_passed: false, overall_progress: 0 });
    }
    const rows = await query<any[]>(
      'SELECT * FROM user_lesson_progress WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { lesson_id, all_subtests_passed, full_test_passed } = req.body;
    if (!lesson_id) return res.status(400).json({ error: 'lesson_id required' });

    const progress = await query<any[]>(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, all_subtests_passed, full_test_passed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET
         all_subtests_passed = EXCLUDED.all_subtests_passed,
         full_test_passed = EXCLUDED.full_test_passed,
         updated_at = now()
       RETURNING *`,
      [userId, lesson_id, !!all_subtests_passed, !!full_test_passed]
    );
    return res.status(200).json(progress[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
