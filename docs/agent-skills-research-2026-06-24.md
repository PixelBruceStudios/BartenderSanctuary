# 2026 AI Agent Skills Research — Bartender Sanctuary
**Research Date:** June 24, 2026  
**Target Stack:** Next.js + Postgres (Neon) + Vercel  
**Focus:** Bartending school platform — lessons, tests, progress tracking, cocktail/ingredient data, user engagement  
**Previous Report:** June 23, 2026 — `docs/agent-skills-research-2026-06-23.md`

---

## Executive Summary

Since June 23, the ecosystem has produced **one high-impact new adapter** (`@mastra/pg@1.14.1`) and several provider-level updates to the Vercel AI SDK. The Mastra agent framework also shipped a minor but notable observability bump. For Bartender Sanctuary, the most actionable signal is the new **Mastra Postgres adapter**, which offers a direct typed data-access path for agents without leaving the Mastra ecosystem.

1. **Mastra Postgres Adapter (`@mastra/pg@1.14.1`)** — typed Postgres data access for Mastra agents, aligned with the project’s Neon/Postgres stack.
2. **AI SDK provider updates (`@ai-sdk/xai@3.0.97`, `@ai-sdk/anthropic@3.0.86`)** — expanded model choice (Grok, Claude) through the unified AI Gateway provider abstraction.
3. **Mastra observability/core update (`@mastra/observability@1.15.1`, `@mastra/core@1.46.0`)** — improved tracing and agent runtime stability.
4. **`pg@8.22.0` + `neon-init@0.19.0`** — Postgres driver and Neon initialization updates with minor fixes.
5. **`@sentry/vercel-edge@10.60.0`** — updated Edge Runtime error tracking for Vercel deployments.

The **zero-AI-deps gap persists** in `package.json`. All P1–P5 recommendations from June 21 and June 23 remain fully actionable.

---

## Verified Package Versions (as of June 24)

| Package | June 23 version | June 24 version | Change |
|---------|----------------|----------------|--------|
| `@ai-sdk/anthropic` | 3.0.85 | **3.0.86** | Minor patch |
| `@ai-sdk/xai` | *not tracked* | **3.0.97** | **NEW — XAI/Grok provider** |
| `ai` (Vercel AI SDK) | 6.0.208 | **6.0.209** | Minor patch |
| `@ai-sdk/gateway` | 3.0.134 | **3.0.134** | No change |
| `@ai-sdk/langchain` | 2.0.216 | **2.0.217** | Minor patch |
| `ai-sdk-tools` | 1.2.0 | **1.2.0** | No change |
| `@ai-sdk-tools/agents` | 1.2.0 | **1.2.0** | No change |
| `@anthropic-ai/claude-agent-sdk` | 0.3.186 | **0.3.187** | Minor patch |
| `mastra` | 1.15.0 | **1.15.1** | Minor patch |
| `@mastra/core` | 1.45.0 | **1.46.0** | Minor patch |
| `@mastra/observability` | 1.15.0 | **1.15.1** | Minor patch |
| `@mastra/pg` | *not tracked* | **1.14.1** | **NEW — Postgres adapter** |
| `@neondatabase/serverless` | 1.1.0 | **1.1.0** | No change |
| `pg` (project dep) | 8.21.0 | **8.22.0** | Minor patch |
| `neon-init` | *not tracked* | **0.19.0** | **NEW** |
| `@sentry/vercel-edge` | *not tracked* | **10.60.0** | **NEW** |
| `next` | 16.2.9 | **16.2.9** | No change |

---

## Top 5 Relevant Developments (Updated June 24)

### 1. Mastra Postgres Adapter (`@mastra/pg@1.14.1`) ⭐ P1
*New since June 23 — typed data access for agents.*

`@mastra/pg@1.14.1` provides a typed Postgres client for Mastra agents, letting them query and mutate Neon/Postgres data without raw SQL strings or separate ORM setup.

**Why it matters:** Bartender Sanctuary already uses Postgres (Neon) for lessons, tests, and progress. This adapter lets tutoring agents read student progress, write grading results, and query lesson metadata through the same Mastra tool surface used for orchestration. It reduces the need for custom API routes between the agent runtime and the database.

**Implementation Difficulty:** 2/5
- Install `@mastra/pg` alongside `@mastra/core`
- Configure Neon connection string as a Mastra tool/store
- Wrap existing school schema queries (lessons, tests, progress) as typed agent tools

**Potential Impact:** 4/5
- Agents read/write school data without custom serverless glue
- Type-safe queries reduce runtime errors in tutoring workflows
- Enables agent-driven progress tracking and auto-grading directly against Postgres

