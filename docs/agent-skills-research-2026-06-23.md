# 2026 AI Agent Skills Research — Bartender Sanctuary
**Research Date:** June 23, 2026  
**Target Stack:** Next.js + Postgres (Neon) + Vercel  
**Focus:** Bartending school platform — lessons, tests, progress tracking, cocktail/ingredient data, user engagement  
**Previous Report:** June 21, 2026 — `docs/agent-skills-research-2026-06-21.md`

---

## Executive Summary

The ecosystem shows **minor version drift across several key packages** since June 21, with one significant new release (`@ai-sdk/langchain@2.0.216`) and two new toolkit ecosystems (`ai-sdk-tools@1.2.0`, `@inngest/agent-kit@0.13.2`). The most actionable signals for Bartender Sanctuary are:

1. **Vercel AI SDK LangChain adapter (v2.0.216)** — bridges Vercel AI Gateway + LangGraph, letting the platform consume LangChain agents through the unified AI SDK UI layer.
2. **`ai-sdk-tools` + `@ai-sdk-tools/agents` (v1.2.0)** — first-party Vercel toolkit for multi-agent orchestration, state management, caching, and artifacts. Directly applicable to tutoring bots and auto-graders.
3. **Claude Agent SDK (v0.3.186)** — Anthropic's official agent framework with native tool execution, filesystem access, and codebase understanding. A strong alternative to LangGraph for tutoring workflows.

The **zero-AI-deps gap persists** in `package.json`. All P1–P5 recommendations from June 21 remain fully actionable.

---

## Verified Package Versions (as of June 23)

| Package | June 21 version | June 23 version | Change |
|---------|----------------|----------------|--------|
| `ai` (Vercel AI SDK) | 6.0.208 | **6.0.208** | No change |
| `@ai-sdk/gateway` | 3.0.133 | **3.0.133** | No change |
| `@ai-sdk/openai` | 3.0.73 | **3.0.74** | Minor patch |
| `@ai-sdk/anthropic` | 3.0.85 | **3.0.85** | No change |
| `@ai-sdk/langchain` | *not tracked* | **2.0.216** | **NEW — major release** |
| `ai-sdk-tools` | *not tracked* | **1.2.0** | **NEW** |
| `@ai-sdk-tools/agents` | *not tracked* | **1.2.0** | **NEW** |
| `@neondatabase/serverless` | 1.1.0 | **1.1.0** | No change |
| `@modelcontextprotocol/sdk` | 1.29.0 | **1.29.0** | No change |
| `pgvector` | 0.3.0 | **0.3.0** | No change |
| `@mastra/core` | 1.45.0 | **1.45.0** | No change |
| `@mastra/observability` | *not tracked* | **1.15.0** | **NEW** |
| `@framers/agentos` | 0.9.75 | **0.9.78** | Minor patch |
| `langchain` | 1.5.0 | **1.5.1** | Minor patch |
| `@langchain/core` | 1.2.0 | **1.2.1** | Minor patch |
| `@langchain/langgraph` | 1.4.4 | **1.4.5** | Minor patch |
| `@anthropic-ai/claude-agent-sdk` | *not tracked* | **0.3.186** | **NEW** |
| `@inngest/agent-kit` | *not tracked* | **0.13.2** | **NEW** |
| `openlit` | *not tracked* | **1.13.0** | **NEW** |
| `next` | 16.2.9 | **16.2.9** | No change |
| `pg` (current project dep) | 8.21.0 | **8.21.0** | Still in use |

---

## Top 5 Relevant Developments (Updated June 23)

### 1. Vercel AI SDK LangChain Adapter (v2.0.216) ⭐ P1
*New since June 21 — major release.*

`@ai-sdk/langchain@2.0.216` provides seamless integration between LangChain agents/graphs and the Vercel AI SDK UI components (`useChat`, `streamUI`). This means Bartender Sanctuary can build complex tutoring agents with LangGraph, but serve them through the same unified streaming UI layer as direct LLM calls.

