import type { NextApiRequest, NextApiResponse } from 'next';
import { affiliateProducts } from '@/data/affiliate-products';
import { affiliateUrl } from '@/data/affiliate-products';
import { query } from '@/lib/db';

type RedirectResponse = { ok: true; url: string } | { ok: false; error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<RedirectResponse>) {
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

  // Log click to database (non-blocking — redirect happens regardless)
  try {
    const sourcePath = (req.headers.referer || req.headers.referrer || '').toString();
    const userAgent = (req.headers['user-agent'] || '').toString();
    const sessionId = (req as any).cookies?.session || '';

    await query(
      `INSERT INTO affiliate_clicks (product_id, product_name, source_path, session_id, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [product.id, product.name, sourcePath, sessionId, userAgent]
    );
  } catch (err) {
    // Never block the redirect on logging failure
    console.error('Affiliate click logging failed:', err);
  }

  return res.redirect(302, target);
}
