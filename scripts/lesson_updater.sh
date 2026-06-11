#!/usr/bin/env bash
set -euo pipefail

PROJECT="/home/skicmi/bartender-sanctuary-app"
STATE="$PROJECT/.last_lesson_update"
LOG="$PROJECT/.lesson_updates.log"
TS=$(date -Iseconds)

# Find lesson that was updated longest ago
LATEST=$(cd "$PROJECT" && grep -o "id: '[^']*'" data/school.ts | sed "s/id: '//;s/'//" | tail -1)
echo "[$TS] Checking lessons... last seen: $LATEST" >> "$LOG"

# Touch state file so the cron doesn't double-run
echo "$TS" > "$STATE"
echo "[$TS] Marked for review." >> "$LOG"
