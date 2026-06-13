#!/usr/bin/env python3
"""
Apply Croatian bartending glossary to all existing HR lessons in-place.
Updates titles, descriptions, and content with canonical Croatian terms.
"""
import os
import re

import psycopg2

PASS_FILE = os.path.expanduser("~/Desktop/NeonDbPass")
HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
DB = "BartenderSanctuary"
USER = "neondb_owner"

HR_GLOSSARY: dict[str, str] = {
    "highball": "visoki balon",
    "highball glass": "čaša visoki balon",
    "highball cocktail": "visoki balon",
    "rocks": "na kockama",
    "rocks glass": "čaša na kockama",
    "old fashioned": "old fashioned",
    "old-fashioned": "old fashioned",
    "old fashioned glass": "čaša old fashioned",
    "coupe": "kupa",
    "coupe glass": "kupasta čaša",
    "martini": "martini",
    "martini glass": "kupasta čaša",
    "champagne flute": "čahura za šampanjac",
    "flute": "čahura",
    "wine glass": "čaša za vino",
    "shot": "čašica",
    "shot glass": "čašica",
    "julep cup": "kup za julep",
    "julep": "julep",
    "copper mug": "bakarana mugla",
    "mule": "mugla",
    "hurricane": "hurikan",
    "hurricane glass": "čaša hurikan",
    "collins": "kolins",
    "collins glass": "čaša kolins",
    "tiki": "tiki",
    "tiki glass": "tiki čaša",
    "pousse café": "pus kafe",
    "pousse cafe glass": "čaša pus kafe",
    "irish coffee": "irski kafa",
    "irish coffee glass": "irski kafa",
    "stirred": "miješano",
    "shaken": "uz prskanje leda",
    "shaking": "prskanje leda",
    "muddled": "mudlano",
    "muddling": "mudlanje",
    "bitters": "biters",
    "simple syrup": "limunada",
    "vermouth": "vermut",
    "dry vermouth": "suhi vermut",
    "sweet vermouth": "slatki vermut",
    "blanco": "blanco",
    "reposado": "reposado",
    "anejo": "anejo",
    "mezcal": "mezcal",
    "tequila": "tekila",
    "rum": "rum",
    "vodka": "votka",
    "gin": "đin",
    "whiskey": "viski",
    "whisky": "viski",
    "bourbon": "burbon",
    "scotch": "skotski viski",
    "campari": "kampari",
    "aperol": "aperol",
    "amaro": "amaro",
    "chartreuse": "šartrez",
    "cointreau": "kuantru",
    "triple sec": "tripel sek",
    "orgeat": "oržat",
    "falernum": "falernum",
    "sour": "sour",
    "sours": "sour kokteli",
}


def apply_glossary(text: str) -> str:
    result = text
    for en_term, hr_term in HR_GLOSSARY.items():
        pattern = re.compile(re.escape(en_term), re.IGNORECASE)
        result = pattern.sub(hr_term, result)
    return result


with open(PASS_FILE) as f:
    password = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode="require")
cur = conn.cursor()

cur.execute("SELECT id, title, description, content FROM lessons_hr")
rows = cur.fetchall()

updated = 0
skipped = 0
changes: list[tuple[str, str, str]] = []

for row_id, title, description, content in rows:
    new_title = apply_glossary(title or "")
    new_description = apply_glossary(description or "")
    new_content = apply_glossary(content or "")

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
        title_delta = f"{title[:30]!r} -> {new_title[:30]!r}" if title != new_title else "(unchanged)"
        changes.append((str(row_id), title_delta, new_title))
    else:
        skipped += 1

print(f"=== Glossary application ===")
print(f"Total HR rows: {len(rows)}")
print(f"Updated: {updated}")
print(f"Skipped (no changes): {skipped}")
if changes:
    print("\nFirst 10 changed titles:")
    for rid, delta, new_title in changes[:10]:
        print(f"  {rid}: {new_title[:60]}")

cur.close()
conn.close()
