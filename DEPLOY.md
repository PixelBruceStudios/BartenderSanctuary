# Bartender Sanctuary — Deployment & Content Ops

## Prerequisites
- Node v20+ (installed)
- Vercel CLI (`npx vercel`)
- Neon Postgres (provisioned)
- DATABASE_URL set locally and in Vercel

## Local env
Copy `.env.example` to `.env.local` and paste the real Neon DATABASE_URL.

## Build locally to verify
```bash
cd /home/skicmi/bartender-sanctuary-app
DATABASE_URL="postgresql://neondb_owner:***@ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" npx next build --no-lint
```

## Games sync (already in sync)
```bash
cd /home/skicmi/DrinkingModule/games && npm run build
# Then copy to public:
rsync -a /home/skicmi/DrinkingModule/games/dist/ /home/skicmi/bartender-sanctuary-app/public/games/app/
```

## First-time Vercel deploy
```bash
cd /home/skicmi/bartender-sanctuary-app
vercel login          # opens browser, log in with your Vercel account
vercel --prod         # first deploy, will ask to link/create project
```
After first deploy, set the env var in Vercel dashboard:
- Project Settings → Environment Variables
- Name: `DATABASE_URL`
- Value: your Neon connection string
- Environment: Production + Preview

Then trigger a redeploy (push any commit or `vercel --prod`).

## Subsequent deploys
```bash
git add -A && git commit -m "update" && git push origin main
vercel --prod
```

## Content management (no rebuild needed)
All content lives in Postgres. Use the API routes or the migration script:

### Add / update / delete via API
- `POST /api/cocktails` — create cocktail (auth key required)
- `PUT /api/cocktails/[id]` — update
- `DELETE /api/cocktails/[id]` — delete
- Same pattern for categories, techniques, lessons.

### Add / update via migration script
```bash
# Edit scripts/migrate.cjs or add a new TS/JSON data file, then:
node scripts/migrate.cjs --import   # upsert into Postgres, no rebuild needed
```

### Add lessons
Lessons are intentionally empty after initial migration. Add them via the API once the content injector is ready.

## Architecture
- Next.js runtime on Vercel (no `output: 'export'`)
- Static pages: `/`, `/school`, `/games`
- Serverless API routes: `/api/cocktails`, `/api/school/full`, etc.
- Database: Neon Postgres
- Games: built separately, copied to `public/games/app/`, served as static assets
