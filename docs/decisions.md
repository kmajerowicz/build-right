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

Full analysis: [research/analysis.md](research/analysis.md)

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

### Decision 13: Start C — GSR for existing products

**What:** GSR is not just for building from scratch. Start C introduces GSR into an existing product for building new features or developing functionality.

Flow: Codebase Onboarding → Feature Scope → Feature File → Build → Verify

- **Codebase Onboarding** (runs once per product) — map codebase, create CLAUDE.md + docs structure
- **Feature Scope** — same as Phase 0 but at feature level (goal, vision, user, why, what)
- **Feature File** — create docs/features/<name>.md with spec + skills
- **Build + Verify** — identical to Phases 3 and 4

**Why:** Most real work is adding features to existing products, not building from scratch. The good practices (feature files, skills, human-in-the-loop, verification) are equally valuable there. GSR adoption is gradual — no need to retroactively document everything, feature files build up over time.

**Impact:** Third entry point. Needs its own command. Vision.md updated from "Two Entry Points" to "Three Entry Points." New phase spec: `phases/0c-existing-product.md`.

---

## Phase 3: Plugin Architecture Decisions

### Decision 13: GSR becomes a standalone Claude Code plugin

**What:** GSR is packaged as a Claude Code plugin (`.claude-plugin/`) that anyone can install. No dependency on superpowers or other plugins. The `build-right` repo transforms into the plugin itself — existing design docs move to `docs/design/` as internal reference.

**Why:** The goal is to make GSR's workflow reusable. A plugin is the distribution mechanism Claude Code supports. Standalone means no install conflicts, no version coupling, and the plugin can be tested in isolation. The superpowers plugin was analyzed as an architecture reference — GSR follows the same patterns (skills, commands, hooks, agents) but owns its entire workflow.

**Impact:** Repo structure changes — adds `.claude-plugin/`, `hooks/`, `commands/`, `skills/`, `templates/`, `agents/` directories. Existing docs move to `docs/design/`.

### Decision 14: Explicit commands, no auto-triggering in MVP

**What:** 5 explicit commands: `/gsr:scope`, `/gsr:prd`, `/gsr:build`, `/gsr:verify`, `/gsr:learn`. User types the command to enter a phase. Skills do not auto-trigger based on context detection.

**Why:** Testability — each phase can be tested in isolation without triggering others. Predictability — user always knows which workflow is active. Superpowers evolved from commands to auto-triggering, proving commands-first is a valid starting point. Auto-triggering can be added later without breaking the command interface.

**Impact:** Each command is a thin wrapper (commands/*.md) that invokes the corresponding skill (skills/*/SKILL.md). Commands know what comes next and tell the user to clear context and run the next command.

### Decision 15: Phase 1 (PRD) + Phase 2 (Init) merged into `/gsr:prd`

**What:** `/gsr:prd` generates PRD.md + feature files AND creates project infrastructure (CLAUDE.md, STATE.md, BACKLOG.md, techstack.md) in one flow. No separate `/gsr:init` command.

**Why:** Phase 2 (init) is a mechanical step — generate 4 files from the PRD. There's no product decision or human judgment involved. Separating it into its own command adds friction without adding value. The user finishes PRD generation, the system creates the infrastructure, done. One context window, one command.

**Impact:** Phase specs remain as separate design docs (phases/1 and phases/2) for reference, but the plugin implements them as a single skill. The PRD skill suggests the user clears context and runs `/gsr:build` when complete.

### Decision 16: Build is per-feature, within build phases

**What:** `/gsr:build` shows available features from `docs/features/*.md` with their status from STATE.md. User picks a specific feature to build. STATE.md tracks progress at two granularity levels: phases (groups of related features, defined in PRD) and features (individual units of work).

**Why:** Features are the natural unit of work. "Build the dashboard" is more concrete than "execute build phase 2." But phases still matter — they group related features ("Core UI" contains onboarding + dashboard) and define the order of work. Both levels provide clear visibility into what's done and what's left.

