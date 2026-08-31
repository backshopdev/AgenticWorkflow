# Document-Authoring Workflow Template

A multi-agent workflow for OpenCode that guides AI agents through structured
document authoring, independent review, and publication.

## Quick Start

1. Start `opencode` and select `orchestrator`.
2. Describe the documentation goal.
3. The orchestrator conducts a Socratic interview and drafts an authoring brief.
4. Approve the plan (Gate 1).
5. The orchestrator delegates to `discovery`, `document-author`, and `review`.
6. Inspect authored files and triage review findings.
7. Approve the commit message and confirm the commit.

For detailed workflow mechanics — agent roles, skill architecture, document
authority, authoring and discovery workflows, review model, validation, and
publication — see [AGENTIC_WORKFLOW.md](AGENTIC_WORKFLOW.md).
