# Phase 0: Scope Shaping

**Turns a raw idea (Start A) or existing materials (Start B) into a structured scope document.**

---

## Start A: Empty Page Flow

Based on the proven 7-step process from Psie Wędrówki scope-shaping session, plus 6 improvements identified in retrospective.

### Step 1: Vision intake
User dumps raw idea (conversational, unstructured is fine). Claude listens, asks 3-5 clarifying questions covering: target user, competitor landscape, tech constraints, MVP vs long-term.

The ideal opening message includes the **why** (pain points), the **what** (rough features), the **how** (tech preferences), and the **who** (target user). ~70% of core vision typically comes from the first message.

### Step 2: Competitive mapping (parallelizable — agent)
Claude researches the primary competitor's UX. Maps features, identifies gaps, finds differentiation opportunities. Proactive, not waiting for user to ask "how does X handle this?"

### Step 3: First scope draft
Claude produces a broad scope document. User reviews for major misalignments.

### Step 4: Prioritization pass
"This is X months of work. What's the Y-week version?" Force every feature through MVP/v2/cut.

**Mandatory edge case checklist applied to every MVP feature:**
- What happens when it's empty?
- What happens when it's optional?
- What's the day-0 experience?
- What cascading effects does this have on other features?

### Step 5: Feature deep-dives
Screen by screen, feature by feature. For each: what does the user see? What are the states (empty, partial, full)? What data does it need? What happens day 0?

**User journey mapping** asked early: "Who is the user on day 1, day 7, day 30?"

### Step 6: Consistency audit
Full document review. Check: data model matches features, optional fields cascade correctly, empty states defined, research areas flagged, no promises without coverage.

### Step 7: Final review (two-pass rule)
Both parties review. Scope is "done" when neither finds meaningful issues in two consecutive passes.

---

## Process Rules

- Batch decisions, then update document (not mixed in same message)
- **Active assumption flagging** — throughout steps 1-6, Claude flags every unverified statement inline ("⚠️ assumes PTTK has digital data"). In step 6 (consistency audit), Claude does an explicit research sweep: collects all flagged assumptions and triages them (blocking scope / blocking PRD / blocking build). User can also flag research areas at any point.
- Claude drives ~70% through questions, user drives ~30% through corrections
- User's strongest contributions: corrections and domain expertise
- Claude's strongest contributions: structure, edge cases, "what happens when X is empty/missing"

---

## Domain Expertise Adaptation

The system detects whether user is domain expert or domain-naive and adapts:

**User knows the domain** (PM building in their area):
- Claude asks more questions, user corrects with domain insight
- Less research needed, more structure and edge cases
- Example: Kacper knew dogs, Claude provided structure

**User doesn't know the domain** (developer building in unfamiliar area):
- Claude does more research (parallel agents for competitive analysis, domain investigation)
- More "here's how this typically works" explanations
- Step 2 (competitive mapping) and Step 5 (deep-dives) are research-heavier

---

## Start B: Something Exists Flow

### Step 1: Intake
Ask user to point to or paste all materials they have. No assumptions about what they should have — every project is different.

### Step 2: Map what exists
Read all materials. Produce a summary: "You have X covering Y. Missing: Z."

Mapping is **adaptive, not checklist-based**. Don't ask about PWA push if it's not a mobile app. Don't ask about i18n if it's a single-market tool. Assess based on what the project actually is.

### Step 3: Assess quality
Against what's needed for the project type: Do we understand the goal? The vision? The users? How the app works? What's in scope vs out?

The scope doesn't need to be super detailed — that's what PRD is for. It needs to be clear enough to start PRD generation.

### Step 4: Improve or proceed
- If gaps are significant → enter scope shaping conversation to fill them (same steps 4-7 from Start A)
- If quality is good → proceed to PRD phase
- Some gaps can be deferred to PRD phase (more detail emerges there)

---

## Research Areas

During scope shaping, research areas are identified and triaged into three tiers:

1. **Blocking scope** → resolve now (parallel agent research). Things that could kill or reshape the scope. Example: "Does PTTK have digital data?" — if no, entire trail ingestion strategy changes.

2. **Blocking PRD** → resolve during PRD generation. Architecture-informing research. Example: "How does Mapbox offline work in PWA?"

3. **Blocking build** → flag in PRD, resolve when you get there. Things you can only answer by trying. Example: "Is Overpass API response time acceptable for real-time search?"

---

## Output

`docs/scope.md` in the target project, containing:
- Vision statement
- Navigation architecture (screens, flows)
- Core concepts (key differentiators)
- Data model (entity-level, field-level decisions where they matter)
- Empty states and edge cases (per screen)
- Research areas (triaged: blocking scope / blocking PRD / blocking build)
- v2 backlog (explicitly deferred, with why)
- Competitive positioning
- Resolved decisions (archive of choices made during scoping)
