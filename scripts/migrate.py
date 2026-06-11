#!/usr/bin/env python3
"""
Migrate categories + techniques (no lessons) and cocktails from TS data files into Postgres.
Usage:
  python scripts/migrate.py [--dry-run] [--clear]

Options:
  --dry-run  print what would be inserted, do not write to DB
  --clear    DELETE all rows from categories/techniques/cocktails before inserting
"""

import argparse
import ast
import json
import os
import re
import sys
from pathlib import PurePosixPath
from urllib.parse import urlparse

import psycopg2

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(APP_DIR, "data")
DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)


def load_ts_module(path: str):
    """Parse a TS data file by extracting the top-level `export const X = ...` assignments."""
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        src = f.read()
    # Normalise typographic dashes/quotes that Python ast chokes on
    src = (
        src.replace("\u2014", "--")
        .replace("\u2013", "-")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2019", "'")
    )
    tree = ast.parse(src)
    exports = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id.startswith("schoolCategories"):
                    exports["schoolCategories"] = ast.literal_eval(node.value)
                if isinstance(target, ast.Name) and target.id == "cocktails":
                    exports["cocktails"] = ast.literal_eval(node.value)
    return exports


def migrate(dry_run: bool = False, clear: bool = False):
    payload = load_ts_module(os.path.join(DATA_DIR, "school.ts"))
    cocktail_payload = load_ts_module(os.path.join(DATA_DIR, "cocktails.ts"))

    categories_raw = payload.get("schoolCategories", [])
    cocktails_raw = cocktail_payload.get("cocktails", [])

    # Build a mapping from category slug -> techniques (no lessons)
    rows: list[dict] = []
    for cat in categories_raw:
        techniques = []
        for tech in cat.get("techniques", []):
            techniques.append(
                {
                    "slug": tech["slug"],
                    "title": tech["title"],
                    "description": tech.get("description", ""),
                    "sort_order": 0,
                }
            )
        rows.append(
            {
                "slug": cat["slug"],
                "title": cat["title"],
                "description": cat.get("description", ""),
                "icon": cat.get("icon", ""),
                "sort_order": 0,
                "techniques": techniques,
            }
        )

    cocktail_rows = []
    for c in cocktails_raw:
        cocktail_rows.append(
            {
                "slug": c["slug"],
                "name": c["name"],
                "description": c.get("story", c.get("description", "")),
                "ingredients": json.dumps(c.get("ingredients", c.get("ingredients", []))),
                "instructions": json.dumps(c.get("instructions", [])),
                "glass_type": c.get("glass", c.get("glass_type", "")),
                "garnish": c.get("garnish", ""),
                "difficulty": c.get("difficulty", "Beginner"),
            }
        )

    if dry_run:
        print(f"[DRY RUN] Would migrate {len(rows)} categories + {len(cocktail_rows)} cocktails")
        for row in rows[:3]:
            print(f"  category: {row['slug']} ({len(row['techniques'])} techniques)")
        print(f"  first cocktail: {cocktail_rows[0]['slug'] if cocktail_rows else 'none'}")
        return

    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    cur = conn.cursor()

    if clear:
        cur.execute("DELETE FROM sources;")
        cur.execute("DELETE FROM lessons;")
        cur.execute("DELETE FROM techniques;")
        cur.execute("DELETE FROM categories;")
        cur.execute("DELETE FROM cocktails;")

    cat_ids: dict[str, str] = {}
    for row in rows:
        cur.execute(
            """
            INSERT INTO categories (slug, title, description, icon, sort_order)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, icon=EXCLUDED.icon
            RETURNING id
            """,
            (row["slug"], row["title"], row["description"], row["icon"], row["sort_order"]),
        )
        cat_id = cur.fetchone()[0]
        cat_ids[row["slug"]] = str(cat_id)
        for idx, tech in enumerate(row["techniques"]):
            cur.execute(
                """
                INSERT INTO techniques (category_id, slug, title, description, sort_order)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (category_id, slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description
                RETURNING id
                """,
                (cat_id, tech["slug"], tech["title"], tech["description"], idx),
            )

    for row in cocktail_rows:
        cur.execute(
            """
            INSERT INTO cocktails (slug, name, description, ingredients, instructions, glass_type, garnish, difficulty)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, instructions=EXCLUDED.instructions
            """,
            (
                row["slug"],
                row["name"],
                row["description"],
                row["ingredients"],
                row["instructions"],
                row["glass_type"],
                row["garnish"],
                row["difficulty"],
            ),
        )

    conn.close()
    print(f"Migrated {len(rows)} categories + {len(cocktail_rows)} cocktails into Postgres.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Migrate Bartender Sanctuary content into Postgres")
    parser.add_argument("--dry-run", action="store_true", help="Print plan without writing to DB")
    parser.add_argument("--clear", action="store_true", help="Clear existing rows before insert")
    args = parser.parse_args()
    migrate(dry_run=args.dry_run, clear=args.clear)
