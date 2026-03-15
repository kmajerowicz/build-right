# Start C: Existing Product

**Introduces GSR into an existing product for building new features or developing functionality.**

---

## When to Use

- You have a running product (codebase exists, users exist)
- You want to add a new feature or improve an existing one
- You want GSR practices (human-in-the-loop, feature files, skills, verification) for this work
- You don't need to rewrite the full PRD for the entire product

---

## Flow

```
Codebase Onboarding → Feature Scope → Feature File → Build → Verify
```

---

## Step 1: Codebase Onboarding

Map the existing product so GSR can work with it. This step runs once per product — after that, GSR is "installed."

### What happens
1. **Map the codebase** — architecture, conventions, stack, folder structure (parallelizable — multiple agents)
2. **Create `CLAUDE.md`** if it doesn't exist — conventions, code references, learned rules. If it exists, read and validate.
3. **Create `docs/techstack.md`** if it doesn't exist — stack, versions, project-wide skills
4. **Create `docs/` structure** if it doesn't exist — the GSR docs folder for feature files, STATE.md, BACKLOG.md

### What it produces
```
existing-product/
├── CLAUDE.md                   # Created or updated
├── docs/
│   ├── techstack.md            # Created
│   ├── features/               # Created (empty, fills with feature files)
│   ├── STATE.md                # Created
│   └── BACKLOG.md              # Created
├── src/                        # Existing code (untouched)
└── ...
```

### Adaptive, not prescriptive
- If the project already has good documentation → read it, reference it, don't duplicate
- If CLAUDE.md already exists → extend it with GSR conventions, don't overwrite
- If the project has a different docs structure → adapt, don't force GSR layout

### GSR Adoption is Gradual
After onboarding, GSR is available but doesn't change the existing product. Feature files are created one at a time as new work comes in. No need to document all existing features retroactively.

---

## Step 2: Feature Scope

Same as Phase 0 (Scope Shaping) but scoped to a single feature, not the whole product.

### Project foundations at feature level
- **Goal** — what does this feature achieve? What problem does it solve?
- **Vision** — what does it look like when it works?
- **Target user** — who uses this feature? (may be a subset of the product's users)
- **Why** — why are we building this now? What changes?
- **What it does** — what does the feature actually do? (high level)

### What's different from Phase 0 (full product scope)
- No navigation architecture (product already has one)
- No full data model (extends existing model)
- No competitive mapping (unless the feature is a differentiator)
- Shorter — scoping a feature is faster than scoping a product
- Must understand **how this feature fits into the existing product** — interactions with existing features, impact on existing UX

### Edge case checklist still applies
- What happens when it's empty?
- What happens when it's optional?
- What cascading effects on existing features?
- What's the migration path for existing users?

### Research areas still triaged
Same three tiers (blocking scope / blocking feature file / blocking build), but typically fewer items since the product stack is already known.

---

## Step 3: Feature File

Create `docs/features/<feature-name>.md` — same format as Phase 1 feature files:

- Feature name, purpose, user flow
- States: empty, partial, full, error, loading, offline
- Business rules and edge cases
- Data needs at conceptual level
- UX description (layout intent, key interactions)
- **Skills** (matched from skills.sh marketplace)
- Decision log (choices + rationale)
- **Integration points** — how this feature connects to existing features (extra section for Start C)
- Related features (links to other feature files if they exist)

### Skills matching
Same flow as Phase 1 — browse skills.sh, compare with installed, recommend missing.

---

## Step 4: Build

Identical to Phase 3 — creative (human-in-the-loop) or systematic (agent-driven).

The workflow reads the feature file, loads skills, loads CLAUDE.md. Same as building from a full PRD, but the feature file is the spec.

---

## Step 5: Verify

Identical to Phase 4 — verify against the feature file's success criteria.

Additional check for Start C: **verify integration with existing features** — does the new feature break anything? Do existing flows still work?

---

## GSR Grows With the Product

Each new feature gets its own feature file. Over time:
- `docs/features/` fills up → self-documenting product
- `CLAUDE.md` Learned Rules grow → Claude gets better at this codebase
- `docs/STATE.md` tracks progress across features
- New team members read feature files to understand the product

No need to create a full PRD retroactively. The feature files ARE the product documentation, built incrementally.
