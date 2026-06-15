# Refactor Plan — Bartender Sanctuary

_Last updated: 2026-06-15 (automated ops run)_

---

## General Checklist

- [ ] Phase 1 Uptime monitoring — alert if not 2xx/3xx
- [ ] Phase 2 Database backup — verify completion, investigate skipped tables
- [ ] Phase 3 Project health — build, DB, audits, secrets scan
- [ ] Phase 4 Project audit — async safety, injection, validation, CORS, rate limit, DB indexes/constraints
- [ ] Phase 5 Conditional deploy — commit only when fixes verified by build
- [ ] Phase 6 Telegram summary — send to channel on every run

---

## Active Findings / Action Items

### Security
- High npm audit: Next.js, lodash.pick, postcss, uuid (breaking changes require —force or upstream upgrade)
- API .env files (.env.vercel, .env.vercel.prod) are tracked in git (unexpected); ensure they remain only on Vercel environment
- No CORS headers in any pages/api route
- No rate limiting in any pages/api route
- No input validation libraries (zod/joi/yup) in pages/api
- Hardcoded secrets scan: none found in source, but env files present

### Performance / Reliability
- 10/21 API handlers are async without try/catch (unhandled rejections can crash Next.js API routes)
- next.config.js: `images.unoptimized = true` (no image optimization); consider enabling remotePatterns + optimization
- next.config.js: reactStrictMode disabled (no `reactStrictMode: true`)
- console.error calls left in production API code (11 files) — acceptable for observability but should be replaced by a logger with redaction

### Database
- Verified indexes: tests has indexes including lesson_id+scope unique, test_attempts/test_questions already indexed on test_id
- lessons_hr has no updated_at trigger for upserts
- tests.scope has no CHECK constraint
- tests has no partial index `WHERE scope='lesson'` (only 'sublesson' and 'combined' exist)
- user_progress table does not exist; backup script skips it

### Build
- `npm run build` passes
- `git status` shows one change: `.gitignore` updated to include `.env`, `.env.local`, `.env.production`

---

## Static DB Recommendations (from this run)

- Add index on `tests.lesson_id`
- Add index on `test_attempts.test_id`
- Add index on `test_questions.test_id`
- Add `updated_at` trigger on `lessons_hr` upserts
- Add CHECK constraint on `tests.scope`
- Add partial index on `tests(lesson_id) WHERE scope='lesson'`
