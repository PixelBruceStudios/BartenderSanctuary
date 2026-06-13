#!/usr/bin/env python3
"""
scripts/daily_email_report.py
Daily 8 AM email report for Bartender Sanctuary.

Covers:
- Cron activity and health
- App state and build status
- Engagement signals from DB
- Recent important emails
- Actionable daily todos for monetization, reach, and automation
"""

from __future__ import annotations

import json
import os
import re
import smtplib
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

import requests

REPO = Path("/home/skicmi/bartender-sanctuary-app")
BACKUP_DIR = Path("/home/skicmi/backups")
REPORT_HOURS = 24
LOOKBACK_HOURS = 3  # for trend-based todos


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


def get_resend_api_key() -> str | None:
    # Try env first, then common files
    key = os.environ.get("RESEND_API_KEY")
    if key:
        return key.strip()
    for candidate in [
        REPO / ".env.vercel.prod",
        REPO / ".env.vercel",
        Path.home() / ".hermes" / ".env",
    ]:
        if candidate.exists():
            try:
                for line in candidate.read_text(errors="ignore").splitlines():
                    if line.startswith("RESEND_API_KEY="):
                        return line.split("=", 1)[1].strip().strip('"').strip("'")
            except Exception:
                pass
    return None


def get_email_from() -> str | None:
    for candidate in [
        REPO / ".env.vercel.prod",
        REPO / ".env.vercel",
        Path.home() / ".hermes" / ".env",
    ]:
        if candidate.exists():
            try:
                for line in candidate.read_text(errors="ignore").splitlines():
                    if line.startswith("EMAIL_FROM="):
                        val = line.split("=", 1)[1].strip().strip('"').strip("'")
                        if val:
                            return val
            except Exception:
                pass
    return None


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


def get_cron_status() -> dict:
    jobs: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    try:
        r = run("hermes cron list --json 2>/dev/null || true", timeout=20)
        data = json.loads(r.stdout or "[]")
        if isinstance(data, dict) and "jobs" in data:
            data = data["jobs"]
        for j in data:
            jobs.append(
                {
                    "name": j.get("name"),
                    "last_status": j.get("last_status"),
                    "last_run_at": j.get("last_run_at"),
                    "schedule": j.get("schedule"),
                    "next_run_at": j.get("next_run_at"),
                }
            )
            if j.get("last_status") == "error":
                errors.append(jobs[-1])
    except Exception:
        pass
    return {"jobs": jobs, "errors": errors, "total": len(jobs), "errored": len(errors)}


def get_build_status() -> dict:
    try:
        r = run("npm run build 2>&1 | tail -20", check=False, timeout=15)
        out = r.stdout
        failed = r.returncode != 0 or "error -" in out.lower() or "error  " in out.lower()
        if not out and r.returncode == 0:
            next_dir = REPO / ".next"
            if next_dir.exists():
                age_hours = (datetime.now() - datetime.fromtimestamp(next_dir.stat().st_mtime)).total_seconds() / 3600
                if age_hours < 24:
                    return {"ok": True, "snippet": f".next cache age: {age_hours:.1f}h"}
            return {"ok": False, "snippet": "build produced no output"}
        return {"ok": not failed, "snippet": out[-600:]}
    except subprocess.TimeoutExpired:
        return {"ok": None, "snippet": "build check timed out after 15s"}
    except Exception as e:
        return {"ok": None, "snippet": f"build check error: {e}"}


