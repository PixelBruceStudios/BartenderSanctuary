#!/usr/bin/env python3
"""
scripts/daily_email_report.py
Daily operational review for Bartender Sanctuary.
"""

from __future__ import annotations

import configparser
import json
import os
import re
import smtplib
import subprocess
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any

REPO = Path("/home/skicmi/bartender-sanctuary-app")
BACKUP_DIR = Path("/home/skicmi/backups")
REPORT_HOURS = 24
STATE_FILE = REPO / "scripts" / ".daily_report_state.json"


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


def load_state() -> dict:
    try:
        if STATE_FILE.exists():
            return json.loads(STATE_FILE.read_text())
    except Exception:
        pass
    return {}


def save_state(state: dict) -> None:
    try:
        STATE_FILE.write_text(json.dumps(state, indent=2))
    except Exception:
        pass


def get_himalaya_smtp_config() -> dict:
    cfg_path = Path.home() / ".config" / "himalaya" / "config.toml"
    if not cfg_path.exists():
        return {}
    parser = configparser.ConfigParser()
    try:
        parser.read(cfg_path)
        section = "accounts.personal" if parser.has_section("accounts.personal") else None
        if not section and parser.has_section("accounts"):
            section = "accounts"
        if not section:
            return {}
        return dict(parser.items(section))
    except Exception:
        return {}


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
        jobs_path = Path.home() / ".hermes" / "cron" / "jobs.json"
        if jobs_path.exists():
            data = json.loads(jobs_path.read_text())
            if isinstance(data, dict) and "jobs" in data:
                data = data["jobs"]
            for j in data:
                jobs.append(
                    {
                        "name": j.get("name"),
                        "last_status": j.get("last_status"),
                        "last_run_at": j.get("last_run_at"),
                        "schedule": j.get("schedule_display") or j.get("schedule", {}).get("display"),
                        "next_run_at": j.get("next_run_at"),
                    }
                )
                if j.get("last_status") == "error":
                    errors.append(jobs[-1])
    except Exception:
        pass
    return {"jobs": jobs, "errors": errors, "total": len(jobs), "errored": len(errors)}


def categorize_errors(errors: list[dict]) -> dict:
    cats: dict[str, list[str]] = {
        "deploy": [],
        "publish": [],
        "audit": [],
        "telegram": [],
        "translation": [],
        "curation": [],
        "unknown": [],
    }
    for e in errors:
        name = (e.get("name") or "").lower()
        if "deploy" in name or "vercel" in name:
            cats["deploy"].append(e.get("name", "?"))
        elif "publish" in name or "scheduled" in name:
            cats["publish"].append(e.get("name", "?"))
        elif "audit" in name or "refactor" in name or "improver" in name:
            cats["audit"].append(e.get("name", "?"))
        elif "telegram" in name or "reporter" in name:
            cats["telegram"].append(e.get("name", "?"))
        elif "translation" in name or "translate" in name:
            cats["translation"].append(e.get("name", "?"))
        elif "curat" in name:
            cats["curation"].append(e.get("name", "?"))
        else:
            cats["unknown"].append(e.get("name", "?"))
    return {k: v for k, v in cats.items() if v}


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

        cur.execute("SELECT COUNT(*) FROM test_attempts")
        row = cur.fetchone()
        metrics["test_attempts"] = row[0] if row else 0

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

        cur.execute("SELECT COUNT(*) FROM cocktails")
        row = cur.fetchone()
        metrics["cocktails_total"] = row[0] if row else 0

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


def classify_email_domain(entry: dict) -> str:
    sender = entry.get("from", "").lower()
    subject = entry.get("subject", "").lower()
    combined = f"{sender} {subject}"
    if any(k in combined for k in ["vercel", "deploy", "production"]):
        return "deploy"
    if any(k in combined for k in ["invoice", "payment", "bill", "receipt", "transaction", "refund"]):
        return "billing"
    if any(k in combined for k in ["security", "alert", "warning", "suspicious", "login", "verify", "2fa"]):
        return "security"
    if any(k in combined for k in ["urgent", "action required", "deadline", "asap", "important"]):
        return "important"
    if "skicmi" in sender or "bpcm" in subject:
        return "pipeline"
    if any(k in combined for k in ["newsletter", "promo", "off", "unsubscribe", "marketing"]):
        return "promo"
    if any(k in combined for k in ["support", "ticket", "issue", "bug", "help"]):
        return "support"
    return "neutral"


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

        classified = []
        counts = Counter()
        for e in recent:
            category = classify_email_domain(e)
            counts[category] += 1
            classified.append({"email": e, "category": category})

        important = [c for c in classified if c["category"] in {"important", "billing", "security", "deploy", "pipeline"}]
        return {
            "ok": True,
            "total_scanned": len(entries),
            "recent_24h": len(recent),
            "important_count": len(important),
            "categories": dict(counts),
            "important": [c["email"] for c in important[:8]],
            "sample": recent[:10],
        }
    except Exception as e:
        return {"ok": False, "error": str(e), "emails": []}


