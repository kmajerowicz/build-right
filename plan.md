# Build Right — How We Got Here

**The evolution from analysis to system design.**

---

## Phase 1: Analysis (What Exists)

### Kacper's Approach (PRD-First, Human-in-the-Loop)

Proven on Vitis-App — 98 commits, working MVP in ~2 days.

Three phases, all in Claude Code:
1. **Scope Shaping** — conversational, Claude as thinking partner
2. **PRD Generation** — scope + design refs → full technical PRD (~32k tokens)
3. **Build** — small tasks, plan mode, mandatory skills, aggressive correction, memory growth

Key mechanisms:
- CLAUDE.md as living instruction manual (~110 lines, grew organically)
- 8 mandatory skills (frontend-design, shadcn-ui, responsive-design, tailwind-design-system, vercel-react-best-practices, vitest, web-design-guidelines)
- Human reviews every diff — instant feedback loop
- Corrections compound across sessions via memory + CLAUDE.md

### GSD (Get Shit Done)

Used on pointer-adventure — 9 phases, 21 plans, ~10 sessions, 8,300 LOC. Result: app worked but looked generic, too many bugs, unhappy with quality.

Agent-orchestrated pipeline:
1. `/gsd:new-project` — agents question + research + generate requirements + roadmap
2. `/gsd:discuss-phase` — system identifies gray areas
3. `/gsd:plan-phase` — research + planner + checker agent loop
4. `/gsd:execute-phase` — parallel executor agents, fresh 200k context each
5. `/gsd:verify-work` — verifier agent checks goals

System: 12 agents, 50+ CLI commands, 28 templates, 100+ files.

### Why Kacper's Approach Won

| Dimension | Kacper's Way | GSD |
|-----------|-------------|-----|
| Product decisions | Human, before code | Agents, during execution |
| Design quality | Skills + human eye | No design context |
| Feedback loop | Instant (review every diff) | Delayed (verify after phase) |
| Context | Compounds (CLAUDE.md + memory) | Lost (fresh per executor) |
| Research | Targeted by human domain knowledge | Automated, broad, sometimes irrelevant |

### What GSD Did Better

1. **STATE.md** — structured progress tracking
2. **VERIFICATION.md** — grep-based evidence
3. **Atomic commits** per task (git bisect possible)
4. **Deferred work tracking** — explicit, not in human's head
5. **Systematic execution** — worked well for Vitis hardening sprint (17 requirements, 4 phases)

Full analysis: [your-approach-vs-gsd-report.md](your-approach-vs-gsd-report.md)

---

## Phase 2: Decisions Made During Scope Shaping

### Decision 1: Two entry points, not one

**What:** The system needs two starts — "Empty Page" (just an idea) and "Something Exists" (has materials).

**Why:** Real projects start differently. Vitis started with 3 client files. Psie Wędrówki started from scratch. Both need to converge into the same pipeline.

**Impact:** Commands and workflows must handle both entry points.

### Decision 2: Scope shaping follows a proven 7-step process

**What:** Extracted from the Psie Wędrówki scope-shaping session with Claude:

1. Vision intake (user dumps idea, Claude asks 3-5 questions)
2. Competitive mapping (proactive research)
3. First scope draft
4. Prioritization pass ("what's the 6-week version?")
5. Feature deep-dives (screen by screen, state by state)
6. Consistency audit (data model ↔ features, cascading optionality)
7. Final review (two-pass rule — done when neither finds issues)

**Why:** This process produced a scope document richer than GSD's entire planning stack. Proven on a real project.

**6 improvements baked in** (from retrospective):
- Edge cases earlier (empty/optional/day-0/cascading checklist per feature)
- Competitive mapping upfront (not ad-hoc)
- Challenge MVP scope harder ("what's the 6-week version?")
- Batch decisions, then update document (not mixed)
- Track assumptions from message 1
- User journey mapping (day 1/7/30) early

Source: [scope-shaping-meta-process.md](/Users/kacpermajerowicz/Downloads/scope-shaping-meta-process.md)

### Decision 3: Domain expertise adaptation

**What:** The system detects whether user is domain expert or domain-naive and adapts.

- Domain expert → Claude asks more questions, less research, more structure
- Domain naive → Claude does more research (parallel agents), more explanations

**Why:** Kacper is an experienced PM who knows his domain. But the system should also work for developers building in unfamiliar areas. Both are v1 target users.

### Decision 4: Research areas triaged into 3 tiers

**What:**
1. **Blocking scope** → resolve now (could kill the scope)
2. **Blocking PRD** → resolve during PRD generation (informs architecture)
3. **Blocking build** → flag in PRD, resolve when you get there (needs hands-on testing)

**Why:** Not all research is equal. Some can reshape the entire project (data source doesn't exist), some just informs a technical choice (which caching strategy), some you can only answer by trying.

### Decision 5: PRD is the single source of truth

**What:** No separate REQUIREMENTS.md, ROADMAP.md, or PROJECT.md. The PRD contains architecture, specs, build phases, and success criteria — all in one document.

**Why:** GSD splits context across 5+ documents. Executors read PLAN.md but miss holistic vision. One document means every task references the same foundation.

### Decision 6: Two build modes, zero config

**What:**
- **Creative** (human-in-the-loop) — for UI, design-sensitive, product decisions
- **Systematic** (agent-driven with verification) — for testing, i18n, accessibility, hardening

Selected by which command you use, not by a config toggle.

**Why:** GSD has config.json with 30+ toggles. Complexity for complexity's sake. The mode is obvious from the task type.

### Decision 7: 4 project artifacts, not 15

**What:**
```
CLAUDE.md       — living instruction manual
docs/scope.md   — vision, features, research areas
docs/PRD.md     — single source of truth
docs/STATE.md   — progress tracker (~30 lines)
docs/BACKLOG.md — deferred work
```

**Why:** GSD creates PROJECT.md + REQUIREMENTS.md + ROADMAP.md + STATE.md + config.json + CONTEXT.md + RESEARCH.md + PLAN.md + SUMMARY.md + VERIFICATION.md per phase. Managing artifacts becomes a job. Less is more.

### Decision 8: Parallelization wherever independent

**What:** Multiple agents for independent tasks — competitive research, research areas, systematic tasks, verification checks.

**Why:** Speed. User explicitly requested this. Constraint: all parallel agents share the same CLAUDE.md context.

### Decision 9: Corrections compound, not isolate

**What:** No fresh-context executors. CLAUDE.md Learned Rules section grows with every correction. Read before every task.

**Why:** GSD's biggest flaw — executor in phase 5 repeats the CSS grid mistake you corrected in phase 1. Corrections must persist.

---

## Phase 3: What's Still Open

| # | Topic | Why it matters |
|---|-------|---------------|
| 1 | CLAUDE.md + skills setup | How are skills installed and mapped during init? Auto-detected or user-configured? |
| 2 | Naming | "Build Right" is a working title |
| 3 | Command surface | 8 commands proposed — need validation |
| 4 | Done signals | When is a phase done? When is the project done? |
| 5 | Start B details | How exactly is quality evaluated when materials exist? |
| 6 | Sweep parallelization | How do parallel agents share CLAUDE.md context? |

---

## Document Map

| Document | What it is | Status |
|----------|-----------|--------|
| [scope.md](scope.md) | Full system scope — phases, flows, artifacts, principles | In progress (open topics remain) |
| [your-approach-vs-gsd-report.md](your-approach-vs-gsd-report.md) | Deep comparison of Kacper's approach vs GSD | Complete |
| [plan.md](plan.md) | This file — how we got here, decisions made, what's next | Living document |
