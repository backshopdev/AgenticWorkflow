# [Project Name]

[Brief project description — 1-2 sentences explaining what this project does]

## Quick Start

1. Start `opencode` and select `orchestrator`.
2. Describe your documentation goal.
3. The orchestrator conducts a Socratic interview and drafts an authoring brief.
4. Approve the plan (Gate 1).
5. The orchestrator delegates to `discovery`, `document-author`, and `review`.
6. Inspect authored files and triage review findings.
7. Approve the commit message and confirm the commit.

## Project Overview

<!-- Customize this section with your project's specific information -->

[Describe your project's purpose, main features, and key technologies]

## Documentation Structure

This project uses a structured documentation system:

- `docs/decisions/` — Decision records
- `docs/specs/` — Specifications with Gherkin scenarios
- `docs/plans/` — Implementation plans
- `docs/architecture/` — Architecture documents
- `docs/implementation-maps/` — Code navigation maps
- `docs/contracts/` — API and data contracts
- `ktlo/` — Keep the Lights On operational items

For detailed workflow mechanics, see [AGENTIC_WORKFLOW.md](AGENTIC_WORKFLOW.md).

## Validation

Two validation tools must pass before commit:

- **docs-check:** `node .opencode/docs-check.js`
- **markdownlint:** `npx --yes markdownlint-cli2@0.23.2`

## Contributing

<!-- Customize this section with your project's contribution guidelines -->

[Describe how contributors should get started, coding standards, PR process, etc.]

## Files

- `AGENTS.md` — Concise introduction and quick start
- `AGENTIC_WORKFLOW.md` — Complete workflow mechanics
- `opencode.json` — Agent definitions and permissions
- `.opencode/docs-check.js` — Documentation validation script
- `.opencode/skills/` — All skill definitions
