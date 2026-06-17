# 2026 AI Agent Skills Research — Bartender Sanctuary
**Research Date:** June 17, 2026  
**Target Stack:** Next.js 13.5 (Pages Router) + Postgres (Neon) + Vercel  
**Focus:** Bartending school platform — lessons, tests, progress tracking, cocktail/ingredient data, user engagement  
**Previous Report:** June 16, 2026 — `docs/agent-skills-research-2026-06-16.md`

---



## Executive Summary

Since the June 16 research, the 2026 AI agent ecosystem has continued stabilizing around a few core primitives. The top story is **production hardening**: MCP SDK and reference servers are mature, Vercel AI SDK v6 is the established baseline, and Neon's serverless Postgres driver is ready for drop-in migration. For Bartender Sanctuary, this means the "experiment" window has closed and the "integrate" window is open. The highest-ROI moves are: (1) migrate `pg` → `@neondatabase/serverless` for edge-ready queries, (2) adopt Vercel AI SDK v6 for streaming + tool use, and (3) pilot MCP wrapping of the existing school schema to future-proof tutoring/assessment AI.

---



## Top 5 Relevant Developments (Updated June 17)

### 1. MCP Ecosystem Maturation (SDK v1.29 + Official Servers)

**What it is:**  
The Model Context Protocol SDK is at **v1.29.0** (npm), and Anthropic's official MCP reference servers were last updated **2026.01.26**. The TypeScript SDK is production-stable, and the `server-everything`, `server-sequential-thinking`, `server-memory`, and `server-filesystem` packages are actively maintained.

**Why it matters for Bartender Sanctuary:**  
Wrapping the existing Neon Postgres schema (lessons, tests, progress, cocktails, ingredients) as MCP tools lets any LLM feature read/write school data without bespoke glue. This is the integration layer that makes automated tutoring, admin copilots, and curriculum generation interchangeable across model providers.

**Implementation Difficulty:** 3/5  
- Mature TypeScript SDKs fit the existing Next.js stack.  
- Requires designing permission-bound tool schemas (student vs. admin).  
- Deploy MCP server as a Next.js API route or standalone edge function; use `@neondatabase/serverless` for Postgres access.

**Potential Impact:** 5/5  
- Reduces integration surface for every new AI feature.  
- Enables model swapping without refactoring business logic.  
- Accelerates tutoring bot, auto-grader, and admin assistant development.

**Stack-Specific Note:**  
Next.js 13.5 Pages Router API routes can host an MCP server endpoint. Use `@modelcontextprotocol/sdk` ^1.29.0. Neon Postgres becomes the shared state layer.

---



### 2. Vercel AI SDK v6 — Production Streaming + Tool Use Baseline

**What it is:**  
Vercel's AI SDK reached **v6.0.207** on **June 16, 2026**. The v6 line has 345+ releases, making it the current production baseline. It provides unified streaming (`useChat`, `streamText`), tool calling (function calling with Zod schemas), and generative UI primitives.

**Why it matters for Bartender Sanctuary:**  
The platform currently has **no AI SDK installed** (`ai` and `@ai-sdk/openai` are absent from `package.json`). Vercel AI SDK v6 is the lowest-friction path to adding streaming chat, tool-using agents, and LLM-generated content directly in Next.js Server Components or API routes.

**Implementation Difficulty:** 2/5  
- Install `ai` ^6.x and a provider package (e.g. `@ai-sdk/openai` or `@ai-sdk/anthropic`).  
- Wrap existing API routes with `streamText()` for server-side streaming.  
- Use `generateText()` with `tools` for structured quiz generation and grading.

**Potential Impact:** 5/5  
- Enables streaming tutoring chat UI with minimal React code.  
- Tool calling lets the LLM query lessons/tests/progress via MCP or direct Postgres queries.  
- Generates UI (e.g., quiz cards) from tool outputs via `streamUI`.

**Stack-Specific Note:**  
Bartender Sanctuary is on Next.js 13.5 Pages Router. Vercel AI SDK v6 supports both Pages and App Router. Migrate `pg` → `@neondatabase/serverless` first, then add `ai` for streaming endpoints.

