#!/usr/bin/env python3
"""
Translate EN lessons -> HR (Croatian), quality-check, then upsert into lessons_hr.
Idempotent: skips lessons that already have an HR row.
"""
import json
import os
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path

import psycopg2
from deep_translator import GoogleTranslator
from spellchecker import SpellChecker

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

TRANSLATE_LANG = 'hr'
SPELL_LANG = 'hr'
MAX_LESSONS_PER_RUN = 6
MIN_WORD_COUNT = 3
MAX_UNKNOWN_RATIO = 0.18

# Quality thresholds
MIN_DIACRITIC_RATIO = 0.015  # Croatian text should contain some diacritics
MAX_ENGLISH_RATIO = 0.25     # fail if >25% of words look English
MIN_LENGTH_RATIO = 0.5       # HR should be at least half the EN length
MAX_LENGTH_RATIO = 3.0       # HR should not be 3x longer than EN

try:
    spell_hr = SpellChecker(language=TRANSLATE_LANG)
except Exception:
    print("WARNING: Croatian spellchecker dictionary not found; falling back to English (weak signal).")
    spell_hr = SpellChecker(language='en')

_translation_cache: dict[str, str] = {}


def translate_text(text: str) -> str:
    if not text or not text.strip():
        return text
    if text in _translation_cache:
        return _translation_cache[text]
    try:
        translated = GoogleTranslator(source='en', target=TRANSLATE_LANG).translate(text)
        translated = translated or text
    except Exception as e:
        print(f"  translate failed: {e}; using original")
        translated = text
    _translation_cache[text] = translated
    return translated


def diacritic_ratio(text: str) -> float:
    diacritics = re.findall(r"[čćžšđČĆŽŠĐ]", text)
    words = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿŠšŽžĆćĐđ]+", text)
    if not words:
        return 0.0
    return len(diacritics) / len(words)


def english_word_ratio(text: str) -> float:
    # Words that look like plain English (no diacritics, ASCII only)
    words = re.findall(r"[A-Za-z]{3,}", text)
    if not words:
        return 0.0
    # Common Croatian words that happen to be ASCII
    croatian_ascii = {
        'i', 'u', 'na', 'za', 'od', 'do', 'su', 'sa', 'se', 'da', 'je',
        'koji', 'koja', 'koje', 'kroz', 'barem', 'više', 'kako', 'što',
        'ovo', 'ona', 'oni', 'one', 'jer', 'ili', 'ali', 'ako', 'pa',
        'bar', 'može', 'mogu', 'treba', 'trebaju', 'biti', 'imaju',
    }
    english_looking = [w for w in words if w.lower() not in croatian_ascii]
    return len(english_looking) / len(words)


def length_ratio(original: str, translated: str) -> float:
    if not original:
        return 1.0
    return len(translated) / len(original)


def spell_check_passed(text: str) -> bool:
    words = [w.lower() for w in re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿŠšŽžĆćĐđ]+", text)]
    words = [w for w in words if len(w) >= MIN_WORD_COUNT]
    if not words:
        return True
    unknowns = [w for w in spell_hr.unknown(words) if len(w) >= MIN_WORD_COUNT]
    ratio = len(unknowns) / len(words)
    if ratio > MAX_UNKNOWN_RATIO:
        print(f"  spell-check flagged {len(unknowns)}/{len(words)} unknown ({ratio:.0%})")
        return False
    return True


def quality_check_passed(original: str, translated: str) -> tuple[bool, str]:
    """Returns (passed, reason)."""
    if not translated or not translated.strip():
        return False, "empty translation"

    ratio = length_ratio(original, translated)
    if ratio < MIN_LENGTH_RATIO:
        return False, f"too short (ratio {ratio:.2f})"
    if ratio > MAX_LENGTH_RATIO:
        return False, f"too long (ratio {ratio:.2f})"

    en_ratio = english_word_ratio(translated)
    if en_ratio > MAX_ENGLISH_RATIO:
        return False, f"too many English-looking words ({en_ratio:.0%})"

    diac_ratio = diacritic_ratio(translated)
    if diac_ratio < MIN_DIACRITIC_RATIO and len(translated) > 200:
        return False, f"too few Croatian diacritics ({diac_ratio:.3f})"

    return True, "ok"


@dataclass
class LessonRow:
    id: str
    technique_id: str
    slug: str
    title: str
    description: str
    content: str


def fetch_pending_lessons(cur, limit: int) -> list[LessonRow]:
    cur.execute(
        """
        SELECT l.id, l.technique_id, l.slug, l.title, l.description, l.content
        FROM lessons l
        LEFT JOIN lessons_hr lhr
          ON lhr.technique_id = l.technique_id AND lhr.slug = l.slug
        WHERE lhr.id IS NULL
        ORDER BY l.id
        LIMIT %s
        """,
        (limit,),
    )
    rows = cur.fetchall()
    return [
        LessonRow(id=r[0], technique_id=r[1], slug=r[2], title=r[3], description=r[4], content=r[5])
        for r in rows
    ]


def upsert_hr(cur, lesson: LessonRow, hr_title: str, hr_description: str, hr_content: str) -> None:
    cur.execute(
        """
        INSERT INTO lessons_hr (technique_id, slug, title, description, duration, difficulty, content, sort_order)
        SELECT technique_id, slug, %s, %s, duration, difficulty, %s, sort_order
        FROM lessons
        WHERE id = %s
        ON CONFLICT (technique_id, slug)
        DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            content = EXCLUDED.content,
            updated_at = now()
        """,
        (hr_title, hr_description, hr_content, lesson.id),
    )


def run_once() -> tuple[int, int, int, list[str]]:
    """Returns (translated, skipped, failed, log_lines)."""
    log: list[str] = []
    with open(PASS_FILE) as f:
        password = f.read().strip()

    conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
    cur = conn.cursor()

    pending = fetch_pending_lessons(cur, MAX_LESSONS_PER_RUN)
    translated = 0
    skipped = 0
    failed = 0

    for lesson in pending:
        log.append(f"→ {lesson.slug} ({lesson.title[:40]})")
        hr_title = translate_text(lesson.title)
        hr_description = translate_text(lesson.description)
        hr_content = translate_text(lesson.content)

        combined = f"{hr_title}\n{hr_description}\n{hr_content}"

        ok, reason = quality_check_passed(lesson.content, combined)
        if not ok:
            failed += 1
            log.append(f"  ✗ quality check failed: {reason}")
            continue

        if not spell_check_passed(combined):
            failed += 1
            log.append(f"  ✗ spell-check failed; skipping")
            continue

        try:
            upsert_hr(cur, lesson, hr_title, hr_description, hr_content)
            translated += 1
            log.append(f"  ✓ injected")
        except Exception as e:
            failed += 1
            log.append(f"  ✗ DB upsert failed: {e}")

        time.sleep(0.3)

    conn.commit()
    cur.close()
    conn.close()
    return translated, skipped, failed, log


if __name__ == '__main__':
    print("=== lesson translation run ===")
    done, skipped, failed, log = run_once()
    print("\n".join(log))
    print(f"Done: translated={done} skipped={skipped} failed={failed}")
