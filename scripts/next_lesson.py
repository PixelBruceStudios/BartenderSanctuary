#!/usr/bin/env python3
"""
scripts/next_lesson.py
Returns the next missing lesson as JSON on stdout.
The agent reads this, writes content, then calls inject_lesson.py.

Usage: python3 scripts/next_lesson.py
Output: JSON with cat_slug, tech_slug, lesson_slug, title, description, duration, difficulty
Exit 0 = found next lesson, Exit 1 = all covered
"""
import json, os, sys, psycopg2

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

with open(PASS_FILE, 'r') as f:
    password = f.read().strip()

with open('/home/skicmi/bartender-sanctuary-app/scripts/curriculum_tree.json', 'r') as f:
    tree = json.load(f)

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
cur = conn.cursor()

# Get all existing lesson slugs with content check
cur.execute("""
SELECT c.slug as cat_slug, t.slug as tech_slug, l.slug, l.content IS NOT NULL as has_content
FROM lessons l
JOIN techniques t ON l.technique_id = t.id
JOIN categories c ON t.category_id = c.id
""")
rows = cur.fetchall()
cur.close()
conn.close()

existing = set()
for cat_slug, tech_slug, lesson_slug, has_content in rows:
    if has_content:
        existing.add(f"{cat_slug}::{tech_slug}::{lesson_slug}")

# Find first missing lesson
for cat in tree['categories']:
    for tech in cat['techniques']:
        for lesson in tech['lessons']:
            key = f"{cat['slug']}::{tech['slug']}::{lesson['slug']}"
            if key not in existing:
                result = {
                    'cat_slug': cat['slug'],
                    'tech_slug': tech['slug'],
                    'lesson_slug': lesson['slug'],
                    'title': lesson['title'],
                    'description': lesson.get('description', ''),
                    'duration': lesson.get('duration', '10 min'),
                    'difficulty': lesson.get('difficulty', 'Beginner')
                }
                print(json.dumps(result, indent=2))
                sys.exit(0)

print(json.dumps({'status': 'all_covered'}))
sys.exit(1)
