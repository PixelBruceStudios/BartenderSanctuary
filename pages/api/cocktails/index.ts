import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { categorizeIngredient } from '@/lib/matching';

function mapRow(row: any): any {
  const ingredients = Array.isArray(row.ingredients) ? row.ingredients : [];
  const bases = new Set<string>();
  const mods = new Set<string>();
  ingredients.forEach((ing: any) => {
    const item = typeof ing === 'string' ? ing : ing?.item;
    if (!item) return;
    const cat = categorizeIngredient(item);
    if (cat === 'base') bases.add(item);
    else if (cat === 'mod') mods.add(item);
  });

  return {
    ...row,
    glass: row.glass_type || row.glass || '',
    recipe: Array.isArray(row.instructions) ? row.instructions : [],
    base: Array.from(bases).sort(),
    modifiers: Array.from(mods).sort(),
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const rows = await query<any[]>('SELECT * FROM cocktails ORDER BY name ASC');
      return res.status(200).json(rows.map(mapRow));
    }

    if (method === 'POST') {
      const { slug, name, description, image_url, ingredients, instructions, glass_type, garnish, difficulty, origin, tags } = req.body;
      const rows = await query<any[]>(
        `INSERT INTO cocktails (slug, name, description, image_url, ingredients, instructions, glass_type, garnish, difficulty, origin, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          slug,
          name,
          description || '',
          image_url || '',
          JSON.stringify(ingredients || []),
          JSON.stringify(instructions || []),
          glass_type || '',
          garnish || '',
          difficulty || 'Beginner',
          origin || '',
          JSON.stringify(tags || []),
        ]
      );
      return res.status(201).json(mapRow(rows[0]));
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('API /cocktails error:', err);
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
