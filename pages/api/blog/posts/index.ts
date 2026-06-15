import type { NextApiRequest, NextApiResponse } from 'next';
import { blogPosts, blogCategories } from '@/data/blog';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const posts = blogPosts.map((post) => ({
    ...post,
    category: blogCategories.find((c) => c.slug === post.categorySlug) || null,
  }));
  return res.status(200).json(posts);
}
