import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const id = q.id as string;

  if (!id) return res.status(400).json({ error: 'id required' });

  if (method === 'GET') {
    const rows = await query<any[]>(
      'SELECT * FROM categories WHERE id = $1', [id]
    );
    return rows.length ? res.status(200).json(rows[0]) : res.status(404).json({ error: 'Not found' });
  }

  if (method === 'PUT') {
    const { slug, title, description, icon, sort_order } = req.body;
    const rows = await query<any[]>(
      `UPDATE categories SET slug=$1, title=$2, description=$3, icon=$4, sort_order=$5, updated_at=now()
       WHERE id=$6 RETURNING *`,
      [slug, title, description, icon, sort_order, id]
    );
    return res.status(200).json(rows[0]);
  }

  if (method === 'DELETE') {
    await query('DELETE FROM categories WHERE id = $1', [id]);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