**Why it matters:** It removes the "LangChain vs. AI SDK" decision. The platform can use LangGraph for complex tutoring orchestration while keeping the front-end simple with `@ai-sdk/react` hooks. This directly supports the P4 multi-agent recommendation.

**Implementation Difficulty:** 2/5
- Install `@ai-sdk/langchain` alongside existing `ai` v6 packages
- Wrap LangGraph chains/agents with the adapter
- Existing `useChat` and `streamUI` components work unchanged

**Potential Impact:** 4/5
- Enables LangGraph tutoring agents without custom frontend glue
- Lets the platform mix AI Gateway-routed direct calls and LangChain agents in the same UI
- Future-proofs against LangChain API churn

**Stack-Specific Note:** The adapter requires `ai` v6 + a provider package (already recommended). It is Vercel-first but works with any AI Gateway-compatible endpoint.

---

### 2. `ai-sdk-tools` + `@ai-sdk-tools/agents` (v1.2.0) ⭐ P1
*New since June 21 — first-party Vercel agent toolkit.*

`ai-sdk-tools@1.2.0` is a complete toolkit for the Vercel AI SDK: agents, state management, caching, artifacts, devtools, and memory. `@ai-sdk-tools/agents@1.2.0` adds multi-agent orchestration (handoffs, routing, coordination) for any AI provider.

**Why it matters:** This is Vercel's answer to LangGraph/Mastra, built natively for the AI SDK. It lowers the barrier for building tutoring agents, auto-graders, and admin copilots without adopting a separate orchestration framework. The "artifacts" feature is especially useful for generating quiz cards, lesson plans, and cocktail recipe cards that render directly in the UI.

**Implementation Difficulty:** 2/5
- Install `ai-sdk-tools` and `@ai-sdk-tools/agents`
- Define agent schemas using the toolkit's type-safe APIs
- Use `streamUI` to render agent outputs as React components

**Potential Impact:** 5/5
- Fastest path from "AI SDK installed" to "working tutoring agent"
- Built-in state management and memory reduce boilerplate
- Artifacts enable rich UI generation (quizzes, flashcards, recipe cards)
- Multi-agent routing enables specialized tutoring (Foundations vs. Mixology vs. Advanced)

**Stack-Specific Note:** First-party Vercel tooling with Edge Runtime support. Works on Vercel Edge Functions and serverless API routes.

---

### 3. Claude Agent SDK (v0.3.186) — P1-alternative
*New since June 21 — official Anthropic agent framework.*

`@anthropic-ai/claude-agent-sdk@0.3.186` is Anthropic's official SDK for building autonomous agents with Claude Code capabilities: codebase understanding, filesystem access, tool execution, and multi-step workflows. It includes platform-specific binaries (linux-x64, darwin-arm64, etc.) and a TypeScript API.

**Why it matters:** For Bartender Sanctuary's tutoring use case, Claude Agent SDK offers a different architectural choice than LangGraph or `ai-sdk-tools`. Claude's long-context strength (200K tokens) makes it well-suited for generating full lessons from curriculum documents, while its tool-use reliability is high for auto-grading tasks. The SDK also supports sub-agents and prompt caching, which can reduce costs for repeated curriculum queries.

**Implementation Difficulty:** 3/5
- Requires Claude API key (Anthropic provider already available via `@ai-sdk/anthropic`)
- SDK is opinionated about agent structure (plan → execute → reflect)
- Filesystem and tool access need sandboxing in production

**Potential Impact:** 4/5
- High-quality lesson generation from curriculum docs
- Strong tool-use reliability for auto-grading
- Prompt caching reduces cost for repeated curriculum lookups
- Sub-agent pattern enables specialized lesson-generation vs. grading workflows

**Stack-Specific Note:** Best paired with Vercel AI Gateway's Anthropic provider, so API keys and rate limits stay centralized.

---

### 4. AI Agent Observability Matures (OpenLit, Mastra, Microsoft) — P2
*New since June 21 — multiple new observability packages.*

