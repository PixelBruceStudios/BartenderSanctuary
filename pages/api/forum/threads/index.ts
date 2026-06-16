import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', '..', 'content', 'forum');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, auth) as any;
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, error: 'Sign in required.' });
  }

  const { title, categorySlug, content } = req.body as {
    title?: string;
    categorySlug?: string;
    content?: string;
  };

  const trimmedTitle = (title || '').trim().slice(0, 200);
  const trimmedCategory = (categorySlug || '').trim().slice(0, 100);
  const trimmedContent = (content || '').trim().slice(0, 20_000);

  if (!trimmedTitle || !trimmedCategory || !trimmedContent) {
    return res.status(400).json({ ok: false, error: 'Title, category, and content are required.' });
  }

  const threadId = `${Date.now()}-${trimmedTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
  const createdAt = new Date().toISOString();
  const authorName = (session.user?.name as string) || session.user?.email || 'Anonymous';

  const threadDir = path.join(contentDir, threadId);
  fs.mkdirSync(threadDir, { recursive: true });

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(trimmedTitle)}`,
    `categorySlug: ${JSON.stringify(trimmedCategory)}`,
    `authorName: ${JSON.stringify(authorName)}`,
    `authorEmail: ${JSON.stringify(session.user?.email)}`,
    `createdAt: ${JSON.stringify(createdAt)}`,
    'replyCount: 0',
    '---',
    '',
    trimmedContent,
  ].join('\n');

  fs.writeFileSync(path.join(threadDir, 'index.md'), frontmatter, 'utf-8');

  return res.status(201).json({ ok: true, threadId, createdAt });
}
