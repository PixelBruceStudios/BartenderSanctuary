import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../auth/[...nextauth]';

export default async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, auth) as any;
  const email = session?.user?.email;
  if (!email || email !== 'pixelbruce.3d@gmail.com') {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }
  return session;
}