def generate_todos(metrics: dict, cron: dict, health: dict, emails: dict, trends: dict) -> list[dict]:
    todos: list[dict] = []
    now = datetime.now()

    if cron.get("errored", 0) > 0:
        cats = categorize_errors(cron.get("errors", []))
        todo_text = "Fix failing crons"
        if "deploy" in cats:
            todo_text += " (deploy pipeline)"
        elif "publish" in cats:
            todo_text += " (publish pipeline)"
        elif "audit" in cats:
            todo_text += " (content audit)"
        elif "telegram" in cats:
            todo_text += " (telegram reporter)"
        names = ", ".join(", ".join(cats.get(k, [])[:2]) for k in cats)[:120]
        todos.append({"text": todo_text, "impact": "high", "effort": "medium", "detail": names})

    if health.get("build", {}).get("ok") is False:
        todos.append({"text": "Fix broken build — deploy is blocked", "impact": "high", "effort": "high", "detail": "npm run build is failing"})
    elif health.get("build", {}).get("ok") is None:
        todos.append({"text": "Investigate build timeout", "impact": "high", "effort": "low", "detail": "Build check timed out"})

    fill_rate = 0
    if metrics.get("lessons_total", 0) > 0:
        fill_rate = metrics.get("lessons_filled", 0) / metrics["lessons_total"]
    hr_fill_rate = 0
    if metrics.get("lessons_hr_total", 0) > 0:
        hr_fill_rate = metrics.get("lessons_hr_filled", 0) / metrics["lessons_hr_total"]

    if fill_rate < 0.9:
        todos.append({"text": "Finish remaining empty EN lessons", "impact": "medium", "effort": "medium", "detail": f"fill rate {fill_rate:.0%}"})
    if hr_fill_rate < 0.85:
        todos.append({"text": "Complete Croatian lessons first", "impact": "medium", "effort": "medium", "detail": f"HR fill rate {hr_fill_rate:.0%}"})

    untested = metrics.get("lessons_without_tests", 0)
    if untested > 0:
        todos.append({"text": f"Generate tests for {untested} lessons", "impact": "medium", "effort": "high", "detail": "improves completion rate"})

    prog_delta = trends.get("progress_delta", 0)
    attempts_delta = trends.get("attempts_delta", 0)
    users_delta = trends.get("users_delta", 0)
    users = metrics.get("users_total", 0)

    if users < 50:
        todos.append({"text": "Add 1 new traffic source", "impact": "high", "effort": "medium", "detail": "TikTok/Reel or Reddit bartending"})
    elif users < 200:
        todos.append({"text": "Scale acquisition with short-form video series", "impact": "high", "effort": "high", "detail": "signature pours from the app"})

    if prog_delta < 0 and users > 10:
        todos.append({"text": "Engagement dip — add daily challenge reminder", "impact": "medium", "effort": "low", "detail": "Telegram bot or push notification"})

    if attempts_delta < 0 and metrics.get("tests_total", 0) > 0:
        todos.append({"text": "Test completion dropping — add achievement badges", "impact": "medium", "effort": "medium", "detail": "gamify module completion"})

    if metrics.get("cocktails_total", 0) > 0:
        todos.append({"text": "Review affiliate links on top 10 cocktails", "impact": "medium", "effort": "low", "detail": "stale products or better CPM deals"})

    if cron.get("errored", 0) > 0:
        todos.append({"text": "Automate error recovery / alert escalation", "impact": "high", "effort": "medium", "detail": "auto-restart or escalation for failing jobs"})

    if health.get("build", {}).get("ok") and prog_delta > 0:
        todos.append({"text": "Automate daily content promotion", "impact": "medium", "effort": "low", "detail": "auto-post top lesson to Telegram"})

    imp_count = emails.get("important_count", 0)
    if imp_count > 0:
        todos.append({"text": f"Reply to {imp_count} important email(s)", "impact": "high", "effort": "low", "detail": "respond within 24h"})

    todos.sort(key=lambda x: (0 if x["impact"] == "high" else 1, 0 if x["effort"] == "low" else 1))
    return todos[:6]


