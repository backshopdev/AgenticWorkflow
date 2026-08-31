---
name: javascript
description: Use when a task involves JavaScript. Provides foundational guidance on modern JavaScript patterns, async programming, error handling, and testing approaches.
---

# JavaScript

## Expert stance

Apply modern JavaScript (ES2020+) best practices. JavaScript is a
multi-paradigm language used in browsers, servers (Node.js), and beyond.

## Core concepts

### Variables and types

- Use `const` by default; `let` when reassignment is needed; avoid `var`.
- Prefer primitive types; use objects and arrays for structured data.
- Use `typeof`, `instanceof`, and `Array.isArray()` for type checks.
- Understand type coercion; prefer explicit conversion.

### Functions

- Prefer arrow functions for callbacks and short functions.
- Use default parameters instead of `||` for defaults.
- Use rest parameters (`...args`) for variadic functions.
- Use destructuring for function parameters.

### Async programming

- Use `async/await` for asynchronous code; it is clearer than callbacks or
  `.then()` chains.
- Handle errors with `try/catch` in async functions.
- Use `Promise.all()` for parallel operations.
- Use `Promise.race()` for timeouts.
- Avoid mixing callbacks and promises.

### Error handling

- Throw errors for exceptional conditions; do not use errors for control flow.
- Use custom error classes for domain-specific errors.
- Always handle promise rejections (unhandled rejections crash Node.js).
- Use error boundaries in React.

### Modules

- Use ES modules (`import`/`export`) for new code.
- Use CommonJS (`require`/`module.exports`) only when required by the
  environment.
- Avoid circular dependencies.

## Best practices

- Use strict mode (`"use strict"` or ES modules).
- Prefer immutability; avoid mutating objects and arrays.
- Use `Map` and `Set` for key-value collections and unique values.
- Use optional chaining (`?.`) and nullish coalescing (`??`).
- Use `for...of` for iterables; avoid `for...in` for arrays.
- Lint with ESLint; format with Prettier.

## Testing

- **Unit tests:** Jest, Vitest, or Node.js built-in test runner.
- **Assertion libraries:** Built-in `assert`, Chai, or Jest matchers.
- **Mocking:** `jest.mock()`, `vi.mock()`, or manual mocks.
- **Coverage:** Aim for meaningful coverage, not 100%.
- Test behavior, not implementation.

## Common patterns

- **Factory functions:** Create objects without `new`.
- **Module pattern:** Encapsulate state with closures.
- **Observer pattern:** Event emitters for pub-sub.
- **Middleware pattern:** Compose functions (Express, Koa).
