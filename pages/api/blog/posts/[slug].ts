import type { NextApiRequest, NextApiResponse } from 'next';
import { blogPosts } from '@/data/blog';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing slug' });
  }

  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  return res.status(200).json(post);
}
