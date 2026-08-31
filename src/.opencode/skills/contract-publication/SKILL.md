---
name: contract-publication
description: Use when generating human-readable reference documentation from a machine contract. Covers deterministic generation, on-demand generation, and validation.
---

# Contract Publication

## Purpose

This skill covers the deterministic generation of human-readable reference
documentation from machine-readable contracts (OpenAPI, JSON Schema). The
generated documentation is a projection of the contract, not an independent
source.

## Principles

1. **Deterministic.** Given the same contract input, the generated output is
   always identical. No timestamps, random ordering, or non-deterministic
   elements.
2. **On-demand.** Generation happens when needed, not on a schedule. The
   generated output is not stored in the repository; it is derived at
   publication time.
3. **Validated.** Generated output is validated against the source contract to
   ensure fidelity.
4. **Traceable.** Every generated page identifies its source contract and the
   commit from which it was derived.

## Generation workflow

1. **Read contract.** Parse the machine-readable contract (OpenAPI YAML/JSON,
   JSON Schema).
2. **Validate contract.** Ensure the contract is valid according to its schema.
3. **Generate documentation.** Produce human-readable HTML or Markdown from the
   contract.
4. **Validate output.** Check that the generated documentation covers all
   endpoints, schemas, and examples in the contract.
5. **Publish.** Include the generated documentation in the publication target
   (Wiki, static site).

## What is generated

From OpenAPI:

- Endpoint listing with methods, paths, and descriptions.
- Request and response schemas with examples.
- Authentication requirements.
- Error responses.

From JSON Schema:

- Field listing with types, constraints, and descriptions.
- Example values.
- Nested object structure.

## What is not generated

- Narrative guidance (workflows, best practices). This belongs in the contract
  guide.
- Tutorials or how-to content.
- Architecture or design rationale.

## Tools

Common tools for generating documentation from contracts:

- **OpenAPI:** Redoc, Swagger UI, Stoplight Elements.
- **JSON Schema:** json-schema-viewer, custom generators.

Choose tools that produce deterministic output and support the required output
format.

## Validation

After generation, validate:

- Every endpoint in the contract appears in the documentation.
- Every schema in the contract appears in the documentation.
- Examples are present and valid.
- Links between schemas resolve correctly.
