#!/usr/bin/env python3
"""
scripts/auto_deploy.py
- Builds the Next.js app
- Deploys to Vercel production
- Runs smoke tests
- Reports pass/fail
Exits non-zero on failure so cron/watchdog can catch it.
"""

from __future__ import annotations

import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

REPO = Path("/home/skicmi/bartender-sanctuary-app")
BASE = "https://bartender-sanctuary-app.vercel.app"


def run(cmd: str, *, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd,
        shell=True,
        cwd=REPO,
        capture_output=True,
        text=True,
        timeout=600,
        check=check,
    )


def build() -> tuple[bool, str]:
    r = run("npm run build 2>&1 | tail -40", check=False)
    if r.returncode != 0 or "error" in r.stdout.lower() or "failed" in r.stdout.lower():
        return False, r.stdout[-800:]
    return True, "Build OK"


def deploy() -> tuple[bool, str]:
    r = run("npx vercel --prod --yes 2>&1 | tail -40", check=False)
    if r.returncode != 0:
        return False, r.stdout[-800:] + "\n" + r.stderr[-400:]
    return True, "Deploy OK"


def smoke_test() -> tuple[bool, str]:
    checks = [
        ("health", f"{BASE}/api/health", 200),
        ("school/full", f"{BASE}/api/school/full", 200),
        ("lessons list", f"{BASE}/api/lessons", 200),
        ("session endpoint", f"{BASE}/api/auth/session", 200),
        ("homepage", f"{BASE}/", 200),
    ]

    passed: list[str] = []
    failed: list[str] = []

    for name, url, expected in checks:
        r = subprocess.run(
            f"curl -s -o /dev/null -w '%{{http_code}}' '{url}'",
            shell=True,
            capture_output=True,
            text=True,
            timeout=30,
        )
        actual = r.stdout.strip()
        if actual == str(expected):
            passed.append(name)
        else:
            failed.append(f"{name} (expected {expected}, got {actual})")

    msg = f"Passed: {len(passed)}/{len(checks)}"
    if failed:
        msg += "\nFailed:\n  - " + "\n  - ".join(failed)
        return False, msg
    return True, msg


def main() -> int:
    print(f"=== Auto Deploy {datetime.now():%Y-%m-%d %H:%M} ===\n")
    steps = [("Build", build), ("Deploy", deploy), ("Smoke tests", smoke_test)]
    results: list[tuple[str, bool, str]] = []

    for name, fn in steps:
        print(f":: {name} ...")
        try:
            ok, msg = fn()
        except Exception as e:
            ok, msg = False, str(e)
        results.append((name, ok, msg))
        print(("  ✓ " if ok else "  ✗ ") + msg.replace("\n", "\n    ") + "\n")

    ok = all(x[1] for x in results)
    print("DEPLOY " + ("OK" if ok else "FAILED"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
