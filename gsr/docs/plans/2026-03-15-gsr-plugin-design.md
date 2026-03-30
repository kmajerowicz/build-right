# GSR Plugin Design — Claude Code Plugin Architecture

**Date:** 2026-03-15
**Status:** Approved
**Context:** Brainstorming session — transforming GSR from documentation into a standalone Claude Code plugin.

---

## Overview

GSR (Get Shit Right) becomes a standalone Claude Code plugin that anyone can install. It provides a PRD-first, human-in-the-loop workflow for building production apps — from raw idea to verified MVP.

The existing `build-right` repo transforms into the plugin itself. Design docs move to `docs/design/` as internal reference.

---

## Target Users

- PMs / non-developers building apps with Claude Code
- Developers who want structured product workflow
- The system adapts to both (domain expertise adaptation built into Phase 0)

---

## Command Surface (5 commands)

| Command | Purpose | Input | Output |
|---------|---------|-------|--------|
| `/gsr:scope` | Shape idea or materials into structured scope | Idea (Start A) or existing scope from `/gsr:learn` (Start B) | `docs/scope.md` |
| `/gsr:prd` | Generate PRD + feature files + project init | `docs/scope.md` + design references | `docs/PRD.md` + `docs/features/*.md` + `CLAUDE.md` + `docs/STATE.md` + `docs/BACKLOG.md` + `docs/techstack.md` |
| `/gsr:build` | Build a specific feature | Feature selection + mode selection | Working code, atomic commits, STATE.md updates |
| `/gsr:verify` | Verify feature against PRD criteria | Feature to verify | Evidence-based verification in STATE.md |
| `/gsr:learn` | Index existing project | Existing codebase | `CLAUDE.md` populated + assessment of what exists/missing |

### Command Flow

Each command knows what comes next and tells the user:

```
/gsr:learn → "Project indexed. Run /gsr:scope or /gsr:prd depending on what you have."
/gsr:scope → "Scope complete. Clear context and run /gsr:prd."
/gsr:prd   → "PRD and project initialized. Clear context and run /gsr:build."
/gsr:build → "Feature complete. Run /gsr:verify to verify, or /gsr:build for next feature."
/gsr:verify → "Verification complete. Run /gsr:build for next feature, or you're done."
```

Context clearing between phases keeps the window fresh. Persistent state lives in files (CLAUDE.md, STATE.md, PRD.md, feature files).

### `/gsr:build` Flow

1. Show available features from `docs/features/*.md` with status from STATE.md
2. User picks a feature
3. Ask mode: creative (human-in-the-loop) or systematic (agent-driven)
4. Execute against that specific feature file

---

## Plugin Architecture

### Repo Structure (Approach C)

```
build-right/
├── .claude-plugin/
│   ├── plugin.json              # plugin identity
│   └── marketplace.json         # marketplace registry
├── hooks/
│   ├── hooks.json               # SessionStart hook
│   └── session-start            # injects GSR command awareness
├── commands/
│   ├── scope.md                 # /gsr:scope → scope-shaping skill
│   ├── prd.md                   # /gsr:prd → prd-generation skill
│   ├── build.md                 # /gsr:build → build skill
│   ├── verify.md                # /gsr:verify → verification skill
│   └── learn.md                 # /gsr:learn → learn skill
├── skills/
│   ├── scope-shaping/
│   │   └── SKILL.md
│   ├── prd-generation/
│   │   └── SKILL.md
│   ├── build/
│   │   └── SKILL.md
│   ├── verification/
│   │   └── SKILL.md
│   └── learn/
│       └── SKILL.md
├── agents/                      # subagent role definitions
├── templates/                   # file generation templates
│   ├── claude-md.md
│   ├── state-md.md
│   ├── backlog-md.md
│   ├── techstack-md.md
│   ├── prd-md.md
│   ├── feature-md.md
│   └── scope-md.md
└── docs/
    └── design/                  # existing GSR specs (moved here)
        ├── vision.md
        ├── architecture.md
        ├── decisions.md
        ├── backlog.md
        ├── phases/
        └── research/
```

### Layer Responsibilities

