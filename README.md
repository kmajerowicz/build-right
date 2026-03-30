# Get Shit Right (GSR)

A Claude Code plugin for building production apps — PRD-first, human-in-the-loop, skills-enforced.

**One sentence:** The human makes all product decisions. The system tracks progress and enforces quality.

---

## Why GSR

Building apps with Claude Code works. But without structure, you end up with:
- Product decisions made by the AI mid-build
- No record of what was built or why
- Corrections in session 3 that repeat in session 7
- "Should work" instead of verified evidence

GSR fixes this with a lightweight workflow: scope your idea, generate a PRD, build feature by feature, verify against criteria. Every correction compounds. Every decision is documented. Human stays in control.

---

## Install

```bash
claude plugin marketplace add https://github.com/kmajerowicz/get-shit-right
claude plugin install gsr
```

Or clone and install locally:

```bash
git clone https://github.com/kmajerowicz/get-shit-right
claude plugin marketplace add ./get-shit-right
claude plugin install gsr
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `/gsr:scope` | Shape an idea or existing materials into a structured scope document |
| `/gsr:prd` | Turn scope into PRD + feature files + project infrastructure |
| `/gsr:build` | Build a specific feature — creative (you review every diff) or systematic (agent-driven) |
| `/gsr:verify` | Verify a feature or phase with evidence — build passes, grep results, human checks |
| `/gsr:learn` | Index an existing codebase, populate CLAUDE.md, and get told what to do next |
| `/gsr:feedback` | Log a bug report, feature request, or change request to BACKLOG.md |
| `/gsr:status` | Show current phase, feature progress, next action, and blockers from STATE.md |
| `/gsr:update` | Update GSR to the latest version and reinstall hooks |

Each command tells you what to run next. Context clears between commands — state lives in files.

---

## Three Ways to Start

### Start A: You have an idea
```
/gsr:scope → /gsr:prd → /gsr:build → /gsr:verify
```

### Start B: You have materials (brief, notes, partial spec)
```
/gsr:learn → /gsr:scope (if gaps) or /gsr:prd → /gsr:build → /gsr:verify
```

### Start C: You have a running product, want to add a feature
```
/gsr:learn → /gsr:build → /gsr:verify
```

---

## How It Works

### Scope Shaping (`/gsr:scope`)
7-step process: vision intake → competitive mapping → first draft → prioritization → feature deep-dives → consistency audit → final review. Surfaces edge cases, "don't hand-roll" opportunities, and known pitfalls before a line of code is written.

### PRD Generation (`/gsr:prd`)
Turns scope into:
- `docs/PRD.md` — condensed product knowledge (200-300 lines, pure product — no schemas, no routes)
- `docs/features/*.md` — one file per feature with: user flow, states, business rules, must-haves, skills
- `CLAUDE.md` — technical instruction manual
- `docs/STATE.md` — progress tracker
- `docs/BACKLOG.md` — deferred work

Also matches skills from the marketplace per feature and runs a "don't hand-roll" sweep.

### Build (`/gsr:build`)
Pick a feature, pick a mode:

**Creative mode** (UI, design-sensitive work): You review every diff. Every correction gets asked "add to CLAUDE.md Learned Rules?" — so it never repeats. Corrections compound across sessions.

**Systematic mode** (testing, i18n, accessibility, hardening): Claude generates a task list with pass/fail criteria. You approve. Agents execute. Atomic commits with evidence.

Both modes enforce the gate function before every completion claim: build passes, TS clean, lint passes. Never "should work."

### Verification (`/gsr:verify`)
4-tier evidence ladder:
1. Automated — build, TypeScript, lint
2. Grep — anti-pattern sweep, key links, artifact checks
3. Tests — test suite execution
4. Human — only what Claude genuinely can't verify

Produces a structured report (Truths / Artifacts / Key Links / Anti-Patterns). Blockers must be resolved. Minors go to BACKLOG.md. Phase PASS when no blockers and human checks complete.

---

## What Your Project Looks Like After GSR

```
your-project/
├── CLAUDE.md                  # Technical instruction manual + Learned Rules
├── docs/
│   ├── PRD.md                 # Product knowledge (what, for whom, why)
│   ├── scope.md               # Original vision (historical after PRD)
│   ├── techstack.md           # Stack + project-wide skills
│   ├── features/
│   │   ├── dashboard.md       # Full spec: flow, states, rules, must-haves, skills
│   │   ├── onboarding.md
│   │   └── ...
│   ├── STATE.md               # Progress tracker (~30 lines)
│   └── BACKLOG.md             # Deferred work
└── src/                       # Code = source of truth for implementation
```

Documents describe **what and why**. Code describes **how**. No duplication, no drift.

---

## Design Principles

1. **Human thinks, AI executes** — Product decisions are made by the human. Always.
2. **Corrections compound** — CLAUDE.md Learned Rules grow with every correction. No fresh-context executors that repeat your mistakes.
3. **PRD is the constitution** — Every task traces back to a feature file.
4. **Evidence, not hope** — Every completion claim requires a command output. "Build passes (0 errors)" not "should work."
5. **Docs for product, code for implementation** — Documents reference code, never duplicate it.
6. **Explain every choice** — When presenting a decision, always explain options, product impact, and technical impact. Empower the user to decide.

---

## Hooks

GSR includes two terminal hooks that install automatically on first session start:

**Status line** — shows model, current focus, project name, context usage bar, and an update badge when a new version is available.

**Context monitor** — warns Claude (not you) when context is running low, so it finishes the current task cleanly before running out.

To install manually:

```bash
node ~/.claude/plugins/marketplaces/gsr/gsr/hooks/install.js
```

Restart Claude Code after installing.

## Updates

When a new version of GSR is available, the status line shows `⬆ /gsr:update`. Run that command to pull the latest version and reinstall hooks.

---

## Requirements

- Claude Code installed
- Git repository

---

## Author

Kacper Majerowicz & Marcin Jarota
