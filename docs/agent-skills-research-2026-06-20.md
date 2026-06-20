# 2026 AI Agent Skills Research — Bartender Sanctuary
**Research Date:** June 20, 2026  
**Target Stack:** Next.js 13.5 (Pages Router) + Postgres (Neon) + Vercel  
**Focus:** Bartending school platform — lessons, tests, progress tracking, cocktail/ingredient data, user engagement  
**Previous Report:** June 19, 2026 — `docs/agent-skills-research-2026-06-19.md`

---

## Executive Summary

The ecosystem is in a **stable, production-ready window** with no breaking changes since June 19. All core packages hold their versions. The project's **zero-AI-deps state persists** — the urgent gap first flagged on June 17 remains open. No bartending-specific AI packages surfaced from the npm registry. The honest signal for June 20 is: the landscape has not shifted, the window of stability is a good time to begin the P1 migrations, and the priority stack from June 19 still stands unchanged.

---

## Verified Package Versions (as of June 20)

| Package | June 19 version | June 20 version | Change |
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
| `@open-mercato/ai-assistant` | 0.6.5 | **0.6.5** | No change |
| `pg` (current project dep) | 8.21.0 | **8.21.0** | Still in use |
| `langchain` | — | **1.5.0** | New tracked baseline |
| `@langchain/core` | — | **1.2.0** | New tracked baseline |
| `@langchain/langgraph` | — | **1.4.4** | New tracked baseline |

---

## Top 5 Relevant Developments (Updated June 20)

### 1. Vercel AI SDK Gateway Provider — Multi-Model Routing ⭐ P1
*No change from June 19 — stable and recommended.*

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
*No change from June 17 — production-stable.*

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

### 4. pgvector + Neon — Semantic Search for Cocktails & Curriculum — P3
*No change from June 19 — stable and ready.*

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

### 5. LangGraph + LangChain 1.x — Multi-Agent Orchestration (Evaluator-Optimizer) — P4 (NEW WATCH-ITEM)
*New since June 19 — version bumps confirmed.*

`langchain` v1.5.0, `@langchain/core` v1.2.0, and `@langchain/langgraph` v1.4.4 are all stable. LangGraph is the production runtime for the evaluator-optimizer and orchestrator-workers patterns that Anthropic identified as the most successful agent architectures. The v1.x line is mature and documented.

**Why it matters:** Education tasks are naturally multi-faceted. A single LLM call struggles to simultaneously generate a quiz, align it to standards, grade it fairly, and write personalized feedback. LangGraph lets Bartender Sanctuary build a central pedagogical orchestrator that delegates to specialized workers — content generation, rubric evaluation, feedback synthesis — with explicit state checkpoints in Neon.

**Implementation Difficulty:** 4/5
- Requires a state machine or graph runtime (LangGraph)
- Need explicit evaluation criteria (e.g., "does this quiz item match standard X?")
- Postgres stores agent state, checkpoints, and evaluation scores; Next.js streams progress to the UI

**Potential Impact:** 4/5
- Enables complex learning workflows (project-based learning, adaptive pathways)
- Improves reliability via iterative evaluator-optimizer loops
- Natural fit for nightly curriculum review automation via Vercel Cron

**Stack-Specific Note:** Assess after Vercel AI SDK v6 + AI Gateway are installed (P1 milestones). LangGraph can consume MCP tools and gateway-routed LLM calls, making it a natural layer above the P1 infrastructure.

---

## New Ecosystem Signals (Watching Only)

| Signal | Package/Version | Status | Why it matters |
|--------|----------------|--------|----------------|
| LangChain 1.x stable | `langchain` 1.5.0, `langgraph` 1.4.4 | **Stable** | Multi-agent orchestration runtime. Mature alternative to Mastra. |
| AgentOS framework | `@framers/agentos` v0.9.75 | **Early stage** (0.x) | TypeScript agent framework with graph orchestration. Still pre-1.0; monitor. |
| Mastra agent scaffolding | `@mastra/core` v1.45.0 | **Stable** | Active maintenance. Evaluate post-MCP wrapper. |
| Anthropic provider | `@ai-sdk/anthropic` v3.0.85 | **Stable** | Confirmed provider option. Relevant if Claude is preferred for tutoring quality. |
| Bartending-specific AI | npm search | **None found** | No npm packages target bartending/AI. Opportunity for custom tooling. |

---

## Delta from June 19 Report