**Stack-Specific Note:** The project currently uses `pg` ^8.21.0 directly. `@mastra/pg` is an additive layer — it does not replace `pg` immediately, but it offers a cleaner path for AI-driven data access.

---

### 2. AI SDK Provider Expansion (`@ai-sdk/xai@3.0.97`, `@ai-sdk/anthropic@3.0.86`) — P2
*New since June 23 — additional model options.*

Two new/updated provider packages for the Vercel AI SDK:
- `@ai-sdk/xai@3.0.97` — adds XAI (Grok) as a first-class provider
- `@ai-sdk/anthropic@3.0.86` — Anthropic provider patch

**Why it matters:** More provider choice means Bartender Sanctuary can route different tutoring tasks to different models (e.g., Grok for fast quiz generation, Claude for deep lesson authoring) through the same `ai` v6 API. AI Gateway already supports multi-provider routing; these packages make client-side usage consistent.

**Implementation Difficulty:** 1/5
- Install the provider package
- Add to AI Gateway allowlist/budget
- Use standard `generateText` / `streamText` calls with `provider: 'xai'` or `provider: 'anthropic'`

**Potential Impact:** 3/5
- Cost optimization: use cheaper/faster models for routine tasks
- Capability optimization: use Claude for long-form lesson generation, Grok for quick feedback
- Future-proofs against single-provider lock-in

**Stack-Specific Note:** Vercel AI Gateway centralizes credentials and rate limits. Adding providers is a config change, not an infrastructure change.

---

### 3. Mastra Core + Observability Update (`@mastra/core@1.46.0`, `@mastra/observability@1.15.1`) — P2
*Updated June 24 — runtime and tracing improvements.*

Mastra shipped minor updates across core runtime and observability. The framework continues to mature its tracing, scoring, and multi-agent coordination features.

**Why it matters:** If Bartender Sanctuary adopts Mastra for tutoring orchestration, these updates improve stability and make it easier to trace agent decisions (which lesson was generated, which grade was assigned, and why). Observability is critical for debugging tutoring failures and meeting compliance requirements.

**Implementation Difficulty:** 2/5
- Upgrade `@mastra/core` and `@mastra/observability` together
- Enable tracing in the Mastra config
- Export spans to Vercel Analytics or an OpenTelemetry collector

**Potential Impact:** 4/5
- Debug tutoring agent failures and grading inconsistencies
- Monitor LLM costs per user/session (EU AI Act Article 4 compliance)
- Build evaluation datasets from real agent traces
- Detect prompt injection or unsafe outputs before they reach students

**Stack-Specific Note:** Vercel has native OpenTelemetry support; Mastra spans can be exported to Vercel Analytics or any OTel collector.

---

### 4. Postgres & Neon Ecosystem Updates (`pg@8.22.0`, `neon-init@0.19.0`) — P3
*Updated June 19/22 — driver and initialization fixes.*

- `pg@8.22.0` — minor patch to the Node Postgres driver
- `neon-init@0.19.0` — Neon connection initialization helper

**Why it matters:** The project depends on `pg` ^8.21.0 directly. Upgrading to 8.22.0 brings minor fixes. `neon-init` provides a standardized way to bootstrap Neon connections with proper SSL and pooling configuration, which could replace ad-hoc connection setup in API routes.

**Implementation Difficulty:** 1/5
- `npm install pg@8.22.0`
- Evaluate `neon-init` for replacing custom Neon connection logic

**Potential Impact:** 2/5
- Low-risk stability improvement for database layer
- `neon-init` may simplify connection management in serverless functions

**Stack-Specific Note:** The project still uses raw `pg` queries. A longer-term evaluation of `@neondatabase/serverless` v1.1.0 (recommended in prior reports) would provide type-safe serverless queries and WebSocket support.

---

### 5. Sentry Vercel Edge (`@sentry/vercel-edge@10.60.0`) — P3
*New since June 23 — Edge Runtime error monitoring.*

`@sentry/vercel-edge@10.60.0` provides error tracking and performance monitoring for Vercel Edge Functions and Edge Runtime.

**Why it matters:** Bartender Sanctuary runs on Vercel. As the platform migrates more logic to Edge Functions (middleware, API routes, AI streaming), capturing errors and performance data in production becomes essential. This package integrates Sentry directly into the Edge Runtime without server-side overhead.

**Implementation Difficulty:** 1/5
- Install `@sentry/vercel-edge`
- Configure DSN and environment filtering
- Wrap Edge handlers with Sentry instrumentation

