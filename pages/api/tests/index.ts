import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    // List tests, optionally filtered by scope + target
    const { scope, lesson_id, technique_id } = req.query;
    const where: string[] = [];
    const params: any[] = [];
    if (scope) { where.push('scope = $' + (params.length + 1)); params.push(scope); }
    if (lesson_id) { where.push('lesson_id = $' + (params.length + 1)); params.push(lesson_id); }
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
    const rows = await query<any[]>(
      `INSERT INTO tests (scope, lesson_id, technique_id, title, description, passing_score, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [scope, lesson_id || null, technique_id || null, title || '', description || '', passing_score ?? 70, sort_order ?? 0]
    );
    return res.status(201).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
