# Review Core Skill

## Description
Shared review contract loaded by the two review lanes (`harness-reviewer`, `peer-reviewer`). Provides consistent review methodology and a checklist template. Consolidation + triage rules live here too.

## Review Checklist Template
When reviewing any deliverable, evaluate:

### Acceptance Criteria
- [ ] All acceptance criteria from spec are addressed
- [ ] Criteria are implemented correctly (not hallucinated)
- [ ] Edge cases covered

### Conventions & Quality
- [ ] Code follows project style conventions
- [ ] No hallucinated imports or APIs
- [ ] Scope creep absent (no unrelated changes)
- [ ] Comments/documentation present where needed

### Risks & Side Effects
- [ ] Potential runtime failures identified
- [ ] Security considerations noted
- [ ] Performance concerns flagged

### Documentation
- [ ] README/docs updated if behavior changed
- [ ] API contracts preserved or explicitly revised
- [ ] Decision records updated if architecture changed

## Scope Rule (both lanes)
- Review **only the files the orchestrator lists as changed this session**, plus how those changes intersect the rest of the repo.
- Read outward to judge integration is fine; **raise findings anchored to session changes only.** Do not audit untouched files.

## Two-Lane Consolidation Rules
The orchestrator merges the `harness-reviewer` + `peer-reviewer` packets and presents to the human. The human has final say.

### Finding both lanes raise (agree)
- Present as "Consensus: {finding}" — high signal, but the human still confirms.

### Finding only one lane raises
- Present as "Solo ({lane}): {finding}" with that lane's rationale.
- Single-lane ≠ wrong and ≠ right; it is flagged for the human to accept or **dismiss**.

### Findings that conflict
- Present as "Debate: {lane A view} vs {lane B view}" with the specific question for the human.
- The orchestrator never resolves a conflict unilaterally.

### Human triage (authoritative)
- The human may **accept, edit, or dismiss any finding.** Dismissed findings do not block.
- Accepted findings → returned to the developing agent (harness-writer) to fix; the loop continues.

### Output
- Returned to the orchestrator **in-context as a completion packet** — no findings file is written to disk (triage happens in-session).
- Orchestrator's summary to the human lists: findings by lane, severity, and a clear accept/dismiss action per finding.

## When Not to Review
- Deliverable without acceptance criteria → flag and return to the orchestrator for plan clarification
- Changes without corresponding test coverage → flag for reviewer
- Work from outside the session's changed-file scope → out of scope; do not raise (see Scope Rule)
