import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { auth } from '../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'forum');

function bad(res: NextApiResponse, status: number, error: string) {
  return res.status(status).json({ ok: false, error });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return bad(res, 405, 'Method Not Allowed');

  const session = await getServerSession(req, res, auth) as any;
  if (!session?.user?.email) return bad(res, 401, 'Sign in required.');

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return bad(res, 400, 'Expected multipart/form-data.');
  }

  const { formidable } = await import('formidable');
  const form = formidable({ keepExtensions: true, maxFileSize: 2 * 1024 * 1024, allowEmptyFiles: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return bad(res, 400, 'Invalid upload.');
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return bad(res, 400, 'File is required.');

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${path.extname(file.originalFilename || '')}`;
    const dest = path.join(uploadDir, safeName);

    fs.mkdirSync(uploadDir, { recursive: true });
    fs.renameSync(file.filepath, dest);

    const url = `/uploads/forum/${safeName}`;
    return res.status(200).json({ ok: true, url });
  });
}
