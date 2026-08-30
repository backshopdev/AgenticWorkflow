# Decision 0001: Markdown linting via `npx`, no `package.json`

- **Status:** Accepted
- **Date:** 2026-08-29
- **Context owner:** (workflow harness repo)

## Context
The harness repo's entire product is Markdown + JSON (AGENTS.md, docs/, ktlo/, references/, .opencode/ skills). For a code project the worker runs a code linter/tests/build; the equivalent objective signal here is a **Markdown style/structure lint**, run by the harness-writer. We chose `markdownlint-cli2` (the author's recommended CLI; same engine as `markdownlint`, with glob/ignore config + `--fix`).

The open question was **how the linter gets onto a machine**:

| Option | Install footprint | Reproducibility | Portability to consuming repos |
|--------|-------------------|-----------------|-------------------------------|
| **`npx markdownlint-cli2`** (chosen) | none (npx ships with Node) | version resolved at run time | just works if Node is present |
| `npm i -D` + `package.json` | adds `package.json` + `node_modules/` to repo | pinned version | imposes JS scaffolding on a config-only template |
| `npm i -g` | manual, per-machine | drifts between machines | worst for "copy to new repo" goal |

## Decision
**Invoke via `npx markdownlint-cli2`.** Do **not** add a `package.json`/`node_modules/` to the harness repo. The repo stays a clean, dependency-free, copy-friendly template; "just works" on any machine with Node (which OpenCode already implies).

## Consequences
- (+) Template remains pure config/markdown — no JS-project machinery to carry into consuming repos.
- (+) Zero install step; the harness-writer calls `npx ...` directly.
- (−) The exact lint version isn't pinned at the repo level (it's whatever `npx` resolves). Acceptable for a *style* linter, where near-head behavior is fine.
- (−) First run on a fresh machine downloads the package (npx cache makes later runs fast).

## Follow-ups / escape hatch
A consuming repo that is **already a JS project** can pin `markdownlint-cli2` as a devDependency in *its* `package.json` for CI-grade reproducibility; this decision only governs the harness template itself. Revisit if lint results start diverging across machines — pin at that point rather than pre-emptively.

## Related
- `.markdownlint-cli2.jsonc` (rule selection + ignores)
- GP02 (single source of truth), GP06 (question-vs-command; this followed it)
- Trigger policy: run on conclusion of any document-creation work (see `AGENTS.md`).
