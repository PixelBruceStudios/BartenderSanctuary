#!/usr/bin/env python3
"""
Daily DB backup: exports key tables to JSON for disaster recovery.
Stores backups in /home/skicmi/backups/
"""
import json
import os
import sys
from datetime import datetime
from pathlib import Path

import psycopg2

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'
BACKUP_DIR = Path('/home/skicmi/backups')
TABLES = [
    'categories',
    'techniques',
    'lessons',
    'lessons_hr',
    'cocktails',
    'tests',
    'test_questions',
    'test_attempts',
    'user_lesson_progress',
    'users',
]


def get_conn():
    with open(PASS_FILE) as f:
        pwd = f.read().strip()
    return psycopg2.connect(host=HOST, database=DB, user=USER, password=pwd, sslmode='require')


def backup_table(cur, table: str) -> list:
    cur.execute(f'SELECT * FROM {table} ORDER BY id')
    cols = [d[0] for d in cur.description]
    rows = cur.fetchall()
    return [dict(zip(cols, r)) for r in rows]


def main():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    out = BACKUP_DIR / f'backup_{ts}.json'

    conn = get_conn()
    cur = conn.cursor()
    data = {'timestamp': ts, 'tables': {}}
    for t in TABLES:
        try:
            data['tables'][t] = backup_table(cur, t)
            print(f'✓ {t}: {len(data["tables"][t])} rows')
        except Exception as e:
            print(f'⊘ {t}: skipped ({e})')
            data['tables'][t] = []
    cur.close()
    conn.close()

    out.write_text(json.dumps(data, indent=2, default=str))
    size = out.stat().st_size
    print(f'\nBackup written: {out} ({size/1024:.1f} KB)')

    # Retention: keep last 7 days
    old = sorted(BACKUP_DIR.glob('backup_*.json'))
    for f in old[:-7]:
        f.unlink()
        print(f'Pruned old backup: {f.name}')


if __name__ == '__main__':
    main()
