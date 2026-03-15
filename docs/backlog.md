# GSR — Backlog

Open topics, questions, and ideas for discussion. Anyone can add items or respond.

---

## Open Topics (Need Decision)

### #4 Done signals (partially resolved)
When is the whole project done? Per-feature done signals are resolved (feature status in STATE.md + per-feature verification). But "project complete" signal is still open — all features verified? Explicit user declaration?

**Status:** Partially resolved — per-feature tracking decided, project-level completion still open

---

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
- #6 Sweep parallelization → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md). Subagents for independent tasks within phases, not agentic teams
