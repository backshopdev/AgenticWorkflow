# Contributing

This document defines how changes are made, reviewed, and committed in this repository.

This is a **populate-once** file for consuming repos: copy it in, set the tracker key format below, and leave the rest aligned with the shared standard. The commit *grammar* itself is owned by `.opencode/skills/commit-convention.SKILL.md` (source-of-truth) — this file points to it rather than restating every rule.

## Human-in-the-loop (HITL) — hard gate on every commit

No changeset may be committed until the human collaborator **and** the reviewing agents have **all** approved. If either requests changes, the work bounces back to the dev stage and the loop restarts.

```text
[agent develops] → [human reviews] → [agents review] → [commit]
       ▲                │                  │
       └────────────────┴──────────────────┘  (any "request changes" restarts the loop)
```

- The **human reviews first** — a fast, cheap direction check ("is this the right thing?") before spending adversarial-review tokens.
- The **review lanes** (`harness-reviewer` + `peer-reviewer`) run **next** — each scoped to the session's changed files. The harness-writer has already run the repo's lint/structure checks (reported in its `verify-status`), and a conformance pass on the drafted commit message happens here.
- These roles **overlap**: every reviewer — human or agent — brings its own strengths, so this is a dialog, not a rigid "human=fit / agents=quality" split. Each review agent's playbook declares its specific lens on top of its base model's strengths.
- **Commit message:** the working agent **drafts** it per the standard and shows it to the human for approval before the commit is made.

This is **Gate 2**. **Gate 1 — plan sign-off** sits upstream: unless an approved written plan already exists in the repo, the human signs off on the plan before work begins. See `AGENTS.md` for the full pipeline.

## Commit message standard

This repo uses **Conventional Commits** for every commit, written so its history can be consumed directly to generate release notes (agentic release tooling reads the log — the more consistent and user-facing the entries, the better the output).

The normative grammar lives in `.opencode/skills/commit-convention.SKILL.md`. In short:

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

## Per-repo overrides (consume in your repo)
- **Tracker / key format:** GitHub (`#<number>`) by default. Swap the footer format if your tracker differs.
- **Extra types / scopes:** you may add repo-specific scopes; keep the base type set aligned with the source-of-truth skill.
