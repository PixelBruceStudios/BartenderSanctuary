#!/usr/bin/env python3
"""Parse data/school.ts and write Foundations lessons as JSON files for injection."""
import json
import re

with open('/home/skicmi/bartender-sanctuary-app/data/school.ts', 'r') as f:
    src = f.read()

# Find the foundations category by walking the AST manually
idx = src.find("slug: 'foundations'")
if idx == -1:
    print("ERROR: foundations category not found")
    exit(1)

# Walk back to the opening { of the category object
cat_start = src.rfind('{', 0, idx)

# Now find matching }
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

# Find technique positions: \n      {\n        slug:
tech_positions = []
for m in re.finditer(r'\n\s*\{\s*\n\s*slug:', cat_block):
    tech_positions.append(m.start())

print(f"Found {len(tech_positions)} techniques")

for ti, tstart in enumerate(tech_positions):
    tend = tech_positions[ti + 1] if ti + 1 < len(tech_positions) else len(cat_block)
    tech_text = cat_block[tstart:tend]

    # Extract technique slug, title, description
    slug_m = re.search(r"slug:\s*'([^']+)'", tech_text)
    if not slug_m:
        continue
    tech_slug = slug_m.group(1)

    title_m = re.search(r"title:\s*'([^']+)'", tech_text)
    tech_title = title_m.group(1) if title_m else tech_slug

    desc_m = re.search(r"description:\s*'([^']*)'", tech_text)
    tech_desc = desc_m.group(1) if desc_m else ''

    # Find lessons: ['lessons: ['] then walk brackets to find matching ]
    ls = tech_text.find("lessons: [")
    if ls == -1:
        print(f"  {tech_slug}: no lessons block")
        continue
    ls += len("lessons: [")

    # Walk to find matching ] for the lessons array
    depth = 0
    in_str = False
    str_char = ''
    lessons_end = ls
    for i in range(ls, len(tech_text)):
        ch = tech_text[i]
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
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                lessons_end = i + 1
                break

    lessons_text = tech_text[ls:lessons_end]

    # Find each lesson: {id: '...'}
    lesson_positions = []
    for m in re.finditer(r'\{id:\s*\'', lessons_text):
        lesson_positions.append(m.start())

    print(f"\nTechnique: {tech_slug} ({len(lesson_positions)} lessons)")

    for li, lstart in enumerate(lesson_positions):
        lend = lesson_positions[li + 1] if li + 1 < len(lesson_positions) else len(lessons_text)
        lesson = lessons_text[lstart:lend]

        lid_m = re.search(r"id:\s*'([^']+)'", lesson)
        lid = lid_m.group(1) if lid_m else 'unknown'

        title_m = re.search(r"title:\s*'([^']+)'", lesson)
        title = title_m.group(1) if title_m else lid

        desc_m = re.search(r"description:\s*'([^']*)'", lesson)
        desc = desc_m.group(1) if desc_m else ''

        dur_m = re.search(r"duration:\s*'([^']+)'", lesson)
        dur = dur_m.group(1) if dur_m else '10 min'

        diff_m = re.search(r"difficulty:\s*'(Beginner|Intermediate|Advanced)'", lesson)
        diff = diff_m.group(1) if diff_m else 'Beginner'

        # Content in backticks
        content_m = re.search(r"content:\s*`([^`]+)`", lesson, re.DOTALL)
        content = content_m.group(1).strip() if content_m else ''

        print(f"  - {title} ({lid}): {len(content)} chars")

        if content:
            data = {
                'cat_slug': 'foundations',
                'tech_slug': tech_slug,
                'lesson_slug': lid,
                'title': title,
                'description': desc,
                'duration': dur,
                'difficulty': diff,
                'content': content,
            }
            path = f'/tmp/foundations_{lid}.json'
            with open(path, 'w') as f:
                json.dump(data, f)
        else:
            print(f"    WARNING: no content for {lid}")
