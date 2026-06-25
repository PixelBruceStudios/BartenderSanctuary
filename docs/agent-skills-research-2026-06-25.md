# 2026 AI Agent Skills Research — Bartender Sanctuary
**Research Date:** June 25, 2026  
**Target Stack:** Next.js + Postgres (Neon) + Vercel  
**Focus:** Bartending school platform — lessons, tests, progress tracking, cocktail/ingredient data, user engagement  
**Previous Report:** June 24, 2026 — `docs/agent-skills-research-2026-06-24.md`

---

## Executive Summary

Since June 24, the ecosystem produced **two high-impact new releases** and one significant major-version beta jump:
1. **`@mastra/core` 1.47.0-alpha.2** — new alpha with **eval gates/verdicts** (critical for auto-grading) and **Vercel `waitUntil` support** (solves serverless agent persistence).
2. **`@anthropic-ai/claude-agent-sdk` 0.3.191** — 4 weekly parity patches ahead of June 24, adding weekly rate-limit awareness and fast-mode fixes.
3. **`@ai-sdk/langchain` 3.0.0-beta.187** — major version jump tied to `ai@7.0.0-beta.187`; still beta but signals ecosystem convergence on AI SDK v7.

Additionally, **`@langchain/langgraph` 1.4.6** was updated today, and Vercel Labs shipped **`agent-browser` 0.30.1** for agent-driven browser automation.

The **zero-AI-deps gap in `package.json` remains the critical blocker**. No bartending-specific AI packages exist on npm.

---

## Verified Package Versions (as of June 25)

| Package | June 24 version | June 25 version | Change |
|---------|----------------|----------------|--------|
| `@anthropic-ai/claude-agent-sdk` | 0.3.187 | **0.3.191** | +4 weekly parity patches |
| `@ai-sdk/langchain` | 2.0.217 | **3.0.0-beta.187** | **MAJOR — beta jump, tied to ai v7** |
| `@langchain/langgraph` | 1.4.5 | **1.4.6** | Minor patch (published today) |
| `mastra` | 1.15.1 | **1.15.1** | No change |
| `@mastra/core` | 1.46.0 | **1.47.0-alpha.2** | **NEW — eval gates + Vercel waitUntil** |
| `@mastra/observability` | 1.15.1 | **1.15.1** | No change |
| `@mastra/pg` | 1.14.1 | **1.14.1** | No change |
| `ai` | 6.0.209 | **6.0.209** | No change |
| `@ai-sdk/gateway` | 3.0.134 | **3.0.134** | No change |
| `@ai-sdk/anthropic` | 3.0.86 | **3.0.86** | No change |
| `@ai-sdk/xai` | 3.0.97 | **3.0.97** | No change |
| `@ai-sdk/openai` | 3.0.74 | **3.0.74** | No change |
| `ai-sdk-tools` | 1.2.0 | **1.2.0** | No change |
| `@ai-sdk-tools/agents` | 1.2.0 | **1.2.0** | No change |
| `@neondatabase/serverless` | 1.1.0 | **1.1.0** | No change |
| `pg` | 8.22.0 | **8.22.0** | No change |
| `next` | 16.2.9 | **16.2.9** | No change |
| `@modelcontextprotocol/sdk` | 1.29.0 | **1.29.0** | No change |
| `pgvector` | 0.3.0 | **0.3.0** | No change |
| `@inngest/agent-kit` | 0.13.2 | **0.13.2** | No change |
| `openlit` | 1.13.0 | **1.13.0** | No change |
| `@sentry/vercel-edge` | 10.60.0 | **10.60.0** | No change |
| **NEW** `agent-browser` | — | **0.30.1** | **Vercel Labs browser automation** |
| **NEW** `@arcjet/next` | — | **1.5.0** | **Prompt injection + PII protection for Next.js** |

---

## Top 5 Relevant Developments (Updated June 25)

### 1. Mastra Core 1.47.0-alpha.2 — Eval Gates + Vercel waitUntil ⭐ P1
*NEW since June 24 — most actionable release.*

`@mastra/core` 1.47.0-alpha.2 introduces two game-changing features for Bartender Sanctuary:

