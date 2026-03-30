# Get Shit Right — Project Architecture

**How a GSR-managed project is structured.**

---

## Core Principle: Docs for Product, Code for Implementation

Documents and code serve different audiences and different purposes. When they overlap, information drifts — the doc says one thing, the code says another. GSR solves this with a clear separation:

| In documents (product knowledge) | In code (implementation) |
|---|---|
| What we're building and why | How it's implemented |
| User flows and business rules | Routes, endpoints, API contracts |
| Entity relationships (conceptual) | Table schemas, column types, migrations |
| Feature states (empty, error, loading) | Component logic |
| Design decisions and rationale | CSS, design tokens |
| Must-haves (truths, artifacts, key links) | Test cases |

**Documents describe what and why. Code describes how.** Documents reference code for implementation details — they don't duplicate it.

### The Reference Pattern

Instead of duplicating implementation details in docs, use references:

```markdown
## Data Model

### Entities and Relationships
User 1──* Dog (one user, one dog in MVP, many in v2)
Dog has: name, breed (text), age, weight, optional weekly goals
User has: default location, optional distance preferences, optional streak minimum

Goals are fully optional — the app works without them.
When goals are not set: dashboard shows raw stats, streak is inactive.

### Implementation Reference
Schema: `supabase/migrations/` (source of truth for types and fields)
```

The conceptual level (entities, relationships, business rules) is **stable** — it doesn't change when you rename a column or refactor a migration. The implementation level lives in code where it belongs. The doc **points to** the code, never duplicates it.

This is the same pattern Kacper used in Vitis with `docs/VITIS-DESIGN-SYSTEM.md` — the design system doc informed the CSS, it wasn't a copy of the CSS.

---

## The PM → Dev Handoff

GSR is designed for a workflow where **PM prepares product docs, dev executes**.

The PM's deliverables:
- `docs/scope.md` — vision, decisions, research areas (Phase 0)
- `docs/PRD.md` — condensed product knowledge (Phase 1)
- `docs/features/*.md` — per-feature specs (Phase 1)

The dev reads these docs and understands the product **without the PM explaining it**. Then reads the code for implementation. No external tools, no Confluence, no "ask the PM" — everything is in the repo.

Claude Code works the same way: reads CLAUDE.md for technical context, reads feature files for product context, reads code for implementation.

---

## Progressive Disclosure

Three layers, each adding detail. Claude (or a human) reads only what's needed:

```
CLAUDE.md (~50 lines, grows with corrections)
  ↓ points to
PRD.md (~200-300 lines, pure product knowledge)
  ↓ points to
docs/features/*.md (one per feature, ~300 lines max each)
```

---

## Project File Structure

```
project-root/
├── CLAUDE.md                   # Technical instruction manual
│                               # Conventions, learned rules, code references
│                               # Points to → docs/techstack.md, docs/PRD.md
│                               # NO skills mapping (skills live in feature files)
│
├── docs/
│   ├── PRD.md                  # Pure product knowledge (~200-300 lines)
│   │                           # What, for whom, why, how it works (user perspective)
│   │                           # High-level architecture (system diagram, not implementation)
│   │                           # Conceptual data model (entities + relationships, not schemas)
│   │                           # Feature index → points to features/*.md
│   │                           # Build phases (demo sentence + must-haves)
│   │
│   ├── scope.md                # Original vision document (from Phase 0)
│   │                           # Historical reference after PRD is generated
│   │
│   ├── techstack.md            # Stack, versions, tech decisions
│   │
│   ├── features/               # One file per feature (~300 lines max)
│   │   ├── dashboard.md        # Spec + skills + decisions
│   │   ├── discover.md         # Spec + skills + decisions
│   │   ├── tracking.md         # Spec + skills + decisions
│   │   ├── history.md          # Spec + skills + decisions
│   │   ├── onboarding.md       # Spec + skills + decisions
│   │   └── ...                 # One file per feature/screen
│   │
│   ├── STATE.md                # Progress tracker (~30 lines, never >50)
│   └── BACKLOG.md              # Deferred work
│
└── src/                        # Code = source of truth for implementation
    ├── schema.ts               # Data model (actual types, fields, constraints)
    ├── routes/                  # Routing (actual paths, guards)
    └── ...                     # Everything else
```

