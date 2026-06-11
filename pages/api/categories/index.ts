import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;

  if (method === 'GET') {
    const rows = await query<any[]>(
      'SELECT * FROM categories ORDER BY sort_order ASC, title ASC'
    );
    return res.status(200).json(rows);
  }

  if (method === 'POST') {
    const { slug, title, description, icon, sort_order } = req.body;
    const rows = await query<any[]>(
      `INSERT INTO categories (slug, title, description, icon, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [slug, title, description || '', icon || '', sort_order || 0]
    );
    return res.status(201).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
