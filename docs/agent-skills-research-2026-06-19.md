# 2026 AI Agent Skills Research — Bartender Sanctuary
**Research Date:** June 19, 2026  
**Target Stack:** Next.js 13.5 (Pages Router) + Postgres (Neon) + Vercel  
**Focus:** Bartending school platform — lessons, tests, progress tracking, cocktail/ingredient data, user engagement  
**Previous Report:** June 18, 2026 — `docs/agent-skills-research-2026-06-18.md`

---

## Executive Summary

The June 18 findings remain valid with two package-version updates confirmed via npm registry. The ecosystem is in a stable, production-ready window. One signal now warrants a priority adjustment: **`@mastra/core` has progressed to v1.45.0** (was v1.43.0 on June 18), with active maintainer momentum that makes it a credible post-MCP scaffolding candidate. All other packages are unchanged. The project's zero-AI-deps state persists — the urgent gap described on June 17 is still open.

---

## Verified Package Versions (as of June 19)

| Package | June 18 version | June 19 version | Change |
|---------|----------------|----------------|--------|
| `ai` (Vercel AI SDK) | 6.0.208 | **6.0.208** | No change |
| `@modelcontextprotocol/sdk` | 1.29.0 | **1.29.0** | No change |
| `@neondatabase/serverless` | 1.1.0 | **1.1.0** | No change |
| `pgvector` | 0.3.0 | **0.3.0** | No change |
| `@ai-sdk/openai` | 3.0.73 | **3.0.73** | No change |
| `@ai-sdk/gateway` | 3.0.133 | **3.0.133** | No change |
| `@ai-sdk/anthropic` | — | **3.0.85** | NEW — Anthropic provider for AI SDK |
| `@mastra/core` | 1.43.0 | **1.45.0** | **Minor bump — active maintenance** |
| `@framers/agentos` | 0.9.65 | **0.9.75** | **Minor bump — early stage** |
| `@open-mercato/ai-assistant` | 0.6.5 | **0.6.5** | No change |
| `pg` (current project dep) | 8.21.0 | **8.21.0** | Still in use |

---

## Top 5 Relevant Developments (Updated June 19)

### 1. Vercel AI SDK Gateway Provider — Multi-Model Routing ⭐ P1
*No change from June 18 — stable and recommended.*

`@ai-sdk/gateway` v3.0.133. The Gateway provider lets any Vercel AI SDK v6 app route LLM calls through Vercel's AI Gateway, which handles model fallback, rate limiting, cost tracking, and unified API keys across providers.

**Implementation Difficulty:** 2/5
- Install `@ai-sdk/gateway` ^3.0.133 alongside `ai` ^6.x
- Configure Vercel project with AI Gateway enabled
- Replace provider imports with `createGatewayAI()` — minimal code change
- Works with existing `streamText()` and `generateText()` calls

**Potential Impact:** 4/5
- Reduces per-model config overhead as AI features grow
- Enables cost-tiered model selection (premium for tutoring, budget for bulk generation)
- Future-proofs against model-API churn

**Stack-Specific Note:** The Gateway provider is a Vercel-first feature. Bartender Sanctuary is already on Vercel, so this integrates without new infrastructure. Install alongside the core `ai` upgrade (P1 from June 17).

---

### 2. MCP Ecosystem Maturation (SDK v1.29 + Official Servers) — P1-equivalent
*No change from June 17 — production-stable.*

The Model Context Protocol SDK remains at **v1.29.0**. The `server-everything`, `server-sequential-thinking`, `server-memory`, and `server-filesystem` packages are actively maintained. Production readiness confirmed.

**Why it matters:** Wrapping the existing Neon Postgres schema (lessons, tests, progress, cocktails, ingredients) as MCP tools lets any LLM feature read/write school data without bespoke glue. This is the integration layer that makes automated tutoring, admin copilots, and curriculum generation interchangeable across model providers.

**Implementation Difficulty:** 3/5
- Mature TypeScript SDKs fit the existing Next.js stack.
- Requires designing permission-bound tool schemas (student vs. admin).
- Deploy MCP server as a Next.js API route or standalone edge function; use `@neondatabase/serverless` for Postgres access.