---



### 3. Neon Serverless Postgres Driver — Edge-Ready Database Access

**What it is:**  
`@neondatabase/serverless` reached **v1.1.0** (npm). It is a drop-in replacement for `node-postgres` (`pg`) that uses HTTPS and WebSockets instead of TCP, with message pipelining for lower latency. Types are included.

**Why it matters for Bartender Sanctuary:**  
The project currently uses `pg` ^8.21.0, which requires TCP connections — problematic in Vercel Edge Functions and serverless environments. Migrating to `@neondatabase/serverless` removes that constraint and enables AI features (MCP server, retrieval agents, streaming assessment graders) to run at the edge.

**Implementation Difficulty:** 2/5  
- Replace `pg` with `@neondatabase/serverless` in `package.json`.  
- Update `lib/db.ts` import; the API surface is intentionally compatible.  
- No schema changes needed.

**Potential Impact:** 4/5  
- Unlocks edge-deployed MCP servers and retrieval agents.  
- Lower latency for AI API routes (no cold-start TCP penalty).  
- Future-proofs the data layer for any Vercel Edge or Neon Branching workflows.

**Stack-Specific Note:**  
Neon is the existing Postgres provider; the serverless driver is the officially recommended client. Install: `npm install @neondatabase/serverless`.

---



### 4. pgvector — Semantic Search for Cocktails & Curriculum

**What it is:**  
`pgvector` npm package is at **v0.3.0**, and Neon supports the `vector` extension natively. Embeddings can be stored and queried directly in Postgres, enabling semantic search over cocktail descriptions, lesson content, and ingredient profiles.

**Why it matters for Bartender Sanctuary:**  
Cocktail and ingredient data is highly relational (substitutions, flavor families, technique pairings). A naive keyword search misses these. pgvector enables:
- "What can I make with bourbon and honey?" semantic queries.  
- Learning path suggestions based on technique prerequisites.  
- Adaptive tutoring that retrieves lesson context at the appropriate difficulty.

**Implementation Difficulty:** 3/5  
- Enable `vector` extension in Neon.  
- Store embeddings for cocktail descriptions, lesson text, and ingredient profiles.  
- Build a retrieval agent (LangGraph or direct tool loop) that queries pgvector + keyword fallback.  
- Vercel Edge caches frequent queries to reduce embedding costs.

**Potential Impact:** 5/5  
- Dramatically reduces hallucinations in tutoring contexts.  
- Enables adaptive learning pathways.  
- Makes the system auditable for school administrators.

**Stack-Specific Note:**  
Neon supports `CREATE EXTENSION vector;` in SQL. Use `@neondatabase/serverless` + `pgvector` npm for TypeScript embedding storage/retrieval.

---



### 5. Evaluator-Optimizer Loops for Automated Assessment

**What it is:**  
Anthropic's evaluator-optimizer pattern (augmented LLM with evaluation + revision loop) is canonical in 2026. It enables LLMs to generate content, grade it against a rubric, and iteratively improve — all with transparent quality scores.

**Why it matters for Bartender Sanctuary:**  
The school data (`data/school.ts`) is static and manually maintained. Automated generation can:
- Create new lessons from cocktail/ingredient source material.  
- Generate quizzes aligned to existing lesson IDs.  
- Grade free-form test responses with transparent rubrics.  
- Maintain item banks in Postgres for psychometric tracking.

**Implementation Difficulty:** 2/5  
- Start with prompt templates for question generation and rubric scoring.  
- Use Vercel Cron to trigger nightly item expansion.  
- Store generation metadata and evaluation scores in Neon.

**Potential Impact:** 5/5  
- 10x+ reduction in curriculum authoring time.  
- Consistent grading with transparent rubrics.  
- Enables mastery-based progression at scale.

**Stack-Specific Note:**  
Use Vercel AI SDK `generateText()` with `tools` to query lesson schemas, then loop with `evaluate()` until rubric score exceeds threshold. Store outputs in Postgres `test_items` and `generation_logs` tables.

