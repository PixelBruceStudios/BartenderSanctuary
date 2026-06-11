#!/usr/bin/env python3
"""
scripts/seed_school_db.py
Seeds the Bartender Sanctuary school curriculum into Postgres.
Usage: python3 scripts/seed_school_db.py
"""
import os
import sys
import subprocess
import psycopg2

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'
SQL_FILE = os.path.join(os.path.dirname(__file__), 'seed-school.sql')

def main():
    with open(PASS_FILE, 'r') as f:
        password = f.read().strip()

    # Read SQL
    with open(SQL_FILE, 'r') as f:
        sql = f.read()

    # Connect
    conn = psycopg2.connect(
        host=HOST,
        database=DB,
        user=USER,
        password=password,
        sslmode='require'
    )
    conn.autocommit = False
    cur = conn.cursor()

    try:
        cur.execute(sql)
        conn.commit()
        print('SUCCESS: School curriculum seeded')
    except Exception as e:
        conn.rollback()
        print(f'FAILED: {e}')
        sys.exit(1)
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    main()
