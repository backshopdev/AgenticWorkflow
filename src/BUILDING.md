# Building This Project

## Prerequisites
- OpenCode CLI installed (`opencode` command available)
- Node.js 18+ (for any build/test scripts)
- Access to model endpoints configured in `opencode.json`

## Initial Setup
1. Clone this repository: `git clone <repo-url>`
2. Launch OpenCode: `opencode`
3. Select the `orchestrator` agent on first launch
4. The orchestrator will guide you through initial workflow setup

## First Workflow Run
1. Describe your goal to the `orchestrator` agent
2. If non-trivial, the pipeline will route through:
   - Orchestrator: plan + Socratic interview, then Gate 1 sign-off
   - Document Author: executes the approved plan and returns a completion packet
   - Review Agent: independent parallel sessions composed from peer, domain,
     and conditional security skills
3. Check `~/docs/` for artifacts at each stage

## Adding Project-Specific KTLO
1. Add items to `KTLO/` marked `[project]`
2. Update `KTLO/index.md` with your new items
3. Reference both template and project KTLO in documentation

## Customizing the Workflow
- Modify `AGENTS.md` for project-specific agent descriptions
- Update `opencode.json` for your model configurations
- Add project build/test scripts in `scripts/`
- Replace `docs/` content with your project documentation
