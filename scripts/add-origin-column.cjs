const { Client } = require('pg');
(async () => {
  const url = 'postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/BartenderSanctuary?sslmode=require&channel_binding=require';
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query('ALTER TABLE cocktails ADD COLUMN IF NOT EXISTS origin TEXT NOT NULL DEFAULT \'\';');
  await client.query('UPDATE cocktails SET origin = \'\' WHERE origin IS NULL;');
  await client.end();
  console.log('done');
})();
