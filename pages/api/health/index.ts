import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

type HealthStatus = 'ok' | 'degraded' | 'error';
type HealthResponse = {
  status: HealthStatus;
  checks: Record<string, { status: HealthStatus; detail?: string }>;
  timestamp: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse>) {
  const checks: HealthResponse['checks'] = {};
  let overall: HealthStatus = 'ok';

  // 1. Auth config check
  try {
    const session = await getServerSession(req, res, authOptions);
    checks.auth = { status: 'ok', detail: session ? 'session-ok' : 'no-session' };
  } catch (e: any) {
    checks.auth = { status: 'error', detail: e.message };
    overall = 'degraded';
  }

  // 2. DB connectivity
  try {
    const client = await pool.connect();
    const r = await client.query('SELECT 1');
    client.release();
    checks.db = { status: 'ok', detail: `rows=${r.rowCount}` };
  } catch (e: any) {
    checks.db = { status: 'error', detail: e.message };
    overall = 'error';
  }

  // 3. Lessons count
  try {
    const r = await pool.query('SELECT COUNT(*) FROM lessons');
    checks.lessons = { status: 'ok', detail: `count=${r.rows[0].count}` };
  } catch (e: any) {
    checks.lessons = { status: 'degraded', detail: 'count-failed' };
    if (overall === 'ok') overall = 'degraded';
  }

  // 4. Lessons HR coverage
  try {
    const r = await pool.query('SELECT COUNT(*) FROM lessons_hr');
    checks.lessons_hr = { status: 'ok', detail: `count=${r.rows[0].count}` };
  } catch (e: any) {
    checks.lessons_hr = { status: 'degraded', detail: 'count-failed' };
    if (overall === 'ok') overall = 'degraded';
  }

  // 5. Disk / memory (basic)
  try {
    const usage = process.memoryUsage();
    checks.memory = { status: 'ok', detail: `rss=${Math.round(usage.rss / 1024 / 1024)}MB` };
  } catch (e: any) {
    checks.memory = { status: 'degraded', detail: 'unavailable' };
  }

  const body: HealthResponse = {
    status: overall,
    checks,
    timestamp: new Date().toISOString(),
  };

  const code = overall === 'ok' ? 200 : overall === 'degraded' ? 503 : 500;
  res.status(code).json(body);
}
