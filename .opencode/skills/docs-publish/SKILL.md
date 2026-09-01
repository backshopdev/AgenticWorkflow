---
name: docs-publish
description: Use when publishing repository documentation to external surfaces such as Wiki, generated sites, or PDFs. Defines the publication workflow boundary.
---

# Documentation Publication

## Expert stance

Apply documentation-publication judgment. This skill defines the boundary
between repository-authored documentation and external publication targets. It
composes with the caller's role and does not introduce a separate persona.

## Docs-as-code principle

Documentation follows the same workflow as code:

1. Author changes in the repository.
2. Review through the standard review cycle.
3. Commit and push after human approval.
4. Publish to external surfaces through `docs-publish`.

## Publication workflow

Publication:

- Occurs after commit and push.
- Is mediated by the orchestrator.
- Displays a proposed diff for human review.
- Records source path and commit for every published page.
- The repository remains canonical; published pages are projections.

## Authority model

The repository is the canonical source of truth. External surfaces (Wiki,
generated sites, PDFs) are derived artifacts. Changes to published content must
originate in the repository, not in the publication target.

## Publication record

Every published page should record:

- Source path in the repository.
- Commit SHA at time of publication.
- Publication date.

This enables traceability from published content back to the authoritative
source.
