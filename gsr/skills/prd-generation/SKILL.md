# /gsr:prd — PRD Generation Skill

You are executing the `/gsr:prd` command. Your job is to generate `docs/PRD.md`, `docs/features/*.md`, and the full project infrastructure from `docs/scope.md`.

This skill runs Phase 1 (PRD generation) + Phase 2 (project init) in one flow.

---

## Iron Laws

1. **PRD is purely product.** No tech stack, no schemas, no routes, no design tokens. Those live in code and CLAUDE.md. If you catch yourself writing a column name or route path in PRD.md — stop. Move it to code.
2. **Every build phase must have a demo sentence.** "User can [do X] after this phase." If you can't write it, the phase is too abstract. Restructure.
3. **Skills are boosters, not blockers.** The PRD is complete whether or not skills are installed. Skills enhance quality, not enable completion.

---

## Step 0: Detect Mode

Before doing anything, check if `docs/PRD.md` already exists.

**If PRD.md exists → Update mode:**
- Read `docs/PRD.md` and `docs/scope.md`
- Do NOT re-run research. Research was already done for the existing PRD.
- Identify what changed: compare scope with what's reflected in the PRD. List the deltas.
- Update only the sections that need to change. Leave the rest untouched.
- Skip straight to the self-verification pass (Step 1), then present changes to user.

**If PRD.md does not exist → Full generation mode:**
- Read `docs/scope.md` and any design references the user mentions
- Resolve research areas from scope.md marked "blocking PRD" before writing — dispatch researcher agents in parallel for independent research questions
- Proceed through Step 1 in full

---

## Step 1: Generate PRD.md

Use `${CLAUDE_PLUGIN_ROOT}/templates/prd-md.md` as the structure. Fill in from scope.md:

