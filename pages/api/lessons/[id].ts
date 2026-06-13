import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

async function resolveLessonId(slug: string): Promise<string | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = await query(
    `SELECT id FROM lessons WHERE slug = $1 UNION ALL SELECT id FROM lessons_hr WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  return rows.length > 0 ? String(rows[0].id) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const rawId = q.id as string;
  const lang = (q.lang as string) === 'hr' ? 'hr' : 'en';

  if (!rawId) return res.status(400).json({ error: 'id required' });

  // Resolve slug to UUID if needed
  let lessonId = rawId;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId)) {
    const resolved = await resolveLessonId(rawId);
    if (!resolved) return res.status(404).json({ error: 'Lesson not found', slug: rawId });
    lessonId = resolved;
  }

  if (method === 'GET') {
    const lessonTable = lang === 'hr' ? 'lessons_hr' : 'lessons';
    const lessonRows = await query<any[]>(`SELECT * FROM ${lessonTable} WHERE id = $1`, [lessonId]);
    if (!lessonRows.length) return res.status(404).json({ error: 'Not found' });
    const lesson = lessonRows[0];
    const sources = await query<any[]>('SELECT * FROM sources WHERE lesson_id = $1 ORDER BY sort_order', [lessonId]);
    const tests = await query<any[]>(`SELECT id, lesson_id, scope, title, description, passing_score, sort_order, created_at, updated_at, sublesson_slug FROM tests WHERE lesson_id = $1 ORDER BY sort_order`, [lessonId]) as any[];
    const testIds = (tests || []).map((t: any) => t.id);
    let questions: any[] = [];
    if (testIds.length) {
      questions = await query<any[]>(`SELECT id, test_id, question_index, question_text, options, correct_index FROM questions WHERE test_id = ANY($1::uuid[]) ORDER BY question_index`, [testIds]);
    }
    const testsWithQuestions = tests.map((t) => ({
      ...t,
      questions: questions.filter((q) => q.test_id === t.id),
    }));
    return res.status(200).json({ ...lesson, sources, tests: testsWithQuestions });
  }

  if (method === 'PUT') {
    const { technique_id, slug, title, description, duration, difficulty, content, sort_order } = req.body;
    const lessonTable = lang === 'hr' ? 'lessons_hr' : 'lessons';
    const rows = await query<any[]>(
      `UPDATE ${lessonTable} SET technique_id=$1, slug=$2, title=$3, description=$4, duration=$5, difficulty=$6, content=$7, sort_order=$8, updated_at=now()
       WHERE id=$9 RETURNING *`,
      [technique_id, slug, title, description, duration, difficulty, content, sort_order, lessonId]
    );
    return res.status(200).json(rows[0]);
  }

  if (method === 'DELETE') {
    const lessonTable = lang === 'hr' ? 'lessons_hr' : 'lessons';
    await query(`DELETE FROM ${lessonTable} WHERE id = $1`, [lessonId]);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
