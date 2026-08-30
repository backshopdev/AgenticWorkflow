# Agentic Workflow Harness - Reference Template

This file is the template content that consuming repos start with. Customize for your project's needs.

## Core Philosophy
Human + agent collaborator = better whole. Agents augment not replace. Both bring strengths to the process.

## Agent Pipeline (progressive reveal)

### 1. Orchestrator (REQUIRED - your entry point)
- Primary human-agent interface
- Routes requests through the workflow
- Never writes code/docs directly
- `@orchestrator` in agent selector

### 2. Harness Writer (executor + design specialist)
- Orchestrator hands off the approved plan; harness-writer writes/edits the files
- Specialist in AI-harness craft (playbooks, prompts, skills, workflow structure)
- Independent context; returns a completion packet to the orchestrator
- Runs the repo's objective checks itself (docs: `markdownlint`/JSON/structure; code: lint/tests/build) and reports them in `verify-status` — **no separate Verifier agent**
- `@harness-writer` (subagent)

### 3. Review lanes — two independent, parallel specialists
- `@harness-reviewer` (harness/agentic-tuning lens) + `@peer-reviewer` (general correctness/clarity lens)
- One of each, in parallel, isolated context, scoped to the session's changed files + how they intersect the repo
- Findings return as a packet; the human triages and may dismiss any finding

## Workflow Form (docs → implementation)
`@orchestrator` (plan + Gate 1) → `@harness-writer` (execute + objective checks) → `@harness-reviewer` + `@peer-reviewer` (parallel, isolated, scoped) → Gate 2 (human + lanes approve)

**Doc-creation lint trigger:** at the conclusion of any document-creation work, the **harness-writer** runs the repo's Markdown lint (`npx markdownlint-cli2` by default; configure via `.markdownlint-cli2.jsonc` + `opencode.json` `workflow.repoKind`) over the touched files and clears findings before hand-off. Code repos run their lint/tests/build here as usual.

## HITL Gates (hard rules)
Two human-in-the-loop gates bracket substantive work. Human and agents bring overlapping strengths to each review — a dialog, not a rigid fit-vs-quality split.

**Gate 1 — Plan sign-off.** Unless executing an already-written, approved plan in the repo (`~/plans/` / `~/docs/`), the human must explicitly sign off on the plan before implementation work begins.

**Gate 2 — Commit approval.**
`[agent develops] → [human reviews] → [agents review: harness + peer lanes] → [commit]`
- Commits only when the human AND both review lanes approve; any "request changes" bounces to the harness-writer (step 2) and restarts the loop.
- Human reviews first (fast direction check before review tokens); lanes then review with their own strengths/lenses. Roles overlap.
- The harness-writer runs objective checks + drafts the commit message; the orchestrator presents it to the human before committing. Grammar: `CONTRIBUTING.md` + `.opencode/skills/commit-convention.SKILL.md`.

## Index & link discipline (hard rule)
Every `index.md` MUST:
- (a) use **relative** links; and
- (b) link **only** to (i) other `.md` files in the **same directory** (`[Text](./file.md)`) or (ii) an `index.md` in an **immediate child** directory (`[Text](./child/index.md)`).
- Never link across multiple levels, into non-`index.md` files in child/grandchild dirs, or use absolute paths.
- Every `.md` actually present in the directory (and each immediate child dir's `index.md`) must be linked — no orphans.

## Key Rules
- No stage advances without passing
- Two independent review lanes (harness + peer), parallel and scoped to session changes; the human triages/dismisses
- The harness-writer owns objective checks (lint/structure) — there is no separate Verifier
- Persistent state in `~/docs/` + `WORKFLOW_STATE.md`
- Human yields after each gate; orchestrator resumes at completion
- HITL gates: (1) human signs off the plan before work (unless an approved plan already exists in-repo); (2) human + lanes must ALL approve before commit; any change request restarts the loop
- Commit standard: Conventional Commits + GitHub `Refs:` keys + release-note bodies (`CONTRIBUTING.md` + `.opencode/skills/commit-convention.SKILL.md`)
- Index & link discipline per the rule above
- Socratic dialog: a human question/opinion probe is a dialog-opener, not a work order - converse first; implement only on an explicit command; explain tradeoffs when touching unfamiliar ground

## Quick Start
1. `opencode` - select `orchestrator`
2. Describe goal → orchestrator routes through pipeline
3. Follow pipeline: Harness Writer → (harness + peer reviewers) → commit gate
4. Check `~/docs/` for artifacts at each stage

## Customization
- Override agent descriptions/permissions in AGENTS.md
- Add KTLO items in `KTLO/` (template items marked `[template]`, project items `[project]`)
- Adapt workflow stages for your project type (docs→implementation form preserved)
