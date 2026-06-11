#!/usr/bin/env python3
"""
scripts/inject_lesson.py
Injects a single lesson into the DB. Reads lesson data from a temp JSON file
passed as the first argument, or from stdin if no arg given.

Expected JSON keys: cat_slug, tech_slug, lesson_slug, title, description,
                     content, duration, difficulty
"""
import json, os, sys, psycopg2

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

if len(sys.argv) > 1:
    with open(sys.argv[1], 'r') as f:
        data = json.load(f)
else:
    data = json.loads(sys.stdin.read())

with open(PASS_FILE, 'r') as f:
    password = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
cur = conn.cursor()

# Find category and technique
cur.execute("SELECT id FROM categories WHERE slug = %s", (data['cat_slug'],))
cat_row = cur.fetchone()
if not cat_row:
    print(f"ERROR: category '{data['cat_slug']}' not found")
    sys.exit(1)
cat_id = cat_row[0]

cur.execute("SELECT id FROM techniques WHERE category_id = %s AND slug = %s", (cat_id, data['tech_slug']))
tech_row = cur.fetchone()
if not tech_row:
    print(f"ERROR: technique '{data['tech_slug']}' not found in category '{data['cat_slug']}'")
    sys.exit(1)
tech_id = tech_row[0]

# Upsert lesson
cur.execute("""
INSERT INTO lessons (technique_id, slug, title, description, duration, difficulty, content, sort_order)
VALUES (%s, %s, %s, %s, %s, %s, %s, 1)
ON CONFLICT (technique_id, slug)
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    duration = EXCLUDED.duration,
    difficulty = EXCLUDED.difficulty,
    content = EXCLUDED.content
""", (
    tech_id,
    data['lesson_slug'],
    data['title'],
    data.get('description', ''),
    data.get('duration', '10 min'),
    data.get('difficulty', 'Beginner'),
    data['content']
))

conn.commit()
cur.close()
conn.close()
print(f"SUCCESS: injected lesson '{data['title']}' ({data['cat_slug']} > {data['tech_slug']} > {data['lesson_slug']})")
