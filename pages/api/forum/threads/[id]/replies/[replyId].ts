import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../../../../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', '..', '..', '..', 'content', 'forum');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { threadId, replyId } = req.query;
  if (typeof threadId !== 'string' || typeof replyId !== 'string') {
    return res.status(400).json({ ok: false, error: 'Invalid ids.' });
  }

  const threadDir = path.join(contentDir, threadId);
  const replyPath = path.join(threadDir, 'replies', `${replyId}.md`);
  if (!fs.existsSync(replyPath)) {
    return res.status(404).json({ ok: false, error: 'Reply not found.' });
  }

  const raw = fs.readFileSync(replyPath, 'utf-8');
  const gm = await import('gray-matter');
  const data = (gm.default as any)(raw).data;
  const isOwner = data.authorEmail;

  const session = await getServerSession(req, res, auth) as any;
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, error: 'Sign in required.' });
  }
  if (isOwner !== session.user.email) {
    return res.status(403).json({ ok: false, error: 'Not allowed.' });
  }

  if (req.method === 'DELETE') {
    fs.unlinkSync(replyPath);
    const replies = fs.readdirSync(path.join(threadDir, 'replies')).filter((f) => f.endsWith('.md'));
    const updated = fs.readFileSync(path.join(threadDir, 'index.md'), 'utf-8');
    const { data: threadData, content: body } = matter(updated);
    const newIndex = matter.stringify(body, {
      ...threadData,
      replyCount: replies.length,
    });
    fs.writeFileSync(path.join(threadDir, 'index.md'), newIndex);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'PUT') {
    const { content } = req.body as { content?: string };
    const trimmed = (content || '').trim().slice(0, 20_000);
    if (!trimmed) return res.status(400).json({ ok: false, error: 'Content required.' });
    const newFront = matter.stringify('', { ...data, content: trimmed });
    fs.writeFileSync(replyPath, newFront, 'utf-8');
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
