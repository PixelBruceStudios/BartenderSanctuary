#!/usr/bin/env python3
"""
Croatian lesson quality audit and auto-fix loop.
Reads every lesson + its Croatian translation, validates quality,
and re-translates/fixes any that fail.
"""
import os
import re
import time
import psycopg2
from typing import Optional
from dataclasses import dataclass

from deep_translator import GoogleTranslator

# Allow importing hr_glossary from the same scripts/ directory
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).resolve().parent))
from hr_glossary import HR_GLOSSARY, apply_glossary  # noqa: E402

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
DB_HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
DB_NAME = "BartenderSanctuary"
DB_USER = "neondb_owner"
TRANSLATE_LANG = "hr"
MAX_CHARS = 4500

# Quality thresholds
MIN_DIACRITIC_RATIO = 0.015
MIN_LENGTH_RATIO = 0.5
MAX_LENGTH_RATIO = 3.0

# AI artifact patterns
AI_ARTIFACT_PATTERNS = [
    r"as an ai",
    r"as a language model",
    r"i cannot",
    r"i don'?t have personal",
    r"i'?m not able to",
    r"as an assistant",
    r"my knowledge cutoff",
    r"i don'?t have access to",
    r"i'?m sorry",
    r"i cannot provide",
    r"i cannot assist",
    r"as an artificial intelligence",
    r"as a large language model",
]

# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------
PASS_FILE = os.path.expanduser("~/Desktop/NeonDbPass")


def get_conn():
    with open(PASS_FILE) as f:
        password = f.read().strip()
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=password,
        sslmode="require",
    )


@dataclass
class LessonRow:
    id: str
    technique_id: str
    slug: str
    title: str
    description: str
    content: str


@dataclass
class LessonHRRow:
    technique_id: str
    slug: str
    title: str
    description: str
    content: str


def fetch_all_lessons(cur) -> list[LessonRow]:
    cur.execute(
        """
        SELECT id, technique_id, slug, title, description, content
        FROM lessons
        ORDER BY id
        """
    )
    return [
        LessonRow(id=r[0], technique_id=r[1], slug=r[2], title=r[3], description=r[4], content=r[5])
        for r in cur.fetchall()
    ]


def fetch_hr_lesson(cur, technique_id: str, slug: str) -> Optional[LessonHRRow]:
    cur.execute(
        """
        SELECT technique_id, slug, title, description, content
        FROM lessons_hr
        WHERE technique_id = %s AND slug = %s
        """,
        (technique_id, slug),
    )
    r = cur.fetchone()
    if not r:
        return None
    return LessonHRRow(technique_id=r[0], slug=r[1], title=r[2], description=r[3], content=r[4])


def upsert_hr(cur, lesson: LessonRow, hr_title: str, hr_description: str, hr_content: str) -> None:
    cur.execute(
        """
        INSERT INTO lessons_hr (id, technique_id, slug, title, description, duration, difficulty, content, sort_order)
        SELECT id, technique_id, slug, %s, %s, duration, difficulty, %s, sort_order
        FROM lessons
        WHERE id = %s
        ON CONFLICT (technique_id, slug)
        DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            content = EXCLUDED.content
        """,
        (hr_title, hr_description, hr_content, lesson.id),
    )


# ---------------------------------------------------------------------------
# Translation
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
_translation_cache: dict[str, str] = {}


def chunk_text(text: str, max_chars: int = MAX_CHARS) -> list[str]:
    if len(text) <= max_chars:
        return [text]
    parts: list[str] = []
    current = ""
    # First pass: respect paragraph boundaries
    for para in text.split("\n\n"):
        para = para.strip()
        if not para:
            continue
        candidate = f"{current}\n\n{para}" if current else para
        if len(candidate) <= max_chars:
            current = candidate
            continue
        if current:
            parts.append(current)
            current = ""
        # If a single paragraph is still too long, split by sentences
        if len(para) > max_chars:
            sentences = re.split(r"(?<=[.!?])\s+", para)
            buf = ""
            for s in sentences:
                sc = f"{buf}\n\n{s}" if buf else s
                if len(sc) > max_chars and buf:
                    parts.append(buf)
                    buf = s
                else:
                    buf = sc
            if buf:
                current = buf
        else:
            current = para
    if current:
        parts.append(current)
    # Second pass: hard-split anything still over max_chars by character
    result: list[str] = []
    for p in parts:
        if len(p) <= max_chars:
            result.append(p)
        else:
            for i in range(0, len(p), max_chars):
                result.append(p[i : i + max_chars])
    return result


