#!/usr/bin/env python3
"""
scripts/regenerate_auto_tests.py

Regenerate questions for all existing auto-generated lesson tests using the
current derive_questions logic. This fixes duplicates caused by the old
generic question text (e.g. "Which detail from this lesson is correct?").

Usage:
  python scripts/regenerate_auto_tests.py [--dry-run] [--limit N]
"""
import argparse
import json
import os
import sys
from pathlib import Path

try:
    import psycopg2
except ImportError:
    sys.exit("psycopg2 is required. Install it or run inside the project venv.")

try:
    from generate_lesson_tests import derive_questions
except ImportError:
    sys.exit("Could not import derive_questions from scripts/generate_lesson_tests.py")

NEON_HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
NEON_DB = "BartenderSanctuary"
NEON_USER = "neondb_owner"
PASS_PATH = Path.home() / "Desktop" / "NeonDbPass"


def get_db():
    pwd = os.environ.get("BARTENDER_DB_PASS") or PASS_PATH.read_text().strip()
    return psycopg2.connect(
        host=NEON_HOST, database=NEON_DB, user=NEON_USER, password=pwd, sslmode="require"
    )


def main():
    parser = argparse.ArgumentParser(description="Regenerate questions for auto-generated tests")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=None)
    args = parser.parse_args()

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT t.id, t.lesson_id, l.title, l.content
        FROM tests t
        JOIN lessons l ON l.id = t.lesson_id
        WHERE t.scope = 'lesson' AND t.description = 'Auto-generated lesson test'
        ORDER BY t.created_at DESC
        LIMIT %s
        """,
        (args.limit,) if args.limit else (None,),
    )
    tests = [
        {"test_id": r[0], "lesson_id": r[1], "title": r[2], "content": r[3] or ""}
        for r in cur.fetchall()
    ]

    if not tests:
        print("No auto-generated tests found.")
        return

    print(f"Found {len(tests)} auto-generated tests to regenerate.")

    if args.dry_run:
        for t in tests[:3]:
            qs = derive_questions(t, num_q=5)
            print(f"\n{t['test_id'][:8]} — {t['title']}")
            for q in qs:
                print(f"  Q: {q['question_text'][:100]}")
        return

    total_replaced = 0
    for t in tests:
        # Delete old questions
        cur.execute("DELETE FROM test_questions WHERE test_id = %s", (t["test_id"],))
        deleted = cur.rowcount

        # Generate fresh questions
        questions = derive_questions(t, num_q=5)
        for q in questions:
            cur.execute(
                """
                INSERT INTO test_questions (test_id, question_text, options, correct_index, explanation, sort_order)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    t["test_id"],
                    q["question_text"],
                    json.dumps(q["options"]),
                    q["correct_index"],
                    q.get("explanation", ""),
                    q["sort_order"],
                ),
            )
        total_replaced += deleted
        print(f"  {t['test_id'][:8]} — replaced {deleted} questions with {len(questions)} new ones")

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nDone. Replaced questions in {len(tests)} tests ({total_replaced} old questions removed).")


if __name__ == "__main__":
    main()
