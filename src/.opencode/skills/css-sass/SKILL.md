---
name: css-sass
description: Use when a task involves CSS or Sass. Provides foundational guidance on CSS architecture, Sass patterns, responsive design, and maintainability.
---

# CSS and Sass

## Expert stance

Apply CSS and Sass best practices for maintainable, scalable stylesheets. CSS
is the language for styling web pages; Sass adds variables, nesting, and
mixins.

## Core concepts

### CSS architecture

- **BEM (Block-Element-Modifier):** `.block__element--modifier` naming.
- **ITSS (Inception, Transformation, State, Theme):** Layered architecture.
- **Cube CSS:** Composition, utility blocks, exceptions.
- **Utility-first:** Tailwind CSS approach.

Choose an architecture that fits the project scale and team.

### Sass features

- **Variables:** `$color-primary: #007bff;`
- **Nesting:** Nest selectors, but limit depth to 3 levels.
- **Mixins:** Reusable style blocks with parameters.
- **Functions:** Custom functions for calculations.
- **Partials:** Split styles into `_partial.scss` files.
- **Import:** Use `@use` and `@forward` (not `@import`).

### Selectors

- Prefer class selectors over element or ID selectors.
- Avoid overly specific selectors (e.g., `div.container ul li a`).
- Use descendant combinators sparingly.
- Use `:is()` and `:where()` for complex selectors.

### Layout

- **Flexbox:** One-dimensional layouts (rows or columns).
- **Grid:** Two-dimensional layouts (rows and columns).
- **Container queries:** Style based on container size, not viewport.
- **Logical properties:** Use `margin-inline-start` instead of `margin-left`.

### Responsive design

- Use mobile-first approach (min-width media queries).
- Use relative units (`rem`, `em`, `%`, `vw`, `vh`).
- Use `clamp()` for fluid typography.
- Test at multiple breakpoints.

## Best practices

- Use CSS custom properties (variables) for theming.
- Avoid `!important`; increase specificity instead.
- Avoid inline styles; use classes.
- Use `box-sizing: border-box` globally.
- Reset or normalize browser defaults.
- Lint with Stylelint.

## Testing

- Visual regression testing with Playwright, Percy, or Chromatic.
- Snapshot testing for component styles.
- Test at multiple viewports.
- Test with high-contrast mode and dark mode.

## Common patterns

- **Stack:** Vertical spacing between elements.
- **Cluster:** Horizontal grouping of elements.
- **Switcher:** Responsive layout that switches between row and column.
- **Repel:** Space-between layout with wrapping.