| Topic | June 19 Assessment | June 20 Update |
|-------|-------------------|----------------|
| Core package versions | All stable | **No changes.** Stable window continues. |
| `@ai-sdk/anthropic` | v3.0.85, new provider option | **Unchanged.** Still the recommended second provider. |
| `@mastra/core` | v1.45.0, watch-list | **Unchanged.** Active maintenance confirmed; still post-MCP. |
| `@framers/agentos` | v0.9.75, early stage | **Unchanged.** |
| LangChain / LangGraph | Not tracked | **NEW — 1.5.0 / 1.4.4.** Added as P4 watch-item. |
| Project AI deps installed | None | **None — gap persists.** All P1–P5 recommendations remain actionable. |
| Bartending-specific AI tools | Not checked | **None on npm.** Custom MCP tools remain the best path. |

---

## Updated Recommendations (Priority Order)

| Priority | Action | Difficulty | Impact | Delta from June 19 |
|----------|--------|-----------|--------|-------------------|
| **P1** | Migrate `pg` → `@neondatabase/serverless` v1.1.0 | 2/5 | 4/5 | Unchanged. Prerequisite for all AI work. |
| **P1** | Install `ai` ^6.0.208 + `@ai-sdk/gateway` ^3.0.133 + provider (`openai` or `anthropic`) | 2/5 | 5/5 | Unchanged. Gateway confirmed production-ready with embeddings + reranking. |
| **P3** | Enable pgvector in Neon; embed cocktails + lessons | 3/5 | 5/5 | Unchanged. Embeddings now confirmed via AI Gateway. |
| **P4** | Wrap school schema as MCP tools (lessons, tests, progress) | 3/5 | 5/5 | Unchanged. MCP.io docs confirm cross-client support. |
| **P4 (Watch)** | Evaluate LangGraph v1.4.4 after P1 + P3 are complete | 4/5 | 4/5 | **NEW.** Stable 1.x line; fits post-MCP scaffolding. |
| **P5** | Pilot automated test generation in Foundations category | 2/5 | 5/5 | Unchanged. Quick win; validate rubric scoring before scaling. |
| **Watch** | Evaluate `@mastra/core` v1.45.0 after MCP wrapper is built | — | — | **Unchanged.** Still healthy maintenance, post-MCP candidate. |

---

## Risk and Compliance Considerations (2026 Context)
*Unchanged from June 19.*

- **Academic integrity:** Include responsible-use guardrails and AI-literacy curricula (UNESCO 2024 guidance).
- **Bias and hallucinations:** Use evaluator-optimizer loops and human-in-the-loop checkpoints for high-stakes assessment.
- **Data protection:** Log all agent actions in Postgres for auditability (EU AI Act Article 4).
- **Model costs:** Budget for embedding generation and LLM inference; use Vercel Edge caching + AI Gateway cost controls.

---

## Honest Assessment

The June 20 research cycle found **no new disruptive developments** since June 19. This is itself a useful signal: the agent/AI ecosystem has settled into a stable production window where the recommended stack (Vercel AI SDK v6 + AI Gateway + MCP + pgvector) is mature and low-risk. The absence of bartending-specific AI packages on npm means Bartender Sanctuary's best path is to build **domain-specific MCP tools** wrapping its existing Neon schema, rather than adopting generic education SaaS wrappers. The gap between the platform's zero-AI-deps state and this production-ready stack is now purely a prioritization and execution question, not a technology risk question.

---

## Sources

- npm registry: `ai` v6.0.208, `@ai-sdk/gateway` v3.0.133, `@ai-sdk/openai` v3.0.73, `@ai-sdk/anthropic` v3.0.85, `@modelcontextprotocol/sdk` v1.29.0, `@neondatabase/serverless` v1.1.0, `pgvector` v0.3.0, `@framers/agentos` v0.9.75, `@open-mercato/ai-assistant` v0.6.5, `@mastra/core` v1.45.0, `langchain` 1.5.0, `@langchain/core` 1.2.0, `@langchain/langgraph` 1.4.4
- Vercel docs: https://vercel.com/docs/ai-gateway (last updated May 11, 2026; getting-started page confirms `streamText` + `openai/gpt-5.5` canonical example; embeddings, reranking, and multi-modal listed as supported modalities)
- Model Context Protocol: https://modelcontextprotocol.io/docs — open protocol, supported by Claude, ChatGPT, VS Code, Cursor, MCPJam, and others
- Bartender Sanctuary codebase: `package.json` (`pg` ^8.21.0 only; no AI deps installed)
- Previous reports: `docs/agent-skills-research-2026-06-18.md`, `docs/agent-skills-research-2026-06-19.md`
