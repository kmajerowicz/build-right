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

## "Don't Hand-Roll" Sweep Per Feature

When a feature scope is confirmed, before writing the feature file:

1. Claude identifies the feature's technical needs (auth, payments, email, file upload, real-time, etc.)
2. For each need, checks: does a proven library/service solve this? (parallel with skills matching)
3. Adds a **Don't Hand-Roll** section to the feature file if relevant

This prevents the most expensive mistake: building something that already exists as a mature, tested solution.

```markdown
## Don't Hand-Roll
| Need | Don't Build | Use Instead | Why |
|------|-------------|-------------|-----|
| Auth | Custom JWT session mgmt | next-auth / lucia | OAuth, session security, edge cases handled |
| Email | SMTP client | Resend / Postmark | Deliverability, templates, rate limiting |
| Validation | Manual if/else checks | Zod | Type inference, composable, already in ecosystem |
```

If no relevant items → section omitted (not every feature needs it).

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
10. Build phases (ordered, typed creative/systematic, demo sentence, must-haves)
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
- **Must-haves** (Truths, Artifacts, Key Links — what verification will check, see below)
- **Don't Hand-Roll** (if relevant — proven solutions to use instead of building from scratch)
- **Known Pitfalls** (if relevant — common mistakes for this type of feature)
- **Skills** (which skills to load when implementing — matched from marketplace)
- Decision log (choices + rationale)
- Related features (links to other feature files)

**Does NOT contain:** Component names, CSS classes, API call details, schema field names. Those are code.

### Must-Haves in Feature Files

Defined at spec time, checked at verification time. Three categories:

**Truths** — Observable behaviors that must be true when the feature works:
```markdown
### Truths
- User can create a new walk with start/stop tracking
- Dashboard shows this week's stats even with zero walks
- Goal progress is hidden when no goals are set
```

**Artifacts** — Files that must exist with real implementation (not stubs):
```markdown
### Artifacts
- Walk tracking service with start/stop/pause exports
- Dashboard data fetching with empty state handling
```

**Key Links** — Critical connections between parts:
```markdown
### Key Links
- Dashboard fetches from walk tracking service
- Goal progress component reads user's weekly goal setting
```

Must-haves stay at the product level — no file paths, no line counts. Those details emerge during build and are checked during verification. The feature file defines WHAT must be true, verification checks that it IS true.

### Known Pitfalls in Feature Files

Common mistakes for this type of feature, surfaced during research:

```markdown
## Known Pitfalls

### Race condition in concurrent location updates
**What goes wrong:** Two location updates arrive out of order, GPS drift creates phantom distance
**How to avoid:** Timestamp-based ordering, distance threshold filtering
**Warning signs:** Walks showing impossibly high speed or distance
```

If no relevant pitfalls → section omitted.

---

## Build Phases Within PRD

Each phase includes:
- Scope boundary (what's in, what's not)
- Type: `creative` (human-in-the-loop) or `systematic` (agent-drivable)
- **Demo:** one sentence — what the user can see or do after this phase (required)
- **Must-haves:** Truths, Artifacts, Key Links that verification will check
- Research dependencies (if any blocking-build research must happen first)
- Suggested task breakdown (refined during build)

### Demo Sentence

Every build phase must have a demo sentence. One line, forcing the question: "after this phase, what can the user actually see or do?"

```markdown
### Phase 2: Dashboard + Walk Tracking
**Type:** creative
**Demo:** User can start a walk, see it tracked in real-time, and view stats on the dashboard.
**Must-haves:**
- Truths: walk tracking works with start/stop, dashboard renders with real data
- Artifacts: tracking service, dashboard page, stats API
- Key Links: dashboard reads from tracking service via API
```

If you can't write a demo sentence, the phase is too abstract — it should be restructured so each phase ends with something demonstrable.

The demo sentence becomes the first human verification item in Phase 4.

---

## PRD + Features = Single Source of Truth

No separate REQUIREMENTS.md, ROADMAP.md, or PROJECT.md. PRD.md + feature files contain all of it.

Full architecture details: [../architecture.md](../architecture.md)
