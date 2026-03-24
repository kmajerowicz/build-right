# GSR — Backlog

Open topics, questions, and ideas for discussion. Anyone can add items or respond.

---

## Open Topics (Need Decision)

## Ideas / To Discuss

### Agent definitions
What specific subagent roles are needed beyond research and systematic task execution? Define during implementation.

### Partial GSR setup handling
How does `/gsr:learn` handle projects with partial GSR setup (e.g., has CLAUDE.md but no PRD)?

---

## Resolved (moved to decisions.md)

- #1 CLAUDE.md + skills setup → Decision 12
- #2 Naming → Get Shit Right (GSR)
- #3 Command surface → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md). 5 commands: `/gsr:scope`, `/gsr:prd`, `/gsr:build`, `/gsr:verify`, `/gsr:learn`
- #5 Start B details → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md). `/gsr:learn` indexes existing project, populates CLAUDE.md, assesses what exists, tells user next step
- #4 Done signals → Decision 16 (per-feature) + Decision 23 (project-level: all phases PASS + backlog triaged)
- #6 Sweep parallelization → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md) (Decision 18: subagents) + Decision 25 (file-level partitioning details)
