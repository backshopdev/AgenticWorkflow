# Agentic Workflow Harness

A multi-agent workflow for OpenCode that guides AI agents through structured planning, execution, and independent review.

## Quick Start
1. `opencode` - select `orchestrator`
2. Describe your goal
3. The orchestrator routes through document-author → composed review-agent sessions → commit gate
4. Check `~/docs/` for artifacts at each stage
5. Final result when every required perspective returns a non-`BLOCKED` packet,
   accepted findings are resolved, and you sign off

## Directory Overview
- `~/docs/` - decisions, specs, plans (durable artifacts; index.md per dir)
- `~/ktlo/` - Keep the Lights On items (index + template + project items)
- `~/references/` - considered sources + literature notes + guiding principles
- `~/guiding-principles.md` - numbered GP0X principles extracted from sources
- `~/.opencode/agents/` - this repo's agent playbooks
- `~/.opencode/skills/` - shared source-of-truth skills (also copied into `src/`)
- `~/src/` - reference skeleton for consuming repos (populate-once docs + source-of-truth skills)
- `~/scratch/` - gitignored agent scratch space (contents ignored, folder kept)

## Workflow Pipeline
```text
User Request
  → @orchestrator (plan; Gate 1 sign-off)
  → @document-author (execute + objective checks → completion packet)
  → @review-agent sessions (parallel; peer + domain [+ security])
  → orchestrator presents findings → human triages (may dismiss)
  → Gate 2: all perspectives non-BLOCKED + accepted findings resolved
  → commit (message approved in chat; exact command confirmed once in OpenCode)
        (accepted changes → back to document-author)
```
