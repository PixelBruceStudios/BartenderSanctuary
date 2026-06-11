import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const id = q.id as string;

  if (!id) return res.status(400).json({ error: 'id required' });

  if (method === 'GET') {
    const rows = await query<any[]>('SELECT * FROM techniques WHERE id = $1', [id]);
    return rows.length ? res.status(200).json(rows[0]) : res.status(404).json({ error: 'Not found' });
  }

  if (method === 'PUT') {
    const { category_id, slug, title, description, sort_order } = req.body;
    const rows = await query<any[]>(
      `UPDATE techniques SET category_id=$1, slug=$2, title=$3, description=$4, sort_order=$5, updated_at=now()
       WHERE id=$6 RETURNING *`,
      [category_id, slug, title, description, sort_order, id]
    );
    return res.status(200).json(rows[0]);
  }

  if (method === 'DELETE') {
    await query('DELETE FROM techniques WHERE id = $1', [id]);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
