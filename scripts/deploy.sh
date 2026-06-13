#!/usr/bin/env bash
# Deploy script with smoke tests
set -euo pipefail

echo "=== Building..."
npm run build

echo -e "\n=== Deploying to production..."
npx vercel --prod --yes

echo -e "\n=== Running smoke tests..."
bash scripts/smoke_test.sh "https://bartender-sanctuary-app.vercel.app"

echo -e "\n=== Done ==="
