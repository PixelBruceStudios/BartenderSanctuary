import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const id = q.id as string;

  if (!id) return res.status(400).json({ error: 'id required' });

  if (method === 'GET') {
    const rows = await query<any[]>('SELECT * FROM cocktails WHERE id = $1', [id]);
    return rows.length ? res.status(200).json(rows[0]) : res.status(404).json({ error: 'Not found' });
  }

  if (method === 'PUT') {
    const { slug, name, description, image_url, ingredients, instructions, glass_type, garnish, difficulty } = req.body;
    const rows = await query<any[]>(
      `UPDATE cocktails SET slug=$1, name=$2, description=$3, image_url=$4, ingredients=$5, instructions=$6, glass_type=$7, garnish=$8, difficulty=$9, updated_at=now()
       WHERE id=$10 RETURNING *`,
      [slug, name, description, image_url, JSON.stringify(ingredients || []), JSON.stringify(instructions || []), glass_type, garnish, difficulty, id]
    );
    return res.status(200).json(rows[0]);
  }

  if (method === 'DELETE') {
    await query('DELETE FROM cocktails WHERE id = $1', [id]);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