**Potential Impact:** 5/5
- Reduces integration surface for every new AI feature.
- Enables model swapping without refactoring business logic.
- Accelerates tutoring bot, auto-grader, and admin assistant development.

---

### 3. Vercel AI SDK v6 — Production Streaming + Tool Use Baseline — P1
*No breaking changes; still at v6.0.208.*

The SDK remains the established baseline. `@ai-sdk/anthropic` v3.0.85 is now confirmed available alongside `@ai-sdk/openai` v3.0.73, giving Bartender Sanctuary two provider options for the core `ai` install.

**Why it matters:** The platform currently has **no AI SDK installed** (`ai` and `@ai-sdk/openai` are absent from `package.json`). Vercel AI SDK v6 is the lowest-friction path to adding streaming chat, tool-using agents, and LLM-generated content directly in Next.js Server Components or API routes.

**Implementation Difficulty:** 2/5
- Install `ai` ^6.x and a provider package (`@ai-sdk/openai` ^3.x or `@ai-sdk/anthropic` ^3.x).
- Wrap existing API routes with `streamText()` for server-side streaming.
- Use `generateText()` with `tools` for structured quiz generation and grading.

**Potential Impact:** 5/5
- Enables streaming tutoring chat UI with minimal React code.
- Tool calling lets the LLM query lessons/tests/progress via MCP or direct Postgres queries.
- Generates UI (e.g., quiz cards) from tool outputs via `streamUI`.

---

### 4. pgvector + Neon — Semantic Search for Cocktails & Curriculum — P3
*No change from June 18 — stable and ready.*

`pgvector` npm v0.3.0 + Neon `vector` extension remains ready. Enabling it requires a SQL migration (`CREATE EXTENSION vector;`) and Neon supports this natively.

**Why it matters:** Semantic search over cocktail/ingredient descriptions and lesson content enables adaptive tutoring — the platform can recommend the next lesson or cocktail based on what the user already knows, not just hardcoded linear paths.

**Implementation Difficulty:** 3/5
- Run `CREATE EXTENSION vector;` in Neon.
- Generate embeddings for existing lesson bodies, cocktail descriptions, and ingredient notes (one-time batch job).
- Store embeddings alongside content; query with cosine similarity in API routes.

**Potential Impact:** 5/5
- Powers adaptive lesson sequencing.
- Enables natural-language cocktail search ("find a cocktail with elderflower and gin").
- Provides retrieval context for tutoring LLM (grounded answers vs. hallucinations).

---

### 5. `@mastra/core` v1.45.0 — Stable Agent Scaffolding ⬆ UPGRADED TO WATCH-LIST CANDIDATE
*New since June 18 — version bump 1.43.0 → 1.45.0, active maintainer momentum.*

**What it is:** `@mastra/core` is a framework for building AI agents with tools, memory, and human-in-the-loop workflows. It reached **v1.45.0** (npm). The v1.x line is production-stable.

**Why it matters for Bartender Sanctuary:** Could accelerate tutoring agent development once the MCP wrapper (P1-equivalent) is in place. It provides:
- Structured agent + tool definitions
- Built-in memory layer (replaces hand-rolled progress tracking for agent sessions)
- Human-in-the-loop checkpoints (critical for assessment before final grades)

**Implementation Difficulty:** 3/5 (post-MCP)
- Add `@mastra/core` alongside `ai` and MCP server.
- Define Mastra agents that consume MCP tools as function calls.
- Requires MCP wrapper to exist first; not a standalone starting point.

**Potential Impact:** 4/5
- Reduces boilerplate for tutoring and admin agent loops.
- Provides opinionated scaffolding vs. raw SDK calls.
- Easier onboarding for future contributors familiar with agent frameworks.

**Stack-Specific Note:** Assess after MCP integration is complete (P1-equivalent milestone). The v1.45.0 bump signals healthy maintenance — worth revisiting within 2–4 weeks if the MCP work is on track.

---

## New Ecosystem Signals (Watching Only)