**Impact:** STATE.md tracks both phase progress and per-feature progress within the active phase. Verification (`/gsr:verify`) works at both levels — verify a single feature or an entire phase.

### Decision 17: `/gsr:learn` is the Start B entry point

**What:** When a user has an existing project, they run `/gsr:learn` first. It scans the codebase (structure, tech stack, conventions, patterns), scans existing docs, populates CLAUDE.md with references and conventions, and produces an assessment: what exists, what's missing, and which command to run next.

**Why:** Start B ("Something Exists") was described conceptually in the design docs but lacked a concrete mechanism. `/gsr:learn` fills that gap — it's the bridge between an existing codebase and the GSR workflow. It also serves ongoing projects: re-run it when the codebase has changed significantly.

**Impact:** Start B flow becomes: `/gsr:learn` → assessment → `/gsr:scope` (if scope needed) or `/gsr:prd` (if scope exists). The learn skill is also referenced in architecture.md line 132 where `/gsr:learn` is mentioned for Learned Rules — that usage is separate (corrections during build) from this usage (initial project indexing).

### Decision 18: Subagents for parallelism, not agentic teams

**What:** Independent tasks within phases (competitive research, systematic build tasks, verification checks) use subagents dispatched by the skill. Not Claude Code agentic teams.

**Why:** Agentic teams are experimental, higher cost (each is a full session), and overkill for GSR's parallelization needs. GSR's parallel tasks are independent and report-back — subagents fit perfectly. Each phase is a separate skill with dependencies between them, not a team that needs coordination. Agentic teams could be revisited for Phase 0 research gathering if subagents prove insufficient.

**Impact:** Resolves backlog item #6 (sweep parallelization). Systematic build mode dispatches subagents for independent tasks. Verification dispatches subagents for independent checks (grep, tests, build, TS errors).

### Decision 23: Done signals — phase done and project done (completes Decision 16)

**What:** Two levels of "done," both with clear mechanical checks. Completes the project-level done signal left open by Decision 16 (per-feature done).

