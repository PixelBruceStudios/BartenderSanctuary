import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { auth } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: any = await getServerSession(req, res, auth);
  const userId = session?.user?.id;

  if (req.method === 'GET') {
    const { lesson_id } = req.query;
    if (lesson_id && typeof lesson_id === 'string') {
      const rows = await query<any[]>(
        `SELECT user_id, lesson_id, all_subtests_passed, full_test_passed, overall_progress, updated_at
         FROM user_lesson_progress
         WHERE user_id = $1 AND lesson_id = $2`,
        [userId, lesson_id]
      );
      if (rows.length > 0) {
        return res.status(200).json(rows[0]);
      }
      // Fallback: derive from anonymous test_attempts
      const attemptRows: any[] = await query(
        `SELECT t.lesson_id, t.id as test_id, t.scope, ta.passed
         FROM test_attempts ta
         JOIN tests t ON t.id = ta.test_id
         WHERE ta.user_id IS NULL AND t.lesson_id = $1
         ORDER BY ta.created_at DESC`,
        [lesson_id]
      );
      const aMap: any = {};
      for (const a of attemptRows) {
        if (!aMap[a.lesson_id]) aMap[a.lesson_id] = { lesson_test_passed: false, sublesson_tests_passed: 0, sublesson_tests_total: 0 };
        if (a.scope === 'lesson' && a.passed) aMap[a.lesson_id].lesson_test_passed = true;
        if (a.scope === 'sublesson') { aMap[a.lesson_id].sublesson_tests_total += 1; if (a.passed) aMap[a.lesson_id].sublesson_tests_passed += 1; }
      }
      const a = aMap[lesson_id] || {};
      return res.status(200).json({
        lesson_id,
        lesson_title: null,
        all_subtests_passed: a.sublesson_tests_passed === a.sublesson_tests_total && a.sublesson_tests_total > 0,
        full_test_passed: a.lesson_test_passed,
        overall_progress: a.lesson_test_passed ? 100 : a.sublesson_tests_total > 0 ? Math.round((a.sublesson_tests_passed / a.sublesson_tests_total) * 50) : 0,
        sublesson_tests_passed: a.sublesson_tests_passed,
        sublesson_tests_total: a.sublesson_tests_total,
      });
    }
    if (userId) {
      const rows = await query<any[]>(
        `SELECT user_id, lesson_id, all_subtests_passed, full_test_passed, overall_progress, updated_at
         FROM user_lesson_progress
         WHERE user_id = $1
         ORDER BY updated_at DESC`,
        [userId]
      );
      return res.status(200).json(rows);
    }
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
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
      `SELECT user_id, lesson_id, all_subtests_passed, full_test_passed, overall_progress, updated_at
       FROM user_lesson_progress
       WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lesson_id]
    );
    return res.status(200).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
