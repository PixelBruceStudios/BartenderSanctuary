import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from './auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', '..', 'content', 'forum');

function clientIp(req: NextApiRequest): string {
  const header = req.headers['x-forwarded-for'];
  const first = typeof header === 'string' ? header.split(',')[0].trim() : null;
  return first || req.socket.remoteAddress || 'unknown';
}

function sanitize(str: string, max = 4000): string {
  return str.replace(/[<>]/g, '').slice(0, max);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default withAsyncSafety(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, auth) as any;
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, error: 'Sign in required.' });
  }

  const ip = clientIp(req);
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / 60_000)}`;
  const windowHits = (globalThis as any).__forumWindowHits ||= new Map<string, { count: number; reset: number }>();
  const entry = windowHits.get(key);
  if (entry && entry.reset > now && entry.count >= 10) {
    return res.status(429).json({ ok: false, error: 'Too many posts. Try again shortly.' });
  }
  if (!entry || entry.reset <= now) {
    windowHits.set(key, { count: 1, reset: now + 60_000 });
  } else {
    entry.count += 1;
  }

  const { title, categorySlug, content } = req.body as {
    title?: string;
    categorySlug?: string;
    content?: string;
  };

  const trimmedTitle = sanitize(title || '', 200);
  const trimmedCategory = sanitize(categorySlug || '', 100);
  const trimmedContent = (content || '').trim().slice(0, 20_000);

  if (!trimmedTitle || !trimmedCategory || !trimmedContent) {
    return res.status(400).json({ ok: false, error: 'Title, category, and content are required.' });
  }

  const threadId = `${Date.now()}-${slugify(trimmedTitle)}`;
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