def get_db_metrics(conn) -> dict:
    metrics: dict[str, Any] = {}
    try:
        cur = conn.cursor()
        # Content metrics
        cur.execute("SELECT COUNT(*) FROM lessons")
        row = cur.fetchone()
        metrics["lessons_total"] = row[0] if row else 0

        cur.execute("SELECT COUNT(*) FROM lessons WHERE content IS NOT NULL AND length(content) > 50")
        row = cur.fetchone()
        metrics["lessons_filled"] = row[0] if row else 0

        cur.execute("SELECT COUNT(*) FROM lessons_hr")
        row = cur.fetchone()
        metrics["lessons_hr_total"] = row[0] if row else 0

        cur.execute("SELECT COUNT(*) FROM lessons_hr WHERE content IS NOT NULL AND length(content) > 50")
        row = cur.fetchone()
        metrics["lessons_hr_filled"] = row[0] if row else 0

        # Test coverage
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

        # Engagement / monetization signals
        cur.execute("SELECT COUNT(*) FROM user_lesson_progress")
        row = cur.fetchone()
        metrics["progress_rows"] = row[0] if row else 0

        cur.execute("SELECT COUNT(*) FROM test_attempts")
        row = cur.fetchone()
        metrics["test_attempts"] = row[0] if row else 0

        # Recent activity
        cur.execute(
            """
            SELECT COUNT(*) FROM user_lesson_progress 
            WHERE updated_at >= NOW() - INTERVAL '24 hours'
            """
        )
        row = cur.fetchone()
        metrics["progress_last_24h"] = row[0] if row else 0

        cur.execute(
            """
            SELECT COUNT(*) FROM test_attempts 
            WHERE created_at >= NOW() - INTERVAL '24 hours'
            """
        )
        row = cur.fetchone()
        metrics["test_attempts_last_24h"] = row[0] if row else 0

        # Cocktail / affiliate signals
        cur.execute("SELECT COUNT(*) FROM cocktails")
        row = cur.fetchone()
        metrics["cocktails_total"] = row[0] if row else 0

        # Users
        cur.execute("SELECT COUNT(*) FROM users")
        row = cur.fetchone()
        metrics["users_total"] = row[0] if row else 0

        cur.close()
    except Exception as e:
        metrics["db_error"] = str(e)
    return metrics


def get_recent_errors() -> dict:
    out_dir = Path.home() / ".hermes" / "cron" / "output"
    errors: list[str] = []
    if out_dir.exists():
        try:
            cutoff = datetime.now() - timedelta(hours=REPORT_HOURS)
            for p in sorted(out_dir.glob("*.txt"), key=lambda x: x.stat().st_mtime, reverse=True)[:30]:
                try:
                    txt = p.read_text(encoding="utf-8", errors="replace")
                except Exception:
                    continue
                if "error" in txt.lower() or "traceback" in txt.lower() or "failed" in txt.lower():
                    errors.append(p.name)
                    if len(errors) >= 8:
                        break
        except Exception:
            pass
    return {"error_outputs_24h": len(errors), "files": errors}


def get_email_digest() -> dict:
    try:
        r = run("himalaya envelope list --output plain --page-size 25 2>&1", timeout=30)
        raw = r.stdout.strip()
        if not raw or "Error:" in raw:
            return {"ok": False, "error": raw[:200] if raw else "no output", "emails": []}
        entries: list[dict[str, str]] = []
        lines = [ln.strip() for ln in raw.splitlines() if ln.strip().startswith("|")]
        if len(lines) >= 3:
            for line in lines[2:]:
                parts = [p.strip() for p in line.strip("|").split("|")]
                if len(parts) < 4:
                    continue
                entries.append(
                    {
                        "id": parts[0],
                        "flags": parts[1],
                        "subject": parts[2],
                        "from": parts[3],
                        "date": parts[4] if len(parts) > 4 else "",
                    }
                )
        # Filter last 24h roughly
        recent: list[dict[str, str]] = []
        cutoff = datetime.now(timezone.utc) - timedelta(days=1)
        for e in entries:
            d = e.get("date", "")
            try:
                dt = datetime.fromisoformat(d)
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                else:
                    dt = dt.astimezone(timezone.utc)
                if dt >= cutoff:
                    recent.append(e)
            except ValueError:
                recent.append(e)
        # Classify
        important = []
        for e in recent:
            text = f"{e.get('subject','')} {e.get('from','')}".lower()
            if any(k in text for k in ["urgent", "important", "action required", "verify", "deadline", "invoice", "receipt", "payment", "bill", "transaction", "security", "alert", "warning", "hitres", "hrvatski"]):
                important.append(e)
        return {
            "ok": True,
            "total_scanned": len(entries),
            "recent_24h": len(recent),
            "important_count": len(important),
            "important": important[:8],
            "sample": recent[:10],
        }
    except Exception as e:
        return {"ok": False, "error": str(e), "emails": []}


