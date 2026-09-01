# Agentic Workflow — Detailed Mechanics

This document is the high-level workflow overview and routing surface for the
document-authoring workflow template. For a concise introduction, see
[AGENTS.md](AGENTS.md). For detailed procedures, load the relevant skill.

## Agent Roles

### 1. Orchestrator (primary)

The orchestrator is the only human-invokable agent. It conducts Socratic
interviews, drafts authoring briefs, delegates work to subagents, presents
review findings to the human, and manages the commit gate. It never edits files
directly. See `.opencode/agents/orchestrator.md` for the full protocol.

### 2. Discovery (subagent)

The discovery agent investigates the current state of the codebase and
documentation. It reads files, searches code, runs read-only git commands, and
searches the web. It cannot edit files, delegate tasks, or fetch URLs. It
returns structured findings to the orchestrator.

### 3. document-author (subagent)

The document-author agent implements the approved plan. It loads domain skills,
creates and edits documentation files, runs validation checks, and returns a
completion packet. It cannot delegate tasks. See
`.opencode/agents/document-author.md` for the full contract.

### 4. Review (subagent)

The review agent provides independent, read-only review. It loads `peer` plus
at least one relevant domain or lens skill, inspects the changed-file list and
acceptance criteria, and reports findings with severity, confidence, and
evidence. Multiple review sessions may run in parallel. See
`.opencode/agents/review.md` for the invocation contract.

## Skill Architecture

Skills provide specialized expertise loaded on demand. They do not create new
actors or sessions. See the `harness` skill for skill categorization patterns.
The skills directory is the authoritative list of available skills.

## Authoring Workflow

The orchestrator conducts a Socratic interview to clarify goals, surface
assumptions, identify affected documents, determine document types, and
establish acceptance criteria. From the interview, it drafts an authoring
brief containing objective, scope, document types, acceptance criteria,
relevant skills, changed-file scope, and attention flags.

The document-author loads relevant skills, creates or modifies documents, runs
`docs-check` and `markdownlint`, and returns a completion packet.

The orchestrator launches parallel review sessions. Each session loads `peer`
plus relevant lens skills. Sessions report findings to the orchestrator, which
presents them to the human for triage. The human accepts, dismisses, or
requests changes. Accepted changes return to document-author. The plan remains
approved unless the human explicitly reopens it.

## Remediation Flow

When review surfaces issues that need remediation, the flow returns to
implementation and then back through both review stages. The human and agent
both validate that findings were remediated without introducing new issues.

### Path A — Human review finds issues

```text
human review [changes surfaced] → implementation → human review → agentic review → commit
```

### Path B — Agentic review finds issues (after human review was clean)

```text
human review [clean] → agentic review [changes surfaced] → implementation → human review → agentic review → commit
```

### Skipping workflow steps

The human may elect to skip a workflow step (e.g., agentic re-review after a
trivial fix). If the agent disagrees with that assessment, it should push back.
The human may override, but the agent's pushback is a valued input that signals
potential risk. The decision and reasoning should be noted in the conversation.

## Workflow Reset

After each commit, the workflow resets. The next changeset begins with dialog
and planning, not implementation. Every gate must be passed again, regardless
of how similar the work may seem to previous changesets. After a commit, you go
back to square one.

The human collaborator may choose to abandon work and restart at the planning
phase at any time. This decision is final and should be respected.

## Discovery Workflow

The orchestrator delegates discovery when the current state of the codebase is
unclear, existing documentation needs assessment, or reference material is
needed. The discovery agent reads relevant files, searches for patterns, runs
read-only git commands, searches the web if needed, and returns a structured
findings report containing scope, purpose, findings, recommendations, and open
questions. The orchestrator uses these findings to inform planning, skill
selection, and task routing. Findings are advisory and do not authorize
implementation.

## Routing Table

Load the relevant resource based on your task:

| When | Load | Purpose |
| --- | --- | --- |
| Authoring or reviewing document structure, lifecycles, IDs, indexes, links, archives, specification behavior, or contracts | `repository-documentation` skill | Document structure and lifecycle rules |
| Running or interpreting documentation validation | `docs-check` skill | Validation script usage and checks |
| Publishing documentation to external surfaces | `docs-publish` skill | Publication workflow boundary |
| Drafting or reviewing a commit message | `commit-convention` skill | Commit grammar and approval |
| Decomposing work into a plan | `planning-structure` skill | Plan structure and acceptance criteria |
| Authoring or reviewing harness, agents, skills, or workflow | `harness` skill | Harness architecture and skill catalog |
| Authoring or reviewing OpenCode configuration | `opencode-configuration` skill | Configuration judgment and permission model |
| Conducting a review | `peer` skill (+ domain skill) | Peer review lens and heuristics |
| Changes affect permissions, secrets, or auth | `security` skill | Security review threat model |
| Authoring or reviewing literature notes | `literature-note` skill | Source note evidence judgment |

## HITL Gates

- **Gate 1:** Explicit human plan approval before substantive work.
- **Gate 2:** Human work approval before agent review. Commit only after every
  required perspective returns non-`BLOCKED`, no human-accepted finding remains
  unresolved, and the human approves the commit message.
- Any accepted change restarts human work approval and agent review.

## Key Rules

- No stage advances without passing checks.
- Only the orchestrator conducts human-facing Socratic interviewing.
- Every `git commit` and `git push` requires explicit human chat approval plus
  a fresh OpenCode `once` confirmation for the exact command.
- Never force-push, bypass hooks, use wrappers to evade permissions, or select
  persistent `always` approval.
- Durable artifacts live in `docs/` and `ktlo/`; review packets remain in
  context.
- Questions open dialog; only explicit commands authorize implementation.
- Keep models unpinned and permissions least-privileged.
- Restart OpenCode after config, agent, skill, or plugin changes.
