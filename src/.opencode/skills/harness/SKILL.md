---
name: harness
description: Use when authoring or reviewing AI harnesses, agent playbooks, prompts, skills, orchestration, HITL gates, or root/template workflow synchronization.
---

# Harness

## Expert stance

Apply senior OpenCode and agentic-workflow architecture judgment. Optimize the
whole human-agent system for reliable decisions, bounded autonomy, economical
context, and inspectability. This is a specialist module, not a persona: retain
the caller's role and compose this expertise with other loaded skills.

## Domain model

- **Agent:** a stable actor with a mode, permissions, ownership, and routing
  contract. Create one only when isolation or authority must differ.
- **Skill:** on-demand expertise or a review lens. It sharpens judgment without
  creating another actor, session, or handoff.
- **Contract:** explicit inputs, outputs, allowed tools, stop conditions,
  completion evidence, and revision destination.
- **Gate:** a human decision point. A gate is real only if routing and
  permissions prevent silent advancement.
- **Context boundary:** information not inherited across isolated sessions;
  required state must travel in the handoff.
- **Source/template pair:** operational root artifact and distributable copy
  whose synchronization is an invariant, not an assumption.

## Architecture judgment

Ask:

1. Does this need a new authority/context boundary, or only another expertise
   lens? Prefer a skill unless mode, permissions, ownership, or isolation differ.
2. Can each actor determine what it receives, may do, must return, and where a
   failure or accepted revision goes?
3. Is a claimed invariant enforced by configuration/workflow structure, or
   merely requested in prose?
4. Is always-on context limited to stable routing and safety rules, with
   detailed domain material progressively disclosed through skills?
5. Does every irreversible or judgment-heavy transition preserve meaningful
   human choice, including the ability to reject or reopen work?

| Decision | Prefer | Avoid when |
| --- | --- | --- |
| New agent | Distinct authority, permissions, ownership, or context | Only expertise varies |
| New skill | Reusable specialist judgment loaded on demand | It needs independent action or state |
| Parallel review | Independent, meaningful perspectives | Coordination cost exceeds likely signal |
| Extra gate | Consequential ambiguity or irreversible action | It only rubber-stamps objective checks |

Balance reliability against token and coordination cost. More agents increase
independence but also handoff loss, latency, and synthesis burden. More prompt
text can reduce ambiguity but crowd out task evidence. Use the smallest design
that preserves the required boundaries.

## Preferred and discouraged patterns

Prefer stable roles plus composable skills; explicit completion packets;
least-privilege tool and delegation rules; deterministic objective checks;
single ownership of edits; and one normative source with explicit root/template
synchronization.

Discourage role proliferation by artifact type, fictional identities, hidden
shared-context assumptions, duplicate normative prose, self-approval, gates
that permissions can bypass, broad tool grants for convenience, and review
lanes whose perspectives are indistinguishable.

Warning signs include ghost agent or skill names, dead allowlists, a subagent
expected to interview the human, acceptance criteria omitted from a handoff,
review findings treated as automatic verdicts, and template copies that can
drift without detection.

## Authoring guidance

- Write dense, imperative contracts for both LLM execution and human audit.
- Put stable workflow invariants in agent/config instructions and variable
  expertise in discoverable skills. Do not restate an entire skill in an agent.
- Define normal, failure, blocked, and revision paths; identify who owns each
  transition and artifact.
- Grant only tools, skills, task targets, paths, and network reach needed by the
  role. Ensure permission ordering implements the intended policy.
- When root and template artifacts coexist, change both in one task and make
  byte-identity or an intentional-difference rule objectively checkable.

## Review guidance and evidence

Trace at least one success path and one failure/revision path end to end. Compare
prose with effective config: modes, permissions, skill/task allowlists, startup
behavior, and copied artifacts. Require evidence for claims such as "cannot
edit," "mandatory review," or "synchronized"; wording alone is insufficient.

Escalate when authority is ambiguous, a HITL gate is bypassable, required state
cannot cross an isolation boundary, least privilege conflicts with the task, or
root/template divergence has no declared source of truth. Report the affected
path, concrete consequence, and smallest viable correction.
