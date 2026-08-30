# Agentic Workflow Harness - Reference Template

Customize this template for the consuming repository while preserving the
stable role and gate contracts.

## Stable Roles

- `@orchestrator`: human-facing planner/router; never edits files.
- `@document-author`: implements the approved plan, loads domain skills, owns
  the changed-file list, runs objective checks, and returns a completion packet.
- `@review-agent`: reusable read-only reviewer. Launch one independent session
  per meaningful perspective, in parallel.

## Skill Composition

Every review session loads `peer` plus at least one relevant domain skill:
`harness`, `literature-note`, or `opencode-configuration`. Inspect each
session's entire supplied changed-file list. Add `security` to that session if
any listed change affects permissions, secrets, auth, MCP, plugins, executable
tools or commands, network access, external directories, trust boundaries, or
equivalent sensitive configuration, regardless of the session's perspective.
Stop for a domain-skill gap rather than running peer alone.

Each review session receives the explicit session changed-file list, acceptance
criteria, document-author attention flags, and assigned skills. Sessions are
context-independent, read-only, report review results and assumptions only to
the orchestrator, and never interview the human.

## Workflow

`@orchestrator` (plan + Gate 1) → `@document-author` (author + checks) → human
work approval → parallel `@review-agent` sessions → human triage → commit gate.

The orchestrator merges mechanical duplicates while retaining provenance.
Substantive disagreements are reported as debates for authoritative human
triage and are never resolved unilaterally; original reviewer verdicts are
preserved. Accepted changes return to document-author; the plan remains
approved unless explicitly reopened.

## Objective Checks

The document-author runs the repository checks and reports exact results; there
is no separate verifier. Document work triggers Markdown lint over every touched
Markdown file. Config work also requires JSON/JSONC, schema, frontmatter,
link/index, whitespace, secret, synchronization, and status checks. Code repos
use their `CONTRIBUTING.md` lint/test/build commands.

## HITL Gates

- **Gate 1:** explicit human plan approval before substantive work unless a
  written approved plan already exists.
- **Gate 2:** human work approval occurs before agent review. Commit only after
  every required perspective returns a non-`BLOCKED` packet (correct and rerun
  blocked sessions), no human-accepted finding remains unresolved, and the human
  approves the `commit-convention`-compliant message. Dismissed findings do not
  require a replacement `APPROVE` verdict.
- Any accepted change restarts human work approval and agent review.

## Index and Link Discipline

Every `index.md` links every sibling Markdown file and immediate-child
`index.md`, using relative links only. Do not link multiple levels down.

## Key Rules

- No stage advances without passing; the human may dismiss findings.
- Only the orchestrator conducts human-facing Socratic interviewing.
- Every `git commit` and `git push` by document-author requires explicit human
  chat approval plus a fresh OpenCode `once` confirmation for the exact command;
  commit-message approval precedes commit confirmation. An amend additionally
  requires a fresh confirmation for its exact command and is allowed only while
  the commit is unpushed. Message-only amend requires an empty index; staged
  content must pass human work approval and all required non-`BLOCKED` reviews,
  with no unresolved human-accepted finding. Verify divergence and staged state
  before amend, then the resulting commit/message/tree and branch state after.
  Never force-push, bypass hooks, use wrappers to evade permissions, use OpenCode
  `--auto`/auto-approve, or select persistent `always` approval. Correct an
  already-pushed commit with a new commit.
- Durable artifacts live in `~/docs/`; review packets remain in context.
- Questions open dialog; only explicit commands authorize implementation.
- Keep models unpinned and permissions least-privileged.
- Restart OpenCode after config, agent, skill, or plugin changes.

## Quick Start

1. Start `opencode` and select `orchestrator`.
2. Describe the goal and approve the plan.
3. Inspect authored files before composed review.
4. Triage findings and approve the commit message.
