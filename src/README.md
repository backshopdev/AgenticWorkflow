# Agentic Workflow Harness

A multi-agent workflow for OpenCode that guides AI agents through structured planning, execution, and independent review.

## Quick Start
1. `opencode` - select `orchestrator`
2. Describe your goal
3. The orchestrator routes through the pipeline: Harness Writer → (harness + peer reviewers) → commit gate
4. Check `~/docs/` for artifacts at each stage
5. Final result when both review lanes approve and you sign off on the commit

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
  → @harness-writer (execute + run repo lint/structure → completion packet)
  → @harness-reviewer + @peer-reviewer (parallel, isolated, scoped to changed files)
  → orchestrator presents findings → human triages (may dismiss)
  → Gate 2: human + lanes approve → commit (message approved by human)
        (any "request changes" → back to harness-writer)
```
