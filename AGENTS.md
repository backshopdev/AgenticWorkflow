# Agentic Workflow Harness

## Core Philosophy

Human + agent collaboration produces a better whole. Agents augment rather
than replace human judgment; dialog surfaces assumptions, edge cases, and side
effects before implementation.

This repository is the operational harness for the current project. It defines
the stable roles, workflow, gates, and checks that govern human-agent
collaboration here.

## Universal Rules

These rules apply to all agents in all contexts:

1. **Human approval is mandatory before implementation or commit.** No stage
   advances without passing its gate. Questions and requests for advice do not
   authorize file changes.
2. **Human requests enter through the orchestrator.** The orchestrator is the
   primary human interface and never edits files directly.
3. **Never force-push, bypass hooks, use wrappers to evade permissions, or
   select persistent "always" approval.** Every git commit and push requires
   explicit human chat approval plus a fresh OpenCode `once` confirmation.
4. **Workflow resets after each commit.** The human may abandon work and restart
   at the planning phase at any time.
5. **Prefer deterministic checks over prose-based inspection.** Use tools and
   scripts to validate what can be validated objectively.

## Read on Demand

Load only the resources relevant to your current task. Do not read all linked
files by default.

| When | Read | Purpose |
| --- | --- | --- |
| Understanding the end-to-end workflow | [`AGENTIC_WORKFLOW.md`](AGENTIC_WORKFLOW.md) | Learn stages, gates, roles, orchestration loop, and key rules |
| Authoring or reviewing an artifact | Applicable domain skill | Load artifact-specific or review-lens procedures |
| Validating documentation | `docs-check` skill or document-author responsibilities | Run and interpret objective checks (markdown lint, JSON validation, link/index validation, frontmatter, secrets) |
| Preparing a commit | `commit-convention` skill | Apply the normative commit grammar and amendment rules |
| Changing OpenCode configuration | `opencode-configuration` skill | Apply configuration-specific guidance and validation |
| Conducting a review | `peer` skill (+ domain skill) | Apply the peer review lens and domain expertise |
| Changes affect permissions, secrets, or auth | `security` skill | Apply the security review threat model |
| Decomposing work into a plan | `planning-structure` skill | Apply planning structure requirements and acceptance criteria |
| Understanding authority and autonomy | [`src/.opencode/workflow-docs/autonomy/index.md`](src/.opencode/workflow-docs/autonomy/index.md) | Learn the autonomy model, authority types, escalation protocol, and session lifetime rules |

## OpenCode Synchronization

Root `.opencode/` is a deployed instance of `src/.opencode/`. It is gitignored
and never edited directly. All changes to agents, skills, workflow-docs, or
`docs-check.js` must be made in `src/.opencode/` first, then synced to root:

```bash
npm run sync-opencode
```

The sync copies `src/.opencode/` over root `.opencode/`, overwriting stale
files. Root-only artifacts (`node_modules/`, `data/`, `package.json`,
`.gitignore`) are preserved because they do not exist in `src/`.

Run `npm run test-sync` to execute the automated test suite for the sync
script. It verifies sync correctness, root-only artifact preservation, stale
file removal, and `--verify` integrity checks (including discrepancy
detection).

## Authority and Autonomy

Agent authority is governed by the [autonomy model](src/.opencode/workflow-docs/autonomy/index.md).
Authority = capability × scope × purpose × delegation constraint; all four
must be satisfied simultaneously. Technical enforcement lives in
`opencode.json`; normative guidance lives in the autonomy model. See
[AGENTIC_WORKFLOW.md](AGENTIC_WORKFLOW.md) for the detailed permission model.