---

## What Goes Where

### CLAUDE.md (technical instruction manual)

The first thing Claude reads every session. Small, authoritative, grows organically.

**Contains:**
- Project name + one-line description
- **References** — where things live:
  - "Tech stack: `docs/techstack.md`"
  - "Product context: `docs/PRD.md`"
  - "Schema: `supabase/migrations/`"
  - "Routes: `src/router.tsx`"
  - "Design tokens: `src/index.css` @theme block"
- Code conventions (naming, folder structure, patterns)
- **Learned Rules** section (grows with every `/gsr:learn` correction, each dated)

**Does NOT contain:** Tech stack details (that's techstack.md), skills mapping (skills live in feature files), product knowledge (that's PRD.md), feature specs (that's features/), implementation details (that's code).

**Size:** Starts at ~30-40 lines. Grows to ~80-120 over the life of the project (mostly Learned Rules).

### PRD.md (pure product knowledge)

The "map" of the product — what we're building, for whom, why, and how it works from the user's perspective. A PM's deliverable to a dev.

**Contains:**
1. Project summary (what, for whom, why)
2. Business goals and success metrics
3. User personas
4. MVP scope and exclusions
5. High-level architecture (system diagram — boxes and arrows, not code)
6. Conceptual data model (entities, relationships, business rules — NOT schemas)
7. Feature index (table with links to `features/*.md`)
8. Non-functional requirements (performance targets, accessibility level)
9. Design direction (inspiration, color palette, mobile-first — NOT design tokens)
10. Build phases (ordered, typed creative/systematic, demo sentence, must-haves)
11. Research areas status

