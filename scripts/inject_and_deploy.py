#!/usr/bin/env python3
"""
scripts/inject_and_deploy.py
Orchestrator: injects lesson, adds sources, checks coverage, commits + pushes.
Reads lesson data from /tmp/lesson_inject.json (written by the cron content-gen job).
"""
import json, os, subprocess, sys, urllib.error, urllib.parse, urllib.request, psycopg2

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHOOL_URL = 'https://bartender-sanctuary-app.vercel.app/school'

def run(cmd, check=True, capture=True):
    """Run shell command, return (success, output)."""
    print(f"  $ {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=capture, text=True, cwd=PROJECT_DIR)
    if check and result.returncode != 0:
        print(f"  FAILED (exit {result.returncode}): {result.stderr[:300]}")
        return False, result.stdout + result.stderr
    return True, result.stdout.strip()

def main():
    inject_file = '/tmp/lesson_inject.json'
    if not os.path.exists(inject_file):
        print("No /tmp/lesson_inject.json found — nothing to inject. Stopping.")
        sys.exit(0)

    with open(inject_file) as f:
        data = json.load(f)

    required = ['cat_slug', 'tech_slug', 'lesson_slug', 'title', 'description',
                'duration', 'difficulty', 'content']
    missing = [k for k in required if k not in data]
    if missing:
        print(f"ERROR: inject file missing keys: {missing}")
        sys.exit(1)

    cat_slug = data['cat_slug']
    tech_slug = data['tech_slug']
    lesson_slug = data['lesson_slug']
    title = data['title']
    word_count = len(data['content'].split())
    print(f"\n=== Injecting: {title} ({cat_slug} > {tech_slug} > {lesson_slug}) ===")
    print(f"    Word count: {word_count}")
    if word_count < 800:
        print(f"ERROR: Word count {word_count} below 800 minimum. Aborting.")
        sys.exit(1)

    # Step A: inject lesson
    print("\n--- Step A: Inject lesson ---")
    # Write to temp file for inject_lesson.py
    tmp = '/tmp/lesson_inject_run.json'
    with open(tmp, 'w') as f:
        json.dump(data, f, indent=2)
    ok, out = run(f'.venv/bin/python3 scripts/inject_lesson.py {tmp}')
    if not ok or not out.startswith('SUCCESS'):
        print(f"ERROR: injection failed: {out[:200]}")
        sys.exit(1)
    print(f"  {out}")

    # Step B: get lesson_id
    print("\n--- Step B: Get lesson_id ---")
    password = open(PASS_FILE).read().strip()
    conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
    cur = conn.cursor()
    cur.execute("""
        SELECT l.id FROM lessons l
        JOIN techniques t ON l.technique_id = t.id
        JOIN categories c ON t.category_id = c.id
        WHERE c.slug = %s AND t.slug = %s AND l.slug = %s
    """, (cat_slug, tech_slug, lesson_slug))
    row = cur.fetchone()
    if not row:
        print("ERROR: lesson not found after injection")
        cur.close(); conn.close()
        sys.exit(1)
    lesson_id = str(row[0])
    print(f"  lesson_id: {lesson_id}")
    cur.close()
    conn.close()

    # Step C: add sources from the inject file's sources list
    print("\n--- Step C: Add sources ---")
    sources = data.get('sources', [])
    if not sources:
        print("  WARNING: no sources in inject file")
    source_count = 0
    for i, src in enumerate(sources):
        citation = src.get('citation', src.get('url', ''))
        url = src.get('url', '')
        if not url:
            continue
        payload = json.dumps({
            "lesson_id": lesson_id,
            "citation": citation,
            "url": url,
            "sort_order": i + 1
        }).encode('utf-8')
        req = urllib.request.Request(
            f"{SCHOOL_URL}/api/sources",
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read().decode())
                if result.get('success') or result.get('id'):
                    source_count += 1
                    print(f"  Added source {i+1}: {citation}")
                else:
                    print(f"  Failed to add source {i+1}: {result}")
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:200]
            print(f"  Failed to add source {i+1}: HTTP {e.code}: {body}")
        except Exception as e:
            print(f"  Failed to add source {i+1}: {e}")
    print(f"  Sources added: {source_count}/{len(sources)}")

    # Step D: coverage check
    print("\n--- Step D: Coverage check ---")
    ok, out = run('.venv/bin/python3 scripts/check_coverage.py', check=False)
    print(f"  {out}")

    # Parse remaining count
    remaining = "?"
    for line in out.split('\n'):
        if 'Missing or empty:' in line:
            try:
                remaining = line.split(':')[1].strip()
            except Exception:
                pass

    # Step E: git commit + push
    print("\n--- Step E: Git commit + push ---")
    ok, out = run('git add -A')
    if not ok:
        print(f"  git add failed: {out}")
        sys.exit(1)
    ok, out = run(f'git commit -m "school: add lesson {lesson_slug} ({cat_slug}/{tech_slug})"')
    if not ok:
        # Maybe nothing to commit
        if 'nothing to commit' in out.lower():
            print("  Nothing to commit (already staged?)")
        else:
            print(f"  git commit failed: {out}")
            sys.exit(1)
    ok, out = run('git push origin main')
    if not ok:
        print(f"  git push failed: {out}")
        sys.exit(1)
    print(f"  {out}")

    # Final report
    print(f"\n{'='*50}")
    print(f"SUCCESS: {title}")
    print(f"  Slug: {cat_slug} > {tech_slug} > {lesson_slug}")
    print(f"  Words: {word_count}")
    print(f"  Sources: {source_count}")
    print(f"  Remaining: {remaining}/196")
    print(f"  URL: {SCHOOL_URL}")
    print(f"{'='*50}")

    # Clean up temp files
    for f in [tmp]:
        try:
            os.remove(f)
        except Exception:
            pass

if __name__ == '__main__':
    main()
