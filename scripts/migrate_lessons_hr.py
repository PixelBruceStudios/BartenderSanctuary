#!/usr/bin/env python3
"""
Migrate: add lessons_hr table for Croatian translations.
"""
import psycopg2
import os

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

with open(PASS_FILE) as f:
    password = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS lessons_hr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    duration TEXT NOT NULL DEFAULT '',
    difficulty TEXT NOT NULL DEFAULT 'Beginner',
    content TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (technique_id, slug)
);
""")

conn.commit()

# Updated-at trigger
cur.execute("""
CREATE OR REPLACE FUNCTION set_updated_at_lessons_hr()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
""")

cur.execute("DROP TRIGGER IF EXISTS lessons_hr_updated ON lessons_hr;")
cur.execute("""
CREATE TRIGGER lessons_hr_updated BEFORE UPDATE ON lessons_hr
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_lessons_hr();
""")

conn.commit()
cur.close()
conn.close()
print("SUCCESS: lessons_hr table created")
