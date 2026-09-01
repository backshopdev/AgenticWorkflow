---
name: planning-structure
description: Use when decomposing work into an implementation plan, acceptance criteria, dependencies, readiness, and explicit human plan approval.
---

# Planning Structure

Structure plans with: objective; in/out scope; thin feature slices; dependencies;
specific acceptance criteria; verification; parallelization; gaps and proposed
defaults; and a readiness score with blockers.

Unless a written plan is already human-approved, the orchestrator must obtain
explicit approval before implementation. Revise and re-ask when requested; do
not delegate while Gate 1 is open.

## Implementation plan content

Implementation plans decompose specifications into work:

- Work packages (`WP-NN`) and tasks (`T-NN`).
- Dependencies and parallelism.
- Change map (files created, modified, deleted).
- Prescriptiveness levels (Required, Expected, Discretion).
- Scenario traceability matrix (maps each Gherkin scenario to a work package,
  task, and test location).
- Documentation stubs.
- Verification criteria.

Each work package has a stable identifier (`WP-NN`) and each task within it has
a stable identifier (`T-NN`). Dependencies between work packages are explicit;
independent work packages may proceed in parallel.
