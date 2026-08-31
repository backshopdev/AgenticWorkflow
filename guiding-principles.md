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
  - Operationalized: pipeline form `@orchestrator` → `@document-author` → composed review sessions → human triage
- Human never bypasses gates; agent enforces gate discipline

GP04: Independent parallel review + human triage
  [Basis: human/project premise (human + agent = better whole); not an externally sourced evidence claim]
- Project implication: use independent review and authoritative human triage;
  this is an operational design decision derived from the premise, not a claim
  established by the sources listed in `references/`
- Review runs as one or more independent `review-agent` sessions in parallel;
  diversity comes from assigned domain and lens skills, not pinned models
- Every session loads `peer` plus a domain skill; risk-sensitive work adds `security`
- Scope is disciplined to the session's changed files + how they intersect the repo; findings are anchored, not blanket audits
- The orchestrator presents findings to the human, who **triages and may dismiss any** — findings are inputs, not verdicts
- Operationalized: orchestrator composes perspectives, preserves provenance,
  reports substantive conflicts as debates, and returns accepted changes to
  `document-author` without reopening the approved plan

GP05: Socratic interview surfaces assumptions before generation
  [Basis: human/project premise (human + agent = better whole); not an externally sourced evidence claim]
- Project implication: use Socratic interviewing to expose assumptions before
  generation; this is an operational design decision derived from the premise,
  not a claim established by the sources listed in `references/`
- The orchestrator surfaces unidentified assumptions, unconsidered use cases,
  and side effects through human-facing Socratic interviewing
- Explicit opinion requests open dialog, don't just state opinion
- Operationalized: the orchestrator alone uses the human-facing Socratic
  interview protocol; independent, read-only review-agent sessions report
  assumptions and findings to the orchestrator and never interview the human
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
- Operationalized: `markdownlint-cli2` enforces Markdown structure (see `docs/decisions/0001-markdownlint-via-npx.md`); `AGENTS.md` states the *trigger*, the config holds the *rules*; the document-author runs the check and reports `verify-status`
- Corollary (drives link discipline): docs should be *navigable* (predictable relative index links) so agents reliably reach the on-demand detail files this principle pushes prose into

GP08: The human leads, but the agent's judgment is a near-equal partner
  [Basis: human/project premise (human + agent = better whole); not an externally sourced evidence claim]
- Project implication: the human is the tiebreaker (51%), but the agent's perspective carries substantial weight (49%) and should be taken seriously; this is an operational design decision derived from the premise, not a claim established by the sources listed in `references/`
- When the agent pushes back on a process decision — like skipping a review step or dismissing a finding — that pushback is a critical signal, not a suggestion
- The human may still choose differently, but the agent's perspective deserves serious consideration
- Operationalized: orchestrator pushes back if the human elects to skip a workflow step (e.g., agentic re-review after a trivial fix); the human may override, but the pushback is documented and taken seriously
