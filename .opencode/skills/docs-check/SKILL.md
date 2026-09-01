---
name: docs-check
description: Use when running or interpreting documentation validation checks, including index completeness, link resolution, stable IDs, metadata, lifecycle status, archive location, Gherkin tags, Mermaid syntax, JSON validity, and contract references.
---

# Documentation Validation

## Expert stance

Apply documentation-validation judgment. This skill wraps the validation script
and instructs when and how to run it. It composes with the caller's role and
does not introduce a separate persona.

## When to run

Run documentation validation before every commit that touches Markdown, JSON,
or JSONC files in `docs/` or `ktlo/`. Both `docs-check` and markdown lint must
pass before commit.

## Validation checks

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

## Commands

Run docs-check:

```bash
node .opencode/docs-check.js
```

Run markdown lint:

```bash
npx --yes markdownlint-cli2@0.23.2
```

Both must pass before commit. If docs-check is not available in the current
repository, validate the invariants above manually and report results.

## Interpreting results

- A failure indicates a violated invariant that must be fixed before commit.
- Report the exact check, file, and line that failed.
- If a check is not applicable (for example, no Gherkin scenarios exist), mark
  it `N/A` rather than `FAIL`.
