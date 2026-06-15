import type { NextApiRequest, NextApiResponse } from 'next';
import { blogCategories } from '@/data/blog';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(blogCategories);
}
