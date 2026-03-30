# /gsr:prd — PRD Generation Skill

You are executing the `/gsr:prd` command. Your job is to generate `docs/PRD.md`, `docs/features/*.md`, and the full project infrastructure from `docs/scope.md`.

This skill runs Phase 1 (PRD generation) + Phase 2 (project init) in one flow.

---

## Iron Laws

1. **PRD is purely product.** No tech stack, no schemas, no routes, no design tokens. Those live in code and CLAUDE.md. If you catch yourself writing a column name or route path in PRD.md — stop. Move it to code.
2. **Every build phase must have a demo sentence.** "User can [do X] after this phase." If you can't write it, the phase is too abstract. Restructure.
3. **Skills are boosters, not blockers.** The PRD is complete whether or not skills are installed. Skills enhance quality, not enable completion.

---

## Step 0: Read the Inputs

Before generating anything, read:
1. `docs/scope.md` — the product vision and feature list
2. Any design references the user mentions (Figma URLs, screenshots, design system docs)
3. Research areas from scope.md marked "blocking PRD" — these must be resolved first

**Resolve blocking-PRD research areas in parallel** before writing PRD.md. Dispatch researcher agents for independent research questions.

---

## Step 1: Generate PRD.md

Use `templates/prd-md.md` as the structure. Fill in from scope.md:

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

Present PRD.md to the user for review before moving to feature files. Ask: "Does this accurately represent the product? Any misalignments?"

---

## Step 2: Generate Feature Files (one per feature)

For each feature in the feature index, generate `docs/features/<name>.md` using `templates/feature-md.md`.

Run Steps 2a and 2b in **parallel for each feature** (use researcher agents):

### Step 2a: Skills Matching

Researcher agent brief: "Search skills.sh marketplace for ideal skills for a [feature type] feature in a [tech stack] project. Return: matching skills, whether each is installed in `.agents/skills/`, and which to recommend for installation."

Use WebFetch to browse skills.sh. Compare with installed skills. Add confirmed skills to the feature file's Skills section.

If no marketplace skill found for a technology: note `⚠️ No marketplace skill found for [tech] — rely on docs and learned rules`.

### Step 2b: Don't Hand-Roll Sweep

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

Fill in `templates/feature-md.md` with everything found above. Present to user for review after each feature, or batch if they prefer.

---

## Step 3: Project Init (Phase 2)

After PRD.md and feature files are complete (and reviewed), create the project infrastructure:

### Create CLAUDE.md
Use `templates/claude-md.md`. Fill in:
- Project name from PRD
- References section: where things live (schema path, routes path, design tokens path — infer from tech stack, mark as placeholders if not yet implemented)
- Code conventions: infer from tech stack and any patterns mentioned in scope. Use sensible defaults.

### Create docs/STATE.md
Use `templates/state-md.md`. Fill in:
- Phase progress table from PRD build phases
- Feature progress table for Phase 1 features
- Next action: "Run `/gsr:build` → pick a feature from Phase 1"

### Create docs/BACKLOG.md
Use `templates/backlog-md.md`. Fill in:
- Deferred from Scope: everything in scope.md's v2 backlog

### Create docs/techstack.md
Use `templates/techstack-md.md`. Fill in:
- Tech stack from scope.md
- Project-wide skills (responsive-design, etc. — based on what was identified as project-wide)

---

## Step 4: Skills Recommendations

After generating all feature files, produce a skills installation report:

```
## Skills Installation

**Already installed:** [list]

**Recommended to install:**
- [skill-name] — needed for: [feature 1], [feature 2]. Install: `[install command]`
- [skill-name] — needed for: [feature]. Install: `[install command]`

**Not found in marketplace:**
- ⚠️ No skill found for [tech] in [feature]
```

---

## Iteration Protocol

The user reviews PRD.md and feature files. Common revision patterns:

- **Feature misunderstood** → rewrite that feature file, don't touch others
- **Scope changed** → update PRD.md feature index + affected feature files
- **New edge case discovered** → add to relevant feature file's Business Rules + Must-Haves
- **Skills suggestion rejected** → remove from feature file, don't argue

When the user approves: "Looks good" / "Let's proceed" → move to next step.

---

## Iron Law Enforcement

Red flags:

| Thought | Reality |
|---------|---------|
| "I'll put the schema in PRD.md for reference" | No. PRD is product-only. Schema lives in code. |
| "This phase is a bit abstract but I'll demo sentence it anyway" | No. If you can't demo it, restructure the phase. |
| "Skills matching can be skipped for simple features" | Skills take 2 minutes and prevent quality problems. Do it. |
| "I'll create the infrastructure before the user reviews PRD" | No. Review first. Infrastructure can be regenerated. |
| "The must-haves are too obvious to write" | Write them. They're the verification contract. |
