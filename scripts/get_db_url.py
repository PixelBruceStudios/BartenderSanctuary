#!/usr/bin/env python3
"""
scripts/get_db_url.py
Reads the Neon password from ~/Desktop/NeonDbPass and prints the full DATABASE_URL.
Usage: python3 scripts/get_db_url.py
"""
import os

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

def main():
    with open(PASS_FILE, 'r') as f:
        password = f.read().strip()
    url = f"postgresql://{USER}:{password}@{HOST}/{DB}?sslmode=require&channel_binding=require"
    print(url)

if __name__ == '__main__':
    main()
