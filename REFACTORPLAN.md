# Refactor Plan — Bartender Sanctuary

_Last updated: 2026-06-18 (current refactor run)_

---

## General Checklist

- [x] Phase 1 Uptime monitoring — cron probe every 3h to Telegram Home on failure
- [x] Phase 2 Database backup — verify completion, fix skipped schema items
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
- Verified indexes created: tests.lesson_id, test_attempts.test_id, test_questions.test_id
- Partial index created: tests(lesson_id) WHERE scope='lesson'
- CHECK constraint created: tests.scope IN ('lesson','sublesson','combined')
- user_progress table created (UUID FK to users.id)
- lessons_hr has no updated_at trigger for upserts
- user_progress table created and ready; backup script includes it once rerun

### Build
- `npm run build` passes
- `git status` shows one change: `.gitignore` updated to include `.env`, `.env.local`, `.env.production`

---

## Completed DB fixes
- Index: tests.lesson_id
- Index: test_attempts.test_id
- Index: test_questions.test_id
- Partial index: tests(lesson_id) WHERE scope='lesson'
- Constraint: chk_tests_scope
- Table: user_progress (uuid FK to users)

---

## Safe next steps
- School sequencing: add `id` + `sort_order` via manual full-file rewrite or AST-based generator; avoid regex-only patching of nested TS objects.