Three new observability tools surfaced in June 2026:
- **`openlit@1.13.0`** — OpenTelemetry-native auto-instrumentation for LLM applications (traces, metrics, spans)
- **`@mastra/observability@1.15.0`** — Core observability for Mastra (tracing + scoring)
- **`@microsoft/agents-a365-observability@1.1.0-preview.7`** — Microsoft's OTel SDK for AI agents

**Why it matters:** As Bartender Sanctuary adds AI tutoring and grading, knowing *why* an agent gave a particular answer or grade becomes critical. Observability lets the team trace prompt → model → tool → response, measure latency/cost per tutoring session, and detect hallucination patterns in lesson content.

**Implementation Difficulty:** 2/5
- OpenLit requires minimal code change (auto-instrumentation)
- Mastra observability integrates with existing Mastra agents (if adopted)
- All emit OpenTelemetry-compatible spans, so any OTel backend works

**Potential Impact:** 4/5
- Debug tutoring agent failures and grading inconsistencies
- Monitor LLM costs per user/session (critical for EU AI Act Article 4 compliance)
- Build evaluation datasets from real agent traces
- Detect prompt injection or unsafe outputs before they reach students

**Stack-Specific Note:** Vercel has native OpenTelemetry support; OpenLit spans can be exported to Vercel Analytics or any OTel collector.

---

### 5. MCP Ecosystem Rapid Expansion + AI Gateway MCP Server — P2
*Accelerating since June 21 — new official and community servers.*

The MCP server ecosystem grew significantly in June 2026:
- **Official:** Notion (`@notionhq/notion-mcp-server@2.4.1`), filesystem, Kubernetes, Chrome DevTools
- **Infrastructure:** BrowserStack, Heroku, HubSpot, Alchemy, Transcend, Sentry, Apify
- **Vercel-specific:** `@ayatec/ai-gateway-mcp-server@0.10.1` — exposes AI Gateway models as MCP tools

**Why it matters:** For Bartender Sanctuary, the AI Gateway MCP server is the most immediately useful. It lets any MCP client (Claude Desktop, Cursor, VS Code) call Vercel AI Gateway models as tools. This means admin copilots and curriculum editors can be built as MCP clients that read/write the Neon schema through the Gateway.

**Implementation Difficulty:** 3/5
- Deploy `@ayatec/ai-gateway-mcp-server` as an edge function or API route
- Configure Vercel AI Gateway allowlists and budgets
- Design MCP tool schemas for lessons, tests, progress (student vs. admin permissions)

**Potential Impact:** 4/5
- Enables "write once, integrate everywhere" for school data tools
- Lets non-technical staff use Claude/ChatGPT as admin copilots for curriculum management
- Reduces custom integration surface for every new AI feature

**Stack-Specific Note:** The project already uses Vercel + Neon, so the Gateway MCP server fits without new infrastructure.

---

## New Ecosystem Signals (Watching Only)

| Signal | Package/Version | Status | Why it matters |
|--------|----------------|--------|----------------|
| `@neondatabase/neon-js` | 0.6.2-beta | **Beta** | Neon's own TypeScript SDK for Auth + Data API. Still pre-1.0; monitor for serverless query improvements. |
| `drizzle-orm` | 0.45.2 | **Stable** | Popular with Next.js + Neon. Could replace raw `pg` queries (currently used) for type-safe schema access. |
| `@voltx/db` | 0.4.7 | **Early** | Combines Drizzle + Neon + Pinecone + pgvector. Interesting if Bartender Sanctuary adds Pinecone for hybrid search. |
| `ollama-ai-provider-v2` | 3.6.0 | **Stable** | Local LLM provider for Vercel AI SDK. Useful for cost-sensitive bulk generation (e.g., embedding all cocktail descriptions) without API costs. |
| `@tanstack/ai` | 0.33.0 | **New** | TanStack's AI SDK — headless client + React hooks for streaming chat. Potential alternative to `@ai-sdk/react` if the project already uses TanStack Query. |
| `@elizaos/plugin-vercel-ai-gateway-root` | 2.0.0-alpha.1 | **Alpha** | ElizaOS plugin for Vercel AI Gateway. ElizaOS is an agent personality framework; low priority unless character-driven tutoring is explored. |
| Bartending-specific AI | npm search | **None found** | No npm packages target bartending/AI. Custom MCP tools remain the best path. |

