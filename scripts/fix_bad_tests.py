#!/usr/bin/env python3
"""Remove auto-generated duplicate tests so they can be regenerated correctly."""
import os
import psycopg2
from pathlib import Path

NEON_HOST = "ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech"
NEON_DB = "BartenderSanctuary"
NEON_USER = "neondb_owner"
PASS_PATH = Path.home() / "Desktop" / "NeonDbPass"

pwd = os.environ.get("BARTENDER_DB_PASS") or PASS_PATH.read_text().strip()
conn = psycopg2.connect(
    host=NEON_HOST, database=NEON_DB, user=NEON_USER, password=pwd, sslmode="require"
)
cur = conn.cursor()

# Delete questions from auto-generated tests (WHERE clause is explicit)
cur.execute(
    """
    DELETE FROM test_questions
    WHERE test_id IN (
        SELECT id FROM tests WHERE scope = 'lesson' AND description = 'Auto-generated lesson test'
    )
    """
)
deleted_q = cur.rowcount

# Delete auto-generated tests (WHERE clause is explicit)
cur.execute(
    """
    DELETE FROM tests
    WHERE scope = 'lesson' AND description = 'Auto-generated lesson test'
    """
)
deleted_t = cur.rowcount

conn.commit()
print(f"Deleted {deleted_q} questions and {deleted_t} auto-generated tests.")

cur.close()
conn.close()
