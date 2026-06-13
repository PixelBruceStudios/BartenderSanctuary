import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { auth } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: any = await getServerSession(req, res, auth);
  if (!session?.user?.id) return res.status(401).json({ error: 'Not authenticated' });
  const userId = session.user.id;

  if (req.method === 'GET') {
    const { lesson_id } = req.query;
    if (lesson_id && typeof lesson_id === 'string') {
      const rows = await query<any[]>(
        `SELECT ulp.*, l.title as lesson_title
         FROM user_lesson_progress ulp
         LEFT JOIN lessons l ON l.id = ulp.lesson_id
         WHERE ulp.user_id = $1 AND ulp.lesson_id = $2`,
        [userId, lesson_id]
      );
      return res.status(200).json(rows[0] || null);
    }
    const rows = await query<any[]>(
      `SELECT ulp.*, l.title as lesson_title
       FROM user_lesson_progress ulp
       LEFT JOIN lessons l ON l.id = ulp.lesson_id
       WHERE ulp.user_id = $1
       ORDER BY ulp.updated_at DESC`,
      [userId]
    );
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { lesson_id, all_subtests_passed, full_test_passed, overall_progress } = req.body;
    if (!lesson_id) return res.status(400).json({ error: 'lesson_id required' });

    await query(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, all_subtests_passed, full_test_passed, overall_progress)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET
         all_subtests_passed = EXCLUDED.all_subtests_passed,
         full_test_passed = EXCLUDED.full_test_passed,
         overall_progress = EXCLUDED.overall_progress,
         updated_at = now()`,
      [userId, lesson_id, !!all_subtests_passed, !!full_test_passed, overall_progress ?? 0]
    );
    const rows = await query<any[]>(
      `SELECT ulp.*, l.title as lesson_title
       FROM user_lesson_progress ulp
       LEFT JOIN lessons l ON l.id = ulp.lesson_id
       WHERE ulp.user_id = $1 AND ulp.lesson_id = $2`,
      [userId, lesson_id]
    );
    return res.status(200).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
