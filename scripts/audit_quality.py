#!/usr/bin/env python3
"""
scripts/audit_quality.py

Audit existing BS school lessons for quality issues:
  - AI artifact phrases (scaffolding, internal monologue)
  - Excessive exclamation marks (>3 per lesson)
  - Word count (< 800 = too short)
  - Missing sources (< 2)
  - HTML tags in content

Outputs JSON to stdout: summary + next_targets (worst 20).
Writes full report to /tmp/lesson_quality_report.json

Usage: .venv/bin/python3 scripts/audit_quality.py
"""
import json, os, re, sys
import psycopg2

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

with open(PASS_FILE) as f:
    password = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
cur = conn.cursor()

cur.execute("""
    SELECT c.slug as cat_slug, c.title as cat_title, c.sort_order as cat_sort,
           t.slug as tech_slug, t.title as tech_title, t.sort_order as tech_sort,
           l.id as lesson_id, l.slug as lesson_slug, l.title as lesson_title,
           l.content, l.duration, l.difficulty, l.sort_order as lesson_sort,
           COUNT(s.id) as source_count
    FROM lessons l
    JOIN techniques t ON l.technique_id = t.id
    JOIN categories c ON t.category_id = c.id
    LEFT JOIN sources s ON s.lesson_id = l.id
    WHERE l.content IS NOT NULL
    GROUP BY c.slug, c.title, c.sort_order,
             t.slug, t.title, t.sort_order,
             l.id, l.slug, l.title, l.content, l.duration, l.difficulty, l.sort_order
    ORDER BY c.sort_order, c.slug, t.sort_order, t.slug, l.sort_order, l.slug
""")
rows = cur.fetchall()
cur.close()
conn.close()

# AI artifact patterns — use word boundaries and context to avoid false positives
AI_PATTERNS = [
    # Sentence-starting scaffolding (must be at start of string or after sentence boundary)
    (re.compile(r'(?:^|\.\s)Got it, let', re.IGNORECASE), 'got_it_let'),
    (re.compile(r'(?:^|\.\s)Sure,', re.IGNORECASE), 'sure_comma'),
    (re.compile(r'(?:^|\.\s)As an AI', re.IGNORECASE), 'as_an_ai'),
    (re.compile(r'(?:^|\.\s)I cannot', re.IGNORECASE), 'i_cannot'),
    (re.compile(r'Key Takeaways:\s*Let', re.IGNORECASE), 'key_takeaways_let'),
    (re.compile(r'see original research for source citations', re.IGNORECASE), 'fake_sources'),
    (re.compile(r'(?:^|\.\s)Next,\s*body paragraphs', re.IGNORECASE), 'next_body_paragraphs'),
    (re.compile(r'opening hook needs', re.IGNORECASE), 'opening_hook_needs'),
    (re.compile(r'(?:^|\.\s)Wait,?\s*let', re.IGNORECASE), 'wait_let'),
    (re.compile(r'(?:^|\.\s)Perfect,?\s*now', re.IGNORECASE), 'perfect_now'),
    (re.compile(r'let\'s make sure', re.IGNORECASE), 'lets_make_sure'),
    (re.compile(r'let\'s outline', re.IGNORECASE), 'lets_outline'),
    (re.compile(r'let\'s structure', re.IGNORECASE), 'lets_structure'),
    (re.compile(r'now sources:', re.IGNORECASE), 'now_sources'),
    (re.compile(r'body paragraphs\.\s*let', re.IGNORECASE), 'body_paragraphs_let'),
    (re.compile(r'that\'s perfect\.\s*now', re.IGNORECASE), 'thats_perfect_now'),
]

issues = []
clean = []
by_flag = {}

for row in rows:
    (cat_slug, cat_title, _cat_sort,
     tech_slug, tech_title, _tech_sort,
     lesson_id, lesson_slug, lesson_title,
     content, duration, difficulty, _lesson_sort,
     source_count) = row

    word_count = len(content.split())
    exclaim_count = content.count('!')
    ai_hits = [name for pat, name in AI_PATTERNS if pat.search(content)]
    has_html = bool(re.search(r'<[^>]+>', content))

    flags = []
    if word_count < 800:
        flags.append(f'short:{word_count}w')
    if exclaim_count > 3:
        flags.append(f'excessive_exclaims:{exclaim_count}')
    if ai_hits:
        flags.append(f'ai_artifacts:{len(ai_hits)}')
    if has_html:
        flags.append('html_tags')
    if source_count < 2:
        flags.append(f'few_sources:{source_count}')

    entry = {
        'cat_slug': cat_slug,
        'tech_slug': tech_slug,
        'lesson_slug': lesson_slug,
        'lesson_title': lesson_title,
        'lesson_id': str(lesson_id),
        'word_count': word_count,
        'exclaim_count': exclaim_count,
        'source_count': source_count,
        'ai_hits': ai_hits,
        'flags': flags,
        'priority': len(flags),
    }

    if flags:
        issues.append(entry)
        for flag in flags:
            ft = flag.split(':')[0]
            by_flag[ft] = by_flag.get(ft, 0) + 1
    else:
        clean.append(entry)

issues.sort(key=lambda x: (-x['priority'], x['word_count']))

report = {
    'total': len(rows),
    'clean': len(clean),
    'issues': len(issues),
    'by_flag': by_flag,
    'lessons': issues,
}

with open('/tmp/lesson_quality_report.json', 'w') as f:
    json.dump(report, f, indent=2)

print(json.dumps({
    'summary': {
        'total': report['total'],
        'clean': report['clean'],
        'issues': report['issues'],
        'by_flag': report['by_flag'],
    },
    'next_targets': issues[:20]
}, indent=2))
