# Build Right — Project Architecture

**How a BR-managed project is structured.**

---

## The Problem with Monolithic PRDs

The original Vitis PRD was ~32k tokens (~1700 lines). In practice, Claude never read the whole thing — it jumped to the relevant section ("implement section 10.2"). This works, but:

- Large files are slow to parse and easy to lose context in
- Updating one feature means touching a massive document
- No clear ownership — who "owns" the dashboard spec vs the auth spec?
- New team members (human or AI) face a wall of text

## Progressive Disclosure

Inspired by how CLAUDE.md works best — a small document that points to deeper context — BR projects use a layered architecture:

```
CLAUDE.md (~50 lines, grows with corrections)
  ↓ points to
PRD.md (~200-300 lines, condensed product knowledge)
  ↓ points to
docs/features/*.md (one per feature, ~300 lines max each)
```

Each layer adds detail. Claude reads what it needs for the current task, not everything.

---

## Project File Structure

```
project-root/
├── CLAUDE.md                   # Living instruction manual
│                               # Stack, skills mapping, conventions, learned rules
│                               # Points to → PRD.md for product context
│
├── docs/
│   ├── PRD.md                  # Condensed product knowledge (~200-300 lines)
│   │                           # Architecture, data model, stack, phase plan
│   │                           # Points to → features/*.md for details
│   │
│   ├── scope.md                # Original vision document (from Phase 0)
│   │                           # Kept as historical reference
│   │
│   ├── features/               # One file per feature (~300 lines max)
│   │   ├── dashboard.md        # Full spec: states, data, edge cases, decisions
│   │   ├── discover.md         # Full spec: map, search, filters
│   │   ├── tracking.md         # Full spec: GPS, offline, states
│   │   ├── history.md          # Full spec: list, stats, filters
│   │   ├── onboarding.md       # Full spec: steps, optional fields, flow
│   │   └── ...                 # One file per feature/screen
│   │
│   ├── STATE.md                # Progress tracker (~30 lines, never >50)
│   └── BACKLOG.md              # Deferred work
```

---

## What Goes Where

### CLAUDE.md (the instruction manual)

The first thing Claude reads every session. Small, authoritative, grows organically.

**Contains:**
- Project name + one-line description
- Tech stack (with versions)
- Reference: "Product context → `docs/PRD.md`"
- Skills mapping table (MANDATORY — which skill to read per task type)
- Code conventions (naming, folder structure, patterns)
- Design system reference
- **Learned Rules** section (grows with every `/br:learn` correction, each dated)

**Does NOT contain:** Feature specs, architecture diagrams, data model details. Those live in PRD.md and features/.

**Size:** Starts at ~50 lines. Grows to ~100-150 over the life of the project.

### PRD.md (condensed product knowledge)

The "map" of the product. Enough to understand the whole system, with pointers to feature files for depth.

**Contains:**
1. Project summary (what, for whom, why)
2. Business goals and success metrics
3. User personas
4. MVP scope and exclusions
5. System architecture (ASCII diagram)
6. Project structure (file tree)
7. Data model (schemas, relationships)
8. Feature index (table with links to `features/*.md`)
9. Non-functional requirements
10. Design system reference
11. Build phases (ordered, typed creative/systematic, success criteria)
12. Research areas status

**Does NOT contain:** Detailed per-screen specs, state descriptions, edge cases per feature. Those live in feature files.

**Size:** ~200-300 lines. Condensed. If it grows past 400, something belongs in a feature file.

### docs/features/*.md (feature specs)

One file per feature or screen. The complete specification — everything Claude needs to implement or modify that feature.

**Contains:**
- Feature name and purpose (one paragraph)
- User story / flow (what the user does, step by step)
- States: empty, partial, full, error, loading, offline
- Data requirements (which tables/fields, what API calls)
- UI description (layout, components, interactions)
- Edge cases and business rules
- Decision log (choices made during scope/PRD, with rationale)
- Related features (links to other feature files that interact)
- PRD section reference (which PRD section this expands)

**Does NOT contain:** Architecture decisions, data model definitions, stack choices. Those live in PRD.md.

**Size:** ~100-300 lines per file. If a feature file exceeds 300 lines, consider splitting into sub-features.

### docs/STATE.md (progress tracker)

Lightweight digest of where the project is. Auto-updated after each task.

**Contains:**
- Current focus (phase + status)
- Phase progress table (# | Phase | Type | Status | Tasks done/total)
- Recent decisions (date + what + which file updated)
- Deferred items (captured during build)
- Phase verification records (appended when phases complete)
- Last session / next action

**Size:** ~30 lines normally. Never exceeds 50. If it grows, old verification records can be archived.

### docs/BACKLOG.md (deferred work)

Everything explicitly deferred — from scope's v2 section and from things captured during build.

**Contains:**
- Deferred from Scope (with why deferred + revisit trigger)
- Captured During Build (with context where it came up + priority)

---

## Why This Structure Works

### For Claude (AI)
- **Task: "Build the dashboard"** → Claude reads CLAUDE.md (skills, conventions) → reads `features/dashboard.md` (full spec) → implements. Never reads 1700 lines.
- **Task: "Add a field to the data model"** → Claude reads PRD.md (data model section) → updates schema → updates relevant feature files.
- **Progressive context loading** — only reads what's needed, keeps context window clean.

### For Humans
- **New team member** → reads PRD.md for overview, then feature files for depth. Self-documenting project.
- **PM reviewing progress** → reads STATE.md (30 lines) for status, feature files for specs.
- **Decision archaeology** → every feature file has a decision log. "Why did we make goals optional?" → check `features/dashboard.md` decision log.

### For Collaboration
- **"Confluence in the repo"** — no external docs needed, everything lives with the code.
- **Feature-level ownership** — one person can own `features/tracking.md` without touching the rest.
- **Easy to review** — PR changes one feature file, reviewer reads one file for context.

---

## How Features Are Created

During **PRD generation** (Phase 1):

1. Claude generates the condensed PRD.md with feature index
2. For each feature in the index, Claude generates a `features/<name>.md` file
3. User iterates on individual feature files (easier to review than a monolith)
4. Each iteration updates one file, not the whole PRD

During **Build** (Phase 3):

5. Implementation decisions get added to the feature file's decision log
6. Edge cases discovered during build get added to the feature file
7. Feature files evolve with the code — living documentation

---

## Relationship to scope.md

`docs/scope.md` is the **input** to PRD generation. It's the raw product vision from Phase 0.

After PRD.md and feature files are generated, scope.md becomes historical reference — "this is what we started with." It's not actively referenced during build. PRD.md and feature files are the active documents.

```
Phase 0: scope.md (vision, decisions, research areas)
           ↓
Phase 1: PRD.md + features/*.md (technical specs, implementation-ready)
           ↓
Phase 3: Build (Claude reads PRD.md + relevant feature file per task)
```
