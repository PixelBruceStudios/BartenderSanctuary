#!/usr/bin/env python3
"""
scripts/generate_lesson_tests.py

Idempotent batch generator: creates one lesson-scope test per lesson that lacks one.
No external API required. Questions are derived from lesson content with a simple
content-based heuristic so this can run offline / without API keys.

Usage:
  python scripts/generate_lesson_tests.py [--batch 20] [--dry-run]

Env:
  BARTENDER_DB_PASS  optional; defaults to ~/Desktop/NeonDbPass
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

try:
    import psycopg2
except ImportError:
    sys.exit("psycopg2 is required. Install it or run inside the project venv.")

NEON_HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
NEON_DB = "BartenderSanctuary"
NEON_USER = "neondb_owner"
PASS_PATH = Path.home() / "Desktop" / "NeonDbPass"


def get_db():
    pwd = os.environ.get("BARTENDER_DB_PASS") or PASS_PATH.read_text().strip()
    return psycopg2.connect(
        host=NEON_HOST, database=NEON_DB, user=NEON_USER, password=pwd, sslmode="require"
    )


def fetch_untested_lessons(cur, batch_size: int) -> list[dict]:
    cur.execute(
        """
        SELECT l.id, l.slug, l.title, l.content
        FROM lessons l
        LEFT JOIN tests t ON t.lesson_id = l.id AND t.scope = 'lesson'
        WHERE t.id IS NULL
        ORDER BY l.sort_order
        LIMIT %s
        """,
        (batch_size,),
    )
    cols = [d[0] for d in cur.description]
    return [dict(zip(cols, r)) for r in cur.fetchall()]


def derive_questions(lesson: dict, num_q: int = 5) -> list[dict]:
    content = lesson.get("content") or ""
    title = lesson.get("title") or lesson.get("slug") or "this lesson"
    text = re.sub(r"\s+", " ", content).strip()
    candidates: list[str] = []

    # Pull sentences with strong factual claims (contains numbers, %, named entities, comparisons)
    for sent in re.split(r"(?<=[.!?])\s+", text):
        s = sent.strip()
        if len(s) < 40 or len(s) > 260:
            continue
        score = 0
        if re.search(r"\d", s):
            score += 2
        if re.search(r"%", s):
            score += 2
        if re.search(r"\b(percent|minimum|maximum|rule|must|always|never|typically|usually|primary|secondary|base|key|core|critical|essential)\b", s, re.I):
            score += 1
        if re.search(r"\b(corn|rye|wheat|barley|bourbon|whiskey|rum|vodka|gin|tequila|mezcal|vermouth|liqueur|syrup|bitters|egg|cream|soda|tonic|wine|beer|fortified|aromatic|acid|sugar|dilution|fat|wash|ferment|distill|age|barrel|cask|finish|nose|palate|finish|mouthfeel|body|spirit|modifier|garnish|glass|ice|stir|shake|build|layer|float|dash|bitters|syrup|juice)\b", s, re.I):
            score += 1
        candidates.append((score, s))

    candidates.sort(reverse=True)
    seen = set()
    facts: list[str] = []
    for _, s in candidates:
        key = s.lower()
        if key in seen:
            continue
        seen.add(key)
        facts.append(s)
        if len(facts) >= num_q:
            break

    questions: list[dict] = []
    for idx, fact in enumerate(facts[:num_q]):
        qdata = _build_mc(fact, idx)
        questions.append(
            {
                "question_text": qdata["q"],
                "options": qdata["opts"],
                "correct_index": qdata["ans"],
                "explanation": qdata.get("explanation", ""),
                "sort_order": idx,
            }
        )
    return questions


def _extract_entities(text: str):
    words = re.findall(r"[A-Z][a-zA-Z\-]+(?:\s+[A-Z][a-zA-Z\-]+)*", text)
    return [w for w in words if len(w) > 2][:8]


def _build_mc(fact: str, idx: int) -> dict:
    q = f"According to the lesson, which statement is true?"
    opts = []
    ans = 0
    explanation = fact

    if re.search(r"\d", fact):
        m = re.search(r"([A-Za-z][^.!?]{0,80}?)(\d+[\d./]*%?)", fact)
        if m:
            target = m.group(0)
            q = f"Which detail from this lesson is correct?"
            opts = [target]
    if not opts:
        ents = _extract_entities(fact)
        if ents:
            target = f"{ents[0]} is referenced as relevant in this context."
            q = f"Which concept is emphasized in this lesson?"
            opts = [target]

    filler = [
        "None of the above applies here.",
        "The opposite of the lesson claim is correct.",
        "An unrelated technique from a different category.",
        "A common bartending myth contradicted by the lesson.",
    ]
    while len(opts) < 4:
        opts.append(filler[len(opts) - 1] if (len(opts) - 1) < len(filler) else filler[-1])

    # shuffle deterministically but keep correct at 0
    return {
        "q": q,
        "opts": opts,
        "ans": ans,
        "explanation": explanation,
    }


def create_test_and_questions(cur, lesson_id: str, lesson: dict) -> dict:
    title = f"{lesson.get('title') or lesson.get('slug') or 'Lesson'} — Lesson Test"
    cur.execute(
        """
        INSERT INTO tests (scope, lesson_id, technique_id, title, description, passing_score, sort_order)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        ("lesson", lesson_id, None, title, "Auto-generated lesson test", 70, 0),
    )
    test_id = cur.fetchone()[0]

    questions = derive_questions(lesson, num_q=5)
    for q in questions:
        cur.execute(
            """
            INSERT INTO test_questions (test_id, question_text, options, correct_index, explanation, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (test_id, q["question_text"], json.dumps(q["options"]), q["correct_index"], q.get("explanation", ""), q["sort_order"]),
        )
    return {"test_id": test_id, "questions": len(questions)}


def main():
    parser = argparse.ArgumentParser(description="Generate missing lesson tests")
    parser.add_argument("--batch", type=int, default=20)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    conn = get_db()
    cur = conn.cursor()
    lessons = fetch_untested_lessons(cur, args.batch)
    cur.close()

    if not lessons:
        print(json.dumps({"status": "done", "message": "All lessons already have tests."}))
        return

    results = []
    if args.dry_run:
        for lesson in lessons[:5]:
            qs = derive_questions(lesson, num_q=5)
            results.append({"lesson_id": lesson["id"], "title": lesson["title"], "questions": len(qs), "sample": qs[:2]})
        print(json.dumps({"status": "dry_run", "count": len(lessons), "results": results}, indent=2))
        return

    cur = conn.cursor()
    created = 0
    failed = []
    for lesson in lessons:
        try:
            info = create_test_and_questions(cur, lesson["id"], lesson)
            created += 1
            results.append({"lesson_id": lesson["id"], "test_id": info["test_id"], "questions": info["questions"]})
        except Exception as e:
            failed.append({"lesson_id": lesson["id"], "error": str(e)})

    conn.commit()
    cur.close()
    conn.close()

    payload = {
        "status": "ok",
        "batch": args.batch,
        "created": created,
        "failed_count": len(failed),
        "failed": failed,
        "results": results,
    }
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
