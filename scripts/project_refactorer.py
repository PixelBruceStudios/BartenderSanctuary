#!/usr/bin/env python3
"""
Project refactorer: re-audits the codebase directly, implements known-safe fixes,
and updates REFACTORPLAN.md with results.
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


def find_console_logs():
    """Find console.log statements in source files"""
    findings = []
    for f in list(REPO.rglob("*.ts")) + list(REPO.rglob("*.tsx")) + list(REPO.rglob("*.js")):
        if any(x in str(f) for x in ["node_modules", ".next", "out", ".venv", "__pycache__"]):
            continue
        try:
            text = f.read_text(errors="ignore")
        except Exception:
            continue

        for i, line in enumerate(text.split("\n"), 1):
            if "console.log" in line and "debug" not in line.lower():
                findings.append({
                    "type": "console.log",
                    "file": str(f.relative_to(REPO)),
                    "line": i,
                    "content": line.strip(),
                })
    return findings


def find_gitignore_issues():
    """Find missing env files in .gitignore"""
    gi = REPO / ".gitignore"
    if not gi.exists():
        return [{"type": ".gitignore missing", "file": ".gitignore", "line": 0, "content": ""}]

    text = gi.read_text()
    missing = []
    for ef in [".env.vercel.prod", ".env.production.local", ".env.local"]:
        if ef not in text and (REPO / ef).exists():
            missing.append({"type": "missing in .gitignore", "file": ".gitignore", "line": 0, "content": ef})

    return missing


def find_nextconfig_issues():
    """Find missing next.config.js optimizations"""
    cfg = REPO / "next.config.js"
    if not cfg.exists():
        return [{"type": "next.config.js missing", "file": "next.config.js", "line": 0, "content": ""}]

    text = cfg.read_text()
    issues = []

    if "trailingSlash" not in text:
        issues.append({"type": "missing trailingSlash", "file": "next.config.js", "line": 0, "content": "Add trailingSlash: true"})

    return issues


def fix_console_logs(findings):
    """Remove console.log lines from files"""
    fixed = []
    files_to_patch = {}

    for item in findings:
        f = REPO / item["file"]
        if f not in files_to_patch:
            try:
                files_to_patch[f] = f.read_text().split("\n")
            except Exception:
                continue

        lines = files_to_patch[f]
        if item["line"] <= len(lines) and "console.log" in lines[item["line"] - 1]:
            lines[item["line"] - 1] = ""  # blank it out
            fixed.append(f"{item['file']}:{item['line']}")

    # Write back patched files
    for f, lines in files_to_patch.items():
        new_text = "\n".join(lines)
        # Clean up multiple blank lines
        new_text = re.sub(r"\n{3,}", "\n\n", new_text)
        f.write_text(new_text)

    return fixed


def fix_gitignore():
    """Add missing env files to .gitignore"""
    gi = REPO / ".gitignore"
    if not gi.exists():
        return False, ".gitignore not found"

    text = gi.read_text()
    missing = []
    for ef in [".env.vercel.prod", ".env.production.local"]:
        if ef not in text and (REPO / ef).exists():
            missing.append(ef)

    if not missing:
        return False, "already up to date"

    with open(gi, "a") as f:
        f.write("\n# Added by refactorer\n")
        for m in missing:
            f.write(f"{m}\n")

    return True, f"added {', '.join(missing)} to .gitignore"


def fix_nextconfig(issues):
    """Fix next.config.js issues"""
    if not issues:
        return False, "no issues"

    cfg = REPO / "next.config.js"
    text = cfg.read_text()

    # Add trailingSlash if missing
    if "trailingSlash" not in text:
        # Find the module.exports object and add trailingSlash
        if text.strip().endswith("}"):
            text = text.rstrip().rstrip("}") + "\n  trailingSlash: true,\n}\n"
            cfg.write_text(text)
            return True, "added trailingSlash: true"

    return False, "no safe fixes applied"


def commit_changes(messages):
    if not messages:
        return False

    msg = "refactor: " + "; ".join(messages[:3])
    if len(messages) > 3:
        msg += f" (+{len(messages)-3} more)"

    run_cmd = f'cd {REPO} && git add -A && git commit -m "{msg}" && git push origin main'
    try:
        r = subprocess.run(run_cmd, shell=True, capture_output=True, text=True, timeout=30)
        return r.returncode == 0
    except Exception:
        return False


def update_plan(findings, implemented, deferred):
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Group by grade
    grade_groups = {"A": [], "B": [], "C": [], "D": []}
    for f in findings:
        grade = f.get("grade", "D")
        grade_groups.setdefault(grade, []).append(f)

    lines = [
        f"# REFACTORPLAN",
        f"",
        f"Generated: {now}",
        f"Repo: {REPO}",
        f"",
        f"---",
        f"",
        f"## Findings (from latest audit)",
        f"",
    ]

    for grade in ["A", "B", "C", "D"]:
        items = grade_groups.get(grade, [])
        if items:
            lines.append(f"### Grade {grade} ({len(items)} items)")
            lines.append("")
            for item in items:
                # Check if this was implemented
                key = f"{item.get('file','')}:{item.get('line',0)}"
                was_implemented = any(key in impl for impl in implemented)
                was_deferred = any(key in defr for defr in deferred)

                if was_implemented:
                    status = "x"
                elif was_deferred:
                    status = "~"
                else:
                    status = " "

                desc = item.get("content", item.get("type", "unknown"))
                lines.append(f"- [{status}] {desc}")
            lines.append("")

    lines.extend([
        f"---",
        f"",
        f"## Implementation Log",
        f"",
        f"### {now}",
    ])

    if implemented:
        lines.append(f"- [x] Implemented {len(implemented)} fixes:")
        for msg in implemented:
            lines.append(f"  - {msg}")
    else:
        lines.append(f"- [ ] No auto-fixes this run")

    if deferred:
        lines.append(f"")
        lines.append(f"- [~] Deferred {len(deferred)} items (manual review needed):")
        for msg in deferred:
            lines.append(f"  - {msg}")

    lines.append("")
    lines.append("## Deferred")
    lines.append("")
    if deferred:
        for msg in deferred:
            lines.append(f"- {msg}")
    else:
        lines.append("(none)")

    PLAN.write_text("\n".join(lines))


def main():
    print("=== Project Refactorer ===")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")

    all_findings = []
    implemented = []
    deferred = []

    # 1. Find console.log issues
    print("Scanning for console.log...")
    console_issues = find_console_logs()
    if console_issues:
        all_findings.extend([{**i, "grade": "D", "type": "console.log"} for i in console_issues])
        print(f"  Found {len(console_issues)} console.log statements")

        fixed = fix_console_logs(console_issues)
        if fixed:
            implemented.append(f"removed {len(fixed)} console.log statements")
            print(f"  ✓ Fixed {len(fixed)}")
        else:
            deferred.append(f"{len(console_issues)} console.log statements (fix failed)")
    else:
        print("  None found")

    # 2. Fix .gitignore
    print("\nChecking .gitignore...")
    gi_issues = find_gitignore_issues()
    if gi_issues:
        all_findings.extend([{**i, "grade": "B", "type": ".gitignore"} for i in gi_issues])
        success, msg = fix_gitignore()
        if success:
            implemented.append(msg)
            print(f"  ✓ {msg}")
        else:
            deferred.append(msg)
    else:
        print("  OK")

    # 3. Fix next.config.js
    print("\nChecking next.config.js...")
    cfg_issues = find_nextconfig_issues()
    if cfg_issues:
        all_findings.extend([{**i, "grade": "C", "type": "next.config.js"} for i in cfg_issues])
        success, msg = fix_nextconfig(cfg_issues)
        if success:
            implemented.append(msg)
            print(f"  ✓ {msg}")
        else:
            deferred.append(msg)
    else:
        print("  OK")

    # Grade unknown findings as deferred
    for item in all_findings:
        if not any(item.get("file", "") in impl for impl in implemented):
            if item.get("type") not in ["console.log", ".gitignore", "next.config.js"]:
                deferred.append(f"Grade {item.get('grade','D')}: {item.get('content', item.get('type'))}")

    # Commit
    if implemented:
        print(f"\nCommitting {len(implemented)} fixes...")
        if commit_changes(implemented):
            print("  ✓ Committed and pushed")
        else:
            print("  ⚠ Commit failed")

    update_plan(all_findings, implemented, deferred)

    print(f"\nDone: implemented={len(implemented)}, deferred={len(deferred)}")
    print(f"Plan updated: {PLAN}")


if __name__ == "__main__":
    main()