def compute_trends(current: dict, previous: dict) -> dict:
    trends: dict[str, Any] = {}
    numeric_keys = [
        "lessons_filled",
        "lessons_hr_filled",
        "tests_total",
        "users_total",
        "progress_last_24h",
        "test_attempts_last_24h",
        "cocktails_total",
        "progress_rows",
        "test_attempts",
    ]
    for k in numeric_keys:
        cur = current.get(k)
        prev = previous.get(k)
        if isinstance(cur, (int, float)) and isinstance(prev, (int, float)):
            trends[f"{k}_delta"] = cur - prev
            trends[f"{k}_pct"] = ((cur - prev) / prev * 100) if prev else None
    return trends


def format_delta(value, prev) -> str:
    if not isinstance(value, (int, float)) or not isinstance(prev, (int, float)):
        return ""
    delta = value - prev
    if delta == 0:
        return " (+0)"
    if delta > 0:
        return f" (+{delta})"
    return f" ({delta})"


def priority_badge(cron: dict, health: dict, users: int) -> str:
    bad_areas = 0
    if cron.get("errored", 0) > 0:
        bad_areas += 1
    if health.get("build", {}).get("ok") is False:
        bad_areas += 1
    if users > 10 and health.get("engagement_ok", True) is False:
        bad_areas += 1
    if bad_areas >= 2:
        return "🚨"
    if bad_areas == 1:
        return "⚠️"
    return "✅"


def format_narrative(cron: dict, health: dict, metrics: dict, errors: dict, emails: dict, todos: list[dict], trends: dict) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    badge = priority_badge(cron, health, metrics.get("users_total", 0))
    lines = [f"{badge} **Bartender Sanctuary Daily Review** — {now}", ""]

    lines.append("🕒 **Cron**")
    lines.append(f"  *Total:* {cron.get('total',0)} jobs, *errored:* {cron.get('errored',0)}")
    if cron.get("errors"):
        cats = categorize_errors(cron.get("errors", []))
        for cat, names in cats.items():
            label = cat.upper()
            lines.append(f"  • `{label}`: {', '.join(names[:3])}")
    if trends.get("errored_delta"):
        lines.append(f"  *Change:* {trends['errored_delta']:+d} errored jobs vs yesterday")

    lines.append("")
    lines.append("🔨 **Build**")
    build_ok = health.get("build", {}).get("ok")
    status = "✅ OK" if build_ok else ("⏱ TIMEOUT" if build_ok is None else "❌ FAILED")
    lines.append(f"  {status}")

    lines.append("")
    lines.append("📚 **Content**")
    lines.append(f"  • EN lessons: {metrics.get('lessons_filled',0)}/{metrics.get('lessons_total',0)}")
    lines.append(f"  • HR lessons: {metrics.get('lessons_hr_filled',0)}/{metrics.get('lessons_hr_total',0)}")
    lines.append(f"  • Tests: {metrics.get('tests_total',0)} total, {metrics.get('lessons_without_tests',0)} untested")
    lines.append(f"  • Users: {metrics.get('users_total',0)}")

    if trends:
        lines.append("  *Trends:*")
        if "users_total_delta" in trends:
            lines.append(f"    • Users: {trends['users_total_delta']:+d}")
        if "lessons_filled_delta" in trends:
            lines.append(f"    • EN filled: {trends['lessons_filled_delta']:+d}")
        if "lessons_hr_filled_delta" in trends:
            lines.append(f"    • HR filled: {trends['lessons_hr_filled_delta']:+d}")
        if "progress_last_24h_delta" in trends:
            lines.append(f"    • Progress events: {trends['progress_last_24h_delta']:+d}")
        if "test_attempts_last_24h_delta" in trends:
            lines.append(f"    • Test attempts: {trends['test_attempts_last_24h_delta']:+d}")

    lines.append("")
    lines.append("📧 **Emails**")
    email_cats = emails.get("categories", {})
    if email_cats:
        lines.append(f"  *Last 24h:* {', '.join(f'{k} {v}' for k, v in email_cats.items())}")
    else:
        lines.append(f"  • {emails.get('recent_24h','?')} recent, {emails.get('important_count',0)} important")

    lines.append("")
    lines.append("✅ **Todos**")
    for item in todos:
        impact_icon = {"high": "🔥", "medium": "⚡", "low": "💡"}.get(item.get("impact", "medium"), "•")
        lines.append(f"  {impact_icon} {item.get('text','')}")

    if todos:
        lines.append("")
        top = todos[0].get("text", "")
        lines.append(f"*Top priority:* {top}")

    return "\n".join(lines)


