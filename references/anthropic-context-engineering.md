# Source Note: Effective Context Engineering for AI Agents (Anthropic)

- **Author**: Anthropic (engineering blog)
- **Reference Type**: engineering blog post
- **Title**: Effective context engineering for AI agents
- **Link**: <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
- **Published**: 2025-09
- **Status**: retrieved 2026-09-01 (abstract/snippet only; handoff packet summary; full text not inspected)
- **Informs principles**: GP01, GP02

## Key points captured
- **Smallest set of high-signal tokens**: the goal of context engineering is to provide the minimal set of tokens that meaningfully guide the agent's behavior.
- **Just-in-time context retrieval**: rather than loading everything upfront, use lightweight identifiers (names, descriptions) to route to full content only when needed.

## Limitations
- Handoff summary does not include specific examples, implementation patterns, or evaluation results.
- "Lightweight identifiers" is mentioned but not elaborated in the summary.

## Why it matters here
Directly supports GP01's progressive-disclosure pattern: expose minimal metadata first, load full instructions on demand. The "smallest set of high-signal tokens" framing aligns with the project's ≤100-line AGENTS.md ceiling and its emphasis on keeping always-loaded content minimal. Principle mapping is **strong** for GP01: the source articulates the same design principle the project operationalizes.
