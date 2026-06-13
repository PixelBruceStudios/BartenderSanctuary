#!/usr/bin/env python3
"""
Project health checker: verifies DB, code quality, and REFACTORPLAN consistency.
Reports status via stdout.
"""

import os
import re
import subprocess
from pathlib import Path
from datetime import datetime

REPO = Path("/home/skicmi/bartender-sanctuary-app")
PLAN = Path("/home/skicmi/REFACTORPLAN.md")


def run(cmd, cwd=REPO):
    try:
        r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, timeout=30)
        return r.stdout.strip(), r.returncode
    except Exception as e:
        return str(e), 1


def check_git_status():
    out, code = run("git status --short")
    if code != 0:
        return "error", "git command failed"
    if out:
        return "warning", f"{len(out.splitlines())} uncommitted changes"
    return "ok", "clean"


def check_build():
    out, code = run("npm run build 2>&1 | tail -20")
    if code != 0:
        return "error", f"build failed: {out[:200]}"
    if "error" in out.lower() or "failed" in out.lower():
        return "error", f"build error: {out[:200]}"
    return "ok", "build passes"


def check_db_connection():
    try:
        import psycopg2
        with open('/home/skicmi/Desktop/NeonDbPass') as f:
            pwd = f.read().strip()
        conn = psycopg2.connect(
            host='ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech',
            database='BartenderSanctuary',
            user='neondb_owner',
            password=pwd,
            sslmode='require'
        )
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM lessons")
        row = cur.fetchone()
        count = row[0] if row else 0
        cur.close()
        conn.close()
        return "ok", f"DB reachable, {count} lessons"
    except Exception as e:
        return "error", f"DB unreachable: {e}"


def check_plan_exists():
    if not PLAN.exists():
        return "warning", "REFACTORPLAN.md not found"
    return "ok", f"plan exists ({PLAN})"


def check_plan_freshness():
    if not PLAN.exists():
        return "warning", "no plan to check"
    text = PLAN.read_text()
    m = re.search(r"Generated: (\d{4}-\d{2}-\d{2})", text)
    if not m:
        return "warning", "no timestamp in plan"
    gen_date = datetime.strptime(m.group(1), "%Y-%m-%d")
    age = (datetime.now() - gen_date).days
    if age > 7:
        return "warning", f"plan is {age} days old"
    return "ok", f"plan age: {age} days"


def check_plan_implementation():
    if not PLAN.exists():
        return "warning", "no plan to check"

    text = PLAN.read_text()
    total = len(re.findall(r"- \[( |x|~)\]", text))
    done = len(re.findall(r"- \[x\]", text))
    deferred = len(re.findall(r"- \[~\]", text))
    pending = total - done - deferred

    if pending > 0:
        return "warning", f"{pending} pending, {done} done, {deferred} deferred"
    return "ok", f"{done}/{total} items implemented"


def check_env_security():
    issues = []
    for ef in [".env", ".env.local", ".env.production", ".env.vercel", ".env.vercel.prod"]:
        path = REPO / ef
        if path.exists():
            text = path.read_text(errors="ignore")
            if re.search(r"(password|secret|key)\s*=\s*.{10,}", text, re.I):
                if "example" not in text.lower() and "placeholder" not in text.lower():
                    issues.append(f"{ef} may contain secrets")

    if issues:
        return "warning", "; ".join(issues)
    return "ok", "no obvious secret leaks"


def check_dependencies():
    out, code = run("npm audit --audit-level=high 2>&1 | tail -5")
    if "0 vulnerabilities" in out.lower():
        return "ok", "no high/critical vulnerabilities"
    if code != 0 and "npm" in out:
        return "warning", "npm audit failed or unavailable"
    return "warning", f"npm audit: {out[:200]}"


def main():
    print("=== Project Health Check ===")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"Repo: {REPO}\n")

    checks = [
        ("Git status", check_git_status),
        ("Build", check_build),
        ("DB connection", check_db_connection),
        ("Plan exists", check_plan_exists),
        ("Plan freshness", check_freshness if False else check_plan_freshness),  # placeholder
        ("Plan progress", check_plan_implementation),
        ("Env security", check_env_security),
        ("Dependencies", check_dependencies),
    ]

    results = []
    for name, fn in checks:
        status, msg = fn()
        icon = {"ok": "✓", "warning": "⚠", "error": "✗"}.get(status, "?")
        print(f"  {icon} {name}: {msg}")
        results.append({"name": name, "status": status, "message": msg})

    # Summary
    ok = sum(1 for r in results if r["status"] == "ok")
    warn = sum(1 for r in results if r["status"] == "warning")
    err = sum(1 for r in results if r["status"] == "error")

    print(f"\nSummary: {ok} OK, {warn} warnings, {err} errors")

    if err > 0:
        print("\n🔴 CRITICAL ISSUES FOUND — immediate action needed")
    elif warn > 0:
        print("\n🟡 WARNINGS — review recommended")
    else:
        print("\n🟢 ALL HEALTHY")

    return err == 0


if __name__ == "__main__":
    healthy = main()
    exit(0 if healthy else 1)
