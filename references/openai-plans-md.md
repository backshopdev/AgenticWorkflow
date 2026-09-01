# Source Note: Using PLANS.md for Multi-Hour Problem Solving (OpenAI)

- **Author**: OpenAI (cookbook)
- **Reference Type**: cookbook article / guide
- **Title**: Using PLANS.md for multi-hour problem solving
- **Link**: <https://developers.openai.com/cookbook/articles/codex_exec_plans>
- **Published**: not specified in handoff packet
- **Status**: retrieved 2026-09-01 (abstract/snippet only; handoff packet summary; full text not inspected)
- **Informs principles**: GP01, GP02

## Key points captured
- **Short rule in AGENTS.md describing when plan is required**: the AGENTS.md contains a brief instruction indicating when a PLANS.md file should be created (e.g., for multi-hour tasks).
- **Detailed spec in separate file**: the full plan specification lives in a separate PLANS.md file, not in the always-loaded AGENTS.md.

## Limitations
- Handoff summary does not include the exact wording of the AGENTS.md rule or the PLANS.md structure.
- No information on evaluation results or when this pattern is most effective.

## Why it matters here
Provides a concrete example of GP01's progressive-disclosure pattern in practice: a short routing rule in AGENTS.md points to a detailed situational file. This validates the project's approach of keeping AGENTS.md minimal while delegating detailed guidance to separate files. Principle mapping is **strong** for GP01 and GP02: the source demonstrates the same separation of always-loaded vs. situational content.
