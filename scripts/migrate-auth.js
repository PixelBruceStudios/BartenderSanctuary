const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read DB password from known location
const passPath = path.join(process.env.HOME || '', 'Desktop', 'NeonDbPass');
const dbPass = fs.readFileSync(passPath, 'utf8').trim();

// Read actual DATABASE_URL from .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
let connectionString = 'postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const m = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (m) connectionString = m[1];
}
if (connectionString.includes('***')) {
  connectionString = connectionString.replace('***', dbPass);
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    // Check existing tables
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    const tables = result.rows.map(r => r.table_name);

    // Check if auth tables exist
    const hasUsers = tables.includes('users');
    const hasVerificationTokens = tables.includes('verification_tokens');

    if (hasUsers && hasVerificationTokens) {

      return;
    }

    // Run only auth-related DDL
    const authDDL = `
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

    await client.query(authDDL);

  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
