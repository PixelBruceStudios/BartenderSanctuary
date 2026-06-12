import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const rows = await query<any[]>('SELECT * FROM cocktails ORDER BY name ASC');
      return res.status(200).json(rows);
    }

    if (method === 'POST') {
      const { slug, name, description, image_url, ingredients, instructions, glass_type, garnish, difficulty, origin, tags } = req.body;
      const rows = await query<any[]>(
        `INSERT INTO cocktails (slug, name, description, image_url, ingredients, instructions, glass_type, garnish, difficulty, origin, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [slug, name, description || '', image_url || '', JSON.stringify(ingredients || []), JSON.stringify(instructions || []), glass_type || '', garnish || '', difficulty || 'Beginner', origin || '', JSON.stringify(tags || [])]
      );
      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('API /cocktails error:', err);
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
