#!/usr/bin/env python3
"""Manage lesson test repair queue with persistent state."""
import json
import os
import sys
from pathlib import Path

STATE_FILE = Path(__file__).parent / ".test-repair-state.json"


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {"processed": [], "failed": {}, "in_progress": None}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2))


def get_db():
    try:
        import psycopg2
    except ImportError:
        sys.exit("psycopg2 required")
    NEON_HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
    NEON_DB = "BartenderSanctuary"
    NEON_USER = "neondb_owner"
    PASS_PATH = Path.home() / "Desktop" / "NeonDbPass"
    pwd = os.environ.get("BARTENDER_DB_PASS") or PASS_PATH.read_text().strip()
    return psycopg2.connect(host=NEON_HOST, database=NEON_DB, user=NEON_USER, password=pwd, sslmode="require")


def get_lessons_without_tests(limit=50) -> list[dict]:
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT l.id, l.slug, l.title, l.content
        FROM lessons l
        LEFT JOIN tests t ON t.lesson_id = l.id AND t.scope = 'lesson'
        WHERE t.id IS NULL
        ORDER BY l.sort_order
        LIMIT %s
    """, (limit,))
    cols = [d[0] for d in cur.description]
    results = [dict(zip(cols, r)) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return results


def get_bad_tests(limit=50) -> list[dict]:
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT t.id, t.lesson_id, l.title, l.slug,
               COUNT(tq.id) as question_count
        FROM tests t
        JOIN lessons l ON l.id = t.lesson_id
        LEFT JOIN test_questions tq ON tq.test_id = t.id
        WHERE t.scope = 'lesson'
        GROUP BY t.id, t.lesson_id, l.title, l.slug
        HAVING COUNT(tq.id) != 5
        ORDER BY t.created_at DESC
        LIMIT %s
    """, (limit,))
    cols = [d[0] for d in cur.description]
    results = [dict(zip(cols, r)) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return results


def get_all_tests(limit=100) -> list[dict]:
    """Get ALL lesson-scope tests, regardless of question count."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT t.id, t.lesson_id, l.title, l.slug, l.content,
               COUNT(tq.id) as question_count
        FROM tests t
        JOIN lessons l ON l.id = t.lesson_id
        LEFT JOIN test_questions tq ON tq.test_id = t.id
        WHERE t.scope = 'lesson'
        GROUP BY t.id, t.lesson_id, l.title, l.slug, l.content
        ORDER BY t.created_at DESC
        LIMIT %s
    """, (limit,))
    cols = [d[0] for d in cur.description]
    results = [dict(zip(cols, r)) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return results


def mark_processed(lesson_id: str, success: bool, error: str = ""):
    state = load_state()
    if lesson_id not in state["processed"]:
        state["processed"].append(lesson_id)
    if not success:
        state["failed"][lesson_id] = error
    elif lesson_id in state["failed"]:
        del state["failed"][lesson_id]
    state["in_progress"] = None
    save_state(state)


def mark_in_progress(lesson_id: str):
    state = load_state()
    state["in_progress"] = lesson_id
    save_state(state)


def get_next_target() -> dict | None:
    state = load_state()
    if state["in_progress"]:
        return {"type": "busy", "lesson_id": state["in_progress"], "message": "Another run is in progress."}

    # 1. Missing tests first
    missing = get_lessons_without_tests(limit=20)
    for lesson in missing:
        if lesson["id"] not in state["processed"]:
            mark_in_progress(lesson["id"])
            return {"type": "missing", "lesson": lesson}

    # 2. Bad tests (wrong question count)
    bad = get_bad_tests(limit=20)
    for test in bad:
        if test["lesson_id"] not in state["processed"]:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("SELECT id, slug, title, content FROM lessons WHERE id = %s", (test["lesson_id"],))
            row = cur.fetchone()
            cur.close()
            conn.close()
            if row:
                cols = [d[0] for d in cur.description]
                lesson = dict(zip(cols, row))
                mark_in_progress(lesson["id"])
                return {
                    "type": "repair",
                    "lesson": lesson,
                    "test_id": test["id"],
                    "issue": f"question_count={test['question_count']}",
                }

    # 3. ALL remaining tests (regenerate everything with new method)
    all_tests = get_all_tests(limit=100)
    for test in all_tests:
        if test["lesson_id"] not in state["processed"]:
            mark_in_progress(test["lesson_id"])
            return {
                "type": "regenerate",
                "lesson": {
                    "id": test["lesson_id"],
                    "slug": test["slug"],
                    "title": test["title"],
                    "content": test["content"],
                },
                "test_id": test["id"],
                "issue": f"regenerate_all (current questions: {test['question_count']})",
            }

    return {"type": "done", "message": "All lesson tests processed."}


def status() -> dict:
    state = load_state()
    missing = get_lessons_without_tests(limit=100)
    bad = get_bad_tests(limit=100)
    all_tests = get_all_tests(limit=100)
    return {
        "processed": len(state["processed"]),
        "failed": len(state["failed"]),
        "missing_tests": len(missing),
        "bad_tests": len(bad),
        "total_tests": len(all_tests),
        "in_progress": state["in_progress"],
    }


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "status":
        print(json.dumps(status(), indent=2))
    elif len(sys.argv) > 1 and sys.argv[1] == "next":
        print(json.dumps(get_next_target(), indent=2))
    else:
        print(json.dumps({"error": "Usage: test_repair_queue.py [status|next]"}, indent=2))