**Potential Impact:** 3/5
- Real-time alerting on API route failures (critical for school platform uptime)
- Performance tracing for student-facing pages
- Source map support for debugging production TypeScript errors

**Stack-Specific Note:** Works alongside existing `next-auth` and API routes. Does not require Sentry server-side SDK if only Edge functions are instrumented.

---

## New Ecosystem Signals (Watching Only)

| Signal | Package/Version | Status | Why it matters |
|--------|----------------|--------|----------------|
| `@logtape/drizzle-orm@2.2.1` | June 24 | **Stable** | Logging instrumentation for Drizzle ORM. Relevant if project migrates from raw `pg` to Drizzle. |
| `@electric-sql/pglite@0.5.3` | June 16 | **Stable** | Local Postgres in the browser/Edge runtime. Interesting for offline lesson access, but premature for current stack. |
| `ollama-ai-provider-v2@3.6.0` | June 11 | **Stable** | Local LLM provider for Vercel AI SDK. Useful for cost-sensitive bulk generation (e.g., embedding cocktail descriptions) without API costs. |
| `@tanstack/ai@0.34.0` | June 23 | **Stable** | TanStack's headless AI SDK. Potential alternative to `@ai-sdk/react` if the project adopts TanStack Query, but low priority. |
| `pgvector@0.3.0` | May 31 | **Stable** | No change. Remains the recommended path for vector search in Neon once AI deps are installed. |

---

## Delta from June 23 Report

| Topic | June 23 Assessment | June 24 Update |
|-------|-------------------|----------------|
| Core package versions | Minor drift | **Minor drift continues.** `ai` 6.0.208→6.0.209, `@ai-sdk/langchain` 2.0.216→2.0.217, `langchain` 1.5.1→1.5.2. No breaking changes. |
| `@ai-sdk/xai` | Not tracked | **NEW.** v3.0.97 — XAI/Grok provider for Vercel AI SDK. Expands model routing options. |
| `@ai-sdk/anthropic` | 3.0.85 | **3.0.86** — minor patch. |
| `@mastra/pg` | Not tracked | **NEW.** v1.14.1 — typed Postgres adapter for Mastra agents. Directly relevant to Neon stack. |
| Mastra ecosystem | 1.15.0 / 1.45.0 / 1.15.0 | **1.15.1 / 1.46.0 / 1.15.1** — minor runtime and observability improvements. |
| `pg` | 8.21.0 (project) | **8.22.0** — minor patch available. |
| `neon-init` | Not tracked | **NEW.** v0.19.0 — Neon connection initialization helper. |
| `@sentry/vercel-edge` | Not tracked | **NEW.** v10.60.0 — Edge Runtime error monitoring. |
| `@logtape/drizzle-orm` | Not tracked | **NEW.** v2.2.1 — Drizzle ORM logging instrumentation. |
| Project AI deps installed | None | **None — gap persists.** All P1–P5 recommendations remain actionable. |

---

## Updated Recommendations (Priority Order)

| Priority | Action | Difficulty | Impact | Delta from June 23 |
|----------|--------|-----------|--------|-------------------|
| **P1** | Install `ai` ^6.0.209 + `@ai-sdk/gateway` ^3.0.134 + provider (`openai` or `anthropic`) | 2/5 | 5/5 | Unchanged. Gateway confirmed production-ready. |
| **P1** | Evaluate `ai-sdk-tools@1.2.0` + `@ai-sdk-tools/agents@1.2.0` for tutoring/auto-grader | 2/5 | 5/5 | Unchanged. First-party Vercel agent toolkit. |
| **P1** | Migrate `pg` → `@neondatabase/serverless` v1.1.0 | 2/5 | 4/5 | Unchanged. Prerequisite for all AI work. |
| **P2** | Evaluate `@mastra/pg@1.14.1` for typed agent data access | 2/5 | 4/5 | **NEW.** Direct Postgres adapter for Mastra agents. |
| **P2** | Add observability: `openlit@1.13.0` or `@mastra/observability@1.15.1` | 2/5 | 4/5 | Unchanged. Essential before shipping tutoring agents. |
| **P2** | Add `@ai-sdk/xai@3.0.97` for Grok model routing | 1/5 | 3/5 | **NEW.** Expands model choice through AI Gateway. |
| **P3** | Upgrade `pg` to 8.22.0 and evaluate `neon-init@0.19.0` | 1/5 | 2/5 | **NEW.** Low-risk driver and init helper updates. |
| **P3** | Add `@sentry/vercel-edge@10.60.0` for Edge error monitoring | 1/5 | 3/5 | **NEW.** Production reliability for Vercel Edge Functions. |
| **P2** | Evaluate `@ai-sdk/langchain@2.0.217` for LangGraph integration | 3/5 | 4/5 | Minor patch only. Still relevant for P4 multi-agent architecture. |
| **P3** | Enable pgvector in Neon; embed cocktails + lessons | 3/5 | 5/5 | Unchanged. Embeddings confirmed via AI Gateway. |
| **P4** | Wrap school schema as MCP tools (lessons, tests, progress) | 3/5 | 5/5 | Unchanged. MCP.io docs confirm cross-client support. |
| **P5** | Pilot automated test generation in Foundations category | 2/5 | 5/5 | Unchanged. Quick win; validate rubric scoring before scaling. |
| **Watch** | Evaluate `@tanstack/ai@0.34.0` if project adopts TanStack Query | — | — | **NEW.** Headless AI alternative; low priority. |
| **Watch** | Monitor `@electric-sql/pglite@0.5.3` for offline lesson access | — | — | **NEW.** Local Postgres in Edge; premature for current stack. |