**Eval gates and verdicts for `runEvals`** — You can now attach hard pass/fail gates to agent evaluations:
```ts
const result = await runEvals({
  data: [{ input: 'What is the weather?' }],
  target: weatherAgent,
  gates: [checks.calledTool('get_weather')],          // must pass
  scorers: [
    { scorer: faithfulnessScorer, threshold: 0.7 },    // min score
    { scorer: hallucinationScorer, threshold: { max: 0.3 } }, // max score
  ],
});
result.verdict; // 'passed' | 'scored' | 'failed'
```

**`waitUntil` support for channels** — Background agent runs now survive Vercel serverless response returns. Mastra auto-detects Cloudflare Workers, Netlify, and AWS Lambda; Vercel requires explicit `waitUntil` passing. This directly unblocks long-running tutoring agents on Vercel.

**Why it matters:** Eval gates enable **automated quality control for auto-graded tests** — a grading agent must call the answer-checking tool (gate) and achieve minimum faithfulness (threshold) before the answer is released to a student. The `waitUntil` fix means Mastra tutoring agents no longer get killed mid-response on Vercel Edge/Serverless.

**Implementation Difficulty:** 2/5
- Install `@mastra/core@1.47.0-alpha.2`
- Configure `waitUntil` in Mastra agent channels for Vercel
- Define eval gates for auto-grader workflows

**Potential Impact:** 5/5
- Enables production-quality auto-grading with measurable quality thresholds
- Solves the #1 Vercel serverless agent runtime issue
- Makes Mastra viable for tutoring agents without infrastructure workarounds

**Stack-Specific Note:** Vercel's `waitUntil` is exposed via AsyncLocalStorage, so it must be passed explicitly to Mastra channels. See Mastra changelog for the exact `resolveWaitUntil` pattern.

---

### 2. Claude Agent SDK 0.3.191 — Weekly Parity + Rate-Limit Awareness P1
*Updated since June 24 (0.3.187 → 0.3.191) — 4 weekly patches.*

**New in 0.3.191:**
- `old_source` field on `NotebookEdit` tool results for inline diffs (useful for code/lesson editing)
- `seven_day_overage_included` in `rateLimitType` — per-model weekly usage limits
- `model_scoped` array in usage response — per-model weekly limit windows with utilization/reset times
- Fixed fast mode reverting to standard after first turn when `settingSources` includes user/project settings

**Why it matters:** Bartender Sanctuary's tutoring/auto-grader can now track **per-model weekly costs** (critical for EU AI Act Article 4 compliance and budget controls). The fast-mode fix reduces latency for routine quiz generation. Inline diff support helps with lesson content editing workflows.

**Implementation Difficulty:** 2/5
- Upgrade from 0.3.187 → 0.3.191
- Read `SDKRateLimitInfo.rateLimitType` and `model_scoped` fields for cost dashboards
- Enable fast mode with explicit `settingSources` config

**Potential Impact:** 4/5
- Weekly cost tracking per model (Claude vs. Grok vs. OpenAI)
- Faster routine tutoring interactions via fast mode
- Inline diffs enable AI-assisted lesson editing in admin UI

**Stack-Specific Note:** Best paired with Vercel AI Gateway's Anthropic provider for centralized credentials and rate limiting.

---

### 3. `@ai-sdk/langchain` 3.0.0-beta.187 — Major Version Jump P2
*NEW since June 24 (2.0.217 → 3.0.0-beta.187) — major version tied to ai v7 beta.*

**What changed:**
- Tracks `ai@7.0.0-beta.187` (major AI SDK rewrite)
- Rapid beta iteration: 187 beta versions since initial release
- Key features in recent betas:
  - LangGraph tools stream progress into preliminary tool outputs
  - Citation annotations surfaced as spec-compliant `source-url`/`source-document` UI message parts
  - HITL (Human-in-the-Loop) interrupt matching fixes
  - Global object prototype pollution fix (`c1afaed`)

**Why it matters:** The 3.0 rewrite aligns LangChain/LangGraph with the AI SDK v7 architecture. For Bartender Sanctuary, this means future LangGraph tutoring agents will stream progress updates to the UI and render citations natively. However, **this is still beta and depends on `ai@7.0.0-beta`**, which is not yet stable.

**Implementation Difficulty:** 3/5 (wait for stable release)
- Monitor `ai` v7 stable release
- Upgrade `@ai-sdk/langchain` to stable 3.x when available
- Test LangGraph tutoring agents against new streaming/citation APIs

