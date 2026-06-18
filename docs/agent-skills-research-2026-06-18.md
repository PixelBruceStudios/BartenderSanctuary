# 2026 AI Agent Skills Research — Bartender Sanctuary
**Research Date:** June 18, 2026  
**Target Stack:** Next.js 13.5 (Pages Router) + Postgres (Neon) + Vercel  
**Focus:** Bartending school platform — lessons, tests, progress tracking, cocktail/ingredient data, user engagement  
**Previous Report:** June 17, 2026 — `docs/agent-skills-research-2026-06-17.md`  
**Previous Report:** June 16, 2026 — `references/agent-skills-research-2026-06-16.md`

---

## Executive Summary

The June 17 findings remain fully valid — no core packages have changed. One new development warrants attention: **Vercel AI SDK Gateway provider** (`@ai-sdk/gateway` v3.0.133) is now a first-class option for multi-model routing, relevant to Bartender Sanctuary's planned tutoring and admin AI features. The rest of the ecosystem (MCP SDK, Neon serverless driver, pgvector) is stable. The project's zero-AI-deps state persists — the upgrade path described on June 17 is still open and urgent.

---

## Verified Package Versions (as of June 18)

| Package | June 17 version | June 18 version | Change |
|---------|----------------|----------------|--------|
| `ai` (Vercel AI SDK) | 6.0.207 | **6.0.208** | Patch — bug fixes |
| `@modelcontextprotocol/sdk` | 1.29.0 | **1.29.0** | No change |
| `@neondatabase/serverless` | 1.1.0 | **1.1.0** | No change |
| `pgvector` | 0.3.0 | **0.3.0** | No change |
| `@ai-sdk/openai` | 3.0.73 | **3.0.73** | No change |
| `@ai-sdk/gateway` | — | **3.0.133** | **NEW** |
| `pg` (current project dep) | 8.21.0 | **8.21.0** | Still in use |

---

## Top 5 Relevant Developments (Updated June 18)

### 1. Vercel AI SDK Gateway Provider — Multi-Model Routing ⭐ NEW
**What it is:**  
`@ai-sdk/gateway` reached **v3.0.133** (npm). The Gateway provider lets any Vercel AI SDK v6 app route LLM calls through Vercel's AI Gateway, which handles model fallback, rate limiting, cost tracking, and unified API keys across providers.

**Why it matters for Bartender Sanctuary:**  
The school platform needs model flexibility — tutoring chat might use Claude for quality, while assessment generation might use cheaper/faster models. The Gateway provider means:
- Single provider setup (`createGatewayAI`) for all models, with fallback chains
- Cost observability per feature (tutoring vs. assessment vs. content generation)
- No code changes when swapping underlying models
- Keeps API keys off the server (Vercel-managed)

**Implementation Difficulty:** 2/5  
- Install `@ai-sdk/gateway` ^3.0.133 alongside `ai` ^6.x
- Configure Vercel project with AI Gateway enabled
- Replace provider imports with `createGatewayAI()` — minimal code change
- Works with existing `streamText()` and `generateText()` calls

**Potential Impact:** 4/5  
- Reduces per-model config overhead as AI features grow
- Enables cost-tiered model selection (premium for tutoring, budget for bulk generation)
- Future-proofs against model-API churn

**Stack-Specific Note:**  
The Gateway provider is a Vercel-first feature. Bartender Sanctuary is already on Vercel, so this integrates without new infrastructure. Install alongside the core `ai` upgrade (P1 from June 17).

---

### 2. MCP Ecosystem Maturation (SDK v1.29 + Official Servers) — STABLE
*No change from June 17.*

The Model Context Protocol SDK remains at **v1.29.0**. The `server-everything`, `server-sequential-thinking`, `server-memory`, and `server-filesystem` packages are actively maintained. Production readiness confirmed — no breaking changes since June 16 research.

**Status:** Green light for integration. No blockers.

---

### 3. Vercel AI SDK v6 — Production Streaming + Tool Use Baseline — STABLE
*No breaking changes; minor patch from v6.0.207 → v6.0.208.*

