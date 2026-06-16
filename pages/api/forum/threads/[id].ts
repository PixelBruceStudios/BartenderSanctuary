import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', '..', '..', 'content', 'forum');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { threadId } = req.query;
  if (typeof threadId !== 'string') {
    return res.status(400).json({ ok: false, error: 'Invalid thread id.' });
  }

  const threadPath = path.join(contentDir, threadId, 'index.md');
  if (!fs.existsSync(threadPath)) {
    return res.status(404).json({ ok: false, error: 'Thread not found.' });
  }

  const raw = fs.readFileSync(threadPath, 'utf-8');
  const data = matter(raw).data;
  const isOwner = data.authorEmail;

  const session = await getServerSession(req, res, auth) as any;
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, error: 'Sign in required.' });
  }
  if (isOwner !== session.user.email) {
    return res.status(403).json({ ok: false, error: 'Not allowed.' });
  }

  if (req.method === 'DELETE') {
    fs.rmSync(path.join(contentDir, threadId), { recursive: true });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'PUT') {
    const { title, categorySlug, content } = req.body as { title?: string; categorySlug?: string; content?: string };
    const trimmedTitle = (title || '').trim().slice(0, 200);
    const trimmedCategory = (categorySlug || '').trim().slice(0, 100);
    const trimmedContent = (content || '').trim().slice(0, 20_000);
    if (!trimmedTitle || !trimmedCategory || !trimmedContent) {
      return res.status(400).json({ ok: false, error: 'Title, category, and content are required.' });
    }
    const updated = matter.stringify(trimmedContent, {
      ...data,
      title: trimmedTitle,
      categorySlug: trimmedCategory,
    });
    fs.writeFileSync(threadPath, updated, 'utf-8');
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
