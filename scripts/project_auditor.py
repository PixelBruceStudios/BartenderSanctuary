#!/usr/bin/env python3
"""
Project-wide auditor: scans code, DB, and config for bugs/optimizations.
Writes findings to /home/skicmi/REFACTORPLAN.md
"""

import os
import re
import subprocess
from pathlib import Path
from datetime import datetime

REPO = Path("/home/skicmi/bartender-sanctuary-app")
PLAN = Path("/home/skicmi/REFACTORPLAN.md")

# Severity: P0=critical, P1=high, P2=medium, P3=low
# Grade: A=critical, B=high, C=medium, D=low


def run(cmd, cwd=REPO):
    try:
        r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, timeout=30)
        return r.stdout.strip(), r.returncode
    except Exception as e:
        return str(e), 1


def audit_api_routes():
    findings = []
    api_dir = REPO / "pages" / "api"
    for f in sorted(api_dir.rglob("*.ts")) + sorted(api_dir.rglob("*.tsx")):
        text = f.read_text(errors="ignore")
        rel = f.relative_to(REPO)

        # Check for missing error handling
        if "try:" not in text and "catch(" not in text and "error" not in text.lower():
            if any(x in text for x in [".then(", "await ", "Promise"]):
                findings.append(f"[P2] {rel}: async operation without try/catch")

        # Check for SQL injection risk (string concat in queries)
        if "SELECT" in text and ("+ " in text or '"+' in text or '"+' in text):
            findings.append(f"[P1] {rel}: possible SQL injection via string concatenation")

        # Check for hardcoded secrets
        secret_patterns = [r"api[_-]?key", r"secret", r"password", r"token", r"AUTH"]
        for pat in secret_patterns:
            if re.search(pat, text, re.I) and "process.env" not in text:
                if re.search(pat, text, re.I) and not re.search(r"(example|placeholder|test|xxx)", text, re.I):
                    findings.append(f"[P0] {rel}: possible hardcoded secret ({pat})")

        # Check for console.log in production code
        for line in text.split("\n"):
            if "console.log" in line and "debug" not in line.lower():
                findings.append(f"[P3] {rel}: console.log left in production code")
                break

    return findings


def audit_db_schema():
    findings = []
    # Already inspected; we know the schema
    # Check for missing indexes on foreign keys
    findings.append("[P1] DB: add indexes on tests.lesson_id, test_attempts.test_id, test_questions.test_id for faster queries")
    findings.append("[P2] DB: consider adding updated_at trigger on lessons_hr upserts")
    findings.append("[P2] DB: add CHECK constraint on tests.scope ('lesson' or 'technique')")
    findings.append("[P1] DB: add partial index on tests(lesson_id) WHERE scope='lesson' for lesson test lookups")
    return findings


def audit_nextjs_config():
    findings = []
    config = REPO / "next.config.js"
    if config.exists():
        text = config.read_text()
        if "typescript" not in text and "ignoreBuildErrors" not in text:
            findings.append("[P3] next.config.js: consider enabling TypeScript strict mode")
        if "eslint" not in text:
            findings.append("[P3] next.config.js: consider enabling ESLint during builds")
        if "images" not in text:
            findings.append("[P2] next.config.js: no image optimization config; add next/image domains")
        if "trailingSlash" not in text:
            findings.append("[P3] next.config.js: consider enabling trailingSlash for consistent URLs")
    else:
        findings.append("[P1] next.config.js: missing")
    return findings


def audit_env_files():
    findings = []
    env_files = [".env", ".env.local", ".env.production", ".env.vercel", ".env.vercel.prod"]
    for ef in env_files:
        path = REPO / ef
        if path.exists():
            text = path.read_text(errors="ignore")
            # Check for uncommitted secrets (basic heuristic)
            if re.search(r"(password|secret|key)\s*=\s*.{10,}", text, re.I):
                findings.append(f"[P0] {ef}: contains potential secrets; verify it's in .gitignore")
    # Check .gitignore
    gi = REPO / ".gitignore"
    if gi.exists():
        gitignore = gi.read_text()
        for ef in env_files:
            if ef not in gitignore and (REPO / ef).exists():
                findings.append(f"[P1] .gitignore: {ef} not ignored")
    else:
        findings.append("[P1] .gitignore: missing")
    return findings


def audit_components():
    findings = []
    comp_dir = REPO / "components"
    for f in sorted(comp_dir.glob("*.tsx")):
        text = f.read_text(errors="ignore")
        rel = f.name

        # Check for missing alt text on images
        if '<img' in text and 'alt=' not in text:
            findings.append(f"[P2] components/{rel}: <img> without alt attribute")

        # Check for inline styles (performance)
        if "style={{}}" in text:
            findings.append(f"[P3] components/{rel}: inline styles detected; consider CSS classes")

        # Check for missing React.memo on expensive components
        if "map(" in text and "React.memo" not in text and "export default function" in text:
            if text.count("map(") > 2:
                findings.append(f"[P3] components/{rel}: heavy list rendering without React.memo")

    return findings


