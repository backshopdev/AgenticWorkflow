# Contributing

How changes are made, reviewed, and committed in this repository.

This is a **populate-once** file: copy it in during setup, set your tracker key format below, and keep it aligned with the shared standard. The commit *grammar* is owned by `.opencode/skills/commit-convention.SKILL.md` (source-of-truth, copied from the harness template) — this file references it rather than restating every rule.

## Human-in-the-loop (HITL) — hard gate on every commit

No changeset may be committed until the human collaborator **and** the reviewing agents have **all** approved. If either requests changes, the work bounces back to the dev stage and the loop restarts.

```text
[agent develops] → [human reviews] → [agents review] → [commit]
       ▲                │                  │
       └────────────────┴──────────────────┘  (any "request changes" restarts the loop)
```

- The **human reviews first** — a fast, cheap direction check before spending adversarial-review tokens.
- The **review lanes** (`harness-reviewer` + `peer-reviewer`) run **next** — each scoped to the session's changed files. The harness-writer has already run the repo's lint/structure checks (reported in its `verify-status`), and a conformance pass on the drafted commit message happens here.
- Roles **overlap**: each reviewer — human or agent — brings its own strengths; not a rigid fit-vs-quality split. Each review agent's playbook declares its lens on top of its base model's strengths.
- **Commit message:** the working agent **drafts** it per the standard and shows it to the human for approval before the commit.

This is **Gate 2**. **Gate 1 — plan sign-off** sits upstream: unless an approved written plan already exists in the repo, the human signs off on the plan before work begins. See `AGENTS.md`.

## Commit message standard

**Conventional Commits** for every commit, written so history can be consumed directly to generate release notes. The normative grammar is in `.opencode/skills/commit-convention.SKILL.md`. Summary:

```text
<type>(<scope>): <subject>            # imperative, ≤72 chars, no trailing period

<user-facing body>                    # why + user-facing impact; release-note copy for noteworthy changes

Refs: #123                            # GitHub issue key(s) if applicable
BREAKING CHANGE: <impact + migration> # only for breaking changes
```
- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Breaking:** `!` after type/scope **and** a `BREAKING CHANGE:` footer.
- **Issue footer:** `Refs: #<n>` (comma-separate multiples). Default tracker **GitHub** → override below if yours differs.

## Enforcement (current)
Documentation-only — no git hooks / CI grammar gate. The HITL review + agents drafting from the skill are the enforcement. Add automated checks later if drift appears.

## Per-repo overrides (set for YOUR repo)
- **Tracker / key format:** GitHub (`#<number>`).
- **Extra scopes/types:** add repo-specific scopes as needed; keep the base type set aligned with the source-of-truth skill.