- **Commands** — thin wrappers that invoke the corresponding skill
- **Skills** — workflow logic (the heavy content from phase specs)
- **Templates** — consistent file generation structures, adapted per project
- **Agents** — role definitions for subagents dispatched within skills
- **Hooks** — session-start injects command awareness into context

---

## Skill Responsibilities

### `scope-shaping/SKILL.md`
- Detects entry point: Start A (empty page) vs Start B (has materials from `/gsr:learn`)
- Start A: 7-step process (vision → competitive mapping → draft → prioritize → deep-dives → consistency audit → final review)
- Start B: assess scope.md quality, fill gaps or proceed
- Domain expertise adaptation
- Active assumption flagging, research area triaging
- Output: `docs/scope.md`

### `prd-generation/SKILL.md`
- Generates condensed PRD.md from template (~200-300 lines)
- Generates per-feature files from template (`docs/features/*.md`)
- Skills matching per feature via WebFetch to skills.sh
- Resolves research areas marked "blocking PRD"
- Auto-runs project init: creates CLAUDE.md, STATE.md, BACKLOG.md, techstack.md
- Output: PRD.md + feature files + project infrastructure

### `build/SKILL.md`
- Shows features with status, user picks one
- Asks mode: creative or systematic
- **Creative:** feature file + skills + CLAUDE.md → plan mode if >2 files → user reviews diffs → corrections → atomic commit → STATE.md update
- **Systematic:** task list with pass/fail → user approves → executes (subagents for independent tasks) → atomic commits → evidence
- Enforces skill loading from feature files

### `verification/SKILL.md`
- Reads PRD success criteria for the selected feature
- Automated checks (grep, tests, build, TS errors) — parallelizable via subagents
- Evidence-based report
- Lists items needing manual verification
- Appends results to STATE.md

### `learn/SKILL.md`
- Scans codebase: structure, tech stack, conventions, patterns
- Scans existing docs: README, specs, PRD-like documents
- Populates CLAUDE.md with references and conventions
- Produces assessment: what exists, what's missing, next step
- Output: CLAUDE.md + assessment

---

## Progress Tracking (STATE.md)

Two granularity levels — phases group related features:

```markdown
## Phase Progress

| # | Phase | Status |
|---|-------|--------|
| 1 | Core UI | in progress |
| 2 | Tracking & History | not started |

## Feature Progress (Phase 1: Core UI)

| Feature | Status | Mode | Tasks |
|---------|--------|------|-------|
| onboarding | done | creative | 4/4 |
| dashboard | in progress | creative | 2/6 |
```

Verification works at both levels — verify a feature or an entire phase.

---

## Plugin Metadata

### plugin.json
```json
{
  "name": "gsr",
  "version": "0.1.0",
  "description": "Get Shit Right — PRD-first, human-in-the-loop workflow for building production apps",
  "author": { "name": "Marcin Jarota" },
  "license": "MIT"
}
```

### hooks.json
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup|resume|clear|compact",
      "hooks": [{
        "type": "command",
        "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/session-start\"",
        "async": false
      }]
    }]
  }
}
```

Session-start hook injects awareness of `/gsr:*` commands. Detects if a GSR project is initialized (CLAUDE.md with GSR references, STATE.md). Does not auto-trigger skills.

---

## Key Design Decisions

1. **Standalone plugin** — no dependency on superpowers or other plugins
2. **Explicit commands** — no auto-triggering in MVP, testable in isolation
3. **Phase 1+2 merged** — `/gsr:prd` generates PRD + project init in one flow
4. **Per-feature build** — `/gsr:build` targets a specific feature within a build phase
5. **Cross-command awareness** — each skill tells user the next step, but doesn't auto-invoke
6. **Context clearing** — phases run in fresh context windows, state persists in files
7. **Subagents for parallelism** — independent tasks within phases use subagents, not agentic teams
8. **Templates as guides** — not rigid forms, skills adapt them to the project

---

## Open Questions (for implementation)

- "When is the project done?" signal — all features verified? Explicit user declaration?
- Agent definitions — what specific subagent roles are needed beyond research and systematic task execution?
- Skill prompt engineering — detailed SKILL.md content is implementation work
- How does `/gsr:learn` handle projects with partial GSR setup (e.g., has CLAUDE.md but no PRD)?
