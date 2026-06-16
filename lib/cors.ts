import type { NextApiRequest, NextApiResponse } from 'next';

type CorsOptions = {
  origin?: string | string[] | boolean;
  methods?: string;
  allowHeaders?: string;
};

const DEFAULT_ALLOWED_ORIGINS = ['https://bartender-sanctuary-app.vercel.app'];

function resolveOrigin(origin: string | string[] | boolean | undefined): string | null {
  if (origin === true) return '*';
  if (typeof origin === 'string') return origin;
  if (Array.isArray(origin) && origin.length) return origin[0];
  if (!origin) return DEFAULT_ALLOWED_ORIGINS[0];
  return null;
}

export function withCors(options: CorsOptions = {}) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const originHeader = (req.headers.origin as string) || '';
    const allowed = resolveOrigin(options.origin);
    if (allowed === '*' || allowed === originHeader) {
      res.setHeader('Access-Control-Allow-Origin', allowed);
    }
    res.setHeader('Access-Control-Allow-Methods', options.methods || 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', options.allowHeaders || 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return true;
    }
    return false;
  };
}
