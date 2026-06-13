import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: any = await getServerSession(req, res, auth);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });
  const userId = session.user.id;

  if (req.method === 'GET') {
    const progressRows: any[] = await query(
      `SELECT lesson_id, all_subtests_passed, full_test_passed, overall_progress
       FROM user_lesson_progress WHERE user_id = $1`,
      [userId]
    );
    const progressMap = new Map(progressRows.map((r) => [r.lesson_id, r]));

    const catRows: any[] = await query('SELECT id, slug, title, sort_order FROM categories ORDER BY sort_order');
    const techRows: any[] = await query('SELECT id, category_id, slug, title, sort_order FROM techniques ORDER BY sort_order');
    const lessonRows: any[] = await query('SELECT id, technique_id, slug, title, sort_order FROM lessons ORDER BY sort_order');

    const categories = catRows.map((c: any) => ({ ...c, techniques: [] as any[] }));
    const catMap = new Map(categories.map((c: any) => [c.id, c]));
    const techList = techRows.map((t: any) => ({ ...t, lessons: [] as any[] }));
    const techMap = new Map(techList.map((t: any) => [t.id, t]));

    techList.forEach((t: any) => { const cat = catMap.get(t.category_id); if (cat) cat.techniques.push(t); });
    lessonRows.forEach((l: any) => { const tech = techMap.get(l.technique_id); if (tech) tech.lessons.push(l); });

    const result = categories.map((cat: any) => ({
      ...cat,
      techniques: cat.techniques.map((tech: any) => ({
        ...tech,
        lessons: tech.lessons.map((l: any) => {
          const p = progressMap.get(l.id);
          return { ...l, progress: p ?? null };
        }),
      })),
    }));

    return res.status(200).json({ categories: result });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