**Does NOT contain:**
- Tech stack, versions, dependencies (that's techstack.md)
- Table schemas, column types, migrations (that's code)
- Routes, endpoints, API contracts (that's code)
- Design tokens, CSS variables (that's code)
- Code conventions, folder structure patterns (that's CLAUDE.md)

**Size:** ~200-300 lines. If it grows past 400, something belongs in a feature file or in code.

### docs/features/*.md (product specs per feature)

One file per feature or screen. Everything a dev (human or AI) needs to understand what the feature should do — not how to implement it.

**Contains:**
- Feature name and purpose (one paragraph)
- User story / flow (what the user does, step by step)
- States: empty, partial, full, error, loading, offline
- Business rules and edge cases ("goals are optional — when not set, streak is inactive")
- Data needs at conceptual level ("needs user's weekly goal and this week's tracked km")
- UX description (layout intent, key interactions — not component names)
- **Must-haves** — Truths (observable behaviors), Artifacts (files that must exist with real implementation), Key Links (critical connections between parts). Defined at spec time, checked at verification time.
- **Don't Hand-Roll** (if relevant — proven libraries/services to use instead of building from scratch)
- **Known Pitfalls** (if relevant — common mistakes for this type of feature, with warning signs)
- **Skills** (which skills to load when implementing this feature — matched from skills.sh marketplace during PRD generation)
- Decision log (choices made during scope/PRD, with rationale)
- Related features (links to other feature files that interact)

**Does NOT contain:**
- Component names, CSS classes, implementation patterns (that's code)
- API call details, query structures (that's code)
- Schema field names, types (that's code)

**Skills matching flow** (during PRD generation):
1. Feature scope confirmed
2. System browses skills.sh via WebFetch for ideal skills for this feature
3. Compares with already installed skills (`.agents/skills/`)
4. Recommends missing skills for installation
5. Adds confirmed skills to the feature file's Skills section
6. If no marketplace skill exists for a technology → skip gracefully, note in feature file: "⚠️ No marketplace skill found for [tech] — rely on docs and learned rules"
7. During build, the workflow loads these skills automatically — Claude can't skip them

**Two layers of skills:**
- **Project-wide** (in `docs/techstack.md`) — skills that apply to every feature (e.g. `responsive-design` for mobile-first apps)
- **Feature-specific** (in each feature file) — skills unique to that feature's needs
- Workflow loads both: project-wide + feature-specific

Skills are **boosters, not blockers** — the system works without them. Niche tech patterns accumulate in CLAUDE.md Learned Rules through corrections over time.

**Size:** ~100-300 lines per file. If a feature file exceeds 300 lines, consider splitting into sub-features.

### docs/STATE.md (progress tracker)

Lightweight digest. Auto-updated after each task.

**Contains:**
- Current focus (phase + status)
- Phase progress table (# | Phase | Type | Status | Tasks done/total)
- Recent decisions (date + what + which file updated)
- Deferred items (captured during build)
- Phase verification records (appended when phases complete)
- Last session / next action

**Size:** ~30 lines. Never exceeds 50.

### docs/BACKLOG.md (deferred work)

Everything explicitly deferred.

**Contains:**
- Deferred from Scope (with why deferred + revisit trigger)
- Captured During Build (with context + priority)

---

## Why This Structure Works

### For the PM → Dev handoff
- PM creates PRD.md + feature files (product knowledge)
- Dev reads them, understands the product, implements from code
- No "ask the PM" needed — everything is in the repo
- Decisions are documented with rationale — dev understands not just what, but why

### For Claude (AI)
- **Task: "Build the dashboard"** → reads CLAUDE.md (skills, conventions) → reads `features/dashboard.md` (product spec) → reads code for current state → implements
- **No 1700-line document** — reads ~50 + ~300 lines per task
- **No stale information** — docs describe product intent, code describes implementation reality
- **References in CLAUDE.md** tell Claude where to find things in the codebase

### For the project
- **No drift** — docs and code don't duplicate each other, so they can't contradict
- **Self-documenting** — new team member reads PRD for overview, feature files for depth, code for implementation
- **"Confluence in the repo"** — no external tools needed
- **Feature-level ownership** — one person can own `features/tracking.md` without touching the rest
- **Decision archaeology** — every feature file has a decision log with rationale

---

## How Docs and Code Stay in Sync

The main risk: code references in CLAUDE.md break when files move.

Mitigations:
1. **CLAUDE.md references are high-level** — "Schema: `supabase/migrations/`" not "User table: `supabase/migrations/20260315_create_users.sql` line 42"
2. **Learned Rules catch drift** — when Claude discovers a reference is wrong, it becomes a `/gsr:learn` correction
3. **Feature files don't reference code** — they describe product behavior, not implementation. They can't go stale from a refactor.
4. **PRD.md is conceptual** — "User has many Dogs" doesn't change when you rename a column

The only document that can drift is CLAUDE.md (code references), and it's small enough (~50-150 lines) that drift is easy to catch and fix.

---

## How Features Are Created

During **PRD generation** (Phase 1):

1. Claude generates condensed PRD.md with feature index
2. For each feature in the index, Claude generates a `features/<name>.md` file
3. User iterates on individual feature files (easier to review than a monolith)
4. Each iteration updates one file, not the whole PRD

During **Build** (Phase 3):

5. Business rule discoveries get added to the feature file's decision log
6. Edge cases found during build get added to the feature file
7. Feature files evolve with the product — living product documentation
8. Implementation details stay in code — feature files never describe how, only what and why

---

## Relationship to scope.md

`docs/scope.md` is the **input** to PRD generation. It's the raw product vision from Phase 0.

After PRD.md and feature files are generated, scope.md becomes historical reference — "this is what we started with." PRD.md and feature files are the active documents during build.

```
Phase 0: scope.md (vision, decisions, research areas)
           ↓ feeds into
Phase 1: PRD.md (pure product) + features/*.md (per-feature specs)
           ↓ referenced during
Phase 3: Build (Claude reads CLAUDE.md + relevant feature file + code)
```
