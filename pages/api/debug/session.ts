import { getServerSession } from 'next-auth';
import { auth } from '../auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const session: any = await getServerSession(_req, res, auth);
  const cookieHeader = _req.headers.cookie || '';
  return res.status(200).json({
    hasCookie: Boolean(cookieHeader),
    cookiePreview: cookieHeader.slice(0, 200),
    session: session ? {
      id: session.user?.id,
      email: session.user?.email,
      name: session.user?.name,
    } : null,
  });
}
