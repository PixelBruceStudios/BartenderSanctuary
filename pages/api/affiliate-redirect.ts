import type { NextApiRequest, NextApiResponse } from 'next';
import { affiliateProducts } from '@/data/affiliate-products';
import { affiliateUrl } from '@/data/affiliate-products';

type RedirectResponse = { ok: true; url: string } | { ok: false; error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<RedirectResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { productId } = req.query;

  if (typeof productId !== 'string') {
    return res.status(400).json({ ok: false, error: 'Missing productId' });
  }

  const product = affiliateProducts.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ ok: false, error: 'Product not found' });
  }

  const target = affiliateUrl(product);

  // TODO: Log click to database when DB is available
  // await db.query('INSERT INTO affiliate_clicks ...')

  return res.redirect(302, target);
}
