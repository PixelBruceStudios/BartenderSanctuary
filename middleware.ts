import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limit store (per-instance; acceptable for single-region Vercel deploys)
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX = 60; // per IP per minute

function clientIp(req: NextRequest): string {
  return (
    (req.headers.get('x-forwarded-for') || '')
      .split(',')[0]
      .trim() || req.ip || 'unknown'
  );
}

export function middleware(req: NextRequest) {
  const ip = clientIp(req);
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / WINDOW_MS)}`;
  const entry = hits.get(key);

  if (entry) {
    entry.count += 1;
    if (entry.count > MAX) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((entry.reset - now) / 1000) },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.reset - now) / 1000)) } }
      );
    }
  } else {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
  }

  // Periodic cleanup to prevent memory leak
  if (hits.size > 10000 && Math.random() < 0.01) {
    for (const [k, v] of hits.entries()) {
      if (v.reset < now) hits.delete(k);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
