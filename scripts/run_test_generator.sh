#!/usr/bin/env bash
set -euo pipefail
cd /home/skicmi/bartender-sanctuary-app
./.venv/bin/python scripts/generate_lesson_tests.py --batch 15 2>&1 | tail -40
