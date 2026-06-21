# 2026 AI Agent Skills Research — Bartender Sanctuary
**Research Date:** June 21, 2026  
**Target Stack:** Next.js + Postgres (Neon) + Vercel  
**Focus:** Bartending school platform — lessons, tests, progress tracking, cocktail/ingredient data, user engagement  
**Previous Report:** June 20, 2026 — `docs/agent-skills-research-2026-06-20.md`

---

## Executive Summary

The ecosystem remains in a **stable, production-ready window** with no breaking changes since June 20. All core package versions are identical. The project's **zero-AI-deps state persists**. No bartending-specific AI packages surfaced from the npm registry.

However, two new June 2026 signals sharpen the picture:
1. **Martin Fowler / Thoughtworks (June 16):** "Building Reliable Agentic AI Systems" — a Bayer case study validating production multi-agent RAG patterns (context engineering, harness engineering, reflection loops, observability). This directly reinforces the P4 LangGraph recommendation.
2. **Cloudflare (June 19):** "Temporary Cloudflare Accounts for AI agents" — agent-native identity/auth. Lower immediate priority but signals infrastructure maturation for autonomous agents.

The honest signal for June 21 is: the recommended stack (Vercel AI SDK v6 + AI Gateway + MCP + pgvector) remains the correct target. The window of stability is a good time to begin P1 migrations.

---

## Verified Package Versions (as of June 21)

| Package | June 20 version | June 21 version | Change |
|---------|----------------|----------------|--------|
| `ai` (Vercel AI SDK) | 6.0.208 | **6.0.208** | No change |
| `@ai-sdk/gateway` | 3.0.133 | **3.0.133** | No change |
| `@ai-sdk/openai` | 3.0.73 | **3.0.73** | No change |
| `@ai-sdk/anthropic` | 3.0.85 | **3.0.85** | No change |
| `@neondatabase/serverless` | 1.1.0 | **1.1.0** | No change |
| `@modelcontextprotocol/sdk` | 1.29.0 | **1.29.0** | No change |
| `pgvector` | 0.3.0 | **0.3.0** | No change |
| `@mastra/core` | 1.45.0 | **1.45.0** | No change |
| `@framers/agentos` | 0.9.75 | **0.9.75** | No change |
| `pg` (current project dep) | 8.21.0 | **8.21.0** | Still in use |
| `langchain` | 1.5.0 | **1.5.0** | No change |
| `@langchain/core` | 1.2.0 | **1.2.0** | No change |
| `@langchain/langgraph` | 1.4.4 | **1.4.4** | No change |
| `next` | 16.2.9 | **16.2.9** | No change |

---

## Top 5 Relevant Developments (Updated June 21)

### 1. Vercel AI SDK Gateway Provider — Multi-Model Routing ⭐ P1
*No change from June 20 — stable and recommended.*

`@ai-sdk/gateway` v3.0.133. The Gateway provider routes LLM calls through Vercel's AI Gateway, handling model fallback, rate limiting, cost tracking, and unified API keys across providers. The June 20 Vercel docs confirm production coverage: text generation, embeddings, reranking, multi-modal (image/video/realtime/speech), provider allowlists, API key budgets, and routing rules.

**Implementation Difficulty:** 2/5
- Install `@ai-sdk/gateway` ^3.0.133 alongside `ai` ^6.x
- Configure Vercel project with AI Gateway enabled
- Replace provider imports with `createGatewayAI()` — minimal code change
- Works with existing `streamText()` and `generateText()` calls

**Potential Impact:** 4/5
- Reduces per-model config overhead as AI features grow
- Enables cost-tiered model selection (premium for tutoring, budget for bulk generation)
- Future-proofs against model-API churn
- Embeddings and reranking support enable retrieval-augmented generation on Neon

**Stack-Specific Note:** The Gateway provider is a Vercel-first feature. Bartender Sanctuary is already on Vercel, so this integrates without new infrastructure.

---

### 2. MCP Ecosystem Maturation (SDK v1.29 + Official Servers) — P1-equivalent
*No change from June 20 — production-stable.*

