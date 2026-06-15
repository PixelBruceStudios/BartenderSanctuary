import type { NextApiRequest, NextApiResponse } from 'next';
import { forumCategories } from '@/data/blog';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(forumCategories);
}
