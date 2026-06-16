import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../../../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', '..', '..', 'content', 'forum');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { threadId } = req.query;
  if (typeof threadId !== 'string') {
    return res.status(400).json({ ok: false, error: 'Invalid thread id.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, auth) as any;
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, error: 'Sign in required.' });
  }

  const { content } = req.body as { content?: string };
  const trimmedContent = (content || '').trim().slice(0, 20_000);
  if (!trimmedContent) {
    return res.status(400).json({ ok: false, error: 'Content is required.' });
  }

  const threadDir = path.join(contentDir, threadId);
  if (!fs.existsSync(threadDir)) {
    return res.status(404).json({ ok: false, error: 'Thread not found.' });
  }

  const repliesDir = path.join(threadDir, 'replies');
  fs.mkdirSync(repliesDir, { recursive: true });

  const replyId = `r-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const authorName = (session.user?.name as string) || session.user?.email || 'Anonymous';

  fs.writeFileSync(
    path.join(repliesDir, `${replyId}.md`),
    `---\ntype: reply\nthreadId: ${threadId}\nauthorName: ${authorName}\nauthorEmail: ${session.user?.email}\ncreatedAt: ${createdAt}\n---\n\n${trimmedContent}\n`,
    'utf-8'
  );

  res.status(201).json({ ok: true, replyId, createdAt });
}
