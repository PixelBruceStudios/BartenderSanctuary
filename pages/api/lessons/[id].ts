import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const id = q.id as string;
  const lang = (q.lang as string) === 'hr' ? 'hr' : 'en';

  if (!id) return res.status(400).json({ error: 'id required' });

  if (method === 'GET') {
    const lessonTable = lang === 'hr' ? 'lessons_hr' : 'lessons';
    const lessonRows = await query<any[]>(`SELECT * FROM ${lessonTable} WHERE id = $1`, [id]);
    if (!lessonRows.length) return res.status(404).json({ error: 'Not found' });
    const lesson = lessonRows[0];
    const sources = await query<any[]>('SELECT * FROM sources WHERE lesson_id = $1 ORDER BY sort_order', [id]);
    return res.status(200).json({ ...lesson, sources });
  }

  if (method === 'PUT') {
    const { technique_id, slug, title, description, duration, difficulty, content, sort_order } = req.body;
    const lessonTable = lang === 'hr' ? 'lessons_hr' : 'lessons';
    const rows = await query<any[]>(
      `UPDATE ${lessonTable} SET technique_id=$1, slug=$2, title=$3, description=$4, duration=$5, difficulty=$6, content=$7, sort_order=$8, updated_at=now()
       WHERE id=$9 RETURNING *`,
      [technique_id, slug, title, description, duration, difficulty, content, sort_order, id]
    );
    return res.status(200).json(rows[0]);
  }

  if (method === 'DELETE') {
    const lessonTable = lang === 'hr' ? 'lessons_hr' : 'lessons';
    await query(`DELETE FROM ${lessonTable} WHERE id = $1`, [id]);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
