import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const testId = q.id as string;

  if (!testId) return res.status(400).json({ error: 'test id required' });

  if (method === 'GET') {
    const rows = await query<any[]>('SELECT * FROM tests WHERE id = $1', [testId]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const testRow = rows[0] as any;
    const questions = await query<any[]>('SELECT * FROM test_questions WHERE test_id = $1 ORDER BY sort_order', [testId]);
    return res.status(200).json({ ...testRow, questions });
  }

  if (method === 'POST') {
    // Add question to test
    const { question_text, options, correct_index, explanation, sort_order } = req.body;
    const rows = await query<any[]>(
      `INSERT INTO test_questions (test_id, question_text, options, correct_index, explanation, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [testId, question_text, JSON.stringify(options ?? []), correct_index ?? 0, explanation || '', sort_order ?? 0]
    );
    return res.status(201).json(rows[0]);
  }

  if (method === 'DELETE') {
    await query('DELETE FROM tests WHERE id = $1', [testId]);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
