#!/usr/bin/env python3
import os
import re
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

REPO = Path("/home/skicmi/bartender-sanctuary-app")
CRON_DIR = Path.home() / ".hermes" / "cron" / "output"
BOT_TOKEN = os.environ["CRON_REPORT_BOT_TOKEN"]
CHAT_ID = os.environ["CRON_REPORT_CHAT_ID"]
LOOKBACK_HOURS = 6


def latest_outputs():
    now = datetime.now()
    cutoff = now - timedelta(hours=LOOKBACK_HOURS)
    latest = {}
    for job_dir in CRON_DIR.iterdir():
        if not job_dir.is_dir():
            continue
        candidates = sorted(job_dir.glob("*.md"), reverse=True)
        for p in candidates:
            try:
                ts = datetime.strptime(p.stem, "%Y-%m-%d_%H-%M-%S")
            except ValueError:
                continue
            if ts >= cutoff:
                latest[job_dir.name] = p
            break
    return latest


def summarize_output(path):
    text = path.read_text(errors="ignore")
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    keep = []
    skip_prefixes = (
        "[IMPORTANT:", "You are", "Follow this", "## Your Task", "## Startup",
        "## Your Hourly", "## Constraints", "## 2026", "## Purpose", "## Working",
        "## How to", "### Via API", "```", "---", "Do NOT", "IMPORTANT:",
        "SILENT:", "DELIVERY:", "1.", "2.", "3.", "4.", "5.", "6.", "7.",
    )
    for ln in lines:
        if any(ln.startswith(p) for p in skip_prefixes):
            continue
        if ln.startswith("## ") or ln.startswith("**"):
            keep.append(ln)
            continue
        keep.append(ln)
        if len(keep) >= 10:
            break
    return " ".join(keep[:10]).strip() if keep else "No readable response captured."


def build_review():
    outputs = latest_outputs()
    lines = [
        f"*Cron review — last {LOOKBACK_HOURS}h*",
        f"Checked at `{datetime.now():%Y-%m-%d %H:%M}`",
        "",
        f"Found `{len(outputs)}` job runs with output in this window.",
        "",
    ]
    for job_id, path in sorted(outputs.items()):
        summary = summarize_output(path) or "No readable response captured."
        lines.append(f"• `{job_id}`: {summary}")
    lines += ["", "*Bottom line:* these are the actual results from the last 6 hours."]
    return "\n".join(lines)




if __name__ == "__main__":
    report = build_review()
    print(report)
    sys.exit(0)
