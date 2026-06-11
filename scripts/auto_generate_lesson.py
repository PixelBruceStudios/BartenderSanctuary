#!/usr/bin/env python3
"""
scripts/auto_generate_lesson.py
Self-contained lesson generator. Calls StepFun API directly.
Writes /tmp/lesson_inject.json ready for inject_and_deploy.py.
"""
import json, os, re, sys, subprocess, urllib.request, urllib.error

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STEPFUN_KEY = None
for line in open(os.path.expanduser('~/.hermes/.env')):
    if line.startswith('STEPFUN_API_KEY='):
        STEPFUN_KEY = line.strip().split('=', 1)[1]
        break
if not STEPFUN_KEY:
    print("ERROR: STEPFUN_API_KEY not found in ~/.hermes/.env")
    sys.exit(1)
STEPFUN_URL = 'https://api.stepfun.ai/step_plan/v1/chat/completions'
NEXT_LESSON_CMD = f'cd {PROJECT_DIR} && .venv/bin/python3 scripts/next_lesson.py'
CURRICULUM_FILE = os.path.join(PROJECT_DIR, 'scripts', 'curriculum_tree.json')
INJECT_OUT = '/tmp/lesson_inject.json'
WORD_MIN = 800
WORD_MAX = 1500
TELEGRAM_CHAT = '8600907556'


def run(cmd, check=True):
    print(f"  $ {cmd}")
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=PROJECT_DIR)
    if check and r.returncode != 0:
        print(f"  FAILED: {r.stderr[:300]}")
        sys.exit(1)
    return r.stdout.strip()


def send_telegram(text):
    """Send message via Hermes telegram CLI if available, otherwise skip."""
    try:
        # Use hermes send_message via subprocess
        subprocess.run(
            ['send_message', 'target=telegram:8600907556', f'message={text}'],
            capture_output=True, text=True, timeout=15
        )
    except Exception as e:
        print(f"  Telegram send skipped: {e}")


def call_stepfun(user_prompt):
    """Call StepFun API with the given prompt."""
    payload = json.dumps({
        'model': 'step-3.5-flash',
        'messages': [
            {'role': 'system', 'content': (
                'You are a professional bartending curriculum writer. '
                'Write authoritative, factual lesson content. '
                'No exclamation marks. No filler. No lorem ipsum. '
                'Always include a "Sources" section with 2–3 real URLs.'
            )},
            {'role': 'user', 'content': user_prompt}
        ],
        'temperature': 0.7,
        'max_tokens': 4000
    }).encode()

    req = urllib.request.Request(
        STEPFUN_URL,
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {STEPFUN_KEY}'
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode())
        msg = data['choices'][0]['message']
        # StepFun may return text in 'content' or 'reasoning_content'
        text = msg.get('content', '') or msg.get('reasoning_content', '')
        if not text:
            print("  WARNING: API returned empty content. Keys: " + str(list(msg.keys())))
        return text
    except urllib.error.HTTPError as e:
        print(f"  StepFun API error {e.code}: {e.read().decode()[:500]}")
        sys.exit(1)
    except Exception as e:
        print(f"  StepFun API failed: {e}")
        sys.exit(1)


def validate_slug(slug):
    """Check slug exists in curriculum_tree.json."""
    with open(CURRICULUM_FILE) as f:
        tree = json.load(f)
    for cat in tree['categories']:
        for tech in cat['techniques']:
            for les in tech['lessons']:
                if les['slug'] == slug:
                    return True
    return False


