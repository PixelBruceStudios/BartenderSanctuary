import type { NextApiRequest, NextApiResponse } from 'next';

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per window per IP

// Simple in-memory store (reset on cold start; swap for Redis in production)
const hits = new Map<string, { count: number; reset: number }>();

function getKey(req: NextApiRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string) ||
    (req.headers['x-real-ip'] as string) ||
    (req.socket?.remoteAddress || 'unknown')
  ).toString().split(',')[0].trim();
}

export function withRateLimit(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const key = getKey(req);
    const now = Date.now();
    const entry = hits.get(key);

    if (entry && now < entry.reset) {
      entry.count += 1;
      if (entry.count > RATE_LIMIT_MAX) {
        res.setHeader('Retry-After', Math.ceil((entry.reset - now) / 1000));
        return res.status(429).json({ error: 'Too many requests', retryAfter: Math.ceil((entry.reset - now) / 1000) });
      }
    } else {
      hits.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    }

    // Cleanup old entries periodically
    if (hits.size > 10000 && Math.random() < 0.01) {
      for (const [k, v] of hits) {
        if (v.reset < now) hits.delete(k);
      }
    }

    return handler(req, res);
  };
}