def send_email_smtp(to_email: str, subject: str, html: str) -> dict:
    try:
        cfg = get_himalaya_smtp_config()
        host = cfg.get("message.send.backend.host", "smtp.gmail.com")
        port = int(cfg.get("message.send.backend.port", "465"))
        login = cfg.get("message.send.backend.login") or cfg.get("email") or to_email
        password = cfg.get("message.send.backend.auth.raw", "")
        if not password:
            return {"ok": False, "error": "missing smtp password in himalaya config"}

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = login
        msg["To"] = to_email
        msg.attach(MIMEText(html, "html", "utf-8"))

        with smtplib.SMTP_SSL(host, port, timeout=20) as server:
            server.login(login, password)
            server.sendmail(login, [to_email], msg.as_string())
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def main() -> int:
    now = datetime.now()
    print(f"[{now:%Y-%m-%d %H:%M}] Starting daily review...")

    cron = get_cron_status()
    print(f"  Cron: {cron['total']} jobs, {cron['errored']} errors")

    build_status = get_build_status()
    prog_delta = 0
    attempts_delta = 0
    conn = get_db()
    metrics: dict[str, Any] = {}
    if conn:
        try:
            metrics = get_db_metrics(conn)
            previous_state = load_state()
            prev_metrics = previous_state.get("metrics", {})
            prog_delta = metrics.get("progress_last_24h", 0) - prev_metrics.get("progress_last_24h", metrics.get("progress_last_24h", 0))
            attempts_delta = metrics.get("test_attempts_last_24h", 0) - prev_metrics.get("test_attempts_last_24h", metrics.get("test_attempts_last_24h", 0))
        finally:
            try:
                conn.close()
            except Exception:
                pass
    else:
        metrics = {"db_error": "unreachable"}

    users = metrics.get("users_total", 0)
    engagement_ok = not (users > 10 and prog_delta < 0 and attempts_delta < 0)
    health: dict[str, Any] = {"build": build_status, "engagement_ok": engagement_ok}
    print(f"  Build: {'ok' if build_status['ok'] else 'FAILED'}")

    print(f"  DB: lessons_filled={metrics.get('lessons_filled','?')}")

    errors = get_recent_errors()
    if errors.get("error_outputs_24h"):
        print(f"  Recent error outputs: {errors['error_outputs_24h']}")

    emails = get_email_digest()
    print(f"  Emails: {emails.get('recent_24h','?')} recent, {emails.get('important_count',0)} important")

    previous_state = load_state()
    trends = compute_trends(metrics, previous_state.get("metrics", {}))
    trends["errored_delta"] = cron.get("errored", 0) - (previous_state.get("cron", {}).get("errored", 0) if previous_state.get("cron") else 0)
    trends["progress_delta"] = prog_delta
    trends["attempts_delta"] = attempts_delta
    trends["users_delta"] = metrics.get("users_total", 0) - previous_state.get("metrics", {}).get("users_total", metrics.get("users_total", 0))

    save_state({"cron": {"errored": cron.get("errored", 0)}, "metrics": {k: metrics.get(k) for k in [
        "lessons_filled", "lessons_hr_filled", "tests_total", "users_total",
        "progress_last_24h", "test_attempts_last_24h", "cocktails_total", "progress_rows", "test_attempts"
    ] if k in metrics}})

    todos = generate_todos(metrics, cron, health, emails, trends)
    print(f"  Todos generated: {len(todos)}")

    narrative = format_narrative(cron, health, metrics, errors, emails, todos, trends)
    print("\n" + narrative)

    to_email = os.environ.get("DAILY_REPORT_TO") or os.environ.get("EMAIL_HOME_ADDRESS") or os.environ.get("EMAIL_ADDRESS") or "danijelmiskic99@gmail.com"
    subject = f"Bartender Sanctuary Daily Review — {now:%Y-%m-%d}"

    send_result = send_email_smtp(to_email, subject, f"<pre>{narrative}</pre>")
    if send_result.get("ok"):
        print(f"  Email sent to {to_email}")
    else:
        print(f"  Email send failed: {send_result}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
