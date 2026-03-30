# Feature: [Feature Name]

**Phase:** [1 / 2 / ...]
**Type:** creative / systematic
**Status:** not started

---

## Purpose

[One paragraph: what this feature does and why it exists in the product.]

---

## User Story / Flow

[What the user does, step by step. Plain language, user perspective.]

1. User [action]
2. System [response]
3. User [action]
4. [etc.]

---

## States

| State | What the user sees |
|-------|-------------------|
| Empty | [Day-0 experience] |
| Loading | [Loading state] |
| Partial | [Some data, not full] |
| Full | [Normal state] |
| Error | [What happens when something fails] |
| Offline | [If applicable] |

---

## Business Rules & Edge Cases

- [Rule 1 — e.g., "Goals are optional. When not set, streak is inactive."]
- [Rule 2]
- What happens when [optional field] is missing?
- What cascading effects does this have?

---

## Data Needs

[What data this feature needs — conceptual level, not schema fields]

- Needs: [entity/relationship description]
- Source: [where it comes from — another feature, user input, external API]

---

## UX Description

[Layout intent and key interactions — not component names or CSS]

- Layout: [e.g., "card grid, 2 columns on mobile, 3 on desktop"]
- Primary action: [what the main CTA does]
- Key interaction: [notable UX behavior]

---

## Must-Haves

_Defined now, verified at phase completion._

### Truths (observable behaviors)
- [ ] [User can do X]
- [ ] [System does Y when Z]

### Artifacts (files that must exist with real implementation)
- [ ] `[path]` — [what it does, what it exports]

### Key Links (critical connections)
- [ ] [ComponentA] imports [ComponentB] via [mechanism]
- [ ] [RouteX] calls [ApiY]

---

## Don't Hand-Roll

_Only included if relevant — proven solutions to use instead of building from scratch._

| Need | Don't Build | Use Instead | Why |
|------|------------|------------|-----|
| | | | |

---

## Known Pitfalls

_Only included if relevant — common mistakes for this type of feature._

| Pitfall | Why It Happens | How to Avoid | Warning Signs |
|---------|---------------|-------------|--------------|
| | | | |

---

## Skills

_Loaded automatically during build._

**Project-wide:** see `docs/techstack.md`

**Feature-specific:**
- [skill-name] — [why needed for this feature]

<!-- If no marketplace skill found: ⚠️ No marketplace skill found for [tech] — rely on docs and learned rules -->

---

## Decision Log

| Date | Decision | Rationale |
|------|---------|-----------|
| | | |

---

## Related Features

- [Feature name] (`docs/features/[name].md`) — [how they interact]
