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
  const { method } = req;

  if (method === 'GET') {
    // List tests, optionally filtered by scope + target
    const { scope, lesson_id, technique_id } = req.query;
    const where: string[] = [];
    const params: any[] = [];
    if (scope) { where.push('scope = $' + (params.length + 1)); params.push(scope); }
    if (lesson_id) {
      const raw = String(lesson_id);
      // Resolve slug to UUID if needed
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw)) {
        const resolved = await resolveLessonId(raw);
        if (!resolved) return res.status(200).json([]);
        where.push('lesson_id = $' + (params.length + 1)); params.push(resolved);
      } else {
        where.push('lesson_id = $' + (params.length + 1)); params.push(raw);
      }
    }
    if (technique_id) { where.push('technique_id = $' + (params.length + 1)); params.push(technique_id); }
    const sql = 'SELECT * FROM tests' + (where.length ? ' WHERE ' + where.join(' AND ') : '') + ' ORDER BY sort_order';
    const rows = await query<any[]>(sql, params);
    return res.status(200).json(rows);
  }

  if (method === 'POST') {
    const { scope, lesson_id, technique_id, title, description, passing_score, sort_order } = req.body;
    if (!scope || !['sublesson', 'lesson', 'combined'].includes(scope)) {
      return res.status(400).json({ error: 'Invalid scope (sublesson|lesson|combined)' });
    }
    // Resolve lesson slug to UUID if needed
    let resolvedLessonId: string | null = null;
    if (lesson_id) {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lesson_id)) {
        resolvedLessonId = lesson_id;
      } else {
        resolvedLessonId = await resolveLessonId(String(lesson_id));
        if (!resolvedLessonId) return res.status(404).json({ error: 'Lesson not found', slug: lesson_id });
      }
    }
    const rows = await query<any[]>(
      `INSERT INTO tests (scope, lesson_id, technique_id, title, description, passing_score, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [scope, resolvedLessonId, technique_id || null, title || '', description || '', passing_score ?? 70, sort_order ?? 0]
    );
    return res.status(201).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
