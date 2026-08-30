# Planning Structure Skill

## Description
Provides the planning framework used across workflow stages. Supplies planning tracks, epics, readiness gate, and plan delta structures.

## When to Use
- Planner stage: decomposing spec into thin vertical slices
- Recording implementation plans to `~/plans/`
- Defining dependencies, verification criteria, parallelization decisions

## Planning Tracks Structure
```text
# Implementation Plan

## Objective
{Clear statement of what this implementation achieves}

## Scope
{What's in scope / out of scope for this slice}

## Epics / Feature Slices
- [ ] Epic 1: {description}
- [ ] Epic 2: {description}
- [ ] Epic 3: {description}

## Dependencies
- Depends on: {other slices, projects, or systems}
- Required before: {what must complete first}

## Verification
- How will we know this is done? {tests, criteria, checks}
- Acceptance criteria: {specific, measurable definitions}

## Parallelization Decision
- Safe to parallelize: {yes/no, which slices can run together}
- Worktree strategy: {git worktrees needed, or sequential}

## Gaps and Proposed Defaults
- Known gaps: {what we don't have yet}
- Proposed defaults: {fallback choices if gaps remain}

## Implementation Readiness
Score: 0-10
- Rationale: {why this score}
- Blockers: {what would move this higher}
```

## HITL Plan Sign-off (gate)
A plan is a human-in-the-loop artifact. Unless we are already executing a written, approved plan stored in the repo (`~/plans/` / `~/docs/`), the orchestrator must obtain explicit human sign-off on the plan **before implementation work begins**. If the human requests changes, revise and re-ask - do not proceed to the dev stage until approved.
