# KTLO: Coding Standards

This is a template KTLO item owned by the template repo. Do not edit directly in consuming repos - instead, update the template repo and pull changes, or add a project-specific override.

## Template Content Placeholder

### Code Style Standards
- Use 2-space indentation (no tabs)
- Line length: 100 characters max
- Trailing whitespace: no trailing whitespace on any line

### Naming Conventions
- Functions: camelCase: `calculatePrice()`, `validateUserInput()`
- Variables: camelCase: `userCount`, `totalAmount`
- Constants: UPPER_SNAKE_CASE: `MAX_RETRIES`, `DEFAULT_TIMEOUT`
- Classes: PascalCase: `UserService`, `OrderProcessor`
- Files: camelCase: `user-service.js`, `validation-utils.js`

### Format Requirements
- Single quotes for strings: `'hello world'`
- Semicolons: required at end of statements
- Braces: opening on same line as declaration (e.g., `if (x) {`)
- Max function length: 50 lines
- Max file length: 400 lines

### Format Anti-Patterns to Avoid
- Mixed quote styles within same file
- Missing semicolons (linter should catch)
- Deeply nested conditionals (>3 levels)
- Functions with >3 parameters (consider options object)

### How to Add Project-Specific Standards
1. Create `ktlo/ktlo-item-{short-hash}.md` marked `[project]`
2. Override or extend the template standards as needed
3. Reference both template and project items in `KTLO/index.md`

### When to Pull Template Updates
- When template repo updates `002-coding-standards.md`
- Review changes for relevance to your project
- Manually merge or replace as appropriate
