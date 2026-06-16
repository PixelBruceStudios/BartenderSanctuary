import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', '..', '..', 'content');

const ADMIN_EMAIL = 'pixelbruce.3d@gmail.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, auth) as any;
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  const { kind, slug } = req.query as { kind?: string; slug?: string };
  if (req.method === 'GET') {
    if (!kind || !slug) return res.status(400).json({ ok: false, error: 'Missing kind or slug.' });
    const filePath = path.join(contentDir, kind as string, slug as string, 'index.md');
    if (!fs.existsSync(filePath)) return res.status(404).json({ ok: false, error: 'Not found.' });
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    return res.status(200).json({ ok: true, data: { title: parsed.data.title || '', body: parsed.content } });
  }

  if (req.method === 'PUT') {
    if (!kind || !slug) return res.status(400).json({ ok: false, error: 'Missing kind or slug.' });
    const { title, body } = req.body as { title?: string; body?: string };
    const trimmedTitle = (title || '').trim().slice(0, 200);
    const trimmedBody = (body || '').trim().slice(0, 40_000);
    if (!trimmedTitle || !trimmedBody) return res.status(400).json({ ok: false, error: 'Title and body are required.' });
    const filePath = path.join(contentDir, kind as string, slug as string, 'index.md');
    if (!fs.existsSync(filePath)) return res.status(404).json({ ok: false, error: 'Not found.' });
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    const updated = matter.stringify(trimmedBody, { ...parsed.data, title: trimmedTitle });
    fs.writeFileSync(filePath, updated, 'utf-8');
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
