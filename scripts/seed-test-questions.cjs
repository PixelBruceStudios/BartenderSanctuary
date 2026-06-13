const { Client } = require('pg');
const fs = require('fs');

const password = fs.readFileSync('/home/skicmi/Desktop/NeonDbPass', 'utf8').trim();
const connectionString = `postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/BartenderSanctuary?sslmode=require`;

const client = new Client({ connectionString });

(async () => {
  await client.connect();
  const lessonTestId = '84b0757c-6e4e-4462-a655-bdcda5924099';
  const subTestId = '5969361d-72cc-477b-aa1d-b4ccc2c835b1';

  await client.query(
    `INSERT INTO test_questions (test_id, sort_order, question_text, options, correct_index)
     VALUES
       ($1, 0, 'What is the primary grain in a bourbon mash bill?', '["Corn","Rye","Barley","Wheat"]', 0),
       ($1, 1, 'Which grain contributes spice and pepper notes to whiskey?', '["Corn","Rye","Barley","Wheat"]', 1),
       ($1, 2, 'What is the legal minimum corn percentage for bourbon?', '["49%","51%","70%","80%"]', 1),
       ($1, 3, 'Which grain provides enzymes that convert starch to sugar during mashing?', '["Corn","Rye","Malted Barley","Wheat"]', 2),
       ($1, 4, 'A wheated bourbon uses wheat instead of which grain?', '["Corn","Rye","Barley","Oats"]', 1)`,
    [lessonTestId],
  );

  await client.query(
    `INSERT INTO test_questions (test_id, sort_order, question_text, options, correct_index)
     VALUES
       ($1, 0, 'What is a mash bill?', '["The barrel used for aging","The combination of grains in fermentation","The proof of the spirit","The distillation temperature"]', 1),
       ($1, 1, 'Which compound in rye survives fermentation and distillation?', '["Fructose","Eugenol","Ethanol","Methanol"]', 1),
       ($1, 2, 'What does NAS stand for on whiskey labels?', '["No Age Statement","Natural Aged Spirit","Non-Aged Straight","New American Standard"]', 0)`,
    [subTestId],
  );

  const count = await client.query(
    'SELECT count(*) FROM test_questions WHERE test_id = ANY($1::uuid[])',
    [[lessonTestId, subTestId]],
  );
  console.log('Questions inserted:', count.rows[0].count);
  await client.end();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
