import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../auth/[...nextauth]';

async function resolveLessonId(slug: string): Promise<string | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = await query(
    `SELECT id FROM lessons WHERE slug = $1 UNION ALL SELECT id FROM lessons_hr WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  return rows.length > 0 ? String(rows[0].id) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await auth(req, res);
    const userId = session?.user?.id;

    if (req.method === 'GET') {
      const raw = req.query.lesson_id as string | undefined;

      if (raw) {
        let lessonUuid = raw;
        // If it looks like a slug (no dashes in UUID pattern), resolve it
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw)) {
          const resolved = await resolveLessonId(raw);
          if (!resolved) return res.status(404).json({ error: 'Lesson not found', slug: raw });
          lessonUuid = resolved;
        }

        const rows = await query<any[]>(
          `SELECT ul.user_id, ul.lesson_id, ul.all_subtests_passed, ul.full_test_passed, ul.overall_progress, ul.updated_at,
                  l.title AS lesson_title
           FROM user_lesson_progress ul
           JOIN lessons l ON l.id = ul.lesson_id
           WHERE ul.user_id = $1 AND ul.lesson_id = $2`,
          [userId, lessonUuid]
        );
        if (rows.length > 0) {
          return res.status(200).json(rows[0]);
        }

        // Anonymous fallback: derive from test_attempts
        const attemptRows: any[] = await query(
          `SELECT t.lesson_id, t.id as test_id, t.scope, ta.passed
           FROM test_attempts ta
           JOIN tests t ON t.id = ta.test_id
           WHERE ta.user_id IS NULL AND t.lesson_id = $1
           ORDER BY ta.created_at DESC`,
          [lessonUuid]
        );
        const aMap: any = {};
        for (const a of attemptRows) {
          if (!aMap[a.lesson_id]) aMap[a.lesson_id] = { lesson_test_passed: false, sublesson_tests_passed: 0, sublesson_tests_total: 0 };
          if (a.scope === 'lesson' && a.passed) aMap[a.lesson_id].lesson_test_passed = true;
          if (a.scope === 'sublesson') { aMap[a.lesson_id].sublesson_tests_total += 1; if (a.passed) aMap[a.lesson_id].sublesson_tests_passed += 1; }
        }
        const a = aMap[lessonUuid] || {};
        return res.status(200).json({
          lesson_id: lessonUuid,
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
          `SELECT ul.user_id, ul.lesson_id, ul.all_subtests_passed, ul.full_test_passed, ul.overall_progress, ul.updated_at,
                  l.title AS lesson_title
           FROM user_lesson_progress ul
           JOIN lessons l ON l.id = ul.lesson_id
           WHERE ul.user_id = $1
           ORDER BY ul.updated_at DESC`,
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

      // Accept either slug or UUID; resolve slug if needed
      let lessonUuid = lesson_id;
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lesson_id)) {
        const resolved = await resolveLessonId(lesson_id);
        if (!resolved) return res.status(404).json({ error: 'Lesson not found', slug: lesson_id });
        lessonUuid = resolved;
      }

      await query(
        `INSERT INTO user_lesson_progress (user_id, lesson_id, all_subtests_passed, full_test_passed, overall_progress)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (user_id, lesson_id) DO UPDATE SET
           all_subtests_passed = EXCLUDED.all_subtests_passed,
           full_test_passed = EXCLUDED.full_test_passed,
           overall_progress = EXCLUDED.overall_progress,
           updated_at = now()`,
        [userId, lessonUuid, !!all_subtests_passed, !!full_test_passed, overall_progress ?? 0]
      );
      const rows = await query<any[]>(
        `SELECT user_id, lesson_id, all_subtests_passed, full_test_passed, overall_progress, updated_at
         FROM user_lesson_progress
         WHERE user_id = $1 AND lesson_id = $2`,
        [userId, lessonUuid]
      );
      return res.status(200).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    console.error('[progress/lesson] error:', e);
    return res.status(500).json({ error: 'Server error', detail: e?.message });
  }
}
