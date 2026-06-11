import psycopg2, os

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
with open(PASS_FILE, 'r') as f:
    password = f.read().strip()

conn = psycopg2.connect(
    host='ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech',
    database='BartenderSanctuary',
    user='neondb_owner',
    password=password,
    sslmode='require'
)
cur = conn.cursor()
cur.execute('SELECT slug, title, icon FROM categories ORDER BY sort_order, title')
rows = cur.fetchall()
for r in rows:
    print(f'{r[0]:30s} | {r[1]:30s} | {r[2]}')
cur.close()
conn.close()
