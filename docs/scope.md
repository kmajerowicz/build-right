# Build Right (BR) — System Scope

## Vision

A workflow system for Claude Code that formalizes how Kacper builds production apps — PRD-first, human-in-the-loop, skills-enforced — into reusable commands anyone can use. Takes the best structural elements from GSD (progress tracking, verification, atomic commits) without the overhead, agent-driven product decisions, or loss of human control.

**One sentence:** GSD's structure with Kacper's soul — the human makes all product decisions, the system tracks progress and enforces quality.

**Target users:**
- PMs / non-developers building apps with Claude Code (like Kacper)
- Developers who want structured workflow without enterprise overhead

---

## Two Entry Points

### Start A: Empty Page
User has nothing but an idea. The system helps shape it into a structured scope, then flows into PRD and build.

**Flow:** Idea → Scope Shaping → Scope.md → PRD → Build

### Start B: Something Exists
User has materials (client brief, scope doc, partial spec, existing codebase). The system maps what exists, assesses quality against what's needed, improves gaps or proceeds if ready.

**Flow:** Materials → Map & Assess → Improve or Proceed → PRD → Build

**After the entry point, both paths converge into the same pipeline:** PRD → Init → Build

---

## Phase 0: Scope Shaping

### What it does
Turns a raw idea (Start A) or existing materials (Start B) into a structured scope document.

### Start A: Empty Page Flow

Based on the proven 7-step process from Psie Wędrówki scope-shaping session, plus 6 improvements identified in retrospective:

**Step 1: Vision intake**
User dumps raw idea (conversational, unstructured is fine). Claude listens, asks 3-5 clarifying questions covering: target user, competitor landscape, tech constraints, MVP vs long-term.

The ideal opening message includes the **why** (pain points), the **what** (rough features), the **how** (tech preferences), and the **who** (target user). ~70% of core vision typically comes from the first message.

**Step 2: Competitive mapping** (parallelizable — agent)
Claude researches the primary competitor's UX. Maps features, identifies gaps, finds differentiation opportunities. Proactive, not waiting for user to ask "how does X handle this?"

**Step 3: First scope draft**
Claude produces a broad scope document. User reviews for major misalignments.

**Step 4: Prioritization pass**
"This is X months of work. What's the Y-week version?" Force every feature through MVP/v2/cut.

**Mandatory edge case checklist applied to every MVP feature:**
- What happens when it's empty?
- What happens when it's optional?
- What's the day-0 experience?
- What cascading effects does this have on other features?

**Step 5: Feature deep-dives**
Screen by screen, feature by feature. For each: what does the user see? What are the states (empty, partial, full)? What data does it need? What happens day 0?

**User journey mapping** asked early: "Who is the user on day 1, day 7, day 30?"

**Step 6: Consistency audit**
Full document review. Check: data model matches features, optional fields cascade correctly, empty states defined, research areas flagged, no promises without coverage.

**Step 7: Final review (two-pass rule)**
Both parties review. Scope is "done" when neither finds meaningful issues in two consecutive passes.

**Process rules:**
- Batch decisions, then update document (not mixed in same message)
- **Active assumption flagging** — throughout steps 1-6, Claude flags every unverified statement inline ("⚠️ assumes PTTK has digital data"). In step 6 (consistency audit), Claude does an explicit research sweep: collects all flagged assumptions and triages them (blocking scope / blocking PRD / blocking build). User can also flag research areas at any point.
- Claude drives ~70% through questions, user drives ~30% through corrections
- User's strongest contributions: corrections and domain expertise
- Claude's strongest contributions: structure, edge cases, "what happens when X is empty/missing"

### Domain Expertise Adaptation

The system detects whether user is domain expert or domain-naive and adapts:

**User knows the domain** (PM building in their area):
- Claude asks more questions, user corrects with domain insight
- Less research needed, more structure and edge cases
- Example: Kacper knew dogs, Claude provided structure

**User doesn't know the domain** (developer building in unfamiliar area):
- Claude does more research (parallel agents for competitive analysis, domain investigation)
- More "here's how this typically works" explanations
- Step 2 (competitive mapping) and Step 5 (deep-dives) are research-heavier

### Start B: Something Exists Flow

**Step 1: Intake**
Ask user to point to or paste all materials they have. No assumptions about what they should have — every project is different.

**Step 2: Map what exists**
Read all materials. Produce a summary: "You have X covering Y. Missing: Z."

Mapping is **adaptive, not checklist-based**. Don't ask about PWA push if it's not a mobile app. Don't ask about i18n if it's a single-market tool. Assess based on what the project actually is.

**Step 3: Assess quality**
Against what's needed for the project type: Do we understand the goal? The vision? The users? How the app works? What's in scope vs out?

The scope doesn't need to be super detailed — that's what PRD is for. It needs to be clear enough to start PRD generation.

**Step 4: Improve or proceed**
- If gaps are significant → enter scope shaping conversation to fill them (same steps 4-7 from Start A)
- If quality is good → proceed to PRD phase
- Some gaps can be deferred to PRD phase (more detail emerges there)

### Research Areas in Scope

