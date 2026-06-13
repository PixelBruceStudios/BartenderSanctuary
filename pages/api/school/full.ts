import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { auth } from '../auth/[...nextauth]';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const lang = (_.query.lang as string) === 'hr' ? 'hr' : 'en';
  const session: any = await getServerSession(_, res, auth);
  const userId = session?.user?.id;

  const categories: any[] = await query(`
    SELECT id, slug, title, description, icon, sort_order
    FROM categories
    ORDER BY sort_order ASC, title ASC
  `);

  for (const cat of categories) {
    const techniques: any[] = await query(
      `SELECT id, slug, title, description, sort_order
       FROM techniques WHERE category_id = $1 ORDER BY sort_order ASC, title ASC`,
      [cat.id]
    );
    for (const tech of techniques) {
      const lessonTable = lang === 'hr' ? 'lessons_hr' : 'lessons';
      const lessons: any[] = await query(
        `
        SELECT l.id, l.slug, l.title, l.description, l.duration, l.difficulty, l.content, l.sort_order,
               coalesce(json_agg(s ORDER BY s.sort_order) FILTER (WHERE s.id IS NOT NULL), '[]') as sources
        FROM ${lessonTable} l
        LEFT JOIN sources s ON s.lesson_id = l.id
        WHERE l.technique_id = $1
        GROUP BY l.id
        ORDER BY l.sort_order ASC, l.title ASC
        `,
        [tech.id]
      );

      if (lessons.length > 0) {
        const lessonIds = lessons.map((l: any) => l.id);

        // Authenticated user: read from user_test_progress + user_lesson_progress
        let progressMap = new Map();
        if (userId) {
          const progressRows: any[] = await query(
            `SELECT lesson_id, all_subtests_passed, full_test_passed, overall_progress
             FROM user_lesson_progress WHERE user_id = $1 AND lesson_id = ANY($2::uuid[])`,
            [userId, lessonIds]
          );
          progressMap = new Map(progressRows.map((r) => [r.lesson_id, r]));
        }

        // Anonymous fallback: derive from test_attempts
        const attemptRows: any[] = await query(
          `SELECT t.lesson_id, t.id as test_id, t.scope, ta.score, ta.passed
           FROM test_attempts ta
           JOIN tests t ON t.id = ta.test_id
           WHERE ta.user_id IS NULL AND t.lesson_id = ANY($1::uuid[])
           ORDER BY ta.created_at DESC`,
          [lessonIds]
        );
        const attemptMap = new Map();
        for (const a of attemptRows) {
          if (!attemptMap.has(a.lesson_id)) {
            attemptMap.set(a.lesson_id, {
              lesson_test_passed: false,
              sublesson_tests_passed: 0,
              sublesson_tests_total: 0,
            });
          }
          const cur = attemptMap.get(a.lesson_id);
          if (a.scope === 'lesson' && a.passed) cur.lesson_test_passed = true;
          if (a.scope === 'sublesson') {
            cur.sublesson_tests_total += 1;
            if (a.passed) cur.sublesson_tests_passed += 1;
          }
        }

        (lessons as any[]).forEach((l: any) => {
          if (userId && progressMap.has(l.id)) {
            l.progress = {
              ...progressMap.get(l.id),
              lesson_test_passed: progressMap.get(l.id).full_test_passed,
              all_subtests_passed: progressMap.get(l.id).all_subtests_passed,
            };
          } else if (attemptMap.has(l.id)) {
            const a = attemptMap.get(l.id);
            l.progress = {
              ...a,
              all_subtests_passed: a.sublesson_tests_passed === a.sublesson_tests_total && a.sublesson_tests_total > 0,
              full_test_passed: a.lesson_test_passed,
              overall_progress: a.lesson_test_passed
                ? 100
                : a.sublesson_tests_total > 0
                  ? Math.round((a.sublesson_tests_passed / a.sublesson_tests_total) * 50)
                  : 0,
            };
          } else {
            l.progress = null;
          }
        });
      }

      tech.lessons = lessons;
    }
    cat.techniques = techniques;
  }

  res.status(200).json(categories);
}
