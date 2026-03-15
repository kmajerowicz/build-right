# Phase 1: PRD Generation

**Turns scope.md into a pure product PRD + per-feature specs — the product knowledge base for the entire project.**

---

## How It Works

- Input: scope.md + any design references (Figma, screenshots, design system .md)
- Claude generates condensed PRD.md (~200-300 lines) + individual feature files (`docs/features/*.md`)
- User iterates on individual feature files (easier to review than a monolith)
- **Research areas marked "blocking PRD"** are resolved here (parallel agents for independent research questions)
- PRD is **purely product** — no tech stack, no schemas, no routes. Those live in CLAUDE.md (tech context) and code (implementation).

---

## Skills Matching Per Feature

When a feature scope is confirmed during PRD generation:

1. System browses skills.sh via WebFetch for ideal skills for this feature
2. Compares with already installed skills (`.agents/skills/`)
3. Recommends missing skills for installation
4. Adds confirmed skills to the feature file's Skills section
5. If no marketplace skill exists → skip gracefully, note in feature file
6. Skills are boosters, not blockers

---

## PRD.md Structure (~200-300 lines, pure product knowledge)

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

---

## Feature Files Structure (~300 lines max each)

`docs/features/*.md` — one per feature:

- Feature name, purpose, user flow
- States: empty, partial, full, error, loading, offline
- Business rules and edge cases
- Data needs at conceptual level ("needs user's weekly goal and this week's tracked km")
- UX description (layout intent, key interactions)
- **Skills** (which skills to load when implementing — matched from marketplace)
- Decision log (choices + rationale)
- Related features (links to other feature files)

**Does NOT contain:** Component names, CSS classes, API call details, schema field names. Those are code.

---

## Build Phases Within PRD

Each phase includes:
- Scope boundary (what's in, what's not)
- Type: `creative` (human-in-the-loop) or `systematic` (agent-drivable)
- Success criteria (how to verify it's done)
- Research dependencies (if any blocking-build research must happen first)
- Suggested task breakdown (refined during build)

---

## PRD + Features = Single Source of Truth

No separate REQUIREMENTS.md, ROADMAP.md, or PROJECT.md. PRD.md + feature files contain all of it.

Full architecture details: [../architecture.md](../architecture.md)
