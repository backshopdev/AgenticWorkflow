# Source Note: Configuration Smells in AGENTS.md Files

- **Author**: not specified in handoff packet (arXiv preprint)
- **Reference Type**: research paper (preprint)
- **Title**: Configuration Smells in AGENTS.md Files: Common Mistakes in Configuring Coding Agents
- **Link**: <https://arxiv.org/abs/2606.15828>
- **Published**: 2026-06 (per arXiv ID)
- **Status**: retrieved 2026-09-01 (abstract/snippet only; handoff packet summary; full text not inspected)
- **Informs principles**: GP01, GP02, GP07

## Key points captured
- **Six configuration smells identified**: the study catalogues common mistakes in AGENTS.md files.
- **Most prevalent smells**:
  - **Lint leakage (62%)**: embedding lint/style rules in AGENTS.md that should be enforced by tooling.
  - **Context bloat (42%)**: including too much information in the always-loaded context.
  - **Skill leakage (35%)**: putting skill-specific instructions in the root AGENTS.md instead of in separate skill files.
- **Interpretation**: these smells represent anti-patterns that degrade agent performance and maintainability.

## Limitations
- Handoff summary does not specify the other three smells or the methodology for identifying them.
- No information on the dataset of AGENTS.md files analyzed or the criteria for smell classification.

## Why it matters here
Directly supports GP07's principle that machine-checkable rules belong in tooling, not prose (lint leakage). Supports GP01's emphasis on minimal always-loaded context (context bloat). Supports GP02's separation of situational guidance into skill files (skill leakage). Principle mapping is **strong** for GP01, GP02, and GP07: the source empirically validates the anti-patterns the project aims to avoid.
