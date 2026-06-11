const http = require('http');
const fs = require('fs');
const https = require('https');

// Read password
const password = fs.readFileSync('/home/skicmi/Desktop/NeonDbPass', 'utf8').trim();
const connectionString = `postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/BartenderSanctuary?sslmode=require&channel_binding=require`;

const client = new Client({ connectionString });

async function main() {
  try {
    await client.connect();
    console.log('Connected to Neon');
    await client.query(sql);
    console.log('✓ Seed SQL executed successfully');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
