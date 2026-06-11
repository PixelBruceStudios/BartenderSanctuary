#!/usr/bin/env bash
set -euo pipefail

PROJECT="/home/skicmi/bartender-sanctuary-app"
LOG="$PROJECT/.lesson_updates.log"
TS=$(date -Iseconds)

echo "[$TS] Starting lesson update..." >> "$LOG"

cd "$PROJECT"

PICKED=$(python3 scripts/pick_lesson.py 2>/dev/null || echo "")
if [ -z "$PICKED" ]; then
  echo "[$TS] No lesson selected, exiting." >> "$LOG"
  exit 0
fi

LESSON_ID=$(echo "$PICKED" | cut -d'|' -f1)
LESSON_TITLE=$(echo "$PICKED" | cut -d'|' -f2)

echo "[$TS] Selected: $LESSON_ID - $LESSON_TITLE" >> "$LOG"

# Rewrite content via LLM
RESULT=$(python3 scripts/rewrite_lesson.py "$LESSON_ID" 2>&1)
STATUS=$(echo "$RESULT" | tail -1)

if [ "$STATUS" != "OK" ]; then
  echo "[$TS] FAILED rewrite for $LESSON_ID: $RESULT" >> "$LOG"
  exit 1
fi

# Build + deploy
if npm run build >/dev/null 2>&1 && npm run export >/dev/null 2>&1; then
  cp -r public/photos out/ 2>/dev/null || true
  /home/skicmi/.local/bin/wrangler pages deploy out --project-name=bartender-sanctuary --skip-caching --commit-dirty=true >/dev/null 2>&1
  DEPLOY_STATUS="success"
else
  DEPLOY_STATUS="failed"
fi

SUMMARY=$(echo "$RESULT" | grep '^SUMMARY:' | sed 's/^SUMMARY: //' || echo "Content improved")
echo "[$TS] Updated $LESSON_ID: $LESSON_TITLE — $SUMMARY (deploy: $DEPLOY_STATUS)" >> "$LOG"

# Telegram
python3 scripts/notify_telegram.py \
  "✅ Lesson updated\n\nID: $LESSON_ID\nTitle: $LESSON_TITLE\nImproved: $SUMMARY\nDeploy: $DEPLOY_STATUS\nTime: $TS" 2>/dev/null || true

echo "[$TS] Done." >> "$LOG"
