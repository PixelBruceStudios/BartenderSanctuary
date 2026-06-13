#!/bin/bash
# Deploy smoke tests — run after `vercel --prod` to verify critical paths.
set -euo pipefail
BASE="${1:-https://bartender-sanctuary-app.vercel.app}"

pass=0
fail=0

check() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" = "$expected" ]; then
    echo "✓ $name"
    pass=$((pass+1))
  else
    echo "✗ $name (expected $expected, got $actual)"
    fail=$((fail+1))
  fi
}

http() {
  local method="$1"; shift
  local url="$1"; shift
  curl -s -o /tmp/smoke.body -w "%{http_code}" -X "$method" "$url" "$@"
}

echo "=== Deploy Smoke Tests ==="
echo "Target: $BASE"

# Health
code=$(http GET "$BASE/api/health")
check "health" "200" "$code"

# School tree
code=$(http GET "$BASE/api/school/full")
check "school/full" "200" "$code"

# Lessons list
code=$(http GET "$BASE/api/lessons")
check "lessons list" "200" "$code"

# Single lesson
code=$(http GET "$BASE/api/lessons/index.ts")
check "lessons index" "200" "$code"

# Croatian toggle
code=$(http GET "$BASE/api/school/full?lang=hr")
check "Croatian lang" "200" "$code"

# Session endpoint (no auth required, should 200)
code=$(http GET "$BASE/api/auth/session")
check "session endpoint" "200" "$code"

# Static assets
code=$(http GET "$BASE/")
check "homepage" "200" "$code"

echo
echo "=== Results: $pass passed, $fail failed ==="
if [ "$fail" -gt 0 ]; then
  echo "DEPLOY FAILED — smoke tests did not pass"
  exit 1
fi
echo "DEPLOY OK"
