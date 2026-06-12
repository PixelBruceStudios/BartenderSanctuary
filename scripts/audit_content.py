#!/usr/bin/env python3
"""
Audit all lessons in the DB for content length.
Outputs a summary of which lessons need expansion.
"""
import psycopg2
import os

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

with open(PASS_FILE) as f:
    password = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
cur = conn.cursor()

cur.execute("""
    SELECT c.slug as cat_slug, c.title as cat_title, t.slug as tech_slug, t.title as tech_title,
           l.slug as lesson_slug, l.title as lesson_title, l.content, length(l.content) as clen
    FROM lessons l
    JOIN techniques t ON l.technique_id = t.id
    JOIN categories c ON t.category_id = c.id
    ORDER BY c.sort_order, c.title, t.sort_order, t.title, l.sort_order, l.title
""")

rows = cur.fetchall()

cur.close()
conn.close()

print(f"Total lessons: {len(rows)}\n")

# Group by category
cats = {}
for row in rows:
    cat_slug = row[0]
    if cat_slug not in cats:
        cats[cat_slug] = []
    cats[cat_slug].append(row)

short_threshold = 500  # Less than this is "short"
very_short_threshold = 200

total_short = 0
total_very_short = 0
total_good = 0

for cat_slug, lessons in cats.items():
    cat_title = lessons[0][1]
    short_count = 0
    very_short_count = 0
    
    print(f"\n{'='*60}")
    print(f"Category: {cat_title} ({cat_slug}) — {len(lessons)} lessons")
    print(f"{'='*60}")
    
    for row in lessons:
        _, _, tech_slug, tech_title, lesson_slug, lesson_title, content, clen = row
        status = "OK"
        if clen < very_short_threshold:
            status = "VERY SHORT"
            very_short_count += 1
        elif clen < short_threshold:
            status = "SHORT"
            short_count += 1
        
        if status != "OK":
            print(f"  [{status}] {lesson_title} ({lesson_slug}) — {clen} chars")
            print(f"    Technique: {tech_title}")
    
    total_short += short_count
    total_very_short += very_short_count
    total_good += len(lessons) - short_count - very_short_count
    
    print(f"\n  Summary: {len(lessons) - short_count - very_short_count} good, {short_count} short, {very_short_count} very short")

print(f"\n{'='*60}")
print(f"OVERALL SUMMARY")
print(f"{'='*60}")
print(f"Total lessons: {len(rows)}")
print(f"Good (>{short_threshold} chars): {total_good}")
print(f"Short ({very_short_threshold}-{short_threshold} chars): {total_short}")
print(f"Very short (<{very_short_threshold} chars): {total_very_short}")
print(f"\nNeed expansion: {total_short + total_very_short} lessons")