def generate_todos(metrics: dict, cron: dict, health: dict, emails: dict) -> list[str]:
    todos: list[str] = []
    now = datetime.now()

    # Cron health todos
    if cron.get("errored", 0) > 0:
        names = ", ".join(j.get("name", "?") for j in cron.get("errors", [])[:3])
        todos.append(f"🔧 Fix failing crons today: {names}")
    
    if health.get("build", {}).get("ok") is False:
        todos.append("🛠 Fix broken build — deploy is blocked until build passes")

    # Content / curriculum todos
    fill_rate = 0
    if metrics.get("lessons_total", 0) > 0:
        fill_rate = metrics.get("lessons_filled", 0) / metrics["lessons_total"]
    
    hr_fill_rate = 0
    if metrics.get("lessons_hr_total", 0) > 0:
        hr_fill_rate = metrics.get("lessons_hr_filled", 0) / metrics["lessons_hr_total"]

    if fill_rate < 0.9:
        todos.append("📝 Prioritize filling remaining empty EN lessons to reach 90% completion")
    if hr_fill_rate < 0.85:
        todos.append("🇭🇷 Croatian lessons lagging — finish HR content before expanding other sections")

    untested = metrics.get("lessons_without_tests", 0)
    if untested > 0:
        todos.append(f"📝 Generate tests for {untested} lessons still without test coverage")

    # Engagement / monetization todos
    prog_24h = metrics.get("progress_last_24h", 0)
    attempts_24h = metrics.get("test_attempts_last_24h", 0)
    users = metrics.get("users_total", 0)

    if users < 50:
        todos.append("📈 User base is small — add 1 new traffic source (Tik bartender clip, Reddit r/bartending, or Instagram reel)")
    elif users < 200:
        todos.append("📈 Scale acquisition: launch 1 short-form video series showing signature pours from the app")

    if prog_24h < 5 and users > 10:
        todos.append("📉 Engagement dip detected — add a 'daily challenge' push notification or Telegram bot reminder")

    if attempts_24h < 3 and metrics.get("tests_total", 0) > 0:
        todos.append("🎯 Test completion rate low — add achievement badges for passing modules")

    # Affiliate / monetization
    if metrics.get("cocktails_total", 0) > 0:
        todos.append("💰 Review affiliate links on top 10 cocktail pages for stale products or better CPM deals")

    # Automation
    if cron.get("errored", 0) > 0:
        todos.append("🤖 Automate error recovery: add auto-restart or alert escalation for the failing jobs above")
    
    if health.get("build", {}).get("ok") and metrics.get("progress_last_24h", 0) > 10:
        todos.append("🤖 Automate daily content promotion: auto-post top lesson to Telegram channel")

    # Email todos
    if emails.get("important_count", 0) > 0:
        todos.append(f"📬 Respond to {emails['important_count']} important email(s) within 24h")

    # Ensure at least 3 todos
    if len(todos) < 3:
        todos.append("📋 Review analytics dashboard and pick 1 experiment to run this week")
    if len(todos) < 5:
        todos.append("🚀 Prepare 1 new lesson bundle for launch by end of week")
    
    return todos[:6]