During scope shaping, research areas are identified and triaged into three tiers:

1. **Blocking scope** → resolve now (parallel agent research). Things that could kill or reshape the scope. Example: "Does PTTK have digital data?" — if no, entire trail ingestion strategy changes.

2. **Blocking PRD** → resolve during PRD generation. Architecture-informing research. Example: "How does Mapbox offline work in PWA?"

3. **Blocking build** → flag in PRD, resolve when you get there. Things you can only answer by trying. Example: "Is Overpass API response time acceptable for real-time search?"

### Scope Output

`docs/scope.md` containing:
- Vision statement
- Navigation architecture (screens, flows)
- Core concepts (key differentiators)
- Data model (entity-level, field-level decisions where they matter)
- Empty states and edge cases (per screen)
- Research areas (triaged: blocking scope / blocking PRD / blocking build)
- v2 backlog (explicitly deferred, with why)
- Competitive positioning
- Resolved decisions (archive of choices made during scoping)

---

## Phase 1: PRD Generation

### What it does
Turns scope.md into a pure product PRD + per-feature specs — the product knowledge base for the entire project.

### How it works
- Input: scope.md + any design references (Figma, screenshots, design system .md)
- Claude generates condensed PRD.md (~200-300 lines) + individual feature files (`docs/features/*.md`)
- User iterates on individual feature files (easier to review than a monolith)
- **Research areas marked "blocking PRD"** are resolved here (parallel agents for independent research questions)
- PRD is **purely product** — no tech stack, no schemas, no routes. Those live in CLAUDE.md (tech context) and code (implementation).
- **Skills matching per feature:** When a feature scope is confirmed, the system searches skills.sh marketplace for ideal skills, compares with installed skills, recommends missing ones, and adds skill references to the feature file. This happens during PRD generation, not during build.

### Progressive disclosure structure

**PRD.md** (~200-300 lines, pure product knowledge) contains:
1. Project summary (what, for whom, why)
2. Business goals and success metrics
3. User personas
4. MVP scope and exclusions
5. High-level architecture (system diagram — boxes and arrows, not code)
6. Conceptual data model (entities, relationships, business rules — NOT schemas)
7. Feature index (table with links to `features/*.md`)
8. Non-functional requirements (performance targets, accessibility level)
9. Design direction (inspiration, color palette, mobile-first — NOT design tokens)
10. Build phases (ordered, typed creative/systematic, success criteria)
11. Research areas status

**Does NOT contain:** Tech stack, table schemas, routes, endpoints, design tokens, code conventions. Those live in CLAUDE.md (pointers + conventions) or in code.

