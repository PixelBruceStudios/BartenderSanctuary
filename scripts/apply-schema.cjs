const fs = require('fs');
const { Client } = require('pg');
const sql = fs.readFileSync('/home/skicmi/bartender-sanctuary-app/lib/db-schema.sql', 'utf8');
const client = new Client({ connectionString: process.env.DATABASE_URL });
(async () => {
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('Schema applied');
})().catch(err => { console.error(err); process.exit(1); });
