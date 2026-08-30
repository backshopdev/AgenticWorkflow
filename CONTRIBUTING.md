# Contributing

This document defines how changes are made, reviewed, and committed in this repository.

This is a **populate-once** file for consuming repos: copy it in, set the tracker key format below, and leave the rest aligned with the shared standard. The commit *grammar* itself is owned by the discoverable `commit-convention` skill — this file points to it rather than restating every rule.

## Human-in-the-loop (HITL) — hard gate on every commit

A changeset becomes commit-eligible only after the human approves the authored
work, every required review perspective returns a non-`BLOCKED` packet, and no
human-accepted finding remains unresolved. Correct and rerun blocked sessions;
they never satisfy a required perspective. Accepted changes return to document-author and
restart human work approval and review. Human-dismissed findings do not block a
commit or require reviewers to replace their original verdicts with `APPROVE`.

```text
[agent develops] → [human reviews] → [agents review] → [commit]
       ▲                │                  │
       └────────────────┴──────────────────┘  (any "request changes" restarts the loop)
```

- The **human reviews first** — a fast, cheap direction check ("is this the right thing?") before spending adversarial-review tokens.
- One or more independent **review-agent sessions** run next, in parallel. Each
  receives the changed-file list and loads `peer` plus a domain skill; risk-sensitive
  work also loads `security`. The document-author has already reported objective
  checks. The human authoritatively triages findings and debates.
- Original reviewer verdicts and skill/session provenance remain part of the
  review record after human triage.
- Roles **overlap**: every reviewer — human or agent — brings its own strengths,
  so this is a dialog, not a rigid "human=fit / agents=quality" split.
- **Commit message:** the orchestrator drafts it per the standard and shows it
  to the human for approval. Document-author may execute only the exact command
  containing the approved message.
- **Command enforcement:** after the exact message is approved in chat,
  document-author requires a fresh OpenCode `once` confirmation for each exact
  `git commit`, eligible `git commit --amend`, and `git push` command. An amend
  is eligible only while the commit is unpushed. Before amend, verify
  branch/upstream divergence and staged-content state; afterward, verify the
  resulting commit, exact message, tree, and branch state before any push. A
  message-only amend requires an empty index and the exact newly human-approved
  message. Staged content must first pass human work approval and every required
  non-`BLOCKED` review perspective, with no unresolved human-accepted finding.
  If the commit was pushed, use a new commit. Never force-push, bypass hooks,
  evade permissions through wrappers, run this harness with `--auto`/auto-approve,
  or select persistent `always` approval. Read-only Git checks run without
  unnecessary prompts.

This is **Gate 2**. **Gate 1 — plan sign-off** sits upstream: unless an approved written plan already exists in the repo, the human signs off on the plan before work begins. See `AGENTS.md` for the full pipeline.

## Commit message standard

This repo uses **Conventional Commits** for every commit, written so its history can be consumed directly to generate release notes (agentic release tooling reads the log — the more consistent and user-facing the entries, the better the output).

The normative grammar lives in `.opencode/skills/commit-convention/SKILL.md`. In short:

```text
<type>(<scope>): <subject>            # imperative, ≤72 chars, no trailing period

<user-facing body>                    # why + what changed from the user's view;
                                      # for noteworthy changes, this is the release-note copy

Refs: #123                            # footer(s): GitHub issue key(s) if applicable
BREAKING CHANGE: <impact + migration> # only for breaking changes
```

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Breaking changes:** append `!` after the type/scope (`feat(api)!:`) **and** add a `BREAKING CHANGE:` footer.
- **Issue footer:** use `Refs: #<n>` (comma-separate multiple: `Refs: #12, #34`) whenever a tracked issue exists; omit otherwise. This repo uses **GitHub**, so keys are `#<number>`.

### Examples

```text
feat(reviewer): add per-model score to consolidated review output

Reviewers now attach a 0-10 score to each finding, surfaced in the
consolidated report so humans can triage severity at a glance.

Refs: #41
```

```text
fix(orchestrator): stop advancing past a failed gate

A blocked review result could still let the session move forward.
Gate results are now enforced before any stage transition.

Refs: #57
```

```text
feat(session)!: replace flat history with per-session context files

Each session now persists to its own file to bound context growth.
Existing sessions must be re-opened to pick up the new layout.

BREAKING CHANGE: session history format changed; `scratch/sessions/*`
from prior versions are not auto-migrated.
```

## Enforcement (current)

Documentation-only for now — no git hooks / no CI grammar gate. The human+agent HITL review is the enforcement mechanism, and agents drafting commits load the commit-convention skill. Automated enforcement can be layered later if drift appears.

## OpenCode plugin maintenance

`opencode.json` pins `opencode-workflows@0.7.0`. To update it, approve a specific
version change, review that release's provenance and release notes, change only
the explicit version, then restart OpenCode and rerun config, agent, skill, and
workflow checks. A version pin improves repeatability; it is not an integrity
guarantee.

## Per-repo overrides (consume in your repo)
- **Tracker / key format:** GitHub (`#<number>`) by default. Swap the footer format if your tracker differs.
- **Extra types / scopes:** you may add repo-specific scopes; keep the base type set aligned with the source-of-truth skill.
