import { query } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: q } = req;
  const testId = q.id as string;

  if (!testId) return res.status(400).json({ error: 'test id required' });

  if (method === 'POST') {
    // Record attempt
    const { score, passed, answers, session_id } = req.body;
    const rows = await query<any[]>(
      `INSERT INTO test_attempts (test_id, session_id, score, passed, answers)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [testId, session_id || 'anon', score, passed ?? false, JSON.stringify(answers ?? [])]
    );
    return res.status(201).json(rows[0]);
  }

  if (method === 'GET') {
    // Check latest attempt for this session
    const { session_id } = req.query;
    const rows = await query<any[]>(
      `SELECT * FROM test_attempts WHERE test_id = $1 AND session_id = $2 ORDER BY created_at DESC LIMIT 1`,
      [testId, (session_id as string) || 'anon']
    );
    if (!rows.length) return res.status(200).json({ passed: false, attempt: null });
    const attempt = rows[0] as any;
    return res.status(200).json({ passed: attempt.passed, attempt });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
