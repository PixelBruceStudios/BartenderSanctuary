import { getServerSession } from 'next-auth';
import { auth } from '../auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const cookieHeader = _req.headers.cookie || '';
  let session: any = null;
  let error: string | null = null;
  try {
    session = await getServerSession(_req, res, auth);
  } catch (e: any) {
    error = e?.message || String(e);
  }
  return res.status(200).json({
    method: _req.method,
    hasCookie: Boolean(cookieHeader),
    cookieFull: cookieHeader,
    cookieLength: cookieHeader.length,
    session: session ? {
      id: session.user?.id,
      email: session.user?.email,
      name: session.user?.name,
    } : null,
    error,
  });
}
