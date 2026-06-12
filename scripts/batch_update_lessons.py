#!/usr/bin/env python3
"""
batch_update_lessons.py
Updates lesson titles and/or content in the database.
Reads from a JSON file with lesson updates.

Each entry needs: id, cat_slug, tech_slug, lesson_slug
Optional: title, description, duration, difficulty, content
Only provided fields are changed; others keep existing values.
"""
import json
import subprocess
import sys
import os
import urllib.request

INJECT_SCRIPT = os.path.join(os.path.dirname(__file__), 'inject_lesson.py')
API_BASE = 'https://bartender-sanctuary-app.vercel.app/api'
PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')

def fetch_current_lesson(cat_slug, tech_slug, lesson_slug):
    """Fetch current lesson data from API."""
    # We need to get it from the full school tree
    url = f'{API_BASE}/school/full'
    with urllib.request.urlopen(url) as r:
        data = json.loads(r.read())
    for cat in data:
        if cat['slug'] != cat_slug:
            continue
        for tech in cat['techniques']:
            if tech['slug'] != tech_slug:
                continue
            for lesson in tech['lessons']:
                if lesson['slug'] == lesson_slug:
                    return {
                        'id': lesson['id'],
                        'cat_slug': cat_slug,
                        'tech_slug': tech_slug,
                        'lesson_slug': lesson_slug,
                        'title': lesson['title'],
                        'description': lesson.get('description', ''),
                        'duration': lesson.get('duration', '10 min'),
                        'difficulty': lesson.get('difficulty', 'Beginner'),
                        'content': lesson.get('content', ''),
                    }
    return None

def inject_lesson(data):
    """Run inject_lesson.py with JSON data via stdin."""
    result = subprocess.run(
        [sys.executable, INJECT_SCRIPT],
        input=json.dumps(data),
        capture_output=True,
        text=True,
        timeout=30
    )
    if result.returncode != 0:
        print(f"  ERROR: {result.stderr.strip()}")
        return False
    print(f"  OK: {result.stdout.strip()}")
    return True

def main():
    updates_file = sys.argv[1] if len(sys.argv) > 1 else '/tmp/lesson_updates.json'
    with open(updates_file, 'r') as f:
        updates = json.load(f)
    
    total = len(updates)
    success = 0
    fail = 0
    
    for i, update in enumerate(updates, 1):
        lesson_id = update.get('id', '???')
        title_preview = (update.get('title') or update.get('content', '???'))[:60]
        print(f"[{i}/{total}] {lesson_id[:8]}: {title_preview}")
        
        # Fetch current data from API to preserve unchanged fields
        current = fetch_current_lesson(
            update['cat_slug'],
            update['tech_slug'],
            update['lesson_slug']
        )
        if not current:
            print(f"  SKIP: lesson not found in API")
            fail += 1
            continue
        
        # Merge: current data + overrides from update
        merged = current.copy()
        for key in ['title', 'description', 'duration', 'difficulty', 'content']:
            if key in update and update[key] is not None:
                merged[key] = update[key]
        
        ok = inject_lesson(merged)
        if ok:
            success += 1
        else:
            fail += 1
    
    print(f"\nDone: {success} succeeded, {fail} failed out of {total}")

if __name__ == '__main__':
    main()
