# OpenCode Roundhouse

A reusable multi-agent [OpenCode](https://opencode.ai) workflow for structured document authoring. The root of this repository uses the template to maintain and evolve itself.

## Overview

Human + agent collaboration produces a better whole. This workflow pairs human judgment with agent execution through:

- **Human-in-the-loop gates** at every consequential transition
- **Socratic interviewing** that surfaces assumptions before generation
- **Independent parallel review** sessions with authoritative human triage
- **Skill-based architecture** that loads expertise on demand, not all at once

Other approaches work well for their use cases. This is a deliberate choice: we believe the dialogue, gates, and review cycles produce better outcomes than autonomous generation — even when the latter is faster. The partnership itself is the value, and the speed bumps are intentional.

The reusable template lives in `src/`. The root of this repository deploys that template and uses it to maintain and evolve itself — the workflow is docs-as-code by construction.

## Adopting the Template

To use this workflow in your own repository:

1. Copy the contents of `src/` into your repo root.
2. Customize the docs outside `.opencode/` for your project — `AGENTS.md`, `AGENTIC_WORKFLOW.md`, `CONTRIBUTING.md`, `BUILDING.md`, `TESTING.md`, and the `docs/`, `ktlo/` directories are yours to adapt.
3. As the workflow evolves, copy the updated `.opencode/` directory and `opencode.json` from `src/` into your repo to pick up new skills, agents, and configuration.

What you get:

- Four agent roles (orchestrator, investigator, document-author, reviewer) configured in `opencode.json` with prompt files in `.opencode/agents/`
- Skills for planning, commit conventions, peer review, security, and domain-specific authoring
- A structured docs layout (`docs/decisions/`, `docs/specs/`, `docs/plans/`, `docs/architecture/`, `docs/contracts/`, `docs/implementation-maps/`)
- Markdown validation via `markdownlint-cli2` (config not included; adopters provide their own) and a docs-check script

The `.opencode/` directory and `opencode.json` are the workflow engine — agents, skills, and plugin configuration. Copy them from `src/` when you want to adopt the full workflow, or start with just the docs and add `.opencode/` and `opencode.json` later as your needs mature.

## Workflow at a Glance

The template workflow in `src/` runs as follows. The orchestration loop:

```text
@orchestrator (plan + Gate 1) → @document-author (author + checks) → human
work approval → parallel @reviewer sessions → human triage → commit gate
```

Four agent roles with distinct authority:

- **Orchestrator** — the human interface; runs Socratic planning, enforces gates, delegates work, composes review perspectives from skills, consolidates findings, and manages commit approval. Never edits files.
- **Investigator** — investigates the current state of the codebase and documentation; reads files, searches code, runs read-only git commands, and searches the web for reference material. Cannot edit files or delegate tasks.
- **document-author** — implements the approved plan in isolated context; loads relevant skills, runs objective checks, and returns a completion packet. Accepted human or reviewer changes return here; the plan stays approved unless the human explicitly reopens it.
- **Reviewer** — independent read-only sessions in parallel, each loading `peer` plus a domain skill (`harness`, `literature-note`, or `opencode-configuration`); `security` joins when changes touch sensitive areas. The orchestrator presents findings to the human, who triages and may dismiss any — findings are inputs, not verdicts.

Two human gates control every changeset:

- **Gate 1 — plan approval:** the human signs off on the plan before substantive work begins (unless an approved written plan already exists in the repo).
- **Gate 2 — commit approval:** after human work approval and independent review, the human approves the commit message and confirms the exact command.

### Skill Architecture

Skills load on demand — they sharpen judgment without creating another actor, session, or handoff. The root workflow has seven skills across three categories:

- **Foundation** — planning-structure, commit-convention
- **Artifact authoring** — harness, literature-note, opencode-configuration
- **Review lens** — peer, security

The template in `src/` expands to five categories with 41 skills, adding cross-cutting concern skills (security-privacy, accessibility, quality-attributes) and technology skills (react, typescript, astro, and others).

For full workflow mechanics — role detail, HITL gate enforcement, permission model, objective checks, and key rules — see [AGENTIC_WORKFLOW.md](AGENTIC_WORKFLOW.md).

## Repository Structure

- **Root** — deployed instance of the template; uses itself to maintain the template. Contains `AGENTS.md`, `AGENTIC_WORKFLOW.md`, `CONTRIBUTING.md`, `guiding-principles.md`, `opencode.json`, `.markdownlint-cli2.jsonc`, and other files. Root `.opencode/` and `opencode.json` are deployed (gitignored) copies of `src/`.
- **`src/`** — reusable template; copy this into a consuming repo. Mirrors the root structure with its own `.opencode/`, `docs/`, `ktlo/`, and top-level docs.
- **`.opencode/`** (root) — deployed (gitignored) copy of `src/.opencode/`; agents (orchestrator, document-author, reviewer), skills (planning-structure, commit-convention, peer, security, harness, literature-note, opencode-configuration), and plugin configuration.
- **`docs/`** — durable artifacts: decisions, specs, and plans
- **`ktlo/`** — keep-the-lights-on operational items (domain conventions, coding standards, sync procedures)
- **`references/`** — literature notes that informed the guiding principles
- **`guiding-principles.md`** — eight principles (GP01–GP08) extracted from considered sources

## Guiding Principles

Eight principles shape every design decision in this workflow:

1. **Progressive disclosure** — start simple, layer complexity as needed
2. **Single source of truth** — all artifacts in dedicated directories, never scattered
3. **Human in loop** — orchestrator is entry point, yields after each gate
4. **Independent parallel review** — multiple reviewers, human triage
5. **Socratic interview** — surface assumptions before generation
6. **Question, not command** — an invitation to converse, not a work order
7. **Tooling enforces the checkable** — linters handle the verifiable; prose is for judgment
8. **Human leads, agent as near-equal partner** — the human is tiebreaker, but agent judgment carries substantial weight

See [guiding-principles.md](guiding-principles.md) for the full extraction with sources.

## Key Files

### Template (in `src/`)

- **AGENTS.md** — concise introduction and entry point; the first file agents and humans read
- **AGENTIC_WORKFLOW.md** — complete workflow mechanics: roles, gates, checks, permissions, rules
- **CONTRIBUTING.md** — how changes are made, reviewed, and committed; Conventional Commits standard with examples
- **BUILDING.md** — build instructions and prerequisites
- **TESTING.md** — testing procedures and conventions
- **README.md** — project overview and adoption guide
- **opencode.json** — agent definitions and permission rules
- **.opencode/** — agents, skills, and workflow configuration

### Root-only

- **guiding-principles.md** — eight principles (GP01–GP08) with source attribution and operationalization notes
- **.markdownlint-cli2.jsonc** — markdownlint config tuned for dense prose; silence cosmetic rules, keep correctness guards
- **references/** — literature notes that informed the guiding principles
- **LICENSE** — project license
- **.gitignore** — git ignore rules

## Requirements

- **[OpenCode](https://opencode.ai)**
- **Node.js** — for `markdownlint-cli2` (run via `npx`)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution process, HITL gate detail, and commit message standard.
