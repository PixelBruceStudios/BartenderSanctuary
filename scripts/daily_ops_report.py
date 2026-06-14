#!/usr/bin/env python3
"""
scripts/daily_ops_report.py
Aggregates operational metrics for Bartender Sanctuary and prints a Telegram-ready
summary. Designed to run from cron; emits nothing on healthy state if desired.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

REPO = Path("/home/skicmi/bartender-sanctuary-app")


def run(cmd: str, *, timeout: int = 60, check: bool = False) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        text=True,
        timeout=timeout,
        check=check,
        cwd=REPO,
    )


def get_db():
    try:
        import psycopg2
    except ImportError:
        return None
    pwd = os.environ.get("BARTENDER_DB_PASS")
    if not pwd:
        p = Path.home() / "Desktop" / "NeonDbPass"
        if p.exists():
            pwd = p.read_text().strip()
    if not pwd:
        return None
    try:
        return psycopg2.connect(
            host="ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech",
            database="BartenderSanctuary",
            user="neondb_owner",
            password=pwd,
            sslmode="require",
        )
    except Exception:
        return None


def db_metrics(conn) -> dict:
    metrics: dict = {}
    try:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM lessons")
        row = cur.fetchone()
        metrics["lessons_total"] = row[0] if row else 0
        cur.execute("SELECT COUNT(*) FROM lessons WHERE content IS NOT NULL AND length(content) > 50")
        row = cur.fetchone()
        metrics["lessons_filled"] = row[0] if row else 0
        cur.execute("SELECT COUNT(*) FROM tests")
        row = cur.fetchone()
        metrics["tests_total"] = row[0] if row else 0
        cur.execute(
            """
            SELECT COUNT(*) 
            FROM lessons l
            LEFT JOIN tests t ON t.lesson_id = l.id AND t.scope = 'lesson'
            WHERE t.id IS NULL
            """
        )
        row = cur.fetchone()
        metrics["lessons_without_tests"] = row[0] if row else 0
        cur.execute("SELECT COUNT(*) FROM user_lesson_progress")
        row = cur.fetchone()
        metrics["progress_rows"] = row[0] if row else 0
        cur.close()
    except Exception as e:
        metrics["db_error"] = str(e)
    return metrics


def cron_health() -> dict:
    # Try to inspect cron via hermes CLI
    r = run("hermes cron list --json 2>/dev/null || true", timeout=20)
    jobs: list[dict] = []
    try:
        data = json.loads(r.stdout or "[]")
        if isinstance(data, dict) and "jobs" in data:
            data = data["jobs"]
        for j in data:
            jobs.append({
                "name": j.get("name"),
                "last_status": j.get("last_status"),
                "last_run_at": j.get("last_run_at"),
                "last_delivery_error": j.get("last_delivery_error"),
            })
    except Exception:
        pass

    errors = [j for j in jobs if j.get("last_status") == "error"]
    return {"jobs_total": len(jobs), "jobs_errored": len(errors), "errors": errors[:10]}


def recent_errors() -> dict:
    # Scan recent output files for error markers
    out_dir = Path.home() / ".hermes" / "cron" / "output"
    errors: list[str] = []
    if out_dir.exists():
        try:
            cutoff = datetime.now() - timedelta(hours=24)
            for p in sorted(out_dir.glob("*.txt"), key=lambda x: x.stat().st_mtime, reverse=True)[:20]:
                try:
                    txt = p.read_text(encoding="utf-8", errors="replace")
                except Exception:
                    continue
                if "error" in txt.lower() or "traceback" in txt.lower() or "failed" in txt.lower():
                    errors.append(p.name)
                    if len(errors) >= 5:
                        break
        except Exception:
            pass
    return {"error_outputs_24h": len(errors), "files": errors}


def build_status() -> dict:
    r = run("npm run build 2>&1 | tail -25", check=False, timeout=300)
    failed = r.returncode != 0 or "error" in r.stdout.lower() or "failed" in r.stdout.lower()
    return {"ok": not failed, "snippet": r.stdout[-400:]}


def format_report(metrics: dict, cron: dict, err_data: dict, build: dict, db: dict) -> str:
    lines: list[str] = []
    lines.append(f"📋 Daily Ops Report — {datetime.now():%Y-%m-%d %H:%M}")
    lines.append("")

    lines.append("Cron status")
    lines.append(f"  Jobs: {cron.get('jobs_total', '?')} total, {cron.get('jobs_errored', 0)} errored")
    if cron.get("errors"):
        for j in cron["errors"][:3]:
            lines.append(f"  ⚠ {j.get('name')}: {j.get('last_status')} @ {j.get('last_run_at')}")

    lines.append("")
    lines.append("Content")
    total = db.get("lessons_total", "?")
    filled = db.get("lessons_filled", "?")
    lines.append(f"  Lessons: {filled}/{total} filled")
    tests = db.get("tests_total", "?")
    untested = db.get("lessons_without_tests", "?")
    lines.append(f"  Tests: {tests} total, {untested} lessons still untested")
    lines.append(f"  Progress rows: {db.get('progress_rows', '?')}")

    lines.append("")
    lines.append("Build")
    if build.get("ok"):
        lines.append("  ✓ Latest build passes")
    else:
        lines.append("  ✗ Latest build failed")
        if build.get("snippet"):
            lines.append("  " + build["snippet"].replace("\n", "\n  ")[:300])

    lines.append("")
    lines.append("System")
    lines.append(f"  Recent error outputs (24h): {err_data.get('error_outputs_24h', '?')}")
    if db.get("db_error"):
        lines.append(f"  DB issue: {db['db_error']}")

    return "\n".join(lines)


def main() -> int:
    conn = get_db()
    db: dict = {}
    if conn:
        try:
            db = db_metrics(conn)
        finally:
            try:
                conn.close()
            except Exception:
                pass
    else:
        db = {"db_error": "unreachable"}

    cron = cron_health()
    errors = recent_errors()
    build = build_status()
    report = format_report({}, cron, errors, build, db)
    print(report)
    # Non-zero if anything critical looks wrong
    bad = (
        cron.get("jobs_errored", 0) > 0
        or not build.get("ok", True)
        or db.get("db_error") is not None
    )
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
