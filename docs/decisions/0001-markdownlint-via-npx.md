# Decision 0001: Markdown linting via `npx`, no `package.json`

- **Status:** Accepted
- **Date:** 2026-08-29
- **Context owner:** (workflow harness repo)

## Context
The harness repo's entire product is Markdown + JSON (AGENTS.md, docs/, ktlo/, references/, .opencode/ skills). For a code project the worker runs a code linter/tests/build; the equivalent objective signal here is a **Markdown style/structure lint**, run by the document-author. We chose `markdownlint-cli2` (the author's recommended CLI; same engine as `markdownlint`, with glob/ignore config + `--fix`).

The open question was **how the linter gets onto a machine**:

| Option | Install footprint | Reproducibility | Portability to consuming repos |
|--------|-------------------|-----------------|-------------------------------|
| **`npx --yes markdownlint-cli2@0.23.2`** (chosen) | none (npx ships with Node) | exact CLI version in command | just works if Node is present |
| `npm i -D` + `package.json` | adds `package.json` + `node_modules/` to repo | pinned version | imposes JS scaffolding on a config-only template |
| `npm i -g` | manual, per-machine | drifts between machines | worst for "copy to new repo" goal |

## Decision
**Invoke via `npx --yes markdownlint-cli2@0.23.2`.** Do **not** add a
`package.json`/`node_modules/` to the harness repo. The repo stays a clean,
copy-friendly template and resolves the same executable version on every
machine with Node (which OpenCode already implies).

## Consequences
- (+) Template remains pure config/markdown — no JS-project machinery to carry into consuming repos.
- (+) Zero install step; the document-author calls `npx ...` directly.
- (+) Pinning the package spec improves reproducibility and limits silent
  supply-chain drift while retaining the no-install workflow.
- (−) First run on a fresh machine downloads the package (npx cache makes later runs fast).

## Follow-ups / escape hatch
A consuming repo that is **already a JS project** can pin `markdownlint-cli2` as
a devDependency in *its* `package.json`; this decision governs the harness
template. Upgrade intentionally by reviewing the target release and dependency
provenance, running it over the full configured Markdown set, recording any
rule/output changes, and updating every root and `src/` operational command in
the same reviewed changeset.

## Related
- `.markdownlint-cli2.jsonc` (rule selection + ignores)
- GP02 (single source of truth), GP06 (question-vs-command; this followed it)
- Trigger policy: run on conclusion of any document-creation work (see `AGENTS.md`).