| Signal | Package | Status | Why it matters |
|--------|---------|--------|----------------|
| AgentOS framework | `@framers/agentos` v0.9.75 | **Early stage** (0.x) | TypeScript agent framework with graph orchestration and 11 LLM providers. Still pre-1.0; monitor for v1.0 before assessing adoption. |
| MCP chat framework | `@open-mercato/ai-assistant` v0.6.5 | **Early stage** (0.x) | MCP-based tool execution for chat. Could inspire tutoring bot pattern, but too immature. |
| Anthropic provider | `@ai-sdk/anthropic` v3.0.85 | **Stable** | New provider option for AI SDK. Relevant if Bartender Sanctuary prefers Claude for tutoring quality. |

---

## Delta from June 18 Report

| Topic | June 18 Assessment | June 19 Update |
|-------|-------------------|----------------|
| `@mastra/core` | v1.43.0, watch-list candidate | **v1.45.0 — active maintenance.** Stronger case for post-MCP assessment. |
| `@framers/agentos` | v0.9.65, early stage | **v0.9.75 — still early, no adoption change.** |
| `@open-mercato/ai-assistant` | v0.6.5, watching only | **Unchanged.** |
| `@ai-sdk/anthropic` | Not tracked | **NEW — v3.0.85.** Confirmed as stable provider option alongside OpenAI. |
| Core package versions | `ai` 6.0.208, `@ai-sdk/gateway` 3.0.133 | **No changes.** All stable. |
| Project AI deps installed | None | **None — gap persists.** All P1–P5 recommendations remain actionable. |

---

## Updated Recommendations (Priority Order)

| Priority | Action | Difficulty | Impact | Delta from June 18 |
|----------|--------|-----------|--------|-------------------|
| **P1** | Migrate `pg` → `@neondatabase/serverless` v1.1.0 | 2/5 | 4/5 | Unchanged. Prerequisite for all AI work. |
| **P1** | Install `ai` ^6.0.208 + `@ai-sdk/gateway` ^3.0.133 (+ provider) | 2/5 | 5/5 | Unchanged. Add Gateway provider for multi-model routing and cost control. |
| **P3** | Enable pgvector in Neon; embed cocktails + lessons | 3/5 | 5/5 | Unchanged. Powers semantic search and adaptive tutoring. |
| **P4** | Wrap school schema as MCP tools (lessons, tests, progress) | 3/5 | 5/5 | Unchanged. Future-proofs integration surface. |
| **P5** | Pilot automated test generation in Foundations category | 2/5 | 5/5 | Unchanged. Quick win; validate rubric scoring before scaling. |
| **Watch** | Evaluate `@mastra/core` v1.45.0 after MCP wrapper is built | — | — | **UPGRADED.** Active v1.45.0 maintenance makes this a stronger candidate for post-MCP scaffolding. |

---

## Risk and Compliance Considerations (2026 Context)
*Unchanged from June 18.*

- **Academic integrity:** Include responsible-use guardrails and AI-literacy curricula (UNESCO 2024 guidance).
- **Bias and hallucinations:** Use evaluator-optimizer loops and human-in-the-loop checkpoints for high-stakes assessment.
- **Data protection:** Log all agent actions in Postgres for auditability (EU AI Act Article 4).
- **Model costs:** Budget for embedding generation and LLM inference; use Vercel Edge caching + AI Gateway cost controls.

---

## Sources

- npm registry: `ai` v6.0.208, `@ai-sdk/gateway` v3.0.133, `@ai-sdk/openai` v3.0.73, `@ai-sdk/anthropic` v3.0.85, `@modelcontextprotocol/sdk` v1.29.0, `@neondatabase/serverless` v1.1.0, `pgvector` v0.3.0, `@open-mercato/ai-assistant` v0.6.5, `@framers/agentos` v0.9.75, `@mastra/core` v1.45.0
- Bartender Sanctuary codebase: `package.json` (`pg` ^8.21.0 only; no AI deps installed)
- Previous reports: `docs/agent-skills-research-2026-06-18.md`, `docs/agent-skills-research-2026-06-17.md`