The Model Context Protocol SDK remains at **v1.29.0**. The MCP docs (modelcontextprotocol.io) confirm broad client support: Claude, ChatGPT, VS Code, Cursor, MCPJam, and many others all support MCP — making it a viable "write once, integrate everywhere" layer for Bartender Sanctuary's school data.

**Why it matters:** Wrapping the existing Neon Postgres schema (lessons, tests, progress, cocktails, ingredients) as MCP tools lets any LLM feature read/write school data without bespoke glue. This is the integration layer that makes automated tutoring, admin copilots, and curriculum generation interchangeable across model providers.

**Implementation Difficulty:** 3/5
- Mature TypeScript SDKs fit the existing Next.js stack
- Requires designing permission-bound tool schemas (student vs. admin)
- Deploy MCP server as a Next.js API route or standalone edge function; use `@neondatabase/serverless` for Postgres access

**Potential Impact:** 5/5
- Reduces integration surface for every new AI feature
- Enables model swapping without refactoring business logic
- Accelerates tutoring bot, auto-grader, and admin assistant development

---

### 3. Vercel AI SDK v6 — Production Streaming + Tool Use Baseline — P1
*No breaking changes; still at v6.0.208.*

The SDK remains the established baseline. `@ai-sdk/anthropic` v3.0.85 is confirmed available alongside `@ai-sdk/openai` v3.0.73, giving Bartender Sanctuary two provider options. The June 20 Vercel AI Gateway getting-started page uses `streamText` with `openai/gpt-5.5` as its canonical example, confirming the documented setup flow is current.

**Why it matters:** The platform currently has **no AI SDK installed** (`ai` and `@ai-sdk/openai` are absent from `package.json`). Vercel AI SDK v6 is the lowest-friction path to adding streaming chat, tool-using agents, and LLM-generated content directly in Next.js Server Components or API routes.

**Implementation Difficulty:** 2/5
- Install `ai` ^6.x and a provider package (`@ai-sdk/openai` ^3.x or `@ai-sdk/anthropic` ^3.x)
- Wrap existing API routes with `streamText()` for server-side streaming
- Use `generateText()` with `tools` for structured quiz generation and grading

**Potential Impact:** 5/5
- Enables streaming tutoring chat UI with minimal React code
- Tool calling lets the LLM query lessons/tests/progress via MCP or direct Postgres queries
- Generates UI (e.g., quiz cards) from tool outputs via `streamUI`

---

### 4. Production Multi-Agent Patterns Validated (Martin Fowler / Thoughtworks, June 2026) — P4
*New signal since June 20 — reinforces and extends existing recommendation.*

A June 16, 2026 case study on martinfowler.com details Bayer's PRINCE platform (built with Thoughtworks), an agentic RAG system for pharmaceutical research. Key patterns directly applicable to Bartender Sanctuary:

- **Context engineering:** shaping what information each model receives and routing context between specialized agents
- **Harness engineering:** orchestration, tool boundaries, state persistence, retries, fallbacks, validation, reflection loops, observability, and human review
- **Multi-agent pipeline:** Clarify → Think & Plan → Researcher → Reflection → Writer
- **Trust mechanisms:** transparency, explainability, evaluation, monitoring, human-in-the-loop integration

**Why it matters:** This is independent validation (pharma domain, not education) that the multi-agent tutoring architecture recommended on June 19–20 is production-proven. The "reflection agent" pattern is especially relevant for tutoring: an LLM generates an answer, a second agent validates it against curriculum standards, and a third synthesizes personalized feedback.

**Implementation Difficulty:** 4/5
- Requires a state machine or graph runtime (LangGraph v1.4.4)
- Need explicit evaluation criteria (e.g., "does this quiz item match standard X?")
- Postgres stores agent state, checkpoints, and evaluation scores; Next.js streams progress to the UI

**Potential Impact:** 4/5
- Enables complex learning workflows (project-based learning, adaptive pathways)
- Improves reliability via iterative evaluator-optimizer loops
- Natural fit for nightly curriculum review automation via Vercel Cron

