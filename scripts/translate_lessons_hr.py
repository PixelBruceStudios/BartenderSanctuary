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

# Allow importing hr_glossary from the same scripts/ directory
sys.path.append(str(Path(__file__).resolve().parent))
from hr_glossary import HR_GLOSSARY, apply_glossary  # noqa: E402

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
MIN_LENGTH_RATIO = 0.5       # HR should be at least half the EN length
MAX_LENGTH_RATIO = 3.0       # HR should not be 3x longer than EN


def _bootstrap_glossary_terms(spell_hr: SpellChecker) -> None:
    # The Croatian dictionary bundled with pyspellchecker is incomplete, so we
    # supplement it directly. Common bar terms stay in English by design; we
    # also inject the most frequent Croatian words that Google Translate
    # routinely produces and that the bundled dict otherwise flags.
    additions = {
        # Bar / technique terms kept in English (also present in HR_GLOSSARY).
        "highball",
        "rocks",
        "coupe",
        "martini",
        "champagne",
        "flute",
        "wine",
        "shot",
        "hurricane",
        "collins",
        "tiki",
        "pousse",
        "cafe",
        "irish",
        "coffee",
        "julep",
        "copper",
        "mug",
        "stirred",
        "shaken",
        "shaking",
        "muddled",
        "muddling",
        "sours",
        "highballs",
        "fizzes",
        "collinses",
        "mezcal",
        "tequila",
        "rum",
        "vodka",
        "gin",
        "whiskey",
        "whisky",
        "bourbon",
        "scotch",
        "blanco",
        "reposado",
        "añejo",
        "campari",
        "aperol",
        "amaro",
        "cointreau",
        "falernum",
        "bitters",
        "syrup",
        "vermouth",
        "chartreuse",
        "triple",
        "sec",
        "orgeat",
        "absinthe",
        # Croatian words commonly seen in translated lesson content.
        "doba",
        "leda",
        "baza",
        "modifikator",
        "naglasak",
        "higijena",
        "sigurnost",
        "hrane",
        "profila",
        "okusa",
        "taverne",
        "saloni",
        "američki",
        "pokret",
        "mitologije",
        "arhitektura",
        "pića",
        "barmeni",
        "izmislili",
        "potpuno",
        "novu",
        "baze",
        "alkoholnih",
        "ruma",
        "umjesto",
        "prilagođavanja",
        "postojećih",
        "formata",
        "koktela",
        "temi",
        "mitologiji",
        "miješano",
        "uz",
        "prskanje",
        "vodom",
        "od",
        "s",
    }
    for word in additions:
        spell_hr.word_frequency._dictionary[word] = 1


spell_hr = SpellChecker(language=TRANSLATE_LANG)
print("Croatian spell-check active.")
_bootstrap_glossary_terms(spell_hr)

_translation_cache: dict[str, str] = {}


@dataclass
class LessonRow:
    id: str
    technique_id: str
    slug: str
    title: str
    description: str
    content: str


def chunk_text(text: str, max_chars: int = 4500) -> list[str]:
    """Split long text into chunks that stay under the translator limit."""
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
            sentences = re.split(r'(?<=[.!?])\s+', para)
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
                result.append(p[i:i + max_chars])
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
    if spell_hr is None:
        return True
    words = [w.lower() for w in re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿŠšŽžĆćĐđ]+", text)]
    words = [w for w in words if len(w) >= MIN_WORD_COUNT]
    if not words:
        return True

    # Professional bar terms are intentionally preserved as English in Croatian
    # translations. Exclude known glossary tokens (and exact lowercased forms) so
    # they are not treated as spelling errors.
    bar_terms = {t.lower() for t in HR_GLOSSARY.keys()}
    spell_words = [w for w in words if w not in bar_terms]
    if not spell_words:
        return True

    unknowns = [w for w in spell_hr.unknown(spell_words)]
    unknowns = [w for w in unknowns if len(w) >= MIN_WORD_COUNT]
    ratio = len(unknowns) / len(spell_words)
    if ratio > MAX_UNKNOWN_RATIO:
        print(f"  spell-check flagged {len(unknowns)}/{len(spell_words)} unknown ({ratio:.0%})")
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

    diac_ratio = diacritic_ratio(translated)
    if diac_ratio < MIN_DIACRITIC_RATIO:
        return False, f"too few Croatian diacritics ({diac_ratio:.3f})"

    if spell_hr is not None and not spell_check_passed(translated):
        return False, "spell-check failed"

    return True, "ok"


def fetch_pending_lessons(cur, limit: int) -> list[LessonRow]:
    cur.execute(
        """
        SELECT l.id, l.technique_id, l.slug, l.title, l.description, l.content
        FROM lessons l
        LEFT JOIN lessons_hr lhr ON lhr.technique_id = l.technique_id AND lhr.slug = l.slug
        WHERE lhr.id IS NULL
        ORDER BY l.created_at ASC
        LIMIT %s
        """,
        (limit,),
    )
    return [LessonRow(*r) for r in cur.fetchall()]


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
        hr_title = translate_text(lesson.title)
        hr_description = translate_text(lesson.description)
        hr_content = translate_text(lesson.content)

        ok1, reason1 = quality_check_passed(lesson.title, hr_title)
        ok2, reason2 = quality_check_passed(lesson.description, hr_description)
        ok3, reason3 = quality_check_passed(lesson.content, hr_content)

        if not (ok1 and ok2 and ok3):
            reasons = [r for ok, r in [(ok1, reason1), (ok2, reason2), (ok3, reason3)] if not ok]
            log.append(f"✗ {lesson.slug} ({lesson.title}) — {'; '.join(reasons)}")
            failed += 1
            continue

        upsert_hr(cur, lesson, hr_title, hr_description, hr_content)
        conn.commit()
        log.append(f"✓ {lesson.slug} ({lesson.title})")
        translated += 1
        time.sleep(0.3)

    cur.close()
    conn.close()
    return translated, skipped, failed, log


def main() -> None:
    translated, skipped, failed, log = run_once()
    print(f"=== lesson translation run ===")
    for line in log:
        print(line)
    print(f"Done: translated={translated} skipped={skipped} failed={failed}")


if __name__ == "__main__":
    main()
