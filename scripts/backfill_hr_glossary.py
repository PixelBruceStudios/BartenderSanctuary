#!/usr/bin/env python3
"""
Authoritative Croatian bartending glossary backfill.
Updates all lessons_hr text (title, description, content) from this single source.
"""
import os
import re

import psycopg2

PASS_FILE = os.path.expanduser("~/Desktop/NeonDbPass")
HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
DB = "BartenderSanctuary"
USER = "neondb_owner"

# Glassware and bar equipment: LEFT IN ENGLISH (international terms used as-is in Croatia)
# Technique names / actions
# Ingredients / modifiers
# International cocktail / spirit names kept as-is in Croatian bar usage
HR_GLOSSARY: dict[str, str] = {
    # Technique names / actions
    "stirred": "miješano",
    "shaken": "uz prskanje leda",
    "shaking": "prskanje leda",
    "muddled": "mudlano",
    "muddling": "mudlanje",
    # Ingredients / modifiers
    "bitters": "biters",
    "simple syrup": "limunada",
    "vermouth": "vermut",
    "dry vermouth": "suhi vermut",
    "sweet vermouth": "slatki vermut",
    "chartreuse": "šartrez",
    "triple sec": "tripel sek",
    "orgeat": "oržat",
    # International cocktail / spirit names kept as-is in Croatian bar usage
    "sours": "Sours",
    "sour": "Sour",
    "highballs": "Highballs",
    "highball": "visoki balon",
    "fizzes & collinses": "Fizzes & Collinses",
    "stirred spirit-forward cocktails": "Stirred Spirit-Forward Cocktails",
    "old fashioned": "old fashioned",
    "old-fashioned": "old fashioned",
    "martini": "martini",
    "julep": "julep",
    "mule": "mugla",
    "tiki": "tiki",
    "pousse café": "pus kafe",
    "pousse cafe": "pus kafe",
    "irish coffee": "irski kafa",
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
    "cointreau": "kuantru",
    "falernum": "falernum",
}


def apply_glossary(text: str) -> str:
    result = text
    for en_term, hr_term in HR_GLOSSARY.items():
        pattern = re.compile(r"\b" + re.escape(en_term) + r"\b", re.IGNORECASE)
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
    else:
        skipped += 1

print(f"=== Glossary backfill ===")
print(f"Total HR rows: {len(rows)}")
print(f"Updated: {updated}")
print(f"Skipped (no changes): {skipped}")

cur.close()
conn.close()
