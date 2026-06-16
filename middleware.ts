import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://bartender-sanctuary-app.vercel.app',
];

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// In-memory rate limit store (per-instance; acceptable for single-region Vercel deploys)
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const DEFAULT_MAX = 120; // per IP per minute

function clientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for') || '';
  const first = xForwardedFor.split(',')[0]?.trim();
  return first || req.ip || 'unknown';
}

function resolveCorsOrigin(reqOrigin: string): string | null {
  if (!reqOrigin) return null;
  return ALLOWED_ORIGINS.find((o) => o && reqOrigin === o) || null;
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'X-XSS-Protection': '0',
  };
}

export function middleware(req: NextRequest) {
  const ip = clientIp(req);
  const now = Date.now();
  const windowKey = Math.floor(now / WINDOW_MS);
  const key = `${ip}:${windowKey}`;
  const entry = hits.get(key);

  if (entry) {
    entry.count += 1;
    if (entry.count > DEFAULT_MAX) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((entry.reset - now) / 1000) },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((entry.reset - now) / 1000)),
            ...securityHeaders(),
          },
        }
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

  // CORS preflight
  if (req.method === 'OPTIONS') {
    const origin = req.headers.get('origin') || '';
    const allowedOrigin = resolveCorsOrigin(origin);
    const headers: Record<string, string> = {
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Max-Age': '86400',
      ...securityHeaders(),
    };
    if (allowedOrigin) {
      headers['Access-Control-Allow-Origin'] = allowedOrigin;
      headers['Vary'] = 'Origin';
    }
    return new NextResponse(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = resolveCorsOrigin(origin);
  if (allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Vary', 'Origin');
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  for (const [name, value] of Object.entries(securityHeaders())) {
    response.headers.set(name, value);
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
