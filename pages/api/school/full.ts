import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const lang = (_.query.lang as string) === 'hr' ? 'hr' : 'en';

  const categories: any[] = await query(`
    SELECT id, slug, title, description, icon, sort_order
    FROM categories
    ORDER BY sort_order ASC, title ASC
  `);

  for (const cat of categories) {
    const techniques: any[] = await query(
      `SELECT id, slug, title, description, sort_order
       FROM techniques WHERE category_id = $1 ORDER BY sort_order ASC, title ASC`,
      [cat.id]
    );
    for (const tech of techniques) {
      const lessonTable = lang === 'hr' ? 'lessons_hr' : 'lessons';
      const lessons: any[] = await query(
        `
        SELECT l.id, l.slug, l.title, l.description, l.duration, l.difficulty, l.content, l.sort_order,
               coalesce(json_agg(s ORDER BY s.sort_order) FILTER (WHERE s.id IS NOT NULL), '[]') as sources
        FROM ${lessonTable} l
        LEFT JOIN sources s ON s.lesson_id = l.id
        WHERE l.technique_id = $1
        GROUP BY l.id
        ORDER BY l.sort_order ASC, l.title ASC
        `,
        [tech.id]
      );
      tech.lessons = lessons;
    }
    cat.techniques = techniques;
  }

  res.status(200).json(categories);
}