---

## Risk and Compliance Considerations (2026 Context)
*Unchanged from June 21.*

- **Academic integrity:** Include responsible-use guardrails and AI-literacy curricula (UNESCO 2024 guidance).
- **Bias and hallucinations:** Use evaluator-optimizer loops and human-in-the-loop checkpoints for high-stakes assessment.
- **Data protection:** Log all agent actions in Postgres for auditability (EU AI Act Article 4).
- **Model costs:** Budget for embedding generation and LLM inference; use Vercel Edge caching + AI Gateway cost controls.

---

## Honest Assessment

The June 24 research cycle found **meaningful new adapter releases** since June 23, most notably `@mastra/pg@1.14.1` and the expanded AI SDK provider lineup (`@ai-sdk/xai`, `@ai-sdk/anthropic` patch). These reinforce the ecosystem trend of **deepening integration between agent frameworks and the underlying data/provider layer**, rather than introducing entirely new orchestration paradigms.

For Bartender Sanctuary, `@mastra/pg` is the single most actionable new package because it directly addresses the platform’s core dependency (Postgres/Neon) from the agent layer. Combined with `ai-sdk-tools` and the AI Gateway providers, the path to a working tutoring agent is clearer than it was 48 hours ago.

The **zero-AI-deps gap in `package.json` remains the critical blocker**. Every recommendation above is blocked until at least `ai` v6 + a provider package are installed.

No bartending-specific AI packages exist on npm. The best path remains building **domain-specific MCP tools** wrapping the existing Neon schema.

---

## Sources

- npm registry: `ai` v6.0.209, `@ai-sdk/gateway` v3.0.134, `@ai-sdk/openai` v3.0.74, `@ai-sdk/anthropic` v3.0.86, `@ai-sdk/xai` v3.0.97, `@ai-sdk/langchain` v2.0.217, `ai-sdk-tools` v1.2.0, `@ai-sdk-tools/agents` v1.2.0, `@modelcontextprotocol/sdk` v1.29.0, `@neondatabase/serverless` v1.1.0, `@neondatabase/neon-js` v0.6.2-beta, `pgvector` v0.3.0, `@framers/agentos` v0.9.78, `@mastra/core` v1.46.0, `@mastra/observability` v1.15.1, `@mastra/pg` v1.14.1, `@anthropic-ai/claude-agent-sdk` v0.3.187, `@inngest/agent-kit` v0.13.2, `openlit` v1.13.0, `@microsoft/agents-a365-observability` v1.1.0-preview.7, `@langchain/langgraph` v1.4.5, `langchain` v1.5.2, `@langchain/core` v1.2.1, `next` 16.2.9, `pg` 8.22.0, `neon-init` 0.19.0, `@sentry/vercel-edge` 10.60.0, `@logtape/drizzle-orm` 2.2.1, `@electric-sql/pglite` 0.5.3, `@tanstack/ai` 0.34.0
- MCP ecosystem: official Notion, BrowserStack, Heroku, HubSpot, Alchemy, Chrome DevTools, Sentry, Apify servers; `@ayatec/ai-gateway-mcp-server@0.10.1`
- Vercel docs: https://vercel.com/docs/ai-gateway (embeddings, reranking, multi-modal confirmed)
- Model Context Protocol: https://modelcontextprotocol.io/docs
- Bartender Sanctuary codebase: `package.json` (`pg` ^8.21.0 only; no AI deps installed)
- Previous reports: `docs/agent-skills-research-2026-06-16.md` through `docs/agent-skills-research-2026-06-23.md`
