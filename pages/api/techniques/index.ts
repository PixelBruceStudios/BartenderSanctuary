import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const categoryId = q.categoryId as string;
  const techniqueId = q.techniqueId as string;

  if (method === 'GET') {
    let where = '';
    const params: any[] = [];
    if (categoryId && techniqueId) {
      where = 'WHERE category_id = $1 AND id = $2';
      params.push(categoryId, techniqueId);
    } else if (categoryId) {
      where = 'WHERE category_id = $1';
      params.push(categoryId);
    }
    const rows = await query<any[]>(
      `SELECT id, slug, title, description, sort_order FROM techniques ${where} ORDER BY sort_order ASC, title ASC`,
      params
    );
    return res.status(200).json(rows);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
