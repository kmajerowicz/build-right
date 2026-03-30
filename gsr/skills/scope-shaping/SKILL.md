# /gsr:scope — Scope Shaping Skill

You are executing the `/gsr:scope` command. Your job is to turn a raw idea (Start A) or existing materials (Start B) into a structured `docs/scope.md`.

---

## Iron Laws

1. **Explain every decision.** The user may not be technical, may not have product experience. When you present a choice, explain: options, product impact, technical impact. Empower them to decide with full context.
2. **Never skip foundations.** Before writing a word of scope, you must have all 5 foundations clear: Goal, Vision, Target User, Why, What It Does. A hard gate — nothing else proceeds without them.
3. **Flag assumptions, don't hide them.** Every unverified claim gets an inline ⚠️ flag. In Step 6, sweep and triage them all.

---

## Detect Entry Point

Before asking anything, check if a scope already exists:
- Does `docs/scope.md` exist? → **Start B path** (something exists)
- No existing materials mentioned → **Start A path** (empty page)

---

## Start A: Empty Page

### Step 1: Vision Intake

Ask the user to tell you about their idea. Everything is welcome — messy, partial, half-formed.

After they share, extract or ask about the **5 project foundations**. These must be clear before anything else:

1. **Goal** — what problem does this solve? What does success look like?
2. **Vision** — what does the end result look and feel like? How does the user experience it?
3. **Target user** — who is this for? What's their context, technical level, needs?
4. **Why** — why are we building this? What changes if this exists?
5. **What it does** — what does the app/project actually do? (high level, not detailed)

If the first message covers all 5, great. If not, ask — but ask all missing ones in one message, not one per exchange.

**Domain expertise detection:** Is this user a domain expert or domain-naive?
- Domain expert (knows their field) → ask more questions, less research, more structure and edge cases
- Domain naive (developer building in unfamiliar area) → more research in Step 2, more "here's how this typically works" explanations

### Step 2: Competitive Mapping + Don't Hand-Roll Sweep (parallel)

Research in parallel using researcher agents:

**Agent 1 — Competitive mapping:**
"Research [primary competitor]'s UX for [primary use case]. What are the key flows, UX patterns, gaps, and differentiation opportunities?"

**Agent 2 — Don't Hand-Roll sweep:**
For each core technical capability in the user's idea (auth, payments, real-time, email, maps, file storage, geo, etc.), identify the best existing library/service. Use `${CLAUDE_PLUGIN_ROOT}/agents/researcher.md` format.

Results feed directly into scope and later into feature files. Present to user as: "Here's what [competitor] does, and here are the proven solutions for your technical needs."

### Step 3: First Scope Draft

Produce a broad first draft of `docs/scope.md`. Cover:
- Project foundations (Goal, Vision, Target User, Why, What It Does)
- Navigation / screens (what exists, not detailed)
- Core concepts (differentiators, unique mechanics)
- Data model at entity level
- Competitive positioning (from Step 2)

Tell the user: "This is a first draft — look for major misalignments. We'll get detailed in Step 5."

### Step 4: Prioritization Pass

Ask: "This looks like [N] months of work. What's the [Y]-week version?"

For every feature that remains in MVP, apply the edge case checklist:
- What happens when it's empty?
- What happens when it's optional?
- What's the day-0 experience?
- What cascading effects on other features?

Explicitly move features to v2 backlog with a reason.

### Step 5: Feature Deep-Dives

For each MVP feature, work through:
- What does the user see on this screen?
- What are the states (empty, partial, full, error)?
- What data does it need?
- What happens day 0 when there's no data?
- User journey: "Who is the user on day 1, day 7, day 30?"

**Known pitfalls:** For features involving complex or risky technical territory (real-time sync, offline support, payment flows, geo/maps, camera, push notifications), proactively surface:
- What commonly goes wrong with this type of feature
- Why it goes wrong
- How to avoid it
- Warning signs to watch for

These feed into feature files as "Known Pitfalls" during PRD generation.

### Step 6: Consistency Audit

Full document review. Check everything:
- Data model matches features (every feature has the data it needs)
- Optional fields cascade correctly (if X is optional, what happens to features that need X?)
- Empty states defined for all screens
- **Research areas sweep:** collect all ⚠️ assumptions flagged in steps 1-5, triage into:
  - **Blocking scope** → resolve now (kick off researcher agents in parallel)
  - **Blocking PRD** → note for PRD phase
  - **Blocking build** → flag in scope, resolve when you get there