**Potential Impact:** 4/5
- Streaming tool progress improves UX for long tutoring sessions
- Native citation support enables source-attributed lesson explanations
- HITL matching allows teacher review checkpoints in auto-generated content

**Stack-Specific Note:** This is a **watching-only** item until `ai` v7 reaches stable. Do not install on production yet.

---

### 4. `@langchain/langgraph` 1.4.6 + `agent-browser` 0.30.1 — P2/P3
*Updated today / new Vercel Labs tool.*

**`@langchain/langgraph` 1.4.6** — Minor patch published June 25. Confirms active maintenance of the LangGraph runtime that underpins complex tutoring orchestration.

**`agent-browser` 0.30.1** — Vercel Labs' new browser automation CLI for AI agents. Published June 25, 2026. Agents can now drive headless Chrome for web research, recipe scraping, and image verification.

**Why it matters:** LangGraph stability matters for P4 multi-agent architecture. `agent-browser` could automate:
- Scraping new cocktail recipes from Difford's Guide
- Verifying ingredient images on external sites
- Automated QA of deployed pages

**Implementation Difficulty:** 2/5
- `agent-browser`: install + configure Chrome in Vercel deployment or run as a separate worker
- `langgraph`: upgrade when adopting multi-agent tutoring

**Potential Impact:** 3/5 (langgraph) / 2/5 (agent-browser)
- `agent-browser` enables automated content enrichment without custom scrapers
- Vercel-native integration reduces infrastructure overhead

---

### 5. `@arcjet/next` 1.5.0 — AI Security Layer P1
*New since June 23 — prompt injection detection, PII blocking, WAF.*

`@arcjet/next` is a runtime security SDK for Next.js with:
- **Prompt injection detection** — blocks student attempts to manipulate the tutoring AI
- **PII blocking** — prevents students from exfiltrating personal data via prompts
- **WAF + bot protection + rate limiting** — standard API protection

**Why it matters:** Bartender Sanctuary is a school platform. Before shipping any AI tutor or auto-grader, the team must protect against prompt injection (students jailbreaking the grader to get higher scores) and PII leakage. Arcjet provides this as a lightweight middleware.

**Implementation Difficulty:** 2/5
- Install `@arcjet/next`
- Configure prompt injection rules for tutoring endpoints
- Add PII blocking to student-facing chat/test submission routes

**Potential Impact:** 5/5
- Prevents academic integrity violations via AI manipulation
- Protects student PII in AI interactions
- Lightweight (runs at the edge, no external API calls)

**Stack-Specific Note:** Designed for Next.js Edge Runtime. Works alongside `next-auth` and existing API routes.

---

## New Ecosystem Signals (Watching Only)

| Signal | Package/Version | Status | Why it matters |
|--------|----------------|--------|----------------|
| **Agent2Agent (A2A) protocol** | Google-originated, Linux Foundation 1.0 | **Stable** | Mastra has native `@a2a-js/sdk` support. Enables cross-framework agent delegation. Could allow Bartender Sanctuary to outsource specialized tutoring (e.g., wine knowledge) to external agents. |
| `ai-sdk-provider-claude-code` | 3.5.0 | **Stable** | AI SDK v6 provider for Claude via Claude Agent SDK (uses Pro/Max subscription). Cost-saving option for bulk generation if team has Claude Pro. |
| `@ai-sdk/devtools` | 0.0.20 | **New** | Vercel's local debugging UI for AI SDK apps. View LLM requests, tool calls, multi-step interactions. Useful for debugging tutoring agents. |
| `deepagents` | 1.10.5 | **Stable** | LangChain library for controllable AI agents with LangGraph. Alternative to Mastra for complex tutoring orchestration. |
| `@mastra/slack` / `@mastra/voice-inworld-realtime` | Various | **Stable** | Mastra ecosystem expanding with notification inbox, voice, and task lists. Not directly relevant yet. |
| `@google/genai` | 2.10.0 | **Updated** | Google GenAI SDK updated June 24. Adds Gemini model options via AI SDK. |

---

## Delta from June 24 Report

