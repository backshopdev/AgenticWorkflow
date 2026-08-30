# Source Note: A Complete Guide to AGENTS.md (AI Hero)

- **Author**: AI Hero (publication) — no individual byline on page
- **Reference Type**: guide / article
- **Title**: A Complete Guide To AGENTS.md
- **Link**: <https://www.aihero.dev/a-complete-guide-to-agents-md>
- **Updated**: 2026-01-18 (per page frontmatter)
- **Status**: retrieved 2026-08-29 (full text)
- **Informs principles**: GP01, GP02, GP07

## Key points captured
- **Instruction budget**: AI Hero, citing Kyle/HumanLayer, reports that frontier thinking LLMs can follow approximately 150–200 instructions with reasonable consistency; smaller and non-thinking models can follow fewer. The underlying HumanLayer article was not independently inspected for this note. Every `AGENTS.md` token loads on *every* request, so the ideal file is "as small as possible."
- **Stale docs poison context**: for agents reading docs every request, outdated info actively misleads. Prefer describing **capabilities** over hard file paths; domain concepts are safer than paths.
- **Progressive disclosure**: keep only a one-line project description, package manager, and non-standard build/typecheck in root; move everything else to separate files / nested docs / skills, referenced conversationally (no "ALWAYS"/all-caps).
- **Don't build a ball of mud**: the "add a rule per mistake" loop is what makes files unmaintainable; a "ball of mud" harms performance. (Mirrors our anti-patterns.)
- **Monorepo nesting**: sub-dir `AGENTS.md` merge with root; keep each level scoped.

## Why it matters here
The source supports GP01 by recommending minimal always-on context and supports
the separation of durable, situational guidance behind GP02 and GP07. The
project's ≤100-line `AGENTS.md` ceiling is our operationalization of that
direction; the source does not specify or validate that exact threshold.
