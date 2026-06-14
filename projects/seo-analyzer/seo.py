#!/usr/bin/env python3
"""SEO Analyzer CLI - analyze webpages for SEO best practices."""

import argparse
import sys
import re
import json
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
from typing import Optional, Dict, List, Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="seo",
        description="SEO Analyzer CLI - analyze webpages for SEO best practices.",
    )
    parser.add_argument(
        "target",
        nargs="?",
        help="URL or local HTML file path to analyze",
    )
    parser.add_argument(
        "-o", "--output",
        choices=["text", "json", "markdown"],
        default="text",
        help="Output format (default: text)",
    )
    parser.add_argument(
        "--no-color",
        action="store_true",
        help="Disable colored output",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=15,
        help="Request timeout in seconds (default: 15)",
    )
    parser.add_argument(
        "--user-agent",
        default="SEO-Analyzer/1.0",
        help="User-Agent header for HTTP requests",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose output",
    )
    return parser.parse_args()


def is_url(target: str) -> bool:
    try:
        parsed = urlparse(target)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False


def read_local_file(path: str) -> str:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"File not found: {path}")
    return p.read_text(encoding="utf-8")


def fetch_url(url: str, timeout: int = 15, user_agent: str = "SEO-Analyzer/1.0") -> str:
    import urllib.request
    req = urllib.request.Request(
        url,
        headers={"User-Agent": user_agent},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, errors="replace")


def check_title(html: str) -> Dict[str, Any]:
    match = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    text = match.group(1).strip() if match else ""
    length = len(text)
    return {
        "check": "title",
        "status": "pass" if 30 <= length <= 60 else "warn" if text else "fail",
        "message": f"Title length: {length} chars (recommended 30-60)",
        "value": text,
    }


def check_meta_description(html: str) -> Dict[str, Any]:
    match = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']',
        html,
        re.IGNORECASE,
    )
    text = match.group(1).strip() if match else ""
    length = len(text)
    return {
        "check": "meta_description",
        "status": "pass" if 120 <= length <= 160 else "warn" if text else "fail",
        "message": f"Meta description length: {length} chars (recommended 120-160)",
        "value": text,
    }


def check_h1(html: str) -> Dict[str, Any]:
    matches = re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.IGNORECASE | re.DOTALL)
    count = len(matches)
    text = " ".join(m.strip() for m in matches) if matches else ""
    return {
        "check": "h1",
        "status": "pass" if count == 1 else "warn" if count == 0 else "fail",
        "message": f"H1 tags found: {count} (recommended exactly 1)",
        "value": text,
    }


def check_canonical(html: str) -> Dict[str, Any]:
    match = re.search(
        r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']',
        html,
        re.IGNORECASE,
    )
    url = match.group(1).strip() if match else ""
    return {
        "check": "canonical",
        "status": "pass" if url else "fail",
        "message": "Canonical URL present" if url else "Missing canonical URL",
        "value": url,
    }


def check_images_alt(html: str) -> Dict[str, Any]:
    imgs = re.findall(r"<img[^>]+>", html, re.IGNORECASE)
    missing_alt = [img for img in imgs if not re.search(r'\balt\s*=', img, re.IGNORECASE)]
    total = len(imgs)
    missing = len(missing_alt)
    return {
        "check": "images_alt",
        "status": "pass" if missing == 0 and total > 0 else "warn" if total == 0 else "fail",
        "message": f"Images missing alt text: {missing}/{total}",
        "value": f"{total} images",
    }


def run_checks(html: str) -> List[Dict[str, Any]]:
    return [
        check_title(html),
        check_meta_description(html),
        check_h1(html),
        check_canonical(html),
        check_images_alt(html),
    ]


def format_text(results: List[Dict[str, Any]], verbose: bool = False) -> str:
    lines = ["SEO Analysis Results", "=" * 40]
    for r in results:
        symbol = {"pass": "✓", "warn": "!", "fail": "✗"}.get(r["status"], "?")
        lines.append(f"{symbol} {r['check']}: {r['message']}")
        if verbose and r.get("value"):
            lines.append(f"  -> {r['value']}")
    return "\n".join(lines)


def format_json(results: List[Dict[str, Any]]) -> str:
    payload = {
        "analyzed_at": datetime.now().isoformat(),
        "results": results,
        "summary": {
            "pass": sum(1 for r in results if r["status"] == "pass"),
            "warn": sum(1 for r in results if r["status"] == "warn"),
            "fail": sum(1 for r in results if r["status"] == "fail"),
        },
    }
    return json.dumps(payload, indent=2)


def format_markdown(results: List[Dict[str, Any]]) -> str:
    lines = ["# SEO Analysis Report", "", f"Generated: {datetime.now().isoformat()}", ""]
    for r in results:
        symbol = {"pass": "PASS", "warn": "WARN", "fail": "FAIL"}.get(r["status"], "UNKNOWN")
        lines.append(f"## {r['check']} ({symbol})")
        lines.append("")
        lines.append(r["message"])
        if r.get("value"):
            lines.append("")
            lines.append(f"Value: {r['value']}")
        lines.append("")
    return "\n".join(lines)


def write_report(content: str, target: str, fmt: str) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe = re.sub(r"[^a-zA-Z0-9_-]+", "_", target)[:50]
    out = Path(".") / f"seo_report_{safe}_{ts}.{fmt}"
    out.write_text(content, encoding="utf-8")
    return out


def main() -> int:
    args = parse_args()

    if not args.target:
        print("Error: target URL or file path is required.", file=sys.stderr)
        return 1

    try:
        if is_url(args.target):
            html = fetch_url(args.target, timeout=args.timeout, user_agent=args.user_agent)
        else:
            html = read_local_file(args.target)
    except Exception as exc:
        print(f"Error fetching target: {exc}", file=sys.stderr)
        return 1

    results = run_checks(html)

    if args.output == "text":
        content = format_text(results, verbose=args.verbose)
    elif args.output == "json":
        content = format_json(results)
    elif args.output == "markdown":
        content = format_markdown(results)
    else:
        content = format_text(results)

    print(content)

    out_path = write_report(content, args.target, args.output)
    print(f"\nReport saved: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
