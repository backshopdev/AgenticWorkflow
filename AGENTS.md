# Agentic Workflow Harness

## Core Philosophy
Human + agent collaborator = better whole. Agents augment not replace. Both bring strengths to the process. The workflow is designed around genuine dialog and Socratic interview to surface assumptions, unconsidered use cases, and side effects.

## Agent Pipeline (progressive discoverability)

### 1. Orchestrator (REQUIRED - your entry point)
- Primary human-agent interface
- Routes requests through the workflow pipeline
- Never writes code/docs directly - only orchestrates
- `@orchestrator` in agent selector
- Opens with: "I'll walk through the workflow with you. To start, could you tell me: what are you trying to achieve, and what's the primary goal for this work?"

### 2. Harness Writer (executor + design specialist)
- The orchestrator hands off the approved plan; harness-writer is the agent that actually writes/edits files
- Specialist in AI-harness craft: playbooks, prompts/instructions, skills, workflow structure
- Runs in its own independent context; returns a completion packet (files-changed, attention-flags, open-questions) to the orchestrator
- `@harness-writer` (subagent; do not edit files from the orchestrator seat)
- Runs the repo's objective checks itself (docs: `markdownlint`/JSON/structure; code: lint/tests/build) and reports them in its packet's `verify-status` — there is **no separate Verifier agent**

### 3. Review lanes — two independent, parallel specialists
- `@harness-reviewer` — the harness lens: does the change tune well for agentic use (playbooks, prompts, wiring, drift)?
- `@peer-reviewer` — the general peer lens: correctness, completeness, consistency, clarity
- Spawned by the orchestrator **one of each, in parallel, in isolated context**, scoped to the session's changed files + how they intersect the repo (findings anchored to what changed — no out-of-scope audits)
- They return findings as a completion packet; the orchestrator presents them to the human, who **triages and may dismiss any finding**. Findings are inputs, not verdicts

## Workflow Form (docs → implementation)
`@orchestrator` (plan + Gate 1) → `@harness-writer` (execute + run objective checks → completion packet) → `@harness-reviewer` + `@peer-reviewer` (parallel, isolated, scoped to session changes) → Gate 2 (human + lanes approve)

Full loop: (1) orchestrator plans & hands off; (2) harness-writer executes & returns a packet flagging anything needing attention; (3) orchestrator summarizes, points the human at the files (their own tool — no diffs rendered); (4) human approves or requests changes → **changes return to step 2** (plan stays approved); (5-6) orchestrator spawns both reviewers in parallel, consolidates their packets, presents findings for human triage (dismiss allowed) → **changes return to step 2**; (7) orchestrator drafts commit message, human approves it, commit.

Human yields after each gate; orchestrator resumes session at completion.

**Doc-creation lint trigger (hard rule):** on the conclusion of any document-creation work, the **harness-writer** runs `npx markdownlint-cli2` over the touched Markdown and clears findings before hand-off (reported in `verify-status`) — here *and* in consuming repos. This harness repo is `docs`-kind (no build/test); config in `.markdownlint-cli2.jsonc`.

## Index & link discipline (hard rule)
Every `index.md` MUST:
- (a) use **relative** links; and
- (b) link **only** to (i) other `.md` files in the **same directory** (`[Text](./file.md)`) or (ii) an `index.md` in an **immediate child** directory (`[Text](./child/index.md)`).
- Never link across multiple levels, into non-`index.md` files in child/grandchild dirs, or use absolute paths.
- Every `.md` present in the directory (and each immediate child dir's `index.md`) must be linked — no orphans. Enforced by harness-writer on doc-completion + the review lanes.

## HITL Gates (hard rules)
Two human-in-the-loop gates bracket all substantive work. The human and the agents bring *overlapping* strengths to each review — this is a dialog, not a rigid "human=fit / agents=quality" split.

**Gate 1 — Plan sign-off (before work begins).** Unless we're executing an already-written, approved plan living in the repo (`~/plans/` / `~/docs/`), the human collaborator must explicitly sign off on the plan before any implementation work starts. Orchestrator holds here.

**Gate 2 — Commit approval (before commit).**
`[agent develops] → [human reviews] → [agents review: harness + peer lanes] → [commit]`
- A changeset commits ONLY when the human collaborator AND the reviewing lanes all approve; any "request changes" bounces back to harness-writer (step 2) and the loop restarts.
- The human reviews first as a fast direction check (cheap before spending review tokens); then lanes review with their own strengths and lenses. Roles overlap.
- The harness-writer runs the objective checks (lint/structure) and drafts the commit message, which the orchestrator presents to the human for sign-off before committing.
- Commit grammar: `.opencode/skills/commit-convention.SKILL.md`; tracker keys + usage: `CONTRIBUTING.md`.

## Key Rules
- **No stage advances without passing** - failed gates loop back with specific feedback
- **Two independent review lanes** (harness + peer), parallel and scoped to session changes; the human triages and may dismiss any finding
- **Persistent state** in `~/docs/` + `WORKFLOW_STATE.md` = durable record across sessions
- **Human in loop** - orchestrator is the entry point, yields after each gate
- **HITL gates** - (1) human signs off the plan before work (unless an approved plan already exists in-repo); (2) human + agents must ALL approve before a commit; any change request bounces back and restarts the loop
- **Commit standard** - Conventional Commits + GitHub `Refs: #` keys + release-note-aware bodies (see `CONTRIBUTING.md` + `.opencode/skills/commit-convention.SKILL.md`)
- **Socratic interview** - agents surface assumptions before generating; a question is a dialog-opener, NOT a work order - converse first, don't jump to implementing
- **Single source of truth** - all artifacts in `~/docs/`, nothing scattered in chat history

## Quick Start
1. `opencode` - select `orchestrator`
2. Describe goal → orchestrator routes through pipeline
3. Follow pipeline: Harness Writer → (harness + peer reviewers) → commit gate
4. Check `~/docs/` for artifacts at each stage
5. Final result when both lanes approve and the human signs off on the commit

## Customization (for this repo only)
- Override agent descriptions/permissions in AGENTS.md
- Add KTLO items in `KTLO/` (template items marked `[template]`, project items `[project]`)
- Adapt workflow stages for project type (docs→implementation form preserved)
