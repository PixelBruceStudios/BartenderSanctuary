import type { NextApiRequest, NextApiResponse } from 'next';
import { forumCategories, forumThreads, getForumThreadsByCategory } from '@/data/blog.generated';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const threads = forumThreads.map((thread) => ({
      ...thread,
      category: forumCategories.find((c) => c.slug === thread.categorySlug) || null,
    }));
    return res.status(200).json(threads);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
