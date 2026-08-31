---
name: gherkin-testability
description: Review lens for Gherkin scenarios in specifications. Assesses scenario quality, preconditions, actions, outcomes, testability, and tag appropriateness.
---

# Gherkin Testability Review Lens

## Lens stance

Evaluate whether Gherkin scenarios are well-formed, testable, and correctly
classified. A good scenario can be directly translated into an automated test
without ambiguity.

## Review criteria

### Structure

- Does every scenario follow Given-When-Then structure?
- Are preconditions (Given) distinct from actions (When) and outcomes (Then)?
- Is each step atomic (one action per step)?
- Are steps written in active voice?

### Preconditions (Given)

- Are preconditions specific and observable?
- Do preconditions set up the minimum state needed?
- Are preconditions reproducible?
- Do preconditions avoid implementation details?

### Actions (When)

- Does the action describe a single user or system action?
- Is the action specific enough to implement?
- Does the action avoid prescribing implementation?

### Outcomes (Then)

- Are outcomes observable and verifiable?
- Does each Then clause assert one thing?
- Are outcomes specific (not vague like "it works")?
- Are outcomes independent of implementation?

### Testability

- Can this scenario be automated?
- Does the scenario require external context not described in the steps?
- Are there hidden dependencies?
- Can the scenario run in isolation (for @unit) or does it need integration?

### Tag appropriateness

- **@unit:** The scenario can be tested without external dependencies (no
  database, no network, no file system). Fast and isolated.
- **@integration:** The scenario requires interaction with external systems or
  components. Slower and dependent on infrastructure.
- Is the tag choice correct? A scenario tagged @unit that requires a database
  is misclassified.
- Does every scenario have exactly one of @unit or @integration?

### ID uniqueness

- Does every scenario have an `@id` tag?
- Is the ID unique across all specifications?
- Is the ID stable (does not change when the scenario is edited)?
- Is the ID format consistent (e.g., `SCEN-001`)?

### Common anti-patterns

- **Implementation coupling:** Steps describe how, not what.
- **Vague outcomes:** "Then the system behaves correctly."
- **Missing preconditions:** Steps assume state not set up.
- **Multiple actions:** "When the user clicks save and then navigates away."
- **Untestable scenarios:** Scenarios that require human judgment to verify.