**Build phase done** when all 3 conditions are met:
1. **Verification report has no Blockers** — anti-patterns with severity Blocker must be resolved before the phase can be marked PASS. Minor items move to BACKLOG.md.
2. **UAT checklist verified by human** — the verification report includes a UAT checklist: plain-language steps with expected outcomes (e.g., "Go to /login, enter credentials → Dashboard loads with user name visible"). Each item is a "do → expect" pair, not a vague prompt. Claude generates the checklist from phase requirements; human marks each item pass/fail.
3. **All HUMAN-tier items resolved** — verification ladder tier 4 items (things Claude can't verify) have been checked by the human and marked pass/fail.

Phase status flow: `NOT STARTED` → `BUILDING` → `VERIFYING` → `PASS` or `BLOCKED`
- `BLOCKED` means verification found Blockers — resolve them (they become tasks in the current phase), then re-verify.

**Project done** when all 3 conditions are met:
1. **All build phases PASS** — every phase has a verification report with no Blockers.
2. **Backlog triaged** — after the last phase, human reviews BACKLOG.md and categorizes every item: "must before launch" / "v2" / "won't do."
3. **Nothing in "must before launch"** — if any items are "must before launch," they become a new build phase. Project is done only when that phase also passes.

Project status flow: `IN PROGRESS` → `BACKLOG TRIAGE` → `DONE`
- `BACKLOG TRIAGE` triggers automatically after the last planned phase passes.

**STATE.md changes:**
- Add top-level `Project Status` field (IN PROGRESS / BACKLOG TRIAGE / DONE)
- Phase progress table adds `Verification` column showing PASS date or BLOCKED
- Phase statuses: NOT STARTED / BUILDING / VERIFYING / PASS / BLOCKED

**Why:** Decision 16 resolved per-feature done signals but left "when is the whole project done?" open. The answer: (1) explicit Blocker vs Minor severity rule for phase completion, (2) backlog triage after all phases (deferred work needs a decision — can't call a project "done" while ignoring it), (3) STATE.md reflects both levels.

**Impact:** Changes Phase 4 (Blocker = not done, Minor = BACKLOG.md), architecture.md (STATE.md format updated), Phase 2 (project init creates STATE.md with new format).

---

## Phase 3b: Process Detail Decisions

_Decisions adding process depth to the phase specs — verification structure, feature file sections, build phase requirements._

### Decision 20: Structured verification — Truths / Artifacts / Key Links / Anti-Patterns

**What:** Verification (Phase 4) uses a structured, mechanically checkable format instead of a flat checklist. Four categories:

- **Truths** — Observable behaviors ("user can sign up"). Checked by running commands or reading output.
- **Artifacts** — Files that must exist with real implementation, not stubs. Checked by file existence, line count, exports.
- **Key Links** — Connections between components (imports, API calls). Checked by grep.
- **Anti-Patterns** — Stubs, TODOs, hardcoded values, mock data in production code. Checked by grep sweep.

Plus a **verification ladder** — try the strongest automated check first: Static → Command → Behavioral → Human (only when Claude can't verify itself).

Must-haves (Truths/Artifacts/Key Links) are defined at spec time in feature files and PRD build phases, then checked at verification time in Phase 4. Same structure, defined once, verified once.

**Why:** GSR's original Phase 4 was "grep + manual checks" without structure. It didn't catch stubs (file exists but is placeholder), broken wiring (components exist but aren't connected), or anti-patterns (console.log replacing real functionality). The verification ladder also reduces unnecessary human checks — Claude tries automated verification first.

**Source:** Adapted from GSD 2's must-haves verification model (Truths/Artifacts/Key Links format + verification ladder + anti-pattern sweep). Adapted to GSR by: keeping must-haves at product level in feature files (no file paths or line counts in specs), checking implementation details only during verification.

**Impact:** Changes Phase 1 (feature files get Must-haves section), Phase 4 (structured report format + verification ladder + anti-pattern sweep), architecture.md (feature file description updated).

### Decision 21: "Don't Hand-Roll" sweep + Known Pitfalls

**What:** During scope shaping (Phase 0, Step 2) and PRD generation (Phase 1), the system proactively identifies:

1. **Don't Hand-Roll** — For each technical need in a feature (auth, payments, email, etc.), check if a proven library/service already solves it. Results go into the feature file as a table: Need | Don't Build | Use Instead | Why.

2. **Known Pitfalls** — For features involving complex/risky technical territory, surface common mistakes: what goes wrong, why, how to avoid, warning signs.

Both are optional sections in feature files — only included when relevant.

**Why:** Prevents the most expensive mistakes: (1) building something that exists as a mature solution, and (2) falling into known traps. Particularly valuable for the target user "PM / non-developer" who doesn't know what's available in the ecosystem. Complements skills matching — skills are tools for Claude, don't-hand-roll is tools for the code.

**Source:** Adapted from GSD 2's research template ("Don't Hand-Roll" table + "Common Pitfalls" sections). Adapted to GSR by: moving from a separate research artifact into feature files (no new files), making both sections optional, running the sweep in parallel with competitive mapping and skills matching.

**Impact:** Changes Phase 0 (Step 2 expanded, Step 5 pitfalls added), Phase 1 (feature files get Don't Hand-Roll + Known Pitfalls sections).

### Decision 22: Demo sentence per build phase

**What:** Every build phase in the PRD must have a **demo sentence** — one line stating what the user can see or do after this phase completes.

```
**Demo:** User can start a walk, see it tracked in real-time, and view stats on the dashboard.
```

If you can't write a demo sentence, the phase is too abstract and should be restructured.

The demo sentence becomes the first human verification item in Phase 4 ("open app, verify: [demo sentence]").

**Why:** Build phases had "success criteria" — technically correct but not user-facing. A PM/user understands "after this phase I can log in and see my dashboard" better than "auth service exports generateToken, verifyToken." Forces phases to deliver user-visible progress. Also serves as a sanity check: phases that can't be demoed are probably scoped wrong.

**Source:** Adapted from GSD 2's "demo sentence" per slice (`> After this: what the user can demo when this slice is done`). Adapted to GSR by: adding to PRD build phases (not a separate artifact), connecting to Phase 4 as the first human verification item.

**Impact:** Changes Phase 1 (build phases require Demo field), Phase 4 (demo sentence is first human check).

### Decision 24: Start B — how quality is evaluated and what triggers improve vs proceed (details for Decision 17)

**What:** Start B assesses materials on two dimensions — not document quality, but information completeness:

**1. Project foundations** (same 5 from Start A Step 1):
Goal, Vision, Target user, Why, What it does.

**2. Feature clarity** — can we list the product's features and roughly understand what each does? Not detailed specs (that's PRD generation), just enough to know what exists. Features map to functional and non-functional requirements — if client materials describe screens, Claude extracts the underlying features from them.

**Assessment mechanism:** After mapping materials (Step 2), Claude produces a structured assessment table:
- Each foundation: `✓ clear` (with evidence from materials) or `⚠️ unclear` (with what's missing)
- Each feature: source, and whether it's ready for PRD generation
- Verdict: PROCEED or IMPROVE (with specific gaps listed)

**Proceed when:**
- All 5 foundations are clear
- Feature list is known with enough context for PRD generation

**Improve when:**
- Any foundation is missing or ambiguous
- Can't list the features
- Materials contradict each other (contradictions = gap)

**Deferred foundations — queue, don't block:**
- If user doesn't answer a foundation question, Claude marks it `⚠️ unclear`, suggests its best answer, and continues working
- As Claude gathers more context (feature deep-dives, mapping), it returns to unclear items with informed suggestions: "Based on what you described about X, I think the target user is Y — correct?"
- **Hard gate before PRD generation:** all 5 foundations must be `✓ clear`. If anything remains `⚠️ unclear`, Claude returns to it with a suggestion grounded in the context gathered so far

**Improve path is targeted:**
- Enters Start A steps 4-7 but only for identified gaps — doesn't restart scope shaping from scratch
- Foundations are resolved conversationally (they're decisions)
- Features are resolved document-based (Claude drafts from materials, user corrects)

**Assessment is adaptive:**
- Doesn't check for things the project doesn't need (no i18n check for single-market tool, no PWA check for desktop app)
- Checks information, not format — works for client briefs, Figma files, meeting notes, partial specs, or existing codebases

**Why:** Decision 17 (`/gsr:learn` as Start B entry) defined the mechanism but not the assessment criteria. This adds: (1) what "quality" means (foundations + feature clarity), (2) the proceed/improve threshold, (3) the deferred foundations pattern (queue gaps, don't block, hard gate before PRD).

**Impact:** Changes Phase 0 (Start B steps 2-4 get structured assessment format + deferred foundations pattern).

### Decision 25: Sweep parallelization — worktree isolation + file partitioning (details for Decision 18)

**What:** Parallel agents in systematic mode (Mode B) are coordinated through two layers: (1) git worktrees for hard isolation — each agent works in its own worktree, (2) file-level partitioning as the coordination strategy to minimize merge conflicts. Partitioning is enforced at task assignment time.

**Three-phase execution:**

**Phase 1 — Parallel (agents in worktrees):** Each agent spawns in its own git worktree and gets a sweep brief (CLAUDE.md content, relevant feature file, explicit constraints). File partitioning tells agents which files are theirs — worktrees ensure that even if an agent touches an unexpected file, it can't corrupt another agent's work.

**Phase 2 — Sequential merge:** Worktrees are merged back one at a time (not all-at-once). Sequential merge makes conflicts easy to spot and resolve. If file partitioning held, merges are clean.

**Phase 3 — Wiring (single Claude):** After all worktrees are merged, one pass handles:
- Shared files (indexes, configs, wiring imports)
- Consistency check (same conventions across all agent output)
- Atomic commits for the wiring

**Small sweep shortcut:** For ≤2 agents on a handful of files, worktrees are overhead. Use shared filesystem with file partitioning only. Worktrees kick in at ≥3 agents or when the sweep touches ≥10 files.

**Sweep brief:** Snapshot of shared context given to every agent:
- CLAUDE.md conventions + learned rules
- Relevant feature file(s)
- Explicit constraints for the sweep (e.g., "translate to Polish, formal 'Pan/Pani', keys in camelCase")
- Task assignment with file boundaries

**Parallelization heuristic:** If you can draw a task → file mapping where no file appears twice → parallelize. If not → sequential.

**Parallelize:**
- i18n (per screen — each screen's files are independent)
- Testing (per feature — each test file is independent)
- Accessibility audit (per component)
- Security headers (per route)

**Don't parallelize:**
- Refactoring (changes cascade across files)
- Shared state changes (same reducer, same store)
- Cross-file dependencies (agent A creates util, agent B needs it)

**Why:** Decision 18 resolved the "what mechanism" (subagents, not agentic teams). This resolves the "how exactly" — worktrees for isolation safety (feedback from CR), file partitioning for conflict avoidance, and when NOT to parallelize.

**Impact:** Changes Phase 3 (systematic build parallelization section updated with three-phase execution model + worktree isolation + partitioning heuristic).

---

### Decision 26: Iron Law enforcement pattern — borrowed from superpowers

This is a META-PATTERN applied across all GSR skills to prevent Claude from rationalizing its way out of critical rules. Inspired by the superpowers plugin's enforcement approach.

**What:** Every critical rule in GSR skills gets three layers of enforcement:
1. **The Rule** — stated clearly, non-negotiable
2. **Red Flags table** — thoughts/rationalizations that mean STOP (e.g., "this is too simple to need review" = red flag)
3. **Common Rationalizations table** — maps excuses to reality (e.g., "I'll come back to it later" → "You won't. Do it now.")

**Why:** GSR already has good rules ("user reviews every diff", "never say should work", "corrections compound"). But Claude can rationalize skipping any rule. Superpowers proved that explicit rationalization tables dramatically reduce rule violations. The pattern costs zero user friction — it's instructions for Claude, invisible to the user.

**How applied:** Each GSR skill (scope-shaping, prd-generation, build, verification, learn) includes enforcement sections for its critical rules. Not every rule needs enforcement — only the ones that Claude is likely to skip under pressure.

**Impact:** No changes to user flow. No new commands. No new artifacts. Skills become more robust internally.

Reference: [patterns/iron-law-enforcement.md](patterns/iron-law-enforcement.md)

---

## Phase 4: What's Still Open

| # | Topic | Status |
|---|-------|--------|
| 4 | Done signals (project-level) | **Resolved** — Decision 23. Phase done = verification PASS (no Blockers) + demo verified + HUMAN items resolved. Project done = all phases PASS + backlog triaged + nothing "must before launch." |

---

## Document Map

| Document | What it is | Status |
|----------|-----------|--------|
| [vision.md](vision.md) | What GSR is, principles, phase overview | Complete — updated for plugin decisions |
| [phases/0-scope-shaping.md](phases/0-scope-shaping.md) | Phase 0 spec | Complete (updated: don't-hand-roll in Step 2, pitfalls in Step 5) |
| [phases/1-prd-generation.md](phases/1-prd-generation.md) | Phase 1 spec | Complete (updated: must-haves, demo sentence, don't-hand-roll, pitfalls) |
| [phases/2-project-init.md](phases/2-project-init.md) | Phase 2 spec (merged into Phase 1 — Decision 15) | Complete |
| [phases/3-build.md](phases/3-build.md) | Phase 3 spec | Complete — updated for per-feature build |
| [phases/4-verification.md](phases/4-verification.md) | Phase 4 spec | Complete — updated for per-feature verification |
| [architecture.md](architecture.md) | How GSR projects are structured | Complete — updated for per-feature STATE.md |
| [research/analysis.md](research/analysis.md) | Kacper's approach vs GSD comparison | Complete |
| [plans/2026-03-15-gsr-plugin-design.md](plans/2026-03-15-gsr-plugin-design.md) | Plugin architecture design | Complete |
| [decisions.md](decisions.md) | This file — decisions made, what's next | Living document |
