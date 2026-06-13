#!/usr/bin/env python3
"""
Cleanup known bad Croatian bar-term translations from lessons_hr.
Reverts mistranslated technique/ingredient/spirit terms back to English.
"""
import os
import re

import psycopg2

PASS_FILE = os.path.expanduser("~/Desktop/NeonDbPass")
HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
DB = "BartenderSanctuary"
USER = "neondb_owner"

# Known bad Croatian translations that should be reverted to English
BAD_HR_TERMS = {
    "miješano": "stirred",
    "uz prskanje leda": "shaken",
    "prskanje leda": "shaking",
    "mudlano": "muddled",
    "mudlanje": "muddling",
    "biters": "bitters",
    "limunada": "simple syrup",
    "vermut": "vermouth",
    "suhi vermut": "dry vermouth",
    "slatki vermut": "sweet vermouth",
    "šartrez": "chartreuse",
    "tripel sek": "triple sec",
    "oržat": "orgeat",
    "pus kafe": "pousse café",
    "irski kafa": "irish coffee",
    "viski": "whiskey",
    "burbon": "bourbon",
    "skotski viski": "scotch",
    "kampari": "campari",
    "kuantru": "cointreau",
    "votka": "vodka",
    "đin": "gin",
    "tekila": "tequila",
    "kupasta čaša": "martini glass",
    "čaša visoki balon": "highball glass",
    "čaša na kockama": "rocks glass",
    "čaša old fashioned": "old fashioned glass",
    "čahura za šampanjac": "champagne flute",
    "čaša za vino": "wine glass",
    "čašica": "shot glass",
    "kup za julep": "julep cup",
    "bakarana mugla": "copper mug",
    "čaša hurikan": "hurricane glass",
    "čaša kolins": "collins glass",
    "tiki čaša": "tiki glass",
    "čaša pus kafe": "pousse cafe glass",
    "irski kafa": "irish coffee glass",
    "kupa": "coupe",
    "čahura": "flute",
    "hurikan": "hurricane",
    "kolins": "collins",
    "mugla": "mule",
}


def fix_bad_terms(text: str) -> str:
    if not text:
        return text
    result = text
    for bad, good in BAD_HR_TERMS.items():
        # Use word-boundary matching, case-insensitive
        pattern = re.compile(r"\b" + re.escape(bad) + r"\b", re.IGNORECASE)
        result = pattern.sub(good, result)
    return result


with open(PASS_FILE) as f:
    password = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode="require")
cur = conn.cursor()

cur.execute("SELECT id, title, description, content FROM lessons_hr")
rows = cur.fetchall()

updated = 0
skipped = 0

for row_id, title, description, content in rows:
    new_title = fix_bad_terms(title or "")
    new_description = fix_bad_terms(description or "")
    new_content = fix_bad_terms(content or "")

    if new_title != title or new_description != description or new_content != content:
        cur.execute(
            """
            UPDATE lessons_hr
            SET title = %s, description = %s, content = %s, updated_at = now()
            WHERE id = %s
            """,
            (new_title, new_description, new_content, row_id),
        )
        conn.commit()
        updated += 1
    else:
        skipped += 1

print(f"=== Bad term cleanup ===")
print(f"Total HR rows: {len(rows)}")
print(f"Updated: {updated}")
print(f"Skipped (no bad terms): {skipped}")

cur.close()
conn.close()