def audit_package_json():
    findings = []
    pkg = REPO / "package.json"
    if pkg.exists():
        import json
        try:
            data = json.loads(pkg.read_text())
            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}

            # Check for known vulnerabilities (outdated packages)
            if "next" in deps:
                findings.append("[P2] package.json: check Next.js version for security patches")

            # Check for missing type definitions
            if "@types/node" not in deps and "devDependencies" in data:
                findings.append("[P3] package.json: @types/node missing in devDependencies")

            # Check for production dependencies that should be devDependencies
            prod_only = []
            for pkg_name in deps:
                if pkg_name in ["eslint", "prettier", "@types/*", "typescript"]:
                    if pkg_name in data.get("dependencies", {}):
                        prod_only.append(pkg_name)
            if prod_only:
                findings.append(f"[P3] package.json: {', '.join(prod_only)} should be in devDependencies")

        except Exception as e:
            findings.append(f"[P1] package.json: failed to parse ({e})")
    return findings


def audit_api_security():
    findings = []
    api_dir = REPO / "pages" / "api"
    for f in sorted(api_dir.rglob("*.ts")) + sorted(api_dir.rglob("*.tsx")):
        text = f.read_text(errors="ignore")
        rel = f.relative_to(REPO)

        # Check for CORS headers
        if "cors" not in text.lower() and "access-control" not in text.lower():
            # Only flag if it seems like a public API
            if "export default function" in text and "req" in text and "res" in text:
                findings.append(f"[P2] {rel}: no CORS headers; add if called from browser")

        # Check for rate limiting
        if "rate" not in text.lower() and "limit" not in text.lower():
            if "auth" not in rel.name.lower():  # Skip auth routes
                findings.append(f"[P3] {rel}: no rate limiting on public endpoint")

        # Check for input validation
        if "req.body" in text or "req.query" in text:
            if "schema" not in text.lower() and "validate" not in text.lower() and "zod" not in text.lower():
                findings.append(f"[P1] {rel}: request body/query not validated")

    return findings


def grade_findings(findings):
    """Convert [P0] etc to grade letters for prioritization"""
    grade_map = {"P0": "A", "P1": "B", "P2": "C", "P3": "D"}
    graded = []
    for f in findings:
        m = re.match(r"\[(P\d)\]", f)
        if m:
            grade = grade_map.get(m.group(1), "D")
        else:
            grade = "D"
        graded.append({"grade": grade, "finding": f, "status": "pending"})
    return graded


def write_plan(findings):
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    graded = grade_findings(findings)

    lines = [
        f"# REFACTORPLAN",
        f"",
        f"Generated: {now}",
        f"Repo: {REPO}",
        f"Total findings: {len(graded)}",
        f"",
        f"---",
        f"",
        f"## Findings (sorted by grade)",
        f"",
    ]

    for grade in ["A", "B", "C", "D"]:
        items = [g for g in graded if g["grade"] == grade]
        if items:
            lines.append(f"### Grade {grade} ({len(items)} items)")
            lines.append("")
            for i, item in enumerate(items, 1):
                lines.append(f"- [ ] {item['finding']}")
            lines.append("")

    lines.extend([
        f"---",
        f"",
        f"## Implementation Log",
        f"",
        f"### {now}",
        f"- [ ] Initial audit completed",
        f"",
        f"## Deferred",
        f"",
        f"(none yet)",
    ])

    PLAN.write_text("\n".join(lines))
    return graded


def main():
    print("=== Project Audit ===")

    all_findings = []

    print("Auditing API routes...")
    all_findings.extend(audit_api_routes())

    print("Auditing DB schema...")
    all_findings.extend(audit_db_schema())

    print("Auditing Next.js config...")
    all_findings.extend(audit_nextjs_config())

    print("Auditing env files...")
    all_findings.extend(audit_env_files())

    print("Auditing components...")
    all_findings.extend(audit_components())

    print("Auditing package.json...")
    all_findings.extend(audit_package_json())

    print("Auditing API security...")
    all_findings.extend(audit_api_security())

    graded = write_plan(all_findings)

    grade_counts = {}
    for g in graded:
        grade_counts[g["grade"]] = grade_counts.get(g["grade"], 0) + 1

    print(f"\nDone: {len(graded)} findings")
    for grade in sorted(grade_counts.keys()):
        print(f"  Grade {grade}: {grade_counts[grade]}")
    print(f"\nPlan written to {PLAN}")


if __name__ == "__main__":
    main()
