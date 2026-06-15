import type { NextApiRequest, NextApiResponse } from 'next';
import { affiliateProducts } from '@/data/affiliate-products';
import { affiliateUrl } from '@/data/affiliate-products';
import { query } from '@/lib/db';

const WINDOW_MS = 60_000;
const MAX_REDIRECTS_PER_MIN = 30;
const redirectHits = new Map<string, { count: number; reset: number }>();

function clientIp(req: NextApiRequest): string {
  const header = req.headers['x-forwarded-for'];
  const first = typeof header === 'string' ? header.split(',')[0].trim() : null;
  return first || req.socket.remoteAddress || 'unknown';
}

type RedirectResponse = { ok: true; url: string } | { ok: false; error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<RedirectResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { productId } = req.query;

  if (typeof productId !== 'string' || productId.length > 120) {
    return res.status(400).json({ ok: false, error: 'Missing productId' });
  }

  const product = affiliateProducts.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ ok: false, error: 'Product not found' });
  }

  const ip = clientIp(req);
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / WINDOW_MS)}`;
  const entry = redirectHits.get(key);
  if (entry) {
    entry.count += 1;
    if (entry.count > MAX_REDIRECTS_PER_MIN) {
      return res.status(429).json({ ok: false, error: 'Too many requests.' });
    }
  } else {
    redirectHits.set(key, { count: 1, reset: now + WINDOW_MS });
  }

  const target = affiliateUrl(product);

  // Log click to database (non-blocking — redirect happens regardless)
  try {
    const sourcePath = (req.headers.referer || req.headers.referrer || '').toString().slice(0, 2048);
    const userAgent = (req.headers['user-agent'] || '').toString().slice(0, 512);
    const sessionId = (req as any).cookies?.session || '';
    const safeSessionId = typeof sessionId === 'string' ? sessionId.slice(0, 128) : '';

    await query(
      `INSERT INTO affiliate_clicks (product_id, product_name, source_path, session_id, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [product.id, product.name, sourcePath, safeSessionId, userAgent]
    );
  } catch (err) {
    // Never block the redirect on logging failure
    console.error('Affiliate click logging failed:', err);
  }

  return res.redirect(302, target);
}
