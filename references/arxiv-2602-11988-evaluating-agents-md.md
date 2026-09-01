# Source Note: Evaluating AGENTS.md — Are Repository-Level Context Files Helpful for Coding Agents?

- **Author**: not specified in handoff packet (arXiv preprint)
- **Reference Type**: research paper (preprint)
- **Title**: Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?
- **Link**: <https://arxiv.org/html/2602.11988>
- **Published**: 2026-02 (per arXiv ID)
- **Status**: retrieved 2026-09-01 (abstract/snippet only; handoff packet summary; full text not inspected)
- **Informs principles**: GP01, GP02

## Key points captured
- **Context files did not generally improve task success**: the study found that repository-level context files did not reliably increase task completion rates.
- **Increased inference cost**: context files added 20%+ to inference cost.
- **Generic overviews not helpful**: broad, high-level project descriptions did not contribute to performance.
- **Non-standard practice instructions are defensible**: instructions that deviate from common conventions (e.g., project-specific build steps) can be justified when they address demonstrated needs.

## Limitations
- Handoff summary does not specify which benchmarks, models, or context-file formats were evaluated.
- "Did not generally improve" leaves open the possibility of conditional benefits; full text needed to determine conditions.

## Why it matters here
Acts as a counterweight to unconditional claims that AGENTS.md always helps. Supports GP01's emphasis on **high-signal, concise** always-loaded content rather than generic overviews. Supports GP02's preference for situational, task-specific guidance over blanket project descriptions. Principle mapping is **qualified**: the source warns against low-signal context bloat, which aligns with the project's progressive-disclosure approach, but does not address the specific design of the project's AGENTS.md.
