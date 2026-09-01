# Source Note: Equipping Agents for the Real World with Agent Skills (Anthropic)

- **Author**: Anthropic (engineering blog)
- **Reference Type**: engineering blog post
- **Title**: Equipping agents for the real world with Agent Skills
- **Link**: <https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills>
- **Published**: not specified in handoff packet
- **Status**: retrieved 2026-09-01 (abstract/snippet only; handoff packet summary; full text not inspected)
- **Informs principles**: GP01, GP02

## Key points captured
- **Skills as progressive-disclosure mechanism**: skills expose a compact name and description for routing; the full SKILL.md is loaded only when the skill applies to the current task.
- **Compact metadata for routing**: the name and short description are sufficient for the agent to decide whether to load the full skill instructions.

## Limitations
- Handoff summary does not include implementation details, evaluation results, or specific examples of skill structures.
- No information on how Anthropic measures the effectiveness of this pattern.

## Why it matters here
Directly supports the project's skill-routing mechanism and GP01's progressive-disclosure pattern. The "compact name/description for routing, full content on demand" pattern is exactly what the project implements in its `.opencode/skills/` structure. Principle mapping is **strong** for GP01 and GP02: the source describes the same architectural pattern the project uses.
