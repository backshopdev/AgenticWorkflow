---
name: typescript
description: Use when a task involves TypeScript. Provides foundational guidance on TypeScript patterns, type system usage, generics, and testing approaches.
---

# TypeScript

## Expert stance

Apply TypeScript best practices for type-safe JavaScript. TypeScript adds
static types to JavaScript, catching errors at compile time and improving
developer experience.

## Core concepts

### Type annotations

- Annotate function parameters and return types.
- Let TypeScript infer types when obvious.
- Use `interface` for object shapes; use `type` for unions, intersections, and
  aliases.
- Avoid `any`; use `unknown` when the type is truly unknown.

### Interfaces vs. types

- **Interfaces:** Extendable, good for object shapes, support declaration
  merging.
- **Types:** More flexible, support unions, intersections, mapped types,
  conditional types.
- Prefer `interface` for public APIs; use `type` for complex type logic.

### Generics

- Use generics for reusable, type-safe functions and components.
- Constrain generics with `extends` when needed.
- Use generic defaults for common cases.

```typescript
function identity<T>(value: T): T {
  return value;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Utility types

- `Partial<T>`: All properties optional.
- `Required<T>`: All properties required.
- `Readonly<T>`: All properties read-only.
- `Pick<T, K>`: Select a subset of properties.
- `Omit<T, K>`: Exclude a subset of properties.
- `Record<K, V>`: Object with keys K and values V.

### Narrowing

- Use type guards (`typeof`, `instanceof`, `in`) to narrow types.
- Use discriminated unions for state machines.
- Use assertion functions for runtime checks.

## Best practices

- Enable `strict` mode in `tsconfig.json`.
- Use `const` assertions (`as const`) for literal types.
- Use template literal types for string patterns.
- Avoid type assertions (`as`); prefer type guards.
- Use `satisfies` operator for validation without widening.
- Keep types close to their usage; avoid global type files.

## Testing

- Use `ts-jest` or `vitest` for TypeScript-aware testing.
- Test type-level logic with `tsd` or `expectType`.
- Type-check tests; do not use `@ts-ignore` in tests.

## Common patterns

- **Branded types:** Prevent mixing similar types (e.g., `UserId` vs.
  `OrderId`).
- **Builder pattern:** Chainable, type-safe object construction.
- **Result type:** Explicit error handling without exceptions.
- **Tagged unions:** Model state machines with discriminated unions.
