# Commit Convention (Skill)

## Description
Source-of-truth grammar for commit messages, loaded on demand by the agent that drafts a commit and by the agents-review stage that checks it. Shared identically across the harness repo and every consuming repo; repo-specific bits (tracker key format, extra scopes) live in that repo's `CONTRIBUTING.md`, not here.

## When to Use
- An agent finishes a changeset and must **draft the commit message** for human approval.
- The review lanes (harness + peer) run the **conformance pass** as part of the agents-review stage of the HITL commit gate.

## Format
```text
<type>(<scope>): <subject>

<body>

<footer(s)>
```
- Blank line between subject and body, and between body and footers.
- Subject line ≤ 72 characters. Body may wrap ~72 cols.

## Types (fixed base set)
| type | use for | release-note section |
|------|---------|----------------------|
| `feat` | new user-facing capability | Features |
| `fix` | bug fix | Fixes |
| `perf` | performance improvement | Performance |
| `refactor` | internal restructure, no behavior change | (omit from notes) |
| `docs` | documentation only | Documentation |
| `test` | tests only | (omit) |
| `build` | build system / deps | Build |
| `ci` | CI config | (omit) |
| `style` | formatting, no code change | (omit) |
| `chore` | maintenance | (omit) |
| `revert` | reverts a prior commit | Reverts |

The "release-note section" column is the mapping agentic release tooling uses. Types marked *(omit)* should be excluded from generated notes.

## Writing for release notes (the important part)
Because history is the **source for release notes**, write for an end-user reader, not a diff-reader:
- **Subject** = a crisp, imperative summary of the *change*, not the file touched. Good: `add per-model score to review output`. Bad: `update reviewer.ts`.
- **Body** = why + user-facing impact. For any `feat`/`fix`/`perf` the user would notice, the body should read as the release-note paragraph itself (tooling lifts it near-verbatim).
- Skip the body for one-line obvious changes; require it for anything user-facing or breaking.
- No "what changed line by line" narration — the diff already shows that.

## Breaking changes
- Append `!` after type/scope: `feat(api!): ...` or `feat!: ...`.
- AND include a `BREAKING CHANGE:` footer describing impact + migration.
- Agentic release tooling treats `!` / `BREAKING CHANGE:` as a **major** bump and surfaces it prominently.

## Issue-key footers
- Use `Refs: #<number>` when a tracked issue exists.
- Multiple: `Refs: #12, #34` (or repeated `Refs:` lines).
- Default tracker is **GitHub** (`#<number>`). A consuming repo overrides the format in its `CONTRIBUTING.md` if it uses another tracker.
- We use `Refs:` (not `Closes:`) as the single convention; issues are closed manually alongside the gated commit.

## Drafting checklist (for the agent producing the message)
- [ ] Correct `type` and a `scope` that reflects the *area*, not a filename
- [ ] Subject imperative, ≤72 chars, no trailing period, capitalizes nothing mid-word oddly
- [ ] Body present for user-facing/breaking changes and reads as release-note copy
- [ ] `!` and `BREAKING CHANGE:` if (and only if) it breaks
- [ ] `Refs:` footer if an issue exists (per repo's key format)
- [ ] Show the drafted message to the human for approval **before** committing (HITL gate)

## Conformance checklist (for the agents-review pass)
- [ ] Parses as valid Conventional Commits
- [ ] Type is in the base set (or a repo-approved extension)
- [ ] Breaking-change markers are consistent (`!` ⟺ `BREAKING CHANGE:`)
- [ ] Footer format matches the repo's `CONTRIBUTING.md` tracker convention
- [ ] Body is user-facing enough to seed release notes (not diff-restated)
