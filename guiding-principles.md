# Guiding Principles (extracted from considered sources)

GP01: Progressive disclosure - start simple, layer complexity as needed
  [Source: AI Hero guide on AGENTS.md]
- The workflow AGENTS.md should begin with core philosophy and progressive pipeline stages
- Additional details reveal only when the human collaborator yields after each gate
- Prevents context rot by not dumping all information upfront
- Operationalized: AGENTS.md starts compact (≤100-line budget), expands only when task type warrants

GP02: Single source of truth - all artifacts in dedicated directories, never scattered
  [Source: alexop.dev on progressive disclosure for Claude.md]
- All workflow artifacts live in `~/docs/` + `WORKFLOW_STATE.md`
- Chat history is for transitory discussion, not persistent record
- Operationalized: `~/docs/decisions/`, `~/docs/specs/`, `~/docs/plans/` (review findings are ephemeral — triaged in-session, not persisted)
- AGENTS.md references these directories; nothing scattered in conversation history

GP03: Human in loop - orchestrator is entry point, yields after each gate
  [Source: Operator working principle]
- No stage advances without passing; failed gates loop back with specific feedback
- Human yields after each gate; orchestrator resumes session at completion
  - Operationalized: pipeline form `@orchestrator` → `@harness-writer` → (review lanes) → human/lanes approve
- Human never bypasses gates; agent enforces gate discipline

GP04: Independent parallel review + human triage
  [Source: Operator working principle (human + agent = better whole)]
- Review runs as two independent specialist lanes — `harness-reviewer` (agentic-tuning lens) + `peer-reviewer` (general correctness lens) — spawned in parallel, each in its own isolated context
- Lane diversity comes from *role/lens*, not from pinning different models
- Scope is disciplined to the session's changed files + how they intersect the repo; findings are anchored, not blanket audits
- The orchestrator presents findings to the human, who **triages and may dismiss any** — findings are inputs, not verdicts
- Operationalized: orchestrator spawns `@harness-reviewer` + `@peer-reviewer` → consolidates packets → human triages → changes return to the developing agent (harness-writer), not to the plan

GP05: Socratic interview surfaces assumptions before generation
  [Source: Operator working principle (human + agent = better whole)]
- Agents surface unidentified assumptions, unconsidered use cases, side effects
- Explicit opinion requests open dialog, don't just state opinion
- Operationalized: the human-facing agents (orchestrator, review lanes) use a Socratic interview protocol
- Opening question: "Could you tell me: what's your primary objective...?"
- When user asks "what do you think?" → agent opens dialog, doesn't just give opinion

GP06: A question is an invitation to converse, not a work order
  [Source: Operator working principle (human + agent = better whole)]
- Curiosity/opinion probes ("is there a...", "should we...", "what do you think...", "let's talk about...") open a dialog first — do NOT jump to editing files
- Explicit build commands ("implement / proceed / apply") are what trigger action
- When implementing touches ground the human is unfamiliar with, surface the tradeoff and pause for questions — the human learning is part of the spec, not a side quest
- The human's first instinct may be wrong and the agent's may be wrong; dialog is how you find out before spending tokens building the wrong thing
- Operationalized: orchestrator "Question-vs-Command" protocol; AGENTS.md Socratic rule; mirrored to consuming repos via `src/`

GP07: Tooling enforces the checkable; prose is for the judgment-based
  [Source: alexop.dev "Stop Bloating Your CLAUDE.md" (backpressure) + AI Hero "Complete Guide to AGENTS.md" (instruction budget)]
- If a linter/build can verify a rule, encode it in the tool, not in prose instructions (saves the instruction budget + removes ambiguity)
- Prose is reserved for judgment a tool can't make (intent, fit, harness tuning)
- Operationalized: `markdownlint-cli2` enforces Markdown structure (see `docs/decisions/0001-markdownlint-via-npx.md`); `AGENTS.md` states the *trigger*, the config holds the *rules*; the harness-writer runs the check and reports `verify-status`
- Corollary (drives link discipline): docs should be *navigable* (predictable relative index links) so agents reliably reach the on-demand detail files this principle pushes prose into
