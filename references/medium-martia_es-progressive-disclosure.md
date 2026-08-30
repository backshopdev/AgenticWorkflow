# Source Note: Progressive Disclosure — controlling context (and tokens) in AI agents

- **Author**: Marta Fernández García
- **Reference Type**: article (Medium)
- **Title**: Progressive Disclosure: the technique that helps control context (and tokens) in AI agents
- **Link**: <https://medium.com/@martia_es/progressive-disclosure-the-technique-that-helps-control-context-and-tokens-in-ai-agents-8d6108b09289>
- **Published**: 2026-02-24
- **Local capture**: [PDF](./medium-martia_es-progressive-disclosure.pdf) (retrieved 2026-08-29; web fetch was 403)
- **Status**: retrieved (full)
- **Informs principles**: GP01

## Key points captured
- **Three-layer skill disclosure**: discovery exposes only a skill name and short description; activation loads its instructions when it appears useful; execution adds examples, extensive documentation, or other references only when needed.
- **Relevant-context optimization**: the goal is not simply to minimize context or tokens, but to provide relevant information at the right moment. Irrelevant overload can increase cost and latency, distract reasoning, and impair tool selection, while removing useful information can also degrade performance.
- **Reduced tool-selection complexity and modularity**: progressive disclosure reduces decision complexity during tool selection and limits simultaneous instructions, supports modular and scalable architectures, and permits new skills without continually enlarging the base context.
- **Routing and context-management mechanisms**: routing, embedding-based retrieval, or planners can help decide what to load. The pattern also appears with tool routing, hierarchical planner–executor planning, selective information retrieval, and dynamic context compression.
- **Implementation variability**: the pattern has no universal implementation; frameworks and architectures apply variations of the same principle.

## Why it matters here
- The article directly supports GP01's start-simple, layer-as-needed pattern: expose lightweight skill metadata first, load instructions when a skill is activated, and add detailed references only when necessary.
