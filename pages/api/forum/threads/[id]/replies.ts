import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', '..', '..', 'content', 'forum');

function clientIp(req: NextApiRequest): string {
  const header = req.headers['x-forwarded-for'];
  const first = typeof header === 'string' ? header.split(',')[0].trim() : null;
  return first || req.socket.remoteAddress || 'unknown';
}

function sanitize(str: string, max = 4000): string {
  return str.replace(/[<>]/g, '').slice(0, max);
}

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

  const ip = clientIp(req);
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / 60_000)}`;
  const windowHits = (globalThis as any).__forumReplyWindow ||= new Map<string, { count: number; reset: number }>();
  const entry = windowHits.get(key);
  if (entry && entry.reset > now && entry.count >= 20) {
    return res.status(429).json({ ok: false, error: 'Too many replies. Try again shortly.' });
  }
  if (!entry || entry.reset <= now) {
    windowHits.set(key, { count: 1, reset: now + 60_000 });
  } else {
    entry.count += 1;
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

  const replyId = `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const authorName = (session.user?.name as string) || session.user?.email || 'Anonymous';

  const frontmatter = [
    '---',
    `type: reply`,
    `threadId: ${JSON.stringify(threadId)}`,
    `authorName: ${JSON.stringify(authorName)}`,
    `authorEmail: ${JSON.stringify(session.user?.email)}`,
    `createdAt: ${JSON.stringify(createdAt)}`,
    '---',
    '',
    trimmedContent,
  ].join('\n');

  fs.writeFileSync(path.join(repliesDir, `${replyId}.md`), frontmatter, 'utf-8');

  const indexFile = path.join(threadDir, 'index.md');
  let threadData: Record<string, any> = {};
  if (fs.existsSync(indexFile)) {
    const raw = fs.readFileSync(indexFile, 'utf-8');
    threadData = matter(raw).data;
  }

  const existingReplies = fs.readdirSync(repliesDir).filter((f) => f.endsWith('.md')).length;
  const replyDates = fs
    .readdirSync(repliesDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(repliesDir, f), 'utf-8');
      const data = matter(raw).data;
      return (data.createdAt as string) || '';
    })
    .filter(Boolean);
  const lastReplyAt = replyDates.sort().pop() || createdAt;

  const updatedIndex = [
    '---',
    `title: ${JSON.stringify(threadData.title || threadId)}`,
    `categorySlug: ${JSON.stringify(threadData.categorySlug || '')}`,
    `authorName: ${JSON.stringify(threadData.authorName || authorName)}`,
    `authorEmail: ${JSON.stringify(threadData.authorEmail || session.user?.email)}`,
    `createdAt: ${JSON.stringify(threadData.createdAt || createdAt)}`,
    `replyCount: ${existingReplies}`,
    `lastReplyAt: ${JSON.stringify(lastReplyAt)}`,
    '---',
    '',
    threadData.content || '',
  ].join('\n');

  fs.writeFileSync(indexFile, updatedIndex, 'utf-8');

  return res.status(201).json({ ok: true, replyId, createdAt });
}
