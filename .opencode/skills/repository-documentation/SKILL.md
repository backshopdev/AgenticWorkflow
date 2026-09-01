---
name: repository-documentation
description: Use when authoring or reviewing repository documentation structure, document lifecycles, stable IDs, index discipline, link rules, archive rules, lifecycle status, specification behavior, Gherkin guidance, data/API contracts, or the docs-as-code authority model.
---

# Repository Documentation

## Expert stance

Apply repository-documentation judgment for the canonical documentation tree.
This skill covers structure, lifecycles, metadata, and the docs-as-code
authority model. It composes with the caller's role and does not introduce a
separate persona.

## Document authority model

The repository is the canonical source of truth for all documentation. External
surfaces (Wiki, generated sites, PDFs) are publication targets derived from
repository content.

- All documentation changes go through the same review workflow as code.
- Documentation is versioned alongside code.
- Machine-checkable invariants are enforced by `docs-check`.
- Publication occurs after commit and push, mediated by `docs-publish`.

## Repository documentation structure

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

## Document lifecycles

**Decision record:** Active → Superseded → Retired. Terminal: Superseded,
Retired.

**Specification:** Active → Superseded → Retired. Terminal: Superseded,
Retired.

**Implementation plan:** Draft → Ready → In progress → Completed | Abandoned |
Partially completed. Terminal: Completed, Abandoned.

**Architecture document:** Active → Superseded → Retired. Terminal: Superseded,
Retired.

**Implementation map:** Active → Stale. No terminal state.

**Contract:** Active → Superseded → Retired. Terminal: Superseded, Retired.

**KTLO item:** Active → Resolved. Terminal: Resolved.

Terminal plans and specs move to their `archive/` subtree. Archived documents
are removed from the active index but remain linked from the archive index.

## Specification behavior and test traceability

Specifications express behavior as Gherkin scenarios:

- Every scenario has a unique `@id` tag (never reused).
- Every scenario has exactly one `@unit` or `@integration` tag.
- `@unit`: Testable in isolation without external dependencies.
- `@integration`: Requires interaction with external systems.

Implementation plans include a scenario traceability matrix mapping each
scenario to a work package, task, and test location.

## Data and API contracts

Contracts define interfaces between system components:

- API contracts (OpenAPI 3.x).
- Data contracts (JSON Schema).
- Event contracts (JSON Schema).
- Configuration contracts (JSON Schema).

Each contract has a stable ID (`CON-YYYYMMDD-NN`) and lives in
`docs/contracts/`. Contract guides provide human-readable usage documentation.
Generated reference documentation is derived from machine contracts.

## Index and link discipline

Every `index.md` uses relative links and links every sibling Markdown file plus
each immediate child directory's `index.md`. It may link only to same-directory
Markdown or an immediate child's `index.md`; no deep or absolute links.
