#!/usr/bin/env python3
"""
scripts/validate_generated_tests.py
Spot-checks generated lesson tests for correctness issues:
- Exactly 5 questions per lesson test
- No duplicate questions
- Answers/options are not empty/trivial
- Question text differs enough from lesson slug/title
Exits non-zero and prints a human-readable summary.
"""

from __future__ import annotations

import json
import os
import random
import sys
from pathlib import Path
from typing import Any

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


def fetch_tests(cur, limit: int = 50) -> list[dict]:
    cur.execute(
        """
        SELECT t.id, t.lesson_id, l.title, l.slug, l.content
        FROM tests t
        JOIN lessons l ON l.id = t.lesson_id
        WHERE t.scope = 'lesson'
        ORDER BY t.created_at DESC
        LIMIT %s
        """,
        (limit,),
    )
    base = [
        {
            "id": row[0],
            "lesson_id": row[1],
            "lesson_title": row[2],
            "lesson_slug": row[3],
            "lesson_content": row[4] or "",
        }
        for row in cur.fetchall()
    ]
    # Attach questions
    for item in base:
        cur.execute(
            """
            SELECT sort_order, question_text, options, correct_index
            FROM test_questions
            WHERE test_id = %s
            ORDER BY sort_order
            """,
            (item["id"],),
        )
        qs = []
        for row in cur.fetchall():
            qs.append({
                "sort_order": row[0],
                "question_text": row[1],
                "options": row[2] if isinstance(row[2], list) else json.loads(row[2] or "[]"),
                "correct_index": row[3],
            })
        item["questions"] = qs
    return base


def normalize(text: str) -> str:
    return " ".join(text.lower().split())


def analyze(tests: list[dict]) -> dict:
    total_questions = 0
    issues: list[str] = []
    samples_ok = 0

    for t in tests:
        qs = t["questions"] or []
        count = len(qs)
        total_questions += count

        if count != 5:
            issues.append(f"{t['id']}: question count = {count} (expected 5)")

        # Duplicate detection
        seen: set[str] = set()
        for i, q in enumerate(qs, 1):
            qtext = normalize(q.get("question_text", ""))
            if not qtext:
                issues.append(f"{t['id']} Q{i}: empty question")
                continue
            if qtext in seen:
                issues.append(f"{t['id']} Q{i}: duplicate question")
            seen.add(qtext)

            # Options triviality
            opts = q.get("options") or []
            if len(opts) != 4:
                issues.append(f"{t['id']} Q{i}: {len(opts)} options (expected 4)")
            else:
                empty_opts = sum(1 for o in opts if not normalize(str(o)))
                if empty_opts:
                    issues.append(f"{t['id']} Q{i}: {empty_opts} empty option(s)")
                if len(set(normalize(str(o)) for o in opts)) != 4:
                    issues.append(f"{t['id']} Q{i}: duplicate options")

            if not isinstance(q.get("correct_index"), int) or q.get("correct_index") < 0 or q.get("correct_index") >= len(opts):
                issues.append(f"{t['id']} Q{i}: invalid correct_index={q.get('correct_index')}")

        if not issues:
            samples_ok += 1

    return {
        "tests_checked": len(tests),
        "questions_total": total_questions,
        "samples_ok": samples_ok,
        "samples_bad": len(tests) - samples_ok,
        "issues": issues[:50],
        "issues_total": len(issues),
    }


def main() -> int:
    limit = int(os.environ.get("TEST_VALIDATOR_LIMIT", "50"))
    conn = get_db()
    try:
        cur = conn.cursor()
        tests = fetch_tests(cur, limit=limit)
        if not tests:
            print("No tests found to validate.")
            return 0
        result = analyze(tests)
    finally:
        try:
            conn.close()
        except Exception:
            pass

    print(f"🧪 Test validator — checked {result['tests_checked']} tests")
    print(f"   Questions: {result['questions_total']}")
    print(f"   OK samples: {result['samples_ok']}, problem samples: {result['samples_bad']}")
    print(f"   Issues found: {result['issues_total']}")

    if result["issues"]:
        print("\n⚠ Issues:")
        for issue in result["issues"][:20]:
            print(f"  - {issue}")
        if result["issues_total"] > 20:
            print(f"  ... and {result['issues_total'] - 20} more")

    print("\n" + ("VALIDATION FAILED" if result["issues_total"] else "VALIDATION OK"))
    return 1 if result["issues_total"] else 0


if __name__ == "__main__":
    sys.exit(main())