| Topic | June 24 Assessment | June 25 Update |
|-------|-------------------|----------------|
| Core package versions | Stable with minor drift | **Stable.** All June 24 versions unchanged except where noted below. |
| `@anthropic-ai/claude-agent-sdk` | 0.3.187 | **0.3.191** — +4 weekly parity patches; weekly rate-limit awareness added. |
| `@ai-sdk/langchain` | 2.0.217 | **3.0.0-beta.187** — major version jump tied to `ai@7.0.0-beta.187`. Beta only; watch for stable. |
| `@langchain/langgraph` | 1.4.5 | **1.4.6** — minor patch, published today. |
| `@mastra/core` | 1.46.0 | **1.47.0-alpha.2** — **NEW.** Eval gates/verdicts and Vercel `waitUntil` support. Most actionable release. |
| New packages | `@mastra/pg`, `@sentry/vercel-edge`, `neon-init` | **`agent-browser` 0.30.1** (Vercel Labs), **`@arcjet/next` 1.5.0** (AI security). |
| Project AI deps installed | None | **None — gap persists.** All P1–P5 recommendations remain actionable. |
| Bartending-specific AI tools | None on npm | **None found.** Custom MCP tools remain the only path. |

---

## Updated Recommendations (Priority Order)

| Priority | Action | Difficulty | Impact | Delta from June 24 |
|----------|--------|-----------|--------|-------------------|
| **P1** | Install `ai` ^6.0.209 + `@ai-sdk/gateway` ^3.0.134 + provider (`openai` or `anthropic`) | 2/5 | 5/5 | Unchanged. Gateway confirmed production-ready. |
| **P1** | Evaluate `ai-sdk-tools@1.2.0` + `@ai-sdk-tools/agents@1.2.0` for tutoring/auto-grader | 2/5 | 5/5 | Unchanged. First-party Vercel agent toolkit. |
| **P1** | Migrate `pg` → `@neondatabase/serverless` v1.1.0 | 2/5 | 4/5 | Unchanged. Prerequisite for all AI work. |
| **P1** | Add `@arcjet/next@1.5.0` for prompt injection + PII protection | 2/5 | 5/5 | **NEW.** Security must precede AI feature launch. |
| **P2** | Evaluate `@mastra/core@1.47.0-alpha.2` for eval gates + Vercel `waitUntil` | 2/5 | 5/5 | **NEW.** Alpha, but solves two critical problems (auto-grading quality + serverless persistence). |
| **P2** | Evaluate `@mastra/pg@1.14.1` for typed agent data access | 2/5 | 4/5 | Unchanged. Direct Postgres adapter for Mastra agents. |
| **P2** | Upgrade `@anthropic-ai/claude-agent-sdk` to 0.3.191 | 2/5 | 4/5 | **NEW.** 4 patches ahead; adds weekly rate-limit tracking. |
| **P3** | Upgrade `@ai-sdk/langchain` to 3.0.0-beta.187 (beta only) | 3/5 | 4/5 | **NEW.** Major version beta tied to ai v7. Watch for stable release. |
| **P3** | Upgrade `@langchain/langgraph` to 1.4.6 | 2/5 | 3/5 | **NEW.** Minor patch, updated today. |
| **P3** | Add `agent-browser@0.30.1` for automated cocktail/ingredient scraping | 2/5 | 3/5 | **NEW.** Vercel Labs tool for agent-driven browser automation. |
| **P2** | Add observability: `openlit@1.13.0` or `@mastra/observability@1.15.1` | 2/5 | 4/5 | Unchanged. Essential before shipping tutoring agents. |
| **P2** | Add `@ai-sdk/xai@3.0.97` for Grok model routing | 1/5 | 3/5 | Unchanged. Expands model choice through AI Gateway. |
| **P3** | Enable pgvector in Neon; embed cocktails + lessons | 3/5 | 5/5 | Unchanged. Embeddings confirmed via AI Gateway. |
| **P4** | Wrap school schema as MCP tools (lessons, tests, progress) | 3/5 | 5/5 | Unchanged. MCP.io docs confirm cross-client support. |
| **P5** | Pilot automated test generation in Foundations category | 2/5 | 5/5 | Unchanged. Quick win; validate rubric scoring before scaling. |
| **Watch** | Evaluate `@ai-sdk/devtools@0.0.20` for tutoring agent debugging | — | — | **NEW.** Vercel's local debugging UI for AI SDK apps. |
| **Watch** | Monitor `ai` v7 stable for `@ai-sdk/langchain` 3.x stable upgrade | — | — | **NEW.** ai v7 is in beta; wait for stable before production. |
| **Watch** | Monitor A2A protocol (`@a2a-js/sdk`) for cross-agent tutoring delegation | — | — | **NEW.** Google-originated, Linux Foundation standard. Mastra has native support. |

