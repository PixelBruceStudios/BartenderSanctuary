# Refactor Plan — Bartender Sanctuary

_Last updated: 2026-06-22 (Ops Run #2026-06-22)_

---

## General Checklist

- [x] Phase 1 Uptime monitoring — cron probe every 3h to Telegram Home on failure
- [x] Phase 2 Database backup — verify completion, fix skipped schema items
- [x] Phase 3 Project health — build: OK, DB: OK, audit: 6 vulns (5 mod / 1 high), .gitignore broken glob fixed
- [x] Phase 4 Project audit — async safety, injection, validation, CORS, rate limit, DB indexes/constraints
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

### Database (verified in schema — already present)
- CHECK constraint tests.scope IN ('sublesson','lesson','combined'): EXISTS ✓
- Partial index idx_tests_scope_lesson ON tests(scope, lesson_id) WHERE scope IN ('sublesson','lesson'): EXISTS ✓
- Index idx_test_questions_test ON test_questions(test_id): EXISTS ✓
- Index idx_test_attempts_test_session ON test_attempts(test_id, session_id): EXISTS (composite; single test_id index not yet added)
- Trigger lessons_hr_updated BEFORE UPDATE on lessons_hr: EXISTS ✓ (BEFORE INSERT trigger for updated_at not yet added)

### New findings — 2026-06-22 Ops Run
- **npm audit**: 6 vulnerabilities (5 moderate, 1 high) — Next.js XSS/DoS/SSRF/Middleware bypass, postcss XSS, uuid buffer bounds check. All require `npm audit fix --force` → upgrades Next.js to 16.x (breaking change). PLAN: upgrade Next.js in a dedicated refactor session with full regression testing.
- **.gitignore broken glob**: `scripts/__pycache__/\` had a dangling trailing backslash. **FIXED** → `scripts/__pycache__/`
- **next.config.js**:
  - `reactStrictMode: false` — should be `true` for better dev warnings and double-render safety
  - `images.unoptimized: true` — disables Next.js Image Optimization; should use `remotePatterns` + default optimization for external images
  - `trailingSlash: false` — acceptable for this app
- **No React.memo in components**: AffiliateBar.tsx, Hero.tsx, CocktailCard.tsx, etc. have no memo wrapper. PLAN: wrap heavy list/card components.
- **Inline styles in components**: AffiliateBar.tsx has ~15 inline `style={{}}` objects. PLAN: migrate to Tailwind utility classes or CSS modules.
- **Missing alt text**: No `<img>` tags without alt found in scan (likely using Next.js `<Image>` which requires alt). ✓
- **API input validation**: No zod/yup/joi in any pages/api route. All validation is ad-hoc (manual checks like `if (!scope || !['sublesson','lesson','combined'].includes(scope))`). PLAN: introduce zod schemas per route.
- **API async error handling**: All API handlers are async; no explicit try/catch at handler level. Errors bubble to Next.js default handler. ACCEPTABLE but PLAN: add top-level try/catch with structured error responses.
- **console.error in production API**: 4 occurrences in affiliate-redirect.ts, bug-report.ts, cocktails/index.ts, lessons/[id].ts. ACCEPTABLE for observability; PLAN: replace with structured logger (lib/logger.ts exists).
- **env secrets**: .env.vercel.prod contains `DATABASE_URL=""` (empty placeholder, not a real secret). All real secrets are set in Vercel dashboard. ✓
- **SQL injection scan**: pages/api/tests/index.ts line 34 uses dynamic WHERE assembly. **SAFE** — all user values are parameterized via `$N` placeholders; the WHERE strings contain only column names and operators, no raw user input. No injection risk.

---
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
