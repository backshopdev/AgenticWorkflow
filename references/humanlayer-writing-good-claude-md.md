# Source Note: Writing a Good CLAUDE.md (HumanLayer)

- **Author**: HumanLayer (publication; specific author not specified in handoff packet)
- **Reference Type**: blog post / guide
- **Title**: Writing a good CLAUDE.md
- **Link**: <https://www.humanlayer.dev/blog/writing-a-good-claude-md>
- **Published**: 2025-11
- **Status**: retrieved 2026-09-01 (abstract/snippet only; handoff packet summary; full text not inspected)
- **Informs principles**: GP01, GP02

## Key points captured
- **Keep always-loaded content concise**: the root CLAUDE.md (or AGENTS.md) should contain only what is universally needed.
- **Task-specific material in self-describing files**: detailed guidance belongs in separate files with clear names and descriptions indicating when to read them.
- **Short descriptions for when to read**: each supplementary file should include a brief description that helps the agent decide whether to load it for a given task.

## Limitations
- Handoff summary does not include specific examples of file structure, description formats, or evaluation of the approach.
- No information on whether these recommendations are based on empirical testing or author experience.

## Why it matters here
Supports GP01's progressive-disclosure pattern and GP02's emphasis on situational, task-specific guidance. The "short descriptions for when to read" pattern aligns with the project's skill-routing mechanism (name + description for routing, full content loaded on demand). Principle mapping is **qualified** for GP01 and GP02: the source articulates the same separation of always-loaded vs. situational content that the project implements, but the abstract-only retrieval limits direct verification.