---

## Delta from June 21 Report

| Topic | June 21 Assessment | June 23 Update |
|-------|-------------------|----------------|
| Core package versions | All stable | **Minor drift.** `@ai-sdk/openai` 3.0.73→3.0.74, `@langchain/langgraph` 1.4.4→1.4.5, `langchain` 1.5.0→1.5.1, `@langchain/core` 1.2.0→1.2.1, `@framers/agentos` 0.9.75→0.9.78. No breaking changes. |
| `@ai-sdk/langchain` | Not tracked | **NEW.** v2.0.216 — AI SDK ↔ LangChain bridge. High relevance for P4 multi-agent architecture. |
| `ai-sdk-tools` / `@ai-sdk-tools/agents` | Not tracked | **NEW.** v1.2.0 — Vercel's first-party agent toolkit. Strong candidate for tutoring/auto-grader implementation. |
| `@anthropic-ai/claude-agent-sdk` | Not tracked | **NEW.** v0.3.186 — Official Anthropic agent SDK. Alternative to LangGraph for tutoring orchestration. |
| AI observability | Not tracked | **NEW.** OpenLit 1.13.0, Mastra observability 1.15.0, Microsoft A365 1.1.0-preview.7. Mature options for tracing/eval. |
| MCP servers | Stable | **Expanding.** Notion, BrowserStack, Heroku, HubSpot, Alchemy official servers added. AI Gateway MCP server (`@ayatec/ai-gateway-mcp-server@0.10.1`) is the most relevant. |
| Project AI deps installed | None | **None — gap persists.** All P1–P5 recommendations remain actionable. |
| Bartending-specific AI tools | Not checked | **None on npm.** Custom MCP tools remain the best path. |

---

## Updated Recommendations (Priority Order)

| Priority | Action | Difficulty | Impact | Delta from June 21 |
|----------|--------|-----------|--------|-------------------|
| **P1** | Install `ai` ^6.0.208 + `@ai-sdk/gateway` ^3.0.133 + provider (`openai` or `anthropic`) | 2/5 | 5/5 | Unchanged. Gateway confirmed production-ready with embeddings + reranking. |
| **P1** | Evaluate `ai-sdk-tools@1.2.0` + `@ai-sdk-tools/agents@1.2.0` for tutoring/auto-grader | 2/5 | 5/5 | **NEW.** First-party Vercel agent toolkit — lowest-friction path to working AI features. |
| **P1** | Migrate `pg` → `@neondatabase/serverless` v1.1.0 | 2/5 | 4/5 | Unchanged. Prerequisite for all AI work. |
| **P2** | Add observability: `openlit@1.13.0` or `@mastra/observability@1.15.0` | 2/5 | 4/5 | **NEW.** Essential before shipping tutoring agents to production. |
| **P2** | Evaluate `@ai-sdk/langchain@2.0.216` for LangGraph integration | 3/5 | 4/5 | **NEW.** Bridges LangGraph with AI SDK UI. Relevant after P1 is installed. |
| **P3** | Enable pgvector in Neon; embed cocktails + lessons | 3/5 | 5/5 | Unchanged. Embeddings confirmed via AI Gateway. |
| **P2** | Evaluate `@anthropic-ai/claude-agent-sdk@0.3.186` for tutoring orchestration | 3/5 | 4/5 | **NEW.** Anthropic's official agent SDK. Strong alternative to LangGraph. |
| **P4** | Wrap school schema as MCP tools (lessons, tests, progress) | 3/5 | 5/5 | Unchanged. MCP.io docs confirm cross-client support. |
| **P4** | Evaluate LangGraph v1.4.5 after P1 + P3 are complete | 4/5 | 4/5 | Unchanged. Thoughtworks case study (June 16) validates evaluator-optimizer + reflection-agent pattern. |
| **P5** | Pilot automated test generation in Foundations category | 2/5 | 5/5 | Unchanged. Quick win; validate rubric scoring before scaling. |
| **Watch** | Evaluate `@mastra/core` v1.45.0 after MCP wrapper is built | — | — | Unchanged. Still healthy maintenance. |
| **Watch** | Monitor `@neondatabase/neon-js@0.6.2-beta` for serverless query improvements | — | — | **NEW.** Neon's own SDK; still beta. |