---



## Stack-Specific Implementation Notes

| Layer | Current State | Recommended AI Upgrade |
|-------|--------------|----------------------|
| Next.js 13.5 (Pages Router) | REST API routes only | Add Vercel AI SDK v6 for streaming chat + tool use |
| Vercel Serverless | Stateless API routes | Deploy MCP server as API route; use Edge for lightweight retrieval |
| Neon (Postgres) | `pg` ^8.21.0 (TCP) | Migrate to `@neondatabase/serverless` v1.1.0 (WebSocket/HTTPS) |
| Postgres Extensions | None | Enable `vector` (pgvector) for semantic search; use JSONB for agent logs |
| AI/Agent Features | None | Start with automated test generation → MCP wrapper → adaptive tutor |

---



## Risk and Compliance Considerations (2026 Context)

- **Academic integrity:** Platforms must include responsible-use guardrails and AI-literacy curricula (UNESCO 2024 guidance).  
- **Bias and hallucinations:** Use evaluator-optimizer loops and human-in-the-loop checkpoints for high-stakes assessment.  
- **Data protection:** Log all agent actions in Postgres for auditability (EU AI Act Article 4, similar frameworks).  
- **Model costs:** Budget for embedding generation (cocktails + lessons) and LLM inference; use Vercel Edge caching aggressively.

---



## Recommendations (Priority Order)

| Priority | Action | Difficulty | Impact | Rationale |
|----------|--------|-----------|--------|-----------|
| **P1** | Migrate `pg` → `@neondatabase/serverless` v1.1.0 | 2/5 | 4/5 | Unlocks edge deployment for all subsequent AI features. Low risk, high leverage. |
| **P2** | Install Vercel AI SDK v6 (`ai` ^6.x + provider) | 2/5 | 5/5 | Enables streaming chat and tool-using agents in Next.js with minimal code. |
| **P3** | Enable pgvector in Neon; embed cocktails + lessons | 3/5 | 5/5 | Powers semantic search and adaptive tutoring. Requires schema migration but high payoff. |
| **P4** | Wrap school schema as MCP tools (lessons, tests, progress) | 3/5 | 5/5 | Future-proofs integration surface; enables model swapping and multi-agent orchestration. |
| **P5** | Pilot automated test generation in Foundations category | 2/5 | 5/5 | Quick win with visible curriculum impact; validate rubric scoring before scaling. |

---



## Sources and Influencing Signals

- npm registry: `@modelcontextprotocol/sdk` v1.29.0, `@modelcontextprotocol/servers` 2026.01.26 release.  
- npm registry: `ai` v6.0.207 (published 2026-06-16), `@neondatabase/serverless` v1.1.0.  
- npm registry: `pgvector` v0.3.0 (12 published versions).  
- Bartender Sanctuary codebase: `package.json` (no AI SDK installed; `pg` ^8.21.0, `next` ^13.5.6).  
- Anthropic, *Building Effective AI Agents* (Dec 2024; still canonical in 2026).  
- Existing project research: `docs/agent-skills-research-2026-06-16.md`.  
- Neon docs: `@neondatabase/serverless` is the officially recommended serverless Postgres driver.

---



## Delta from June 16 Report

| Topic | June 16 Assessment | June 17 Update |
|-------|-------------------|----------------|
| MCP | v1.x ecosystem, "production-ready" | Confirmed: SDK v1.29.0, official servers updated Jan 2026. No breaking changes. |
| Vercel AI SDK | Mentioned as viable | Confirmed: v6.0.207 is the stable baseline (345+ v6 releases). Project has **zero** AI deps installed. |
| Neon driver | Recommended `pg` | **Upgrade path clarified**: `@neondatabase/serverless` v1.1.0 is drop-in replacement for `pg`. |
| pgvector | Recommended | Confirmed: `pgvector` npm v0.3.0 + Neon `vector` extension = ready to use. |
| Automated generation | 2/5 difficulty | Still 2/5; Vercel AI SDK v6 + MCP makes it easier to implement. |
