# GSR Plugin — TL;DR

**GSR (Get Shit Right)** is becoming a standalone Claude Code plugin that anyone can install. No dependencies on other plugins.

---

## 5 Commands

| Command | What it does |
|---------|-------------|
| `/gsr:learn` | Got an existing project? This scans it and tells you what's there and what's missing |
| `/gsr:scope` | Got an idea? Talk it through → get a structured scope document |
| `/gsr:prd` | Got a scope? Generate PRD + feature specs + project infrastructure in one go |
| `/gsr:build` | Pick a feature, pick a mode (creative or systematic), build it |
| `/gsr:verify` | Check if a feature or phase meets its success criteria with evidence |

---

## How It's Built

The plugin follows the same patterns as superpowers (skills, commands, hooks, agents):
- **Commands** = thin wrappers that trigger skills
- **Skills** = the actual workflow logic per phase
- **Templates** = structures for generated files (CLAUDE.md, PRD, features, etc.)
- **Hooks** = session-start injects awareness of `/gsr:*` commands
- **Agents** = subagent roles for parallel work within phases

---

## Key Architecture Choices

1. **Standalone** — no superpowers dependency, own everything
2. **Explicit commands** — no auto-triggering in MVP, each phase testable in isolation
3. **PRD + Init merged** — `/gsr:prd` does both because init is mechanical
4. **Two granularity levels** — phases group features, features are the unit of work
5. **Subagents for parallelism** — not agentic teams (too heavy, experimental)
6. **Cross-command awareness** — each command tells you the next step, you clear context between phases

---

## Repo Transformation

The `build-right` repo becomes the plugin itself. Existing design docs move to `docs/design/`. New directories: `.claude-plugin/`, `hooks/`, `commands/`, `skills/`, `templates/`, `agents/`.

---

## Full Details

- [Plugin Design Doc](2026-03-15-gsr-plugin-design.md) — full architecture
- [Decisions 13-18](../decisions.md) — rationale for every choice
