#!/usr/bin/env python3
"""
Batch lesson injector with source fixer.
Runs auto_generate_lesson.py -> fixes sources -> inject_and_deploy.py in a loop.
Stops after target_count lessons or when curriculum is fully covered.
"""
import json, os, re, subprocess, sys

PROJECT_DIR = '/home/skicmi/bartender-sanctuary-app'
INJECT_FILE = '/tmp/lesson_inject.json'
TARGET_COUNT = 7  # add enough to reach ~50 total (already at 43)
os.chdir(PROJECT_DIR)

def run(cmd, check=True):
    print(f"\n$ {cmd}")
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=PROJECT_DIR)
    if check and r.returncode != 0:
        print(f"  FAILED: {r.stderr[:300]}")
        sys.exit(1)
    return r.stdout.strip()

def fix_sources():
    """Fix malformed source citations from LLM output."""
    try:
        d = json.load(open(INJECT_FILE))
    except Exception as e:
        print(f"  WARNING: Could not read {INJECT_FILE}: {e}")
        return False

    sources = d.get('sources', [])
    if not sources:
        print("  No sources to fix")
        return False

    fixed = []
    for i, src in enumerate(sources):
        url = src.get('url', '')
        citation = src.get('citation', '')
        # If citation looks like LLM internal monologue, replace with clean citation
        if len(citation) > 120 or 'section,' in citation.lower() or 'let\'s' in citation.lower() or 'wait' in citation.lower():
            # Derive a clean citation from URL
            if 'eur-lex.europa.eu' in url:
                citation = 'EU Regulation 2019/787 - Spirit Drink Definitions'
            elif 'ttb.gov' in url:
                citation = 'TTB - Standards of Identity for Spirits'
            elif 'distilleryuniversity.com' in url:
                citation = 'Distillery University - Production Guide'
            elif 'spirits.eu' in url:
                citation = 'Spirits EU - Production Standards'
            elif 'whiskeyadvocate.com' in url:
                citation = 'Whiskey Advocate - Industry Guide'
            elif 'distilledspirits.org' in url:
                citation = 'Distilled Spirits Council - Industry Report'
            elif 'scotch-whisky.org.uk' in url:
                citation = 'Scotch Whisky Association - Regulatory Guide'
            elif 'usda.gov' in url:
                citation = 'USDA - Agricultural Guidelines'
            elif 'fao.org' in url:
                citation = 'FAO - Agricultural Document'
            else:
                citation = url.replace('https://', '').split('/')[0].title() + ' - Reference'
            print(f"  Fixed source {i+1}: {citation[:60]}...")
        fixed.append({
            'citation': citation,
            'url': url,
            'sort_order': i + 1
        })

    if fixed:
        d['sources'] = fixed
        with open(INJECT_FILE, 'w') as f:
            json.dump(d, f, indent=2)
        return True
    return False

def main():
    added = 0
    while added < TARGET_COUNT:
        print(f"\n{'='*60}")
        print(f"BATCH LOOP: Lesson {added+1} of {TARGET_COUNT}")
        print(f"{'='*60}")

        # Step 1: Generate
        print("\n--- Generate ---")
        run('.venv/bin/python3 scripts/auto_generate_lesson.py')

        # Step 2: Fix sources
        print("\n--- Fix sources ---")
        fix_sources()

        # Step 3: Inject and deploy
        print("\n--- Inject and deploy ---")
        out = run('.venv/bin/python3 scripts/inject_and_deploy.py')

        if 'SUCCESS' in out:
            added += 1
            # Extract remaining count
            for line in out.split('\n'):
                if 'Remaining:' in line:
                    print(f"\n>>> {line.strip()}")
        else:
            print("Inject/deploy failed, stopping")
            sys.exit(1)

    print(f"\n{'='*60}")
    print(f"BATCH COMPLETE: Added {added} lessons")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
