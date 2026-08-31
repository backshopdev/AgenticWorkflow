# Agentic Workflow — Detailed Mechanics

This document contains the complete workflow specification for the
document-authoring workflow template. For a concise introduction and quick
start, see [AGENTS.md](AGENTS.md).

## Agent Roles

### 1. Orchestrator (primary)

The orchestrator is the only human-invokable agent. It:

- Conducts Socratic interviews to clarify goals and surface assumptions.
- Drafts authoring briefs from interview outcomes.
- Delegates work to subagents (`discovery`, `document-author`, `review`).
- Presents review findings to the human for triage.
- Manages the commit gate (message approval, commit confirmation).
- Never edits files directly.

### 2. Discovery (subagent)

The discovery agent investigates the current state of the codebase and
documentation:

- Reads files, searches code, and explores the repository.
- Runs read-only git commands (`log`, `show`, `diff`).
- Searches the web for reference material.
- Cannot edit files, delegate tasks, or fetch URLs.
- Returns findings to the orchestrator.

### 3. Document Author (subagent)

The document-author agent implements the approved plan:

- Loads domain skills relevant to the task.
- Creates and edits documentation files.
- Runs validation checks (`docs-check`, `markdownlint`).
- Returns a completion packet with changed files and attention flags.
- Cannot delegate tasks.

### 4. Review (subagent)

The review agent provides independent, read-only review:

- Loads `peer` plus at least one relevant domain or lens skill.
- Inspects the changed-file list and acceptance criteria.
- Reports findings with severity, confidence, and evidence.
- Cannot edit files, run commands, or delegate tasks.
- Multiple review sessions may run in parallel with different lens
  combinations.

## Skill Architecture

Skills provide specialized expertise loaded on demand. They do not create new
actors or sessions. Skills fall into these categories:

### Foundation skills

- **repository-documentation:** Metadata, stable IDs, index structure, link
  discipline, archive rules, lifecycle status, Mermaid guidance.
- **docs-check:** Wraps the validation script; instructs when and how to run.
- **docs-publish:** Defines the publication workflow boundary.
- **commit-convention:** Commit message grammar and approval.

### Artifact authoring skills

- **decision-record:** Decision record structure and quality.
- **specification:** Specification structure, Gherkin scenarios, tags.
- **implementation-plan:** Plan structure, work packages, traceability.
- **architecture-document:** Architecture structure, diagrams.
- **implementation-map:** Code navigation, capability mapping.
- **contract-design:** Contract design principles.
- **openapi:** OpenAPI 3.x authoring.
- **json-schema:** JSON Schema authoring.
- **contract-guide:** Human-authored contract guide.
- **contract-publication:** Generated reference documentation.

### Review lens skills

- **peer:** Mandatory general review (coherence, clarity, consistency).
- **security:** Security review (permissions, secrets, trust boundaries).
- **decision-quality:** Decision record review.
- **behavioral-completeness:** Specification completeness review.
- **gherkin-testability:** Gherkin scenario quality review.
- **requirements-traceability:** Scenario-to-test mapping review.
- **architectural-coherence:** Architecture consistency review.
- **repository-accuracy:** Implementation map accuracy review.
- **contract-completeness:** Contract completeness review.

### Cross-cutting concern skills

- **security-privacy:** Security and privacy requirements.
- **accessibility:** Accessibility and inclusive design.
- **quality-attributes:** Performance, reliability, scalability, etc.
- **software-architecture:** Architectural patterns and boundaries.
- **software-design:** SOLID, deep modules, information hiding.
- **design-for-testability:** Testable design patterns.
- **api-compatibility:** API versioning and compatibility.

### Technology skills

Foundational guidance for specific technologies:

- **apostrophe-cms**, **astro**, **react**, **javascript**, **typescript**,
  **semantic-html**, **css-sass**, **image-media-delivery**,
  **web-performance**, **seo-structured-data**.

