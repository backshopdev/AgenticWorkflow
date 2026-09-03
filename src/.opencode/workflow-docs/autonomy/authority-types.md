# Authority Types and Boundaries

Classifies every form of authority an agent can hold. An action is authorized
only when it falls within at least one authority type AND satisfies all four
factors of the authority equation (see [Principles](./principles.md)).

## Standing role authority

Permissions granted by virtue of the agent's role definition. These are stable,
repeatable, and do not require per-task approval.

### Read and search

| Capability | Scope | Notes |
| --- | --- | --- |
| Read files | Entire repository except sensitive paths | `.env` files always denied |
| Glob patterns | Entire repository | File discovery |
| Content search (grep) | Entire repository except sensitive paths | All agents: `grep: allow` |
| List directories | Entire repository | Directory structure discovery |

### Routine operations

Operations with no persistent or material side effects outside the agent's
working context.

| Operation | Who | Notes |
| --- | --- | --- |
| Build / compile | document-author | Disposable artifacts only |
| Test execution | document-author | Read-only observation of results |
| Lint / format | document-author | Touches only files in changed-file list |
| `git status`, `git diff`, `git log` | document-author | Read-only git inspection |
| Web search | All agents | Information gathering |
| `opencode debug` commands | document-author | Configuration and agent introspection |

### Web fetch

| Agent | Authority | Constraint |
| --- | --- | --- |
| Orchestrator | Free | Must serve planning or synthesis purpose |
| Subagent (document-author) | URLs in task handoff | URLs not in task require human approval |
| Reviewer | URLs in task handoff | Read-only; no web fetch beyond supplied context |
| Investigator | Denied | Configuration-level deny; no web fetch authority |

**Note:** Read-only agents (investigator and reviewer) have additional
configuration-level restrictions beyond the standard subagent constraints.
Investigator has `webfetch: deny`; reviewer has `webfetch: ask` but operates
under read-only standing authority.

### Content search

Content search (grep) is a routine read operation with no persistent side
effects. All agents have `grep: "allow"` in configuration.

## Task-granted authority

Authority conferred by an approved task handoff. Bounded by the objective;
expires when the task is accepted, abandoned, or superseded.

### Structure

A task grant specifies:

1. **Target scope:** Which files, modules, or directories may be modified.
2. **Capability extension:** Which additional permissions are needed beyond
   standing authority (e.g., `edit` for document-author).
3. **Purpose constraint:** What objective the authority serves.
4. **Delegation limit:** Whether the delegatee may further delegate (default: no).

### Examples

| Task | Target scope | Capability | Purpose | Delegation |
| --- | --- | --- | --- | --- |
| Implement WP-02 | `src/.opencode/workflow-docs/autonomy/*.md` | edit | Create autonomy model documents | No |
| Fix lint errors | Changed-file list from review | edit | Remediate review findings | No |
| Validate JSON | `opencode.json` | read + bash (validation commands) | Verify schema compliance | No |

### Constraints

- Task grants cannot exceed the delegator's own authority (I1).
- Task grants are bounded by the approved objective (I2).
- Task grants do not permit lateral expansion beyond stated scope without
  escalation (I3).

## Workflow-state-derived authority

Authority that arises from approved workflow states. Narrow, normally
non-delegable, and tied to specific transitions.

### Git commit and push

| State | Authority | Constraint |
| --- | --- | --- |
| Plan approved + work approved + review non-BLOCKED | `git commit` (with human chat approval + `once` confirmation) | Message must match approved message exactly |
| Commit unpushed + human approval | `git commit --amend` (with fresh `once` confirmation) | Empty index for message-only amend; staged content requires full re-approval |
| Commit exists + human approval | `git push` (with fresh `once` confirmation) | Never force-push |

### Single-gate principle

Git operations require one human decision gate (explicit chat approval). The
OpenCode `once` confirmation is a per-command technical safety mechanism — not
a second human decision, but required for each individual command.

### Constraints

- Commit/push authority is non-delegable (I4).
- Destructive operations (force-push, `--no-verify`, `--mirror`) are always
  denied regardless of workflow state.
- Amend is allowed only while the commit is unpushed.

## Routine operations vs. persistent/material side effects

### Routine operations

No persistent state change outside the agent's working context. Safe to perform
under standing role authority.

- Builds, tests, lint, formatting (disposable artifacts)
- `git status`, `git diff`, `git log` (read-only inspection)
- Web search (information gathering)
- Content search / grep (read-only)
- Reading files, globbing, listing directories

### Persistent or material operations

Produce lasting state changes that affect the repository, external systems, or
other agents. Require explicit task-granted or workflow-state-derived authority.

- File edits (modify repository content)
- `git commit`, `git push` (modify repository history)
- Scaffolding or code generation (create new files)
- Database migrations (modify external state)
- Installing dependencies (modify environment)
- External API writes (modify external systems)

### Classification rule

When uncertain whether an operation is routine or persistent, classify it as
persistent and require explicit authority. The cost of over-caution is lower
than the cost of unauthorized state change.

## External access rules

### Web search

All agents may perform web searches. No approval required. Information gathering
is a routine operation.

### Web fetch (read)

| Agent | Authority |
| --- | --- |
| Orchestrator | Free; must serve planning or synthesis purpose |
| Subagent | URLs explicitly listed in task handoff; other URLs require human approval |

### External writes

All external write operations require human approval. No agent may write to
external systems (APIs, services, databases) without explicit authorization.

### Sensitive external reads

Currently prohibited. No agent may access external systems that require
authentication, contain sensitive data, or have legal/privacy constraints
without explicit human approval and security review.

## Dependencies

### Conservative treatment

New dependencies (libraries, tools, services) are treated as persistent/material
operations. They modify the environment and may introduce security, licensing,
or compatibility concerns.

### Authorization rules

- Dependencies are authorized **only** when explicitly required by the approved
  plan.
- If a task reveals a need for a new dependency not in the plan, escalate
  (see [Escalation Protocol](./escalation-protocol.md)).
- Do not add dependencies for convenience or speculation.
- Document the dependency, its purpose, and its source in the completion packet.

### Examples

| Scenario | Authorized? | Action |
| --- | --- | --- |
| Plan specifies `markdownlint-cli2@0.23.2` | Yes | Use as specified |
| Task requires a JSON validator not in plan | No | Escalate; do not install |
| Agent prefers a different linting tool | No | Use the tool specified in standing authority |

## Authority summary matrix

| Authority type | Source | Duration | Re-delegable | Examples |
| --- | --- | --- | --- | --- |
| Standing role | Role definition | Permanent (until role changes) | No (inherent to role) | Read, grep, web search, routine bash |
| Task-granted | Approved task handoff | Until task accepted/abandoned/superseded | No (unless explicitly permitted) | Edit specific files, constrained bash |
| Workflow-state | Approved workflow transition | Until transition completes | No | Git commit/push after full approval |
