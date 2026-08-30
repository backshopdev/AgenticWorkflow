# Contributing

How changes are made, reviewed, and committed in this repository.

This is a **populate-once** file: copy it in during setup, set your tracker key format below, and keep it aligned with the shared standard. The commit *grammar* is owned by `.opencode/skills/commit-convention/SKILL.md` (source-of-truth, copied from the harness template) — this file references it rather than restating every rule.

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

- The **human reviews first** — a fast, cheap direction check before spending adversarial-review tokens.
- Independent **review-agent sessions** run next, in parallel. Each receives the
  changed-file list and loads `peer` plus a domain skill; risk-sensitive work
  also loads `security`. The document-author has already reported objective checks.
- Roles **overlap**: each reviewer — human or agent — brings its own strengths;
  the human authoritatively triages findings and substantive debates.
- Original reviewer verdicts and skill/session provenance remain part of the
  review record after human triage.
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

This is **Gate 2**. **Gate 1 — plan sign-off** sits upstream: unless an approved written plan already exists in the repo, the human signs off on the plan before work begins. See `AGENTS.md`.

## Commit message standard

**Conventional Commits** for every commit, written so history can be consumed directly to generate release notes. The normative grammar is in `.opencode/skills/commit-convention/SKILL.md`. Summary:

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