---

## Risk and Compliance Considerations (2026 Context)
*Unchanged from June 21.*

- **Academic integrity:** Include responsible-use guardrails and AI-literacy curricula (UNESCO 2024 guidance).
- **Bias and hallucinations:** Use evaluator-optimizer loops and human-in-the-loop checkpoints for high-stakes assessment.
- **Data protection:** Log all agent actions in Postgres for auditability (EU AI Act Article 4).
- **Model costs:** Budget for embedding generation and LLM inference; use Vercel Edge caching + AI Gateway cost controls.
- **Prompt injection:** Arcjet's detection layer is now recommended before any student-facing AI endpoint.

---

## Honest Assessment

The June 25 research cycle found **meaningful new releases** since June 24, most notably `@mastra/core` 1.47.0-alpha.2 (eval gates + Vercel `waitUntil`) and `@arcjet/next` 1.5.0 (AI security). These are the two most actionable new packages because they directly solve known blockers for Bartender Sanctuary:
1. **Eval gates** make auto-grading measurable and reliable.
2. **`waitUntil`** makes Mastra agents viable on Vercel without infrastructure workarounds.
3. **Arcjet** provides the security layer that was missing from the P1 list.

The `@ai-sdk/langchain` 3.0.0-beta jump is a strong ecosystem signal but is **not yet actionable** because it depends on `ai@7.0.0-beta`. The team should monitor for stable release but avoid beta dependencies in production.

No bartending-specific AI packages exist on npm. The best path remains building **domain-specific MCP tools** wrapping the existing Neon schema.

The **zero-AI-deps gap in `package.json` remains the critical blocker**. Every recommendation above is blocked until at least `ai` v6 + a provider package are installed.

---

## Sources

- npm registry: `ai` v6.0.209, `@ai-sdk/gateway` v3.0.134, `@ai-sdk/openai` v3.0.74, `@ai-sdk/anthropic` v3.0.86, `@ai-sdk/xai` v3.0.97, `@ai-sdk/langchain` v3.0.0-beta.187, `ai-sdk-tools` v1.2.0, `@ai-sdk-tools/agents` v1.2.0, `@modelcontextprotocol/sdk` v1.29.0, `@neondatabase/serverless` v1.1.0, `@neondatabase/neon-js` v0.6.2-beta, `pgvector` v0.3.0, `@framers/agentos` v0.9.78, `mastra` v1.15.1, `@mastra/core` v1.47.0-alpha.2, `@mastra/observability` v1.15.1, `@mastra/pg` v1.14.1, `@anthropic-ai/claude-agent-sdk` v0.3.191, `@inngest/agent-kit` v0.13.2, `openlit` v1.13.0, `@microsoft/agents-a365-observability` v1.1.0-preview.7, `@langchain/langgraph` v1.4.6, `langchain` v1.5.2, `@langchain/core` v1.2.1, `next` 16.2.9, `pg` 8.22.0, `@sentry/vercel-edge` 10.60.0, `@arcjet/next` 1.5.0, `agent-browser` 0.30.1, `@ai-sdk/devtools` 0.0.20
- MCP ecosystem: official Notion, BrowserStack, Heroku, HubSpot, Alchemy, Chrome DevTools, Sentry, Apify servers; `@ayatec/ai-gateway-mcp-server@0.10.1`
- Vercel docs: https://vercel.com/docs/ai-gateway (embeddings, reranking, multi-modal confirmed)
- Model Context Protocol: https://modelcontextprotocol.io/docs
- Mastra changelog: https://github.com/mastra-ai/mastra/blob/main/packages/core/CHANGELOG.md
- Claude Agent SDK changelog: https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md
- @ai-sdk/langchain changelog: https://github.com/vercel/ai/blob/main/packages/langchain/CHANGELOG.md
- Mastra blog: A2A protocol support (June 22, 2026), Notification Inbox (June 24), Task Lists (June 23)
- Anthropic: *Building Effective AI Agents* (Dec 2024; still canonical in 2026)
- Bartender Sanctuary codebase: `package.json` (`pg` ^8.21.0 only; no AI deps installed)
- Previous reports: `docs/agent-skills-research-2026-06-16.md` through `docs/agent-skills-research-2026-06-24.md`