The SDK remains the established baseline. The new `@ai-sdk/gateway` provider (item #1 above) is a complementary addition — it does not replace the core `ai` package but extends its provider options.

**Status:** Still the highest-ROI first step. Project has **zero AI deps** — gap unchanged.

---

### 4. Neon Serverless Postgres Driver — Edge-Ready Database Access — STABLE
*No change from June 17.*

`@neondatabase/serverless` v1.1.0 is the current stable. The `pg` → `@neondatabase/serverless` migration remains the recommended prerequisite before adding AI features.

**Status:** Still P1. No version changes; path remains identical.

---

### 5. pgvector — Semantic Search for Cocktails & Curriculum — STABLE
*No change from June 17.*

`pgvector` npm v0.3.0 + Neon `vector` extension remains ready. Enabling it requires a SQL migration (`CREATE EXTENSION vector;`) and Neon supports this natively.

**Status:** Still P3. Requires schema migration; high payoff for adaptive tutoring.

---

## New Ecosystem Signals (Watching, Not Yet Prioritized)

| Signal | Package | Status | Why it matters |
|--------|---------|--------|----------------|
| MCP-powered chat framework | `@open-mercato/ai-assistant` v0.6.5 | **Early stage** (0.x) | MCP-based tool execution for chat. Could inspire Bartender Sanctuary's tutoring bot pattern, but too immature to adopt now. |
| Autonomous agent framework | `@framers/agentos` v0.9.65 | **Early stage** (0.x) | TypeScript agent framework with graph-based orchestration. Watch for v1.0 release; may simplify multi-agent admin + tutoring workflows. |
| Mastra agent framework | `@mastra/core` v1.43.0 | **Stable** (v1.x) | Framework for building AI agents with tools, memory, and human-in-the-loop. Could accelerate tutoring agent development but adds abstraction layer. Assess after MCP wrapper is built. |
| Evaluator-optimizer pattern | — | **Conceptual** (no new package) | Anthropic's canonical pattern (Dec 2024) is still the best approach for automated assessment. Implement with Vercel AI SDK v6 `generateText()` + manual evaluation loop — no dedicated package needed. |

---

## Delta from June 17 Report

| Topic | June 17 Assessment | June 18 Update |
|-------|-------------------|----------------|
| Core package versions | Stable | No changes. `ai` patch from 6.0.207 → 6.0.208 only. |
| `@ai-sdk/gateway` | Not mentioned | **NEW — v3.0.133.** Multi-model routing via Vercel AI Gateway. Relevant for cost-optimized tutoring + assessment workflows. |
| `@open-mercato/ai-assistant` | Not mentioned | **NEW — v0.6.5.** Early-stage MCP chat framework. Watching only. |
| `@framers/agentos` | Not mentioned | **NEW — v0.9.65.** Early-stage TS agent framework. Watching only. |
| `@mastra/core` | Not mentioned | **NEW — v1.43.0.** Stable v1.x agent framework. Post-MCP assessment candidate. |
| Project AI deps installed | None | **None** — gap persists. All P1–P5 recommendations remain actionable. |
| MCP SDK | v1.29.0 stable | No change. |
| Neon driver | v1.1.0 | No change. |
| pgvector | v0.3.0 | No change. |

---

## Updated Recommendations (Priority Order)

| Priority | Action | Difficulty | Impact | Delta from June 17 |
|----------|--------|-----------|--------|-------------------|
| **P1** | Migrate `pg` → `@neondatabase/serverless` v1.1.0 | 2/5 | 4/5 | Unchanged. Prerequisite for all AI work. |
| **P1-updated** | Install `ai` ^6.0.208 + `@ai-sdk/gateway` ^3.0.133 (+ provider) | 2/5 | 5/5 | Add Gateway provider for multi-model routing and cost control. |
| **P3** | Enable pgvector in Neon; embed cocktails + lessons | 3/5 | 5/5 | Unchanged. Powers semantic search and adaptive tutoring. |
| **P4** | Wrap school schema as MCP tools (lessons, tests, progress) | 3/5 | 5/5 | Unchanged. Future-proofs integration surface. |
| **P5** | Pilot automated test generation in Foundations category | 2/5 | 5/5 | Unchanged. Quick win; validate rubric scoring before scaling. |
| **Watch** | Evaluate `@mastra/core` after MCP wrapper is built | — | — | **NEW.** Assess for tutoring agent scaffolding once MCP foundation is in place. |

---

## Risk and Compliance Considerations (2026 Context)
*Unchanged from June 17.*

- **Academic integrity:** Include responsible-use guardrails and AI-literacy curricula (UNESCO 2024 guidance).
- **Bias and hallucinations:** Use evaluator-optimizer loops and human-in-the-loop checkpoints for high-stakes assessment.
- **Data protection:** Log all agent actions in Postgres for auditability (EU AI Act Article 4).
- **Model costs:** Budget for embedding generation and LLM inference; use Vercel Edge caching + AI Gateway cost controls.

---

## Sources

- npm registry: `ai` v6.0.208, `@ai-sdk/gateway` v3.0.133, `@ai-sdk/openai` v3.0.73, `@modelcontextprotocol/sdk` v1.29.0, `@neondatabase/serverless` v1.1.0, `pgvector` v0.3.0, `@open-mercato/ai-assistant` v0.6.5, `@framers/agentos` v0.9.65, `@mastra/core` v1.43.0
- Bartender Sanctuary codebase: `package.json` (`pg` ^8.21.0 only; no AI deps installed)
- Previous report: `docs/agent-skills-research-2026-06-17.md`