1. **Project summary** — 2-3 sentences: what, for whom, why
2. **Business goals** — measurable goals + success metrics
3. **Target users** — primary persona, day 1/7/30 journeys
4. **MVP scope** — what's in, what's explicitly out (from scope.md v2 backlog)
5. **High-level architecture** — system diagram (boxes and arrows, not code). Infer from tech stack and project type.
6. **Conceptual data model** — entities, relationships, key business rules. Stable level: "User has many Dogs" not "users.id BIGINT NOT NULL"
7. **Feature index** — table with all features and links to their files (files don't exist yet — create the links anyway)
8. **Non-functional requirements** — performance, accessibility, mobile targets
9. **Design direction** — visual inspiration, color palette intent, typography intent (from scope or ask)
10. **Build phases** — ordered phases, each with: type, demo sentence, must-haves summary
11. **Research areas status** — from scope.md

**PRD.md must be 200-300 lines.** If it grows past 400, something belongs in a feature file.

Before presenting to the user, run a mandatory self-verification pass:

### PRD Self-Verification (do this before showing the user)

**1. Cross-phase dependency check**
For every feature in every phase, ask: does this feature depend on something that is only delivered in a later phase? Common traps:
- UI component references a service built in a later phase
- Phase N demo sentence requires data only available after Phase N+2
- Shared infrastructure (service workers, auth middleware, caching) used before it's scaffolded

List every conflict found. For each: either move the dependency earlier, swap phase order, or add a "scaffold in Phase X, complete in Phase Y" note.

**2. Internal consistency check**
- Auth type — does it match across all sections (architecture diagram, data model, onboarding flow, feature descriptions)?
- Screen/step counts — do counts in section headers match the list of actual screens?
- Data model — does every feature have the entities it needs? Does any feature reference a field that doesn't exist in the model?
- Out-of-scope list — does anything in "explicitly out" contradict something that's required by an in-scope feature?

**3. Open decision check**
Scan for any decision that is ambiguous, assumed, or marked ⚠️. List them — these become challenge questions for the user.

After self-verification: fix any bugs you found, then present PRD.md with a summary of what you fixed.

For each open decision or ambiguous assumption found: use the decision gate pattern (`${CLAUDE_PLUGIN_ROOT}/docs/patterns/decision-gate.md`). Enter plan mode, present options with recommendation, user clicks. One decision at a time.

**Final step — always, regardless of how many decisions were resolved:**
Ask the user to read through the full PRD themselves: "Please read through the PRD — does it accurately represent the product? Anything to adjust?"
Do not proceed to feature files until the user explicitly confirms.

---

## Step 2: Generate Feature Files (one per feature)

For each feature in the feature index, generate `docs/features/<name>.md` using `${CLAUDE_PLUGIN_ROOT}/templates/feature-md.md`.

**No skills matching here.** Skills are matched to tasks at build time, not at feature file generation time. Do not add a Skills section to feature files.

Run Step 2a in **parallel for each feature** (use researcher agents):

### Step 2a: Don't Hand-Roll Sweep

For each technical capability the feature needs (auth, payments, email, file upload, real-time, geo, etc.):
- Check if a proven library/service already solves it
- Add a **Don't Hand-Roll** table if relevant

```markdown
## Don't Hand-Roll
| Need | Don't Build | Use Instead | Why |
|------|------------|------------|-----|
| Auth | Custom JWT session management | next-auth or lucia | OAuth, session security, edge cases handled |
```

If no relevant items → omit the section.

### Known Pitfalls

For features involving complex or risky technical territory (real-time sync, offline, payments, geo, camera, push notifications):
- Surface common mistakes, why they happen, how to avoid them, warning signs
- Add a **Known Pitfalls** section if relevant

### Must-Haves

For each feature, define must-haves at product level (no file paths):

**Truths** — observable behaviors:
```
- User can [action]
- System does [behavior] when [condition]
```

**Artifacts** — files that must exist with real implementation:
```
- [Description of module/service] with [key exports]
- [Description of page/component] with [key behavior]
```

**Key Links** — critical connections:
```
- [Feature A] reads from [Feature B]
- [Component] calls [API/service]
```

### Generate the Feature File

Fill in `${CLAUDE_PLUGIN_ROOT}/templates/feature-md.md` with everything found above. No Skills section. Present to user for review after each feature, or batch if they prefer.

---

## Step 3: Project Init (Phase 2)

After PRD.md and feature files are complete (and reviewed), create the project infrastructure:

### Create CLAUDE.md
Use `${CLAUDE_PLUGIN_ROOT}/templates/claude-md.md`. Fill in:
- Project name from PRD
- References section: where things live (schema path, routes path, design tokens path — infer from tech stack, mark as placeholders if not yet implemented)
- Code conventions: infer from tech stack and any patterns mentioned in scope. Use sensible defaults.

### Create docs/STATE.md
Use `${CLAUDE_PLUGIN_ROOT}/templates/state-md.md`. Fill in:
- Phase progress table from PRD build phases
- Feature progress table for Phase 1 features
- Next action: "Run `/gsr:build` → pick a feature from Phase 1"

### Create docs/BACKLOG.md
Use `${CLAUDE_PLUGIN_ROOT}/templates/backlog-md.md`. Fill in:
- Deferred from Scope: everything in scope.md's v2 backlog

### Create docs/techstack.md
Use `${CLAUDE_PLUGIN_ROOT}/templates/techstack-md.md`. Fill in:
- Tech stack from scope.md
- Project-wide skills (responsive-design, etc. — based on what was identified as project-wide)

---

## Iteration Protocol

The user reviews PRD.md and feature files. Common revision patterns:

- **Feature misunderstood** → rewrite that feature file, don't touch others
- **Scope changed** → update PRD.md feature index + affected feature files
- **New edge case discovered** → add to relevant feature file's Business Rules + Must-Haves
- **Don't Hand-Roll suggestion rejected** → remove from feature file, don't argue

When the user approves: "Looks good" / "Let's proceed" → move to next step.

---

## Iron Law Enforcement

Red flags:

| Thought | Reality |
|---------|---------|
| "I'll put the schema in PRD.md for reference" | No. PRD is product-only. Schema lives in code. |
| "This phase is a bit abstract but I'll demo sentence it anyway" | No. If you can't demo it, restructure the phase. |
| "I'll add a Skills section to the feature file" | No. Skills are matched to tasks at build time in gsr:build. |
| "I'll create the infrastructure before the user reviews PRD" | No. Review first. Infrastructure can be regenerated. |
| "The must-haves are too obvious to write" | Write them. They're the verification contract. |
