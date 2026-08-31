---
name: repository-documentation
description: Use when authoring, reviewing, or navigating repository documentation — decisions, specs, plans, architecture, implementation maps, contracts, and KTLO items. Covers metadata, stable IDs, index structure, link discipline, archive rules, lifecycle status, and Mermaid guidance.
---

# Repository Documentation

## Expert stance

Apply senior documentation-architecture judgment. The repository is the
canonical source of truth; external surfaces (Wiki, portals, generated sites)
are publication targets, not independent authorities. This skill encodes the
invariants that keep the documentation tree navigable, consistent, and
machine-checkable.

## Metadata requirements

Every durable document (decisions, specs, plans, architecture, implementation
maps, contracts, KTLO items) must include a `Last modified` metadata field in
ISO 8601 date format (`YYYY-MM-DD`) at the top of the file, immediately after
the frontmatter or as the first line. The only exception is `index.md`, which
does not require `Last modified`.

Example:

```markdown
Last modified: 2026-08-31

# DEC-20260831-01: Adopt event-sourced audit log
```

## Stable ID conventions

Every durable document receives a stable identifier that never changes once
assigned:

| Document type | ID prefix | Format | Example |
| --- | --- | --- | --- |
| Decision record | `DEC` | `DEC-YYYYMMDD-NN` | `DEC-20260831-01` |
| Specification | `SPEC` | `SPEC-YYYYMMDD-NN` | `SPEC-20260829-01` |
| Implementation plan | `PLAN` | `PLAN-YYYYMMDD-NN` | `PLAN-20260831-01` |
| Architecture document | `ARCH` | `ARCH-YYYYMMDD-NN` | `ARCH-20260831-01` |
| Implementation map | `IMPL` | `IMPL-YYYYMMDD-NN` | `IMPL-20260831-01` |
| Contract | `CON` | `CON-YYYYMMDD-NN` | `CON-20260831-01` |
| KTLO item | `KTLO` | `KTLO-YYYYMMDD-NN` | `KTLO-20260831-01` |

The date portion reflects the creation date. The sequence number (`NN`) is
zero-padded and increments per day per type. The stable ID must agree with the
filename: `DEC-20260831-01.md` contains `DEC-20260831-01`.

## Filename conventions

- Filenames use the stable ID as the base name: `DEC-20260831-01.md`.
- Templates use `template.md`.
- Indexes use `index.md`.
- All filenames are lowercase except for the ID prefix.

## Index structure rules

1. Every directory containing Markdown files must have an `index.md`.
2. Each `index.md` links to:
   - Its parent directory's `index.md` (one level up).
   - Every sibling Markdown file in the same directory (excluding itself).
   - Every immediate child directory that contains Markdown (via that child's
     `index.md`).
3. Indexes do not link multiple levels deep. An index in `docs/decisions/`
   links to `docs/index.md` (parent), sibling documents, and
   `docs/decisions/archive/index.md` (immediate child) — but not to documents
   inside `archive/`.
4. All links are relative. No absolute paths.

## Link discipline

- Use relative links exclusively.
- Index links to siblings use bare filenames: `[DEC-20260831-01](DEC-20260831-01.md)`.
- Index links to children use directory names: `[Archive](archive/index.md)`.
- Index links to parent use `../index.md`.
- Cross-references within documents use relative paths from the document's
  location.

## Archive rules

- Terminal plans (status: Completed, Abandoned) and terminal specs (status:
  Superseded, Retired) move to an `archive/` subtree within their parent
  directory.
- Archived documents remain linked from the archive `index.md` but are removed
  from the active parent `index.md`.
- A document must not appear in both active and archive navigation
  simultaneously.
- Archive directories follow the same index and link rules as active
  directories.

## Lifecycle status

Every document with a lifecycle carries a `status` metadata field. Valid values
by type:

| Document type | Valid statuses |
| --- | --- |
| Decision record | `Active`, `Superseded`, `Retired` |
| Specification | `Active`, `Superseded`, `Retired` |
| Implementation plan | `Draft`, `Ready`, `In progress`, |
| | `Completed`, `Abandoned`, `Partially completed` |
| Architecture document | `Active`, `Superseded`, `Retired` |
| Implementation map | `Active`, `Stale` |
| Contract | `Active`, `Superseded`, `Retired` |
| KTLO item | `Active`, `Resolved` |

Status transitions:

- Decision: `Active` → `Superseded` (with link to replacement) → `Retired`.
- Spec: `Active` → `Superseded` (with link to replacement) → `Retired`.
- Plan: `Draft` → `Ready` → `In progress` → `Completed` | `Abandoned` |
  `Partially completed`.
- Architecture: `Active` → `Superseded` → `Retired`.
- Implementation map: `Active` → `Stale` (when code diverges).
- Contract: `Active` → `Superseded` → `Retired`.
- KTLO: `Active` → `Resolved`.

## Supersession and replacement links

- A superseded decision must include a `Superseded by` link pointing to the
  replacement decision. The replacement must include a reciprocal `Supersedes`
  link.
- A superseded spec must include a `Superseded by` link. The replacement must
  include a reciprocal `Supersedes` link.
- These links are machine-checkable for reciprocity.

## Mermaid guidance

Mermaid diagrams are first-class documentation tools. They provide visual
structure that complements prose.

- Validate Mermaid syntax before committing. The `docs-check` script validates
  Mermaid blocks.
- Every Mermaid diagram must be accompanied by prose that conveys its essential
  meaning. A reader should understand the diagram's purpose even if rendering
  fails.
- Use Mermaid for: architecture diagrams, sequence diagrams, state machines,
  flowcharts, entity relationships, and dependency graphs.
- Keep diagrams focused. One concept per diagram. Split large diagrams into
  multiple focused views.

## Docs-as-code principles

- The repository is the canonical source. Wiki pages, generated sites, and
  exported PDFs are publication targets derived from repository content.
- All documentation changes go through the same review workflow as code changes.
- Documentation is versioned alongside code.
- Machine-checkable invariants (links, IDs, metadata, status) are enforced by
  `docs-check`, not by convention alone.
- Publication is a separate step that occurs after commit and push, mediated by
  the `docs-publish` skill.