Technology skills provide best practices and common patterns without project
assumptions. They inform document authoring when the technology is relevant.

## Document Authority Model

The repository is the canonical source of truth for all documentation. External
surfaces (Wiki, generated sites, PDFs) are publication targets derived from
repository content.

- All documentation changes go through the same review workflow as code.
- Documentation is versioned alongside code.
- Machine-checkable invariants are enforced by `docs-check`.
- Publication occurs after commit and push, mediated by `docs-publish`.

## Authoring Workflow

### Socratic Interview

The orchestrator conducts a Socratic interview to:

1. Clarify the documentation goal.
2. Surface assumptions and edge cases.
3. Identify affected documents and stakeholders.
4. Determine the appropriate document type(s).
5. Establish acceptance criteria.

### Authoring Brief

From the interview, the orchestrator drafts an authoring brief containing:

- Objective and scope.
- Document type(s) to create or modify.
- Acceptance criteria.
- Relevant skills to load.
- Changed-file scope.
- Attention flags from discovery.

### Draft

The document-author:

1. Loads relevant skills.
2. Creates or modifies documents according to the brief.
3. Runs `docs-check` and `markdownlint`.
4. Returns a completion packet.

### Review Cycle

1. The orchestrator launches parallel review sessions.
2. Each session loads `peer` plus relevant lens skills.
3. Sessions report findings to the orchestrator.
4. The orchestrator presents findings to the human.
5. The human triages: accept, dismiss, or request changes.
6. Accepted changes return to document-author.
7. The plan remains approved unless the human explicitly reopens it.

### Remediation Flow

When review surfaces issues that need remediation, the flow returns to
implementation and then back through both review stages. The human and agent
both validate that findings were remediated without introducing new issues.

#### Path A — Human review finds issues

```text
human review [changes surfaced] → implementation → human review → agentic review → commit
```

#### Path B — Agentic review finds issues (after human review was clean)

```text
human review [clean] → agentic review [changes surfaced] → implementation → human review → agentic review → commit
```

#### Skipping workflow steps

The human may elect to skip a workflow step (e.g., agentic re-review after a
trivial fix). If the agent disagrees with that assessment, it should push back.
The human may override, but the agent's pushback is a valued input that signals
potential risk. The decision and reasoning should be noted in the conversation.

## Discovery Workflow

The orchestrator delegates discovery when:

- The current state of the codebase is unclear.
- Existing documentation needs assessment.
- Reference material is needed.

The discovery agent:

1. Reads relevant files and directories.
2. Searches for patterns and references.
3. Runs read-only git commands.
4. Searches the web if needed.
5. Returns a findings report to the orchestrator.

## Repository Documentation Structure

```text
docs/
  index.md
  decisions/
    index.md
    template.md
    DEC-YYYYMMDD-NN.md
    archive/
      index.md
  specs/
    index.md
    template.md
    SPEC-YYYYMMDD-NN.md
    archive/
      index.md
  plans/
    index.md
    template.md
    PLAN-YYYYMMDD-NN.md
    archive/
      index.md
  architecture/
    index.md
    template.md
    ARCH-YYYYMMDD-NN.md
  implementation-maps/
    index.md
    template.md
    IMPL-YYYYMMDD-NN.md
  contracts/
    index.md
    template.md
    CON-YYYYMMDD-NN.md
ktlo/
  index.md
  template.md
  KTLO-YYYYMMDD-NN.md
```

Every directory with Markdown has an `index.md`. Every `index.md` links to its
parent, siblings, and immediate children using relative links only.

## Document Lifecycles

**Decision record:** Active → Superseded → Retired. Terminal: Superseded, Retired.

**Specification:** Active → Superseded → Retired. Terminal: Superseded, Retired.

**Implementation plan:** Draft → Ready → In progress → Completed | Abandoned |
Partially completed. Terminal: Completed, Abandoned.

**Architecture document:** Active → Superseded → Retired.
Terminal: Superseded, Retired.

**Implementation map:** Active → Stale. No terminal state.