**docs/features/*.md** (one per feature, ~300 lines max each) contains:
- Feature name, purpose, user flow
- States: empty, partial, full, error, loading, offline
- Business rules and edge cases
- Data needs at conceptual level ("needs user's weekly goal and this week's tracked km")
- UX description (layout intent, key interactions)
- **Skills** (which skills to load when implementing this feature — matched from marketplace)
- Decision log (choices + rationale)
- Related features (links to other feature files)

**Does NOT contain:** Component names, CSS classes, API call details, schema field names. Those are code.

Chain: `CLAUDE.md` → `PRD.md` → relevant `features/*.md` per task. Never 1700 lines at once.

Full details: [architecture.md](architecture.md)

### Build Phases within PRD
Each phase includes:
- Scope boundary (what's in, what's not)
- Type: `creative` (human-in-the-loop) or `systematic` (agent-drivable)
- Success criteria (how to verify it's done)
- Research dependencies (if any blocking-build research must happen first)
- Suggested task breakdown (refined during build)

### PRD + Features = Single Source of Truth
No separate REQUIREMENTS.md, ROADMAP.md, or PROJECT.md. PRD.md + feature files contain all of it.

---

## Phase 2: Project Initialization

### What it does
Creates the project tracking infrastructure from the PRD. One-time automated step.

### What it creates
- `CLAUDE.md` — living instruction manual (starter version with stack, skills mapping, conventions, empty Learned Rules section)
- `docs/STATE.md` — progress tracker (~30 lines, never >50)
- `docs/BACKLOG.md` — deferred work (from scope v2 section + captured during build)

### What it does NOT create
No config.json with 30 toggles. No separate ROADMAP.md. No .planning/ directory with nested phase folders. The PRD IS the roadmap and requirements.

---

## Phase 3: Build

Two modes, selected by which command you use:

### Mode A: Creative Build (human-in-the-loop)

**When:** UI components, screens, interactions, design-sensitive features — anything the user will see and judge.

**How:**
1. User gives a small, scoped task: "Build the dashboard (see `docs/features/dashboard.md`)"
2. System reads the feature file → loads skills listed in the feature's Skills section → reads relevant SKILL.md files
3. Claude reads CLAUDE.md (conventions, references, learned rules)
4. Plan mode if >2 files, direct implementation otherwise
5. User reviews every diff, tests in browser
6. User corrects → Claude asks "Add this to CLAUDE.md Learned Rules?"
7. Atomic commit after user approves
8. STATE.md auto-updates (task count incremented)

**Rules:**
- Claude always says "done, test it" or "still need X" — never "should work"
- Before saying done: code compiles, no TS errors, build passes
- Skills are enforced by the workflow (loaded from feature file), not by Claude remembering a rule

### Mode B: Systematic Build (agent-driven with verification)

**When:** Testing, i18n, accessibility, security hardening, performance — anything with clear pass/fail criteria and no design judgment.

**How:**
1. User describes the systematic task
2. Claude generates task list with pass/fail criteria
3. User approves the list (gate — nothing executes without approval)
4. Claude executes tasks (parallelizable where independent)
5. Atomic commit per task
6. Verification report with grep-based evidence
7. User spot-checks results

**Rules:**
- Agent reads CLAUDE.md and all accumulated corrections before starting
- If agent encounters ambiguity requiring product judgment → stops and asks, never decides autonomously
- Verification is evidence-based: grep results, test output, build status

### Task Classification Heuristic
If the task requires taste, empathy, or design judgment → creative (Mode A).
If it has clear pass/fail criteria and no design judgment → systematic (Mode B).

| Task Type | Mode | Why |
|-----------|------|-----|
| UI components | Creative | Taste, design quality |
| Screen layouts | Creative | Information density, feel |
| New features (first time) | Creative | Product decisions |
| Bug fixes | Creative | Root cause needs context |
| Testing | Systematic | Clear pass/fail |
| i18n | Systematic | Mechanical extraction |
| Accessibility | Systematic | Checklist-based |
| Security hardening | Systematic | Checklist-based |
| Refactoring | Systematic + human review | Pattern-based but verify nothing broke |

---

## Phase 4: Verification

### What it does
Verifies a completed phase against PRD success criteria.

### How it works
1. Claude reads PRD success criteria for the phase
2. Runs automated checks (grep, test suite, build, TypeScript errors)
3. Generates verification evidence
4. Lists items needing human verification ("open /dashboard, verify cards render correctly")
5. User does manual checks, marks pass/fail

### Where results live
Appended to STATE.md as phase completion record. No separate VERIFICATION.md files.

---

## Tracking & Artifacts

### Per-project file structure
```
project-root/
├── CLAUDE.md                   # Living instruction manual (grows with /br:learn)
├── docs/
│   ├── scope.md                # Original vision (from Phase 0, historical reference)
│   ├── PRD.md                  # Condensed product knowledge (~200-300 lines)
│   ├── features/               # One file per feature (~300 lines max)
│   │   ├── dashboard.md
│   │   ├── discover.md
│   │   ├── tracking.md
│   │   └── ...
│   ├── STATE.md                # Progress tracker (~30 lines)
│   └── BACKLOG.md              # Deferred work
```

Progressive disclosure, not a monolith. Full details: [architecture.md](architecture.md)

### STATE.md (lightweight, ~30 lines)
- Current focus (phase + status)
- Phase progress table
- Recent decisions (with date)
- Deferred items
- Last session / next action

### CLAUDE.md (grows organically)
- Starts at ~50 lines from template
- Grows with every `/br:learn` correction
- Contains: stack, skills mapping (MANDATORY), conventions, design system reference, Learned Rules section
- Read before every task

### BACKLOG.md
- Deferred from Scope (with revisit triggers)
- Captured During Build (with context + priority)

---

## Parallelization Principle

**Wherever tasks are independent, run them concurrently via multiple agents.** Specific opportunities:

- Competitive mapping + domain research during scope (Step 2)
- Multiple research areas during PRD (each question = separate agent)
- Codebase mapping in Start B
- Independent systematic tasks in sweep mode
- Verification checks (grep, tests, build — all independent)

**Constraint:** All parallel agents share the same CLAUDE.md context. They run concurrently but with the same instruction manual and accumulated corrections.

---

## Design Principles

1. **Human thinks, AI executes.** Product decisions are made by the human. Always.
2. **PRD is the constitution.** Every task traces back to a numbered section.
3. **Corrections compound.** CLAUDE.md + Learned Rules grow with every correction. No fresh-context executors.
4. **Track progress without managing it.** STATE.md updates automatically. Human never updates a spreadsheet.
5. **Two modes, zero config.** Creative = human-in-the-loop. Systematic = agent-driven. Selected by command, not toggle.
6. **Parallelize the independent.** Multiple agents for independent research/tasks. Sequential for dependent work.
7. **Adaptive, not prescriptive.** Mapping in Start B adapts to the project. Questions adapt to user's domain expertise. No hardcoded checklists for things that vary per project.

---

## Open Topics (Still Need Discussion)

1. **CLAUDE.md + skills setup** — How exactly are skills installed and mapped during init? Auto-detected from stack or user-configured?
2. **Naming** — "Build Right" is a working title. Final name TBD.
3. **Command surface** — 8 commands proposed. Need to validate each one is necessary and sufficient.
4. **Done signals** — When is a phase done? When is the whole project done? How does STATE.md reflect this?
5. **Start B details** — The "map and assess" flow needs more specifics on how quality is evaluated.
6. **Sweep parallelization details** — How exactly do parallel agents share CLAUDE.md context while running concurrently?
