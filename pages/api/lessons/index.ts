import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const techniqueId = q.techniqueId as string;

  if (method === 'GET') {
    const where = techniqueId ? 'WHERE technique_id = $1' : '';
    const params = techniqueId ? [techniqueId] : [];
    const rows = await query<any[]>(
      `SELECT l.*,
              coalesce(json_agg(s ORDER BY s.sort_order) FILTER (WHERE s.id IS NOT NULL), '[]') as sources
       FROM lessons l
       LEFT JOIN sources s ON s.lesson_id = l.id
       ${where ? 'WHERE l.technique_id = $1' : ''}
       GROUP BY l.id
       ORDER BY l.sort_order ASC, l.title ASC`,
      params
    );
    return res.status(200).json(rows);
  }

  if (method === 'POST') {
    const { technique_id, slug, title, description, duration, difficulty, content, sort_order } = req.body;
    const rows = await query<any[]>(
      `INSERT INTO lessons (technique_id, slug, title, description, duration, difficulty, content, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [technique_id, slug, title, description || '', duration || '', difficulty || 'Beginner', content || '', sort_order || 0]
    );
    return res.status(201).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
