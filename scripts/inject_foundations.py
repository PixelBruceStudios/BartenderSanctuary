#!/usr/bin/env python3
"""
Inject all Foundations lessons into the DB.
Reads from data/school.ts and calls inject_lesson.py for each lesson.
"""
import json
import re
import subprocess
import sys

with open('/home/skicmi/bartender-sanctuary-app/data/school.ts', 'r') as f:
    src = f.read()

# Find the foundations category block (from its opening { to its closing }])
idx = src.find("slug: 'foundations'")
if idx == -1:
    print("ERROR: foundations category not found")
    sys.exit(1)

# Walk back to the opening { of the category object
cat_start = src.rfind('{', 0, idx)
# Now find the matching closing } for the category
depth = 0
in_str = False
str_char = ''
cat_end = cat_start
for i in range(cat_start, len(src)):
    ch = src[i]
    if in_str:
        if ch == '\\':
            i += 1
            continue
        if ch == str_char:
            in_str = False
        continue
    if ch in ('"', "'", '`'):
        in_str = True
        str_char = ch
        continue
    if ch == '{':
        depth += 1
    elif ch == '}':
        depth -= 1
        if depth == 0:
            cat_end = i + 1
            break

cat_block = src[cat_start:cat_end]

# Extract techniques from the category
tech_pattern = re.compile(
    r"\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']*)',\s*description:\s*'([^']*)',\s*lessons:\s*\[(.*?)\]\s*\}",
    re.DOTALL
)

INJECT = '/home/skicmi/bartender-sanctuary-app/scripts/inject_lesson.py'
success = 0
fail = 0

for tech_slug, tech_title, tech_desc, lessons_block in tech_pattern.findall(cat_block):
    # Extract each lesson from the lessons block
    lesson_pattern = re.compile(
        r"\{\s*id:\s*'([^']+)',\s*title:\s*'([^']*)',\s*description:\s*'([^']*)',\s*duration:\s*'([^']*)',\s*difficulty:\s*'(Beginner|Intermediate|Advanced)',\s*content:\s*`([^`]*)`",
        re.DOTALL
    )
    lessons = lesson_pattern.findall(lessons_block)
    
    for lesson_id, title, description, duration, difficulty, content in lessons:
        data = {
            'cat_slug': 'foundations',
            'tech_slug': tech_slug,
            'lesson_slug': lesson_id,
            'title': title,
            'description': description,
            'duration': duration,
            'difficulty': difficulty,
            'content': content.strip(),
        }
        result = subprocess.run(
            [sys.executable, INJECT],
            input=json.dumps(data),
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            print(f"OK: {title}")
            success += 1
        else:
            print(f"FAIL: {title} — {result.stderr.strip()}")
            fail += 1

print(f"\nDone: {success} succeeded, {fail} failed")