**Stack-Specific Note:** Assess after Vercel AI SDK v6 + AI Gateway are installed (P1 milestones). LangGraph can consume MCP tools and gateway-routed LLM calls, making it a natural layer above the P1 infrastructure.

---

### 5. pgvector + Neon — Semantic Search for Cocktails & Curriculum — P3
*No change from June 20 — stable and ready.*

`pgvector` npm v0.3.0 + Neon `vector` extension remains ready. The Vercel AI Gateway docs list Embeddings and Reranking as supported modalities, meaning Bartender Sanctuary can generate embeddings via the Gateway and store them in Neon/pgvector in a single stack.

**Why it matters:** Semantic search over cocktail/ingredient descriptions and lesson content enables adaptive tutoring — the platform can recommend the next lesson or cocktail based on what the user already knows, not just hardcoded linear paths.

**Implementation Difficulty:** 3/5
- Run `CREATE EXTENSION vector;` in Neon
- Generate embeddings for existing lesson bodies, cocktail descriptions, and ingredient notes (one-time batch job)
- Store embeddings alongside content; query with cosine similarity in API routes

**Potential Impact:** 5/5
- Powers adaptive lesson sequencing
- Enables natural-language cocktail search ("find a cocktail with elderflower and gin")
- Provides retrieval context for tutoring LLM (grounded answers vs. hallucinations)

---

## New Ecosystem Signals (Watching Only)

| Signal | Package/Version | Status | Why it matters |
|--------|----------------|--------|----------------|
| LangChain 1.x stable | `langchain` 1.5.0, `langgraph` 1.4.4 | **Stable** | Multi-agent orchestration runtime. Mature alternative to Mastra. |
| AgentOS framework | `@framers/agentos` v0.9.75 | **Early stage** (0.x) | TypeScript agent framework with graph orchestration. Still pre-1.0; monitor. |
| Mastra agent scaffolding | `@mastra/core` v1.45.0 | **Stable** | Active maintenance. Evaluate post-MCP wrapper. |
| Anthropic provider | `@ai-sdk/anthropic` v3.0.85 | **Stable** | Confirmed provider option. Relevant if Claude is preferred for tutoring quality. |
| Bartending-specific AI | npm search | **None found** | No npm packages target bartending/AI. Opportunity for custom tooling. |
| Agent identity/auth | Cloudflare temporary accounts (June 2026) | **New infrastructure signal** | Agents can now claim temporary accounts for deployments. Not immediately actionable for Bartender Sanctuary but indicates ecosystem maturation for autonomous agent workflows. |

---

## Delta from June 20 Report

| Topic | June 20 Assessment | June 21 Update |
|-------|-------------------|----------------|
| Core package versions | All stable | **No changes.** Stable window continues. |
| `@ai-sdk/anthropic` | v3.0.85, new provider option | **Unchanged.** Still the recommended second provider. |
| `@mastra/core` | v1.45.0, watch-list | **Unchanged.** Active maintenance confirmed; still post-MCP. |
| `@framers/agentos` | v0.9.75, early stage | **Unchanged.** |
| LangChain / LangGraph | Not tracked | **Unchanged.** 1.5.0 / 1.4.4 still the baseline. |
| Project AI deps installed | None | **None — gap persists.** All P1–P5 recommendations remain actionable. |
| Bartending-specific AI tools | Not checked | **None on npm.** Custom MCP tools remain the best path. |
| **Production agentic patterns** | Not tracked | **NEW.** Martin Fowler / Thoughtworks case study (June 16) validates multi-agent RAG with reflection loops and harness engineering for Bartender Sanctuary's tutoring architecture. |
| **Agent identity infra** | Not tracked | **NEW.** Cloudflare temporary accounts (June 19) signal maturing agent-native infrastructure. |

---

## Updated Recommendations (Priority Order)

