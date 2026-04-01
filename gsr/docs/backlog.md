# GSR — Backlog

Open topics, questions, and ideas for discussion. Anyone can add items or respond.

---

## Open Topics (Need Decision)

## Ideas / To Discuss

### Terminal Visual Polish — Catch Up with GSD

**Context:** First user feedback (April 2026, vibe coder building imposition tool) directly compared GSR and GSD visual experience in the terminal. GSD has custom terminal rendering: colors, interactive option selectors, styled progress indicators, custom UI components. User said: "GSD robi niestety lepiej: kolorki, czytelny flow odpowiadania na pytania, daje 3 opcje lub wpisujesz swoją." and "UI mógłby być przyjaźniejszy."

**What GSD does that GSR can't (today):**
- Colored text output (section headers, warnings, success messages)
- Custom interactive option pickers (not just plan mode)
- Styled progress bars during agent work
- Visual grouping of question blocks with distinct styling
- Numbered option cards with click-to-select

**What GSR can do within Claude Code (implemented in v0.2 feedback fixes):**
- Decision gate pattern (plan mode with clickable options)
- Numbered questions with markdown formatting
- Visual separators (`---`) between reasoning and questions
- Tables instead of walls of text
- Shorter messages with less inline reasoning

**Gap:** Even with all Claude Code formatting tricks, GSR will look like a markdown terminal app. GSD looks like a custom TUI. This is a fundamental trade-off of being a Claude Code plugin (zero custom infra, low barrier to entry, works everywhere Claude Code works) vs. a standalone tool (full control over rendering, but much higher development cost).

**Future options to explore:**
1. Claude Code custom rendering API — if Anthropic ever exposes richer terminal output (ANSI colors, custom components), adopt immediately
2. Companion TUI wrapper — a thin shell around Claude Code that intercepts GSR output and applies styling (risky: fragile, version-dependent)
3. Claude Code hooks for output formatting — hooks currently trigger on tool calls; if they ever support output post-processing, use for styling
4. Accept the gap — focus on information architecture (what we show and when) rather than visual polish. A well-structured plain message beats a pretty but noisy one.

**Why this matters:** For vibe coders (non-technical users), visual clarity is not cosmetic — it's functional. They scan, not read. Colors and structure help them find decisions faster. This directly impacts the "user in control" promise.

---

## Resolved (moved to decisions.md)

- #1 CLAUDE.md + skills setup → Decision 12
- #2 Naming → Get Shit Right (GSR)
- #3 Command surface → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md). 5 commands: `/gsr:scope`, `/gsr:prd`, `/gsr:build`, `/gsr:verify`, `/gsr:learn`
- #5 Start B details → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md) (Decision 17: `/gsr:learn` mechanism) + Decision 24 (assessment criteria: foundations + feature clarity, deferred foundations with hard gate)
- #4 Done signals → Decision 16 (per-feature) + Decision 23 (project-level: all phases PASS + backlog triaged)
- #6 Sweep parallelization → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md) (Decision 18: subagents) + Decision 25 (file-level partitioning, two-phase execution)
- Agent definitions → `agents/implementer.md`, `agents/reviewer.md`, `agents/researcher.md`
- Partial GSR setup handling → `skills/learn/SKILL.md` Step 3 (handles no setup / partial / full)
