# Source Note: Skill Issue — Harness Engineering for Coding Agents (HumanLayer)

- **Author**: HumanLayer (publication; specific author not specified in handoff packet)
- **Reference Type**: blog post / guide
- **Title**: Skill Issue: Harness Engineering for Coding Agents
- **Link**: <https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents>
- **Published**: not specified in handoff packet
- **Status**: retrieved 2026-09-01 (abstract/snippet only; handoff packet summary; full text not inspected)
- **Informs principles**: GP01, GP02, GP07

## Key points captured
- **Start with minimal configuration**: begin with a small AGENTS.md and expand only when needed.
- **Test on representative work**: evaluate the configuration on real tasks, not synthetic benchmarks.
- **Add/retain instructions only when they address demonstrated failures**: do not add speculative rules; each instruction should solve a observed problem.
- **Skills as reusable knowledge**: skills encapsulate domain-specific guidance that can be reused across tasks.
- **Subagents as context-isolation mechanisms**: subagents can isolate context to prevent pollution of the main agent's context.

## Limitations
- Handoff summary does not include specific examples of minimal configurations or failure-driven iterations.
- No information on how to identify "demonstrated failures" or measure when an instruction is needed.

## Why it matters here
Supports GP01's emphasis on minimal always-loaded context and iterative expansion. Supports GP02's separation of situational guidance into skills. Supports GP07's preference for evidence-driven rules over speculative ones. The "start minimal, test, add only when needed" approach aligns with the project's backpressure mechanism (automated feedback for self-correction). Principle mapping is **strong** for GP01, GP02, and GP07: the source articulates the same iterative, evidence-driven approach to harness engineering.
