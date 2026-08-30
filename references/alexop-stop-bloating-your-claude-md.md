# Source Note: Stop Bloating Your CLAUDE.md (alexop.dev)

- **Author**: Alexander Opalic (alexop.dev)
- **Reference Type**: blog post
- **Title**: Stop Bloating Your CLAUDE.md: Progressive Disclosure for AI Coding Tools
- **Link**: <https://alexop.dev/posts/stop-bloating-your-claude-md-progressive-disclosure-ai-coding-tools/>
- **Published**: 2026-01-18
- **Status**: retrieved 2026-08-29 (full text)
- **Informs principles**: GP01, GP02, GP07

## Key points captured
- **Context is just an array of tokens**; no hidden memory. Statelessness is a design constraint to work *with*, not fight.
- **"If a tool can enforce it, don't write prose about it"** — let ESLint/TypeScript/Prettier handle style; one line ("run lint:fix && typecheck") beats 200 lines of style rules. → *backpressure* (automated feedback for self-correction).
- **Universal context vs situational gotchas**: CLAUDE.md is for universal context; gotchas belong in `docs/*.md` loaded on demand, with an explicit "read relevant docs first" pointer.
- **One agent per domain** + isolated-context skills (`context:fork`) to avoid polluting the main thread.
- **Honest caveat**: skills don't always trigger (cites Vercel evals: skills un-invoked in 56% of cases); docs-based loading is more predictable — so be explicit about *when* to read a doc.
- His result: a stable ~50-line CLAUDE.md, with the real knowledge living in a growing `/docs` corpus captured via a `/learn` command.

## Why it matters here
Grounds GP01 (progressive disclosure) and especially **GP07 (machine-checkable rules belong in tooling, not prose)** — the direct rationale for our `markdownlint` trigger and for keeping rule *text* minimal while a *tool* enforces format. Its "read relevant docs first" pattern also justifies our index/link-discipline rule.
