#!/usr/bin/env python3
"""
regenerate_tests.py — rebuild test bank from current lesson content.

Usage:
  python regenerate_tests.py                      # all lesson tests
  python regenerate_tests.py --scope lesson --lesson-id <uuid>
  python regenerate_tests.py --scope combined --technique-id <uuid>
  python regenerate_tests.py --scope sublesson --lesson-id <uuid>

Strategy:
  1. Fetch existing tests matching the scope filter.
  2. Delete their test_questions rows (keep tests row).
  3. Call the configured LLM (via OPENROUTER_API_KEY) to generate fresh
     questions from the current lesson content.
  4. Insert new questions.
  5. Print a summary.

Configuration:
  Set OPENROUTER_API_KEY in .env or export it.
  Default model: google/gemini-2.0-flash-001
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error

import psycopg2

NEON_HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
NEON_DB = "BartenderSanctuary"
NEON_USER = "neondb_owner"


def get_db():
    with open(os.path.expanduser("~/Desktop/NeonDbPass")) as f:
        pwd = f.read().strip()
    return psycopg2.connect(
        host=NEON_HOST, database=NEON_DB, user=NEON_USER, password=pwd, sslmode="require"
    )


def fetch_lesson_content(cur, lesson_id: str) -> str:
    cur.execute("SELECT content FROM lessons WHERE id = %s", (lesson_id,))
    row = cur.fetchone()
    return row[0] if row else ""


def fetch_technique_lessons(cur, technique_id: str) -> list[dict]:
    cur.execute(
        "SELECT id, slug, title, content FROM lessons WHERE technique_id = %s ORDER BY sort_order",
        (technique_id,),
    )
    return [{"id": r[0], "slug": r[1], "title": r[2], "content": r[3]} for r in cur.fetchall()]


def generate_questions_llm(content: str, scope: str, title: str, num_q: int = 5) -> list[dict]:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("[WARN] OPENROUTER_API_KEY not set — returning stub questions", file=sys.stderr)
        return [
            {
                "question_text": f"[Stub] Sample question {i+1} about {title}?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_index": 0,
                "explanation": "Replace with real question after setting OPENROUTER_API_KEY.",
                "sort_order": i,
            }
            for i in range(num_q)
        ]

    prompt = f"""You are a bartending curriculum designer. Generate {num_q} multiple-choice questions for a lesson titled "{title}".

Lesson content:
\"\"\"{content[:4000]}\"\"\"

Rules:
- Questions must be directly answerable from the lesson content.
- Exactly 4 options per question, numbered 0-3.
- One correct answer (correct_index 0-3).
- Include a brief explanation citing the lesson fact.
- Output ONLY valid JSON array (no markdown fences).

JSON schema:
[
  {{
    "question_text": "string",
    "options": ["A", "B", "C", "D"],
    "correct_index": 0,
    "explanation": "string"
  }}
]"""

    payload = json.dumps({
        "model": "google/gemini-2.0-flash-001",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }).encode()

    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())
            text = data["choices"][0]["message"]["content"]
            # Strip markdown fences if present
            text = text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
            return json.loads(text)
    except Exception as e:
        print(f"[ERROR] LLM generation failed: {e}", file=sys.stderr)
        return []


def main():
    parser = argparse.ArgumentParser(description="Regenerate test questions")
    parser.add_argument("--scope", choices=["sublesson", "lesson", "combined"], required=True)
    parser.add_argument("--lesson-id", default=None)
    parser.add_argument("--technique-id", default=None)
    parser.add_argument("--num-questions", type=int, default=5)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.scope in ("sublesson", "lesson") and not args.lesson_id:
        print("--lesson-id required for sublesson/lesson scope", file=sys.stderr)
        sys.exit(1)
    if args.scope == "combined" and not args.technique_id:
        print("--technique-id required for combined scope", file=sys.stderr)
        sys.exit(1)

    conn = get_db()
    cur = conn.cursor()

    # Find existing test(s)
    if args.scope in ("sublesson", "lesson"):
        cur.execute("SELECT id, title FROM tests WHERE scope = %s AND lesson_id = %s", (args.scope, args.lesson_id))
    else:
        cur.execute("SELECT id, title FROM tests WHERE scope = %s AND technique_id = %s", (args.scope, args.technique_id))
    existing = cur.fetchall()

    if not existing:
        # Create new test row
        if args.scope in ("sublesson", "lesson"):
            lesson_content = fetch_lesson_content(cur, args.lesson_id)
            title = f"Test — Lesson {args.lesson_id[:8]}"
        else:
            lessons = fetch_technique_lessons(cur, args.technique_id)
            combined_content = "\n\n".join(f"{l['title']}\n{l['content']}" for l in lessons)
            lesson_content = combined_content
            title = f"Combined test — technique {args.technique_id[:8]}"

        cur.execute(
            "INSERT INTO tests (scope, lesson_id, technique_id, title, description, passing_score, sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (args.scope, args.lesson_id, args.technique_id, title, "Auto-regenerated", 70, 0),
        )
        test_id = cur.fetchone()[0]
        print(f"Created test: {test_id}")
    else:
        test_id = existing[0][0]
        print(f"Using existing test: {test_id} — {existing[0][1]}")

    # Fetch content for generation
    if args.scope in ("sublesson", "lesson"):
        content = fetch_lesson_content(cur, args.lesson_id)
        gen_title = f"Lesson {args.lesson_id[:8]}"
    else:
        lessons = fetch_technique_lessons(cur, args.technique_id)
        content = "\n\n".join(f"{l['title']}\n{l['content']}" for l in lessons)
        gen_title = f"Technique {args.technique_id[:8]}"

    # Generate questions
    questions = generate_questions_llm(content, args.scope, gen_title, args.num_questions)
    print(f"Generated {len(questions)} questions")

    if args.dry_run:
        print(json.dumps(questions, indent=2))
        cur.close()
        conn.close()
        return

    # Delete old questions
    cur.execute("DELETE FROM test_questions WHERE test_id = %s", (test_id,))

    # Insert new
    for i, q in enumerate(questions):
        cur.execute(
            "INSERT INTO test_questions (test_id, question_text, options, correct_index, explanation, sort_order) VALUES (%s,%s,%s,%s,%s,%s)",
            (test_id, q["question_text"], json.dumps(q["options"]), q["correct_index"], q.get("explanation", ""), i),
        )

    conn.commit()
    cur.close()
    conn.close()
    print(f"Injected {len(questions)} questions into test {test_id}")


if __name__ == "__main__":
    main()
