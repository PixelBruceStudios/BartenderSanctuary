#!/usr/bin/env python3
import psycopg2
import sys
import os

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

with open(PASS_FILE) as f:
    pwd = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=pwd, sslmode='require')
cur = conn.cursor()

def apply(label, sql):
    try:
        cur.execute(sql)
        conn.commit()
        print(f"✓ {label}")
    except Exception as e:
        print(f"✗ {label}: {e}")
        conn.rollback()

# 1. Indexes
apply("idx_tests_lesson_id", "CREATE INDEX IF NOT EXISTS idx_tests_lesson_id ON tests(lesson_id);")
apply("idx_test_attempts_test_id", "CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON test_attempts(test_id);")
apply("idx_test_questions_test_id", "CREATE INDEX IF NOT EXISTS idx_test_questions_test_id ON test_questions(test_id);")

# 2. Partial index for lesson scope
apply("idx_tests_lesson_scope", "CREATE INDEX IF NOT EXISTS idx_tests_lesson_scope ON tests(lesson_id) WHERE scope='lesson';")

# 3. CHECK constraint on tests.scope
apply("chk_tests_scope", """
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_tests_scope'
  ) THEN
    ALTER TABLE tests ADD CONSTRAINT chk_tests_scope CHECK (scope IN ('lesson','sublesson','combined'));
  END IF;
END;
$$;
""")

# 4. Ensure user_progress table exists (for user lesson progress)
apply("create_user_progress", """
CREATE TABLE IF NOT EXISTS user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);
""")

cur.close()
conn.close()
print("Done.")