---

## Risk and Compliance Considerations (2026 Context)
*Unchanged from June 21.*

- **Academic integrity:** Include responsible-use guardrails and AI-literacy curricula (UNESCO 2024 guidance).
- **Bias and hallucinations:** Use evaluator-optimizer loops and human-in-the-loop checkpoints for high-stakes assessment.
- **Data protection:** Log all agent actions in Postgres for auditability (EU AI Act Article 4).
- **Model costs:** Budget for embedding generation and LLM inference; use Vercel Edge caching + AI Gateway cost controls.

---

## Honest Assessment

The June 23 research cycle found **meaningful new toolkit releases** since June 21, most notably `@ai-sdk/langchain@2.0.216`, `ai-sdk-tools@1.2.0`, and `@anthropic-ai/claude-agent-sdk@0.3.186`. These represent the ecosystem converging on "agent frameworks that sit on top of the Vercel AI SDK" rather than alongside it. For Bartender Sanctuary, this is a positive signal: the team can adopt a single provider abstraction (AI Gateway) and choose the orchestration layer that best fits the tutoring domain (`ai-sdk-tools` for speed, LangGraph for complexity, Claude Agent SDK for Claude-optimized workflows).

The **zero-AI-deps gap in `package.json` remains the critical blocker**. Every recommendation above is blocked until at least `ai` v6 + a provider package are installed. The project's Next.js 13.5.6 base is compatible with all recommended packages.

No bartending-specific AI packages exist on npm. The best path remains building **domain-specific MCP tools** wrapping the existing Neon schema.

---

## Sources

- npm registry: `ai` v6.0.208, `@ai-sdk/gateway` v3.0.133, `@ai-sdk/openai` v3.0.74, `@ai-sdk/anthropic` v3.0.85, `@ai-sdk/langchain` v2.0.216, `ai-sdk-tools` v1.2.0, `@ai-sdk-tools/agents` v1.2.0, `@modelcontextprotocol/sdk` v1.29.0, `@neondatabase/serverless` v1.1.0, `@neondatabase/neon-js` v0.6.2-beta, `pgvector` v0.3.0, `@framers/agentos` v0.9.78, `@mastra/core` v1.45.0, `@mastra/observability` v1.15.0, `@anthropic-ai/claude-agent-sdk` v0.3.186, `@inngest/agent-kit` v0.13.2, `openlit` v1.13.0, `@microsoft/agents-a365-observability` v1.1.0-preview.7, `@langchain/langgraph` v1.4.5, `langchain` v1.5.1, `@langchain/core` v1.2.1, `next` 16.2.9
- MCP ecosystem: official Notion, BrowserStack, Heroku, HubSpot, Alchemy, Chrome DevTools, Sentry, Apify servers; `@ayatec/ai-gateway-mcp-server@0.10.1`
- Vercel docs: https://vercel.com/docs/ai-gateway (embeddings, reranking, multi-modal confirmed)
- Model Context Protocol: https://modelcontextprotocol.io/docs
- Martin Fowler / Thoughtworks: "Building Reliable Agentic AI Systems" (June 16, 2026)
- Bartender Sanctuary codebase: `package.json` (`pg` ^8.21.0 only; no AI deps installed)
- Previous reports: `docs/agent-skills-research-2026-06-18.md`, `docs/agent-skills-research-2026-06-19.md`, `docs/agent-skills-research-2026-06-20.md`, `docs/agent-skills-research-2026-06-21.md`