| Priority | Action | Difficulty | Impact | Delta from June 20 |
|----------|--------|-----------|--------|-------------------|
| **P1** | Migrate `pg` → `@neondatabase/serverless` v1.1.0 | 2/5 | 4/5 | Unchanged. Prerequisite for all AI work. |
| **P1** | Install `ai` ^6.0.208 + `@ai-sdk/gateway` ^3.0.133 + provider (`openai` or `anthropic`) | 2/5 | 5/5 | Unchanged. Gateway confirmed production-ready with embeddings + reranking. |
| **P3** | Enable pgvector in Neon; embed cocktails + lessons | 3/5 | 5/5 | Unchanged. Embeddings now confirmed via AI Gateway. |
| **P4** | Wrap school schema as MCP tools (lessons, tests, progress) | 3/5 | 5/5 | Unchanged. MCP.io docs confirm cross-client support. |
| **P4** | Evaluate LangGraph v1.4.4 after P1 + P3 are complete | 4/5 | 4/5 | **Reinforced.** New Thoughtworks case study (June 16) validates the evaluator-optimizer + reflection-agent pattern for production agentic RAG. |
| **P5** | Pilot automated test generation in Foundations category | 2/5 | 5/5 | Unchanged. Quick win; validate rubric scoring before scaling. |
| **Watch** | Evaluate `@mastra/core` v1.45.0 after MCP wrapper is built | — | — | **Unchanged.** Still healthy maintenance, post-MCP candidate. |

---

## Risk and Compliance Considerations (2026 Context)
*Unchanged from June 20.*

- **Academic integrity:** Include responsible-use guardrails and AI-literacy curricula (UNESCO 2024 guidance).
- **Bias and hallucinations:** Use evaluator-optimizer loops and human-in-the-loop checkpoints for high-stakes assessment.
- **Data protection:** Log all agent actions in Postgres for auditability (EU AI Act Article 4).
- **Model costs:** Budget for embedding generation and LLM inference; use Vercel Edge caching + AI Gateway cost controls.

---

## Honest Assessment

The June 21 research cycle found **no new package version changes** since June 20. The ecosystem continues its stable production window. The most meaningful development is the June 16 Martin Fowler / Thoughtworks case study on building reliable agentic AI systems, which independently validates the multi-agent tutoring architecture already recommended in this report. The absence of bartending-specific AI packages on npm means Bartender Sanctuary's best path remains building **domain-specific MCP tools** wrapping its existing Neon schema. The gap between the platform's zero-AI-deps state and this production-ready stack is now purely a prioritization and execution question.

---

## Sources

- npm registry: `ai` v6.0.208, `@ai-sdk/gateway` v3.0.133, `@ai-sdk/openai` v3.0.73, `@ai-sdk/anthropic` v3.0.85, `@modelcontextprotocol/sdk` v1.29.0, `@neondatabase/serverless` v1.1.0, `pgvector` v0.3.0, `@framers/agentos` v0.9.75, `@open-mercato/ai-assistant` v0.6.5, `@mastra/core` v1.45.0, `langchain` 1.5.0, `@langchain/core` 1.2.0, `@langchain/langgraph` 1.4.4, `next` 16.2.9
- Vercel docs: https://vercel.com/docs/ai-gateway (last updated May 11, 2026; getting-started page confirms `streamText` + `openai/gpt-5.5` canonical example; embeddings, reranking, and multi-modal listed as supported modalities)
- Model Context Protocol: https://modelcontextprotocol.io/docs — open protocol, supported by Claude, ChatGPT, VS Code, Cursor, MCPJam, and others
- Martin Fowler / Thoughtworks: "Building Reliable Agentic AI Systems" (June 16, 2026) — https://martinfowler.com/articles/reliable-llm-bayer.html
- Cloudflare: "Temporary Cloudflare Accounts for AI agents" (June 19, 2026) — https://blog.cloudflare.com/temporary-accounts/
- Bartender Sanctuary codebase: `package.json` (`pg` ^8.21.0 only; no AI deps installed)
- Previous reports: `docs/agent-skills-research-2026-06-18.md`, `docs/agent-skills-research-2026-06-19.md`, `docs/agent-skills-research-2026-06-20.md`