def send_email_via_resend(to_email: str, subject: str, html: str, api_key: str, from_email: str) -> dict:
    try:
        resp = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": from_email,
                "to": [to_email],
                "subject": subject,
                "html": html,
            },
            timeout=30,
        )
        try:
            body = resp.json()
        except ValueError:
            body = {"raw": resp.text}
        return {"status_code": resp.status_code, "body": body, "ok": resp.status_code in (200, 202)}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def build_html_report(cron: dict, health: dict, metrics: dict, error_data: dict, emails: dict, todos: list[str]) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    cron_ok = cron.get("total", 0) - cron.get("errored", 0)
    build_icon = "✅" if health.get("build", {}).get("ok") else "❌"

    def pill(status: str) -> str:
        color = "#16a34a" if status == "ok" else "#dc2626" if status == "error" else "#d97706"
        return f'<span style="background:{color};color:white;padding:2px 8px;border-radius:999px;font-size:12px;">{status.upper()}</span>'

    rows = []
    for j in cron.get("jobs", []):
        status = j.get("last_status") or "unknown"
        rows.append(
            f"<tr><td>{j.get('name')}</td><td>{j.get('schedule')}</td>"
            f"<td>{pill(status)}</td><td>{j.get('last_run_at') or '—'}</td></tr>"
        )
    cron_table = "\n".join(rows) if rows else "<tr><td colspan='4'>No cron data</td></tr>"

    email_rows = []
    for e in emails.get("important", [])[:6]:
        email_rows.append(f"<tr><td>{e.get('subject')}</td><td>{e.get('from')}</td><td>{e.get('date','')[:10]}</td></tr>")
    email_table = "\n".join(email_rows) if email_rows else "<tr><td colspan='3'>No important emails in last 24h</td></tr>"

    todos_html = "\n".join(f"<li>{t}</li>" for t in todos)

    db_section = f"""
      <p><strong>Lessons:</strong> {metrics.get('lessons_filled',0)}/{metrics.get('lessons_total',0)} EN · {metrics.get('lessons_hr_filled',0)}/{metrics.get('lessons_hr_total',0)} HR</p>
      <p><strong>Tests:</strong> {metrics.get('tests_total',0)} total · {metrics.get('lessons_without_tests',0)} lessons untested</p>
      <p><strong>Engagement (24h):</strong> {metrics.get('progress_last_24h',0)} lesson progresses · {metrics.get('test_attempts_last_24h',0)} test attempts</p>
      <p><strong>Users:</strong> {metrics.get('users_total',0)} registered</p>
    """

    return f"""
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#111;max-width:800px;margin:auto;padding:24px;">
  <h1>🍸 Bartender Sanctuary — Daily Review</h1>
  <p style="color:#555;">{now}</p>

  <h2>🤖 Cron Activity</h2>
  <p>{cron_ok}/{cron.get('total',0)} jobs last OK · {cron.get('errored',0)} errored</p>
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <thead><tr><th>Job</th><th>Schedule</th><th>Status</th><th>Last run</th></tr></thead>
    <tbody>{cron_table}</tbody>
  </table>
  {"<p style='color:#b45309;'>⚠ Recent error outputs: " + str(error_data.get('error_outputs_24h',0)) + " files with error markers</p>" if error_data.get('error_outputs_24h',0) else ""}

  <h2>🏥 App Health</h2>
  <p>Build: {build_icon} {"OK" if health.get('build',{}).get('ok') else "FAILED"}</p>
  {db_section}

  <h2>📬 Important Emails (24h)</h2>
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
    <thead><tr><th>Subject</th><th>From</th><th>Date</th></tr></thead>
    <tbody>{email_table}</tbody>
  </table>

  <h2>✅ Daily Todos</h2>
  <ol>{todos_html}</ol>

  <p style="color:#888;font-size:12px;">Generated automatically by Hermes cron.</p>
</body>
</html>
"""


def main() -> int:
    now = datetime.now()
    print(f"[{now:%Y-%m-%d %H:%M}] Starting daily email report...")

    # 1. Cron status
    cron = get_cron_status()
    print(f"  Cron: {cron['total']} jobs, {cron['errored']} errors")

    # 2. Build
    health: dict[str, Any] = {"build": get_build_status()}
    print(f"  Build: {'ok' if health['build']['ok'] else 'FAILED'}")

    # 3. DB metrics
    conn = get_db()
    metrics: dict[str, Any] = {}
    if conn:
        try:
            metrics = get_db_metrics(conn)
        finally:
            try:
                conn.close()
            except Exception:
                pass
    else:
        metrics = {"db_error": "unreachable"}
    print(f"  DB: lessons_filled={metrics.get('lessons_filled','?')}")

    # 4. Recent errors
    errors = get_recent_errors()
    if errors.get("error_outputs_24h"):
        print(f"  Recent error outputs: {errors['error_outputs_24h']}")

    # 5. Email digest
    emails = get_email_digest()
    print(f"  Emails: {emails.get('recent_24h','?')} recent, {emails.get('important_count',0)} important")

    # 6. Todos
    todos = generate_todos(metrics, cron, health, emails)
    print(f"  Todos generated: {len(todos)}")

    # 7. Compose email
    to_email = os.environ.get("DAILY_REPORT_TO") or os.environ.get("EMAIL_HOME_ADDRESS") or os.environ.get("EMAIL_ADDRESS")
    api_key = get_resend_api_key()
    from_email = get_email_from() or "Bartender Sanctuary <noreply@yourdomain.com>"

    if not to_email:
        print("ERROR: No recipient email configured (DAILY_REPORT_TO / EMAIL_HOME_ADDRESS / EMAIL_ADDRESS)", file=sys.stderr)
        return 2
    if not api_key:
        print("ERROR: No Resend API key found (RESEND_API_KEY)", file=sys.stderr)
        return 2

    html = build_html_report(cron, health, metrics, errors, emails, todos)
    subject = f"Bartender Sanctuary Daily Review — {now:%Y-%m-%d}"

    result = send_email_via_resend(to_email, subject, html, api_key, from_email)
    if result.get("ok"):
        print(f"  Email sent to {to_email}")
        return 0
    else:
        print(f"  Failed to send email: {result}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
