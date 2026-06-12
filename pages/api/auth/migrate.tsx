import { pool } from "../../../lib/db";

export default async function handler(_: any, res: { status: (code: number) => { json: (arg0: { ok: boolean; error?: string }) => void } }) {
  try {
    const sql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        password_hash TEXT NOT NULL DEFAULT '',
        email_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS verification_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        identifier TEXT NOT NULL,
        token TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);

      DROP TRIGGER IF EXISTS users_updated ON users;
      CREATE TRIGGER users_updated BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    `;
    await pool.query(sql);
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("[migrate-auth]", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