**Contract:** Active → Superseded → Retired. Terminal: Superseded, Retired.

**KTLO item:** Active → Resolved. Terminal: Resolved.

Terminal plans and specs move to their `archive/` subtree. Archived documents
are removed from the active index but remain linked from the archive index.

## Specification Behavior and Test Traceability

Specifications express behavior as Gherkin scenarios:

- Every scenario has a unique `@id` tag (never reused).
- Every scenario has exactly one `@unit` or `@integration` tag.
- `@unit`: Testable in isolation without external dependencies.
- `@integration`: Requires interaction with external systems.

Implementation plans include a scenario traceability matrix mapping each
scenario to a work package, task, and test location.

## Data and API Contracts

Contracts define interfaces between system components:

- API contracts (OpenAPI 3.x).
- Data contracts (JSON Schema).
- Event contracts (JSON Schema).
- Configuration contracts (JSON Schema).

Each contract has a stable ID (`CON-YYYYMMDD-NN`) and lives in
`docs/contracts/`. Contract guides provide human-readable usage documentation.
Generated reference documentation is derived from machine contracts.

## Implementation Plan Content

Implementation plans decompose specifications into work:

- Work packages (`WP-NN`) and tasks (`T-NN`).
- Dependencies and parallelism.
- Change map (files created, modified, deleted).
- Prescriptiveness levels (Required, Expected, Discretion).
- Scenario traceability matrix.
- Documentation stubs.
- Verification criteria.

## Review Model

Every review session loads `peer` (mandatory) plus at least one relevant domain
or lens skill. The `security` lens is added when changes affect permissions,
secrets, auth, trust boundaries, or equivalent sensitive configuration.

Review sessions are:

- Context-independent (no shared state).
- Read-only (no edits).
- Parallel (multiple sessions with different perspectives).
- Reported to the orchestrator only (never interview the human).

Findings include severity (`blocker`, `should`, `nit`), confidence, anchor,
impact, and suggested direction. Findings inform human triage; they are not
self-executing verdicts.

## Documentation Validation

The `docs-check` script validates repository documentation invariants:

- Index completeness and link resolution.
- Stable ID and filename agreement.
- Required metadata (Last modified, Status).
- Lifecycle status validity.
- Archive location for terminal documents.
- Supersession link reciprocity.
- Gherkin scenario IDs and tags.
- Mermaid syntax.
- JSON artifact validity.
- Contract reference resolution.

Run with: `node .opencode/docs-check.js`

Markdown lint runs separately: `npx --yes markdownlint-cli2@0.23.2`

Both must pass before commit.

## Docs-as-Code and Wiki Publication

Documentation follows the same workflow as code:

1. Author changes in the repository.
2. Review through the standard review cycle.
3. Commit and push after human approval.
4. Publish to external surfaces (Wiki, generated site) through `docs-publish`.

Publication:

- Occurs after commit and push.
- Is mediated by the orchestrator.
- Displays a proposed diff for human review.
- Records source path and commit for every published page.
- The repository remains canonical; published pages are projections.

## HITL Gates

- **Gate 1:** Explicit human plan approval before substantive work.
- **Gate 2:** Human work approval before agent review. Commit only after every
  required perspective returns non-`BLOCKED`, no human-accepted finding remains
  unresolved, and the human approves the commit message.
- Any accepted change restarts human work approval and agent review.

## Permission Model

Bash permission patterns in `opencode.json` use wildcards (for example,
`"git diff *"`). This assumes OpenCode either sanitizes shell metacharacters
(`&&`, `;`, `|`, `||`) before matching or uses `execFile` instead of a shell
interpreter, so that a wildcard match cannot be escaped into an unintended
command.

For consuming repositories that add git write permissions, port the deny rules
from the production root `opencode.json` (force-push, `--no-verify`, persistent
`always` approval, and similar) before granting write authority. This template
is stricter than production: it grants no git write authority to any agent.

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
