#!/usr/bin/env python3
"""
scripts/check_coverage.py
Shows which lessons exist in the DB vs the curriculum tree.
Exit 0 = all covered, exit 1 = missing lessons remain.
"""
import json, os, psycopg2

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

# Build full lesson map from tree
all_lessons = {}
for cat in tree['categories']:
    for tech in cat['techniques']:
        for lesson in tech['lessons']:
            key = f"{cat['slug']}::{tech['slug']}::{lesson['slug']}"
            all_lessons[key] = {
                'title': lesson['title'],
                'cat': cat['title'],
                'tech': tech['title'],
                'duration': lesson.get('duration', '10 min'),
                'difficulty': lesson.get('difficulty', 'Beginner')
            }

# Get existing lessons from DB
cur.execute("""
SELECT c.slug as cat_slug, t.slug as tech_slug, l.slug, l.title, l.content IS NOT NULL as has_content
FROM lessons l
JOIN techniques t ON l.technique_id = t.id
JOIN categories c ON t.category_id = c.id
""")
rows = cur.fetchall()
cur.close()
conn.close()

existing = {}
for cat_slug, tech_slug, lesson_slug, title, has_content in rows:
    key = f"{cat_slug}::{tech_slug}::{lesson_slug}"
    existing[key] = {'title': title, 'has_content': has_content}

missing = []
for key, meta in sorted(all_lessons.items()):
    if key not in existing:
        missing.append((key, meta))
    elif not existing[key]['has_content']:
        missing.append((key, meta))

print(f"Total curriculum lessons: {len(all_lessons)}")
print(f"In DB: {len(existing)}")
print(f"Missing or empty: {len(missing)}")
print()
if missing:
    print("First 5 missing:")
    for key, meta in missing[:5]:
        print(f"  {meta['cat']} > {meta['tech']} > {meta['title']}")
    print(f"\n...and {len(missing) - 5} more" if len(missing) > 5 else "")

import sys
sys.exit(0 if not missing else 1)
