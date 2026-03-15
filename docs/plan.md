# Get Shit Right — How We Got Here

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

Full analysis: [analysis.md](analysis.md)

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

### Decision 10: Progressive disclosure — PRD splits into condensed PRD + feature files

**What:** Instead of a monolithic PRD (~1700 lines), the system uses:
- `PRD.md` (~200-300 lines) — condensed product knowledge, architecture, data model, phase plan
- `docs/features/*.md` (one per feature, ~300 lines max) — full spec per screen/feature

Chain: `CLAUDE.md` → `PRD.md` → `features/*.md`

**Why:** Claude never reads the whole PRD — it jumps to the relevant section. Separate files make this explicit. Also creates a self-documenting project ("confluence in the repo") where any team member (human or AI) can understand a feature by reading one file.

**Impact:** Changes PRD generation (Phase 1) — Claude generates condensed PRD + individual feature files. Changes build (Phase 3) — Claude reads CLAUDE.md + one feature file per task, not 1700 lines.

**Source:** Conversation with collaborator (megaczlowiekkappa9). Full rationale in [architecture.md](architecture.md).

### Decision 11: Docs for product, code for implementation — reference pattern

**What:** Documents describe **what and why** (product knowledge). Code describes **how** (implementation). Documents never duplicate what the code says — they reference it instead.

- PRD.md is purely product: what, for whom, why, user perspective. No tech stack, no schemas, no routes.
- CLAUDE.md keeps technical context: stack, conventions, and **references to where things live in code** ("Schema: `supabase/migrations/`").
- Feature files describe product behavior and business rules, never implementation details.
- Conceptual data model in docs ("User has many Dogs, goals optional") — stable, doesn't drift with column renames.
- Implementation-level details (schemas, routes, tokens) live only in code.

**Why:** Two problems solved at once:
1. **Drift** — when docs duplicate code, they diverge. Docs say one thing, code says another. References can't go stale from a refactor (conceptual level is stable).
2. **PM → dev handoff** — PM creates product docs (PRD + features/). Dev reads them to understand the product, reads code for implementation. Everything in repo, no external tools, no "ask the PM."

**Source:** Conversation with collaborator (megaczlowiekkappa9) + Kacper's insight about handoff workflow and Vitis design system reference pattern.

### Decision 12: Skills live in feature files, enforced by workflow — not CLAUDE.md

**What:** Skills mapping moves from CLAUDE.md (a rule Claude should follow) to feature files (loaded by the workflow automatically). Each feature file has a Skills section listing which skills to load during implementation.

During PRD generation, when a feature scope is confirmed:
1. System searches skills.sh marketplace for ideal skills (not just what's installed)
2. Compares with installed skills, recommends missing ones
3. Adds confirmed skills to the feature file

During build, the workflow loads skills from the feature file — Claude can't skip them.

**Why:** Three problems solved:
1. **Enforcement** — In Vitis, Claude ignored skills without the word "MANDATORY." Moving enforcement from a document rule to the workflow itself makes it impossible to skip.
2. **Per-feature granularity** — Different features need different skills. Dashboard needs design skills, tracking might need offline/PWA skills. Feature-level assignment is more precise than a global mapping table.
3. **Marketplace-first** — System checks skills.sh for what's ideal, not just what's installed. Like buying the right shoes, not fitting from your closet.

**Impact:** CLAUDE.md becomes leaner (~30-40 lines) — just conventions, references, and learned rules. Tech stack moves to `docs/techstack.md`. Skills mapping removed entirely.

### Decision 12a: Skills — resolved sub-questions

**Skills.sh access:** Claude browses skills.sh via WebFetch during PRD generation. Workflow instruction includes the skills.sh link. No API dependency.

**Missing skills for niche tech:** Skip gracefully. Feature file notes "⚠️ No marketplace skill found for [tech]." Skills are boosters, not blockers. Niche tech patterns accumulate in CLAUDE.md Learned Rules through corrections over time.

**Per-feature + project-wide:** Two layers:
- `docs/techstack.md` lists project-wide skills (e.g. `responsive-design` for any mobile-first app)
- Each feature file lists feature-specific skills
- Workflow loads both: project-wide + feature-specific

**Research area identification in scope:** Claude actively flags assumptions throughout scope shaping (steps 1-6) with inline markers. During step 6 (consistency audit), Claude does an explicit research sweep — collecting all flagged assumptions and triaging them (blocking scope / blocking PRD / blocking build). User can also flag research areas at any point.

---

## Phase 3: What's Still Open

| # | Topic | Status |
|---|-------|--------|
| 1 | CLAUDE.md + skills setup | **Resolved** — Decision 12. Skills in feature files, enforced by workflow. CLAUDE.md = conventions + references + learned rules. Tech stack in techstack.md. |
| 2 | Naming | **Resolved** — Get Shit Right (GSR). Commands: `/gsr:*` |
| 3 | Command surface | Open — define last, after process is clear |
| 4 | Done signals | Open |
| 5 | Start B details | Open |
| 6 | Sweep parallelization | Open |

---

## Document Map

| Document | What it is | Status |
|----------|-----------|--------|
| [scope.md](scope.md) | Full system scope — phases, flows, artifacts, principles | In progress (open topics remain) |
| [analysis.md](analysis.md) | Deep comparison of Kacper's approach vs GSD | Complete |
| [architecture.md](architecture.md) | How GSR projects are structured (PRD, features/, CLAUDE.md) | In progress |
| [plan.md](plan.md) | This file — how we got here, decisions made, what's next | Living document |