def translate_text(text: str) -> str:
    if not text or not text.strip():
        return text
    if text in _translation_cache:
        return _translation_cache[text]
    chunks = chunk_text(text)
    translated_chunks: list[str] = []
    try:
        for chunk in chunks:
            tr = GoogleTranslator(source="en", target=TRANSLATE_LANG).translate(chunk)
            translated_chunks.append(tr or chunk)
            time.sleep(0.2)
        translated = "\n\n".join(translated_chunks)
    except Exception as e:
        print(f"  translate failed: {e}; using original")
        translated = text
    translated = apply_glossary(translated)
    _translation_cache[text] = translated
    return translated


# ---------------------------------------------------------------------------
# Quality checks
# ---------------------------------------------------------------------------
def length_ratio(original: str, translated: str) -> float:
    if not original:
        return 1.0
    return len(translated) / len(original)


def diacritic_ratio(text: str) -> float:
    diacritics = re.findall(r"[šđčćžŠĐČĆŽ]", text)
    words = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿŠšŽžĆćĐđ]+", text)
    if not words:
        return 0.0
    return len(diacritics) / len(words)


def has_ai_artifacts(text: str) -> list[str]:
    lowered = text.lower()
    found = []
    for pattern in AI_ARTIFACT_PATTERNS:
        if re.search(pattern, lowered):
            found.append(pattern)
    return found


def quality_check_passed(original: str, translated: str) -> tuple[bool, str]:
    if not translated or not translated.strip():
        return False, "empty translation"
    if len(translated) < 50:
        return False, "too short"
    ratio = length_ratio(original, translated)
    if ratio < MIN_LENGTH_RATIO:
        return False, f"too short (ratio {ratio:.2f})"
    if ratio > MAX_LENGTH_RATIO:
        return False, f"too long (ratio {ratio:.2f})"
    diac_ratio = diacritic_ratio(translated)
    if diac_ratio < MIN_DIACRITIC_RATIO and len(translated) > 200:
        return False, f"too few Croatian diacritics ({diac_ratio:.3f})"
    artifacts = has_ai_artifacts(translated)
    if artifacts:
        return False, f"AI artifacts detected: {', '.join(artifacts[:3])}"
    return True, "ok"


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------
def main():
    conn = get_conn()
    cur = conn.cursor()
    try:
        lessons = fetch_all_lessons(cur)
        print(f"=== Croatian lesson audit ===")
        print(f"Total lessons: {len(lessons)}\n")

        audited = 0
        fixed = 0
        skipped = 0
        failed = 0

        for lesson in lessons:
            hr = fetch_hr_lesson(cur, lesson.technique_id, lesson.slug)
            if not hr:
                print(f"→ {lesson.slug} ({lesson.title[:40]})")
                print(f"  no Croatian translation; skipping (will be handled by translation cron)")
                skipped += 1
                continue

            audited += 1
            ok, reason = quality_check_passed(lesson.content, hr.content)
            if ok:
                print(f"✓ {lesson.slug} ({hr.title[:40]}) — OK")
                continue

            print(f"✗ {lesson.slug} ({hr.title[:40]}) — {reason}")
            # Re-translate
            hr_title = translate_text(lesson.title)
            hr_description = translate_text(lesson.description)
            hr_content = translate_text(lesson.content)

            ok2, reason2 = quality_check_passed(lesson.content, hr_content)
            if not ok2:
                print(f"  re-translate failed: {reason2}; keeping original")
                failed += 1
                continue

            upsert_hr(cur, lesson, hr_title, hr_description, hr_content)
            conn.commit()
            print(f"  → fixed and updated")
            fixed += 1
            time.sleep(0.3)

        print(f"\nDone: audited={audited} fixed={fixed} skipped={skipped} failed={failed}")
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
