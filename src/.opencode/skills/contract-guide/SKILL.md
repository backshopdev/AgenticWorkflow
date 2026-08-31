---
name: contract-guide
description: Use when authoring a human-authored contract guide. Covers workflows, authentication, error semantics, compatibility, usage patterns, and links to generated reference documentation.
---

# Contract Guide

## Purpose

A contract guide is a human-authored document that explains how to use a
contract. It complements the machine-readable contract (OpenAPI, JSON Schema)
with narrative guidance, examples, and workflow descriptions.

## When to write a contract guide

Write a contract guide when:

- The contract is complex and needs narrative explanation.
- Multiple workflows use the contract in different ways.
- Authentication or authorization is non-trivial.
- Error handling requires guidance beyond status codes.
- Compatibility or migration concerns exist.

## Required sections

### Overview

Brief description of what the contract provides and who it is for.

### Authentication

Describe how to authenticate with the API or service:

- Authentication mechanism (API key, OAuth, JWT, etc.).
- How to obtain credentials.
- How to include credentials in requests.
- Token refresh and expiration.

### Workflows

Describe common workflows using the contract:

- Step-by-step instructions.
- Example requests and responses.
- Error handling at each step.

### Error semantics

Explain how errors work:

- Error response format.
- Common error codes and their meanings.
- Retry strategies for transient errors.
- When to contact support.

### Compatibility

Describe compatibility guarantees:

- Versioning policy.
- Breaking change policy.
- Deprecation process.
- Migration guides for major versions.

### Usage patterns

Provide practical guidance:

- Rate limiting and throttling.
- Pagination.
- Filtering and sorting.
- Batch operations.
- Caching strategies.

### Links to generated reference

Link to the machine-readable contract:

- OpenAPI specification (if applicable).
- JSON Schema definitions.
- Generated client libraries.

## Metadata

Contract guides live alongside the contract they document. If the contract is
`CON-20260831-01`, the guide is part of that contract's documentation.

## Quality criteria

- A developer can integrate with the contract using only this guide.
- Examples are realistic and tested.
- Error handling is explicit, not assumed.
- Compatibility guarantees are clear.
