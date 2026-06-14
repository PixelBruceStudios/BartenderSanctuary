#!/usr/bin/env bash
# Cron wrapper: run the test validator and surface its output.
# Exits non-zero if any generated lesson tests contain duplicate or malformed questions.
set -euo pipefail
cd /home/skicmi/bartender-sanctuary-app
.venv/bin/python scripts/validate_generated_tests.py 2>&1 | tail -80