For research areas that are blocking scope: dispatch researcher agents and integrate findings before proceeding.

### Step 7: Final Review (Two-Pass Rule)

Claude reviews first, then the user reviews. Scope is done when neither finds meaningful issues in two consecutive passes.

**Claude's review checklist (run before presenting to user):**
- Do all MVP features have the data they need in the data model?
- Does any v2 backlog item get silently required by an MVP feature? (backlog ≠ truly deferred)
- Are all optional fields handled — does every feature that depends on an optional field define its behavior when that field is absent?
- Does the navigation/screen list match the feature list — no orphaned screens, no features without a home?
- Are there contradictions between sections (e.g. a feature described as simple in Step 3 but with complex edge cases added in Step 5)?
- Are all ⚠️ flagged assumptions triaged? None left hanging as "unclear."

Surface any issues found before asking the user to review.

---

## Start B: Something Exists

### Step 1: Intake

Ask the user to share all materials they have (docs, PRD, Figma links, existing CLAUDE.md, notes, anything).

Read everything provided. Produce a summary: "You have X covering Y. Missing Z."

### Step 2: Quality Assessment

Against the 5 foundations — not format quality, but information completeness:

**Foundation check:**
| Foundation | Status | Evidence / Gap |
|------------|--------|----------------|
| Goal | ✓ clear / ⚠️ unclear | |
| Vision | ✓ clear / ⚠️ unclear | |
| Target user | ✓ clear / ⚠️ unclear | |
| Why | ✓ clear / ⚠️ unclear | |
| What it does | ✓ clear / ⚠️ unclear | |

**Feature clarity check:** Can we list the product's features and roughly understand what each does?

**Verdict:**
- **PROCEED** — all 5 foundations are clear, feature list is known
- **IMPROVE** — any foundation missing or ambiguous, or can't list features

### Deferred Foundations Pattern

If the user doesn't answer a foundation question: mark it ⚠️ unclear, suggest your best answer based on context, and continue working.

As you gather more context (feature deep-dives), return to unclear items: "Based on what you described about X, I think the target user is Y — correct?"

**Hard gate before producing scope.md:** All 5 foundations must be ✓ clear. If anything remains ⚠️ unclear, return to it with a suggestion grounded in the context gathered.

### Improve Path

If IMPROVE verdict: enter steps 4-7 from Start A but only for identified gaps. Don't restart from scratch.
- Missing foundations → conversational (they're decisions)
- Missing feature clarity → document-based (draft from materials, user corrects)

---

## Active Assumption Flagging

Throughout the entire process (all steps), flag every unverified assumption with ⚠️:

```
⚠️ assumes PTTK has digital trail data accessible via API
⚠️ assumes users will pay for a premium tier
⚠️ assumes offline-first is required (not confirmed by user)
```

In Step 6, sweep all flags and triage them (blocking scope / blocking PRD / blocking build).

---

## Process Rules

- Batch decisions, then update the document (not mixed in same message)
- Never ask multiple questions in separate messages — consolidate into one
- Claude drives ~70% through structure and questions, user drives ~30% through corrections
- User's strongest contribution: domain expertise and corrections
- Claude's strongest contribution: structure, edge cases, "what happens when X is empty/missing"
- **Multi-option decisions use the decision gate pattern.** Read `${CLAUDE_PLUGIN_ROOT}/docs/patterns/decision-gate.md`. Enter plan mode, present options with recommendation, user clicks — no typing required.

---

## Output: docs/scope.md

Use `${CLAUDE_PLUGIN_ROOT}/templates/scope-md.md` as the structure. Fill in:
- Project foundations (all 5)
- Navigation and screens
- Core concepts
- Data model (entity level)
- Edge cases and empty states
- Research areas (triaged into 3 tiers)
- v2 backlog (with reasons)
- Competitive positioning
- Resolved decisions

Write the file to the user's project at `docs/scope.md`.

---

## Iron Law Enforcement

Red flags — if you're thinking any of these, stop:

| Thought | Reality |
|---------|---------|
| "We can figure out the target user later" | No. It's a foundation. Gate is hard. |
| "This scope is clear enough to proceed" | Did you run the two-pass rule? Do it. |
| "The user seems to know what they want, I don't need to ask about edge cases" | Edge cases prevent the most expensive mistakes. Ask. |
| "I'll skip competitive mapping for this simple project" | Competitive mapping surfaces differentiation. Never skip. |
| "The user didn't ask about X, so I won't surface it" | Your job is to surface what they don't know to ask about. |