def main():
    print("=== Auto-generate lesson ===")

    # Step 1: get next lesson
    print("\n--- Step 1: Get next lesson ---")
    out = run(NEXT_LESSON_CMD)
    try:
        meta = json.loads(out)
    except json.JSONDecodeError:
        print(f"  next_lesson.py output: {out[:200]}")
        send_telegram("❌ School: next_lesson.py returned invalid JSON. Stopping.")
        sys.exit(1)

    if meta.get('lesson_slug') is None:
        print("  All lessons covered!")
        send_telegram("🎓 School: All 196 lessons are covered!")
        sys.exit(0)

    cat_slug = meta['cat_slug']
    tech_slug = meta['tech_slug']
    lesson_slug = meta['lesson_slug']
    title = meta['title']
    description = meta['description']
    duration = meta['duration']
    difficulty = meta['difficulty']

    print(f"  Next: {cat_slug} > {tech_slug} > {lesson_slug} ({title})")

    # Step 2: validate slug
    print("\n--- Step 2: Validate slug ---")
    if not validate_slug(lesson_slug):
        print(f"  Slug '{lesson_slug}' not in curriculum_tree.json — aborting")
        send_telegram(f"❌ School: Slug '{lesson_slug}' not in curriculum_tree.json. Aborting.")
        sys.exit(1)
    print("  Slug valid.")

    # Step 3: generate content via StepFun
    print("\n--- Step 3: Generate content ---")
    prompt = f"""Write a professional bartending lesson on "{title}".

Context: {description}
Category: {cat_slug} | Technique: {tech_slug}

Structure (800–1500 words):
1. Opening hook paragraph (narrative, specific)
2. 4–6 body paragraphs with real domain knowledge (facts, figures, named examples, techniques)
3. "Why This Matters Behind a Bar" (2–3 sentences on practical bar application)
4. "Key Takeaways" (5–6 bullet points, concise)
5. "Sources" section: list exactly 2–3 sources. Format each as: Citation Title — URL
   Example: Scotch Whisky Association — Scotch Whisky Labelling Rules — https://www.scotch-whisky.org.uk/our-work/our-regulations/labelling/
   NO meta-commentary in the Sources section. NO thinking out loud. JUST the source lines.

Tone: BarSmarts / IBA professional education. No exclamation marks. No filler.
IMPORTANT: In the Sources section, write ONLY the source citation lines. Do NOT include any reasoning, commentary, or self-talk.

Output plain text only. No markdown formatting."""

    content = call_stepfun(prompt)
    words = len(content.split())
    print(f"  Generated {words} words.")

    # Word count gate
    if words > WORD_MAX:
        print(f"  Word count {words} exceeds {WORD_MAX} max. Trimming to {WORD_MAX} words.")
        # Take first WORD_MAX words (preserving structure roughly)
        words_list = content.split()
        content = ' '.join(words_list[:WORD_MAX])
        # Re-append a clean Sources section if we cut one off
        if 'Sources' not in content[:WORD_MAX*6]:
            content += '\n\nSources\n--------\nSee original research for source citations.'
        words = WORD_MAX
        print(f"  Trimmed to {words} words.")
    elif words < WORD_MIN:
        print(f"  Word count {words} below {WORD_MIN}. Regenerating with expansion request...")
        prompt += f"\n\nYour previous output was only {words} words. Expand to at least {WORD_MIN} words. Add more detail, examples, and depth."
        content = call_stepfun(prompt)
        words = len(content.split())
        print(f"  Regenerated: {words} words.")

    if words < WORD_MIN:
        print(f"  ERROR: Still only {words} words after regeneration. Aborting.")
        send_telegram(f"❌ School: '{title}' failed word gate ({words}w < {WORD_MIN}w). Aborting.")
        sys.exit(1)

    # Step 4: write inject JSON
    print("\n--- Step 4: Write inject file ---")
    inject_data = {
        'cat_slug': cat_slug,
        'tech_slug': tech_slug,
        'lesson_slug': lesson_slug,
        'title': title,
        'description': description,
        'duration': duration,
        'difficulty': difficulty,
        'content': content,
        'sources': []  # Will be populated from content's Sources section if possible
    }

    # Try to extract sources from content
    sources_match = re.search(r'Sources[:\s]*(.*?)$', content, re.DOTALL | re.IGNORECASE)
    if sources_match:
        sources_text = sources_match.group(1).strip()
        # Look for URLs
        urls = re.findall(r'https?://[^\s\)]+', sources_text)
        for i, url in enumerate(urls[:3]):
            # Get the line containing the URL as citation
            lines = sources_text.split('\n')
            citation = url
            for line in lines:
                if url in line:
                    citation = re.sub(r'https?://[^\s\)]+', '', line).strip().rstrip('-').strip()
                    if not citation:
                        citation = url
                    break
            inject_data['sources'].append({
                'citation': citation,
                'url': url,
                'sort_order': i + 1
            })

    with open(INJECT_OUT, 'w') as f:
        json.dump(inject_data, f, indent=2)
    print(f"  Written to {INJECT_OUT}")
    print(f"  Sources extracted: {len(inject_data['sources'])}")

    # Step 5: notify
    print("\n--- Step 5: Notify ---")
    msg = (
        f"📝 Generated: {title} ({cat_slug} > {tech_slug} > {lesson_slug})\n"
        f"📊 Words: {words} | 📚 Sources: {len(inject_data['sources'])}\n"
        f"⏳ Ready for injection"
    )
    send_telegram(msg)
    print(f"  {msg}")
    print("\n=== Done ===")


if __name__ == '__main__':
    main()
