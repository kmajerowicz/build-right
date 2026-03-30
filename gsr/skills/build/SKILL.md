# /gsr:build — Build Skill

You are executing the `/gsr:build` command. Your job is to build a specific feature from the project's feature files.

---

## Iron Laws

1. **Never claim done without evidence.** Run the gate function before every completion claim. Evidence format: "build passes (0 errors), TS clean." Never "should work."
2. **Corrections compound.** Every correction the user makes → ask "Should I add this to CLAUDE.md Learned Rules?" If yes, append it with today's date.
3. **Skills are mandatory, not optional.** Skills are matched to tasks in Step 3.5. Do not skip the verification gate. Do not start implementing before skills are confirmed.

---

## Step 0: Setup

Read these files before doing anything else:
1. `CLAUDE.md` — conventions, references, learned rules
2. `docs/STATE.md` — current phase and feature status
3. `docs/techstack.md` — project-wide skills

---

## Step 1: Feature Selection

Show the user available features with their current status:

```
Available features — Phase 1: [Phase Name]

1. [Feature name] — not started
2. [Feature name] — not started
3. [Feature name] — in progress

Which feature do you want to build?
```

Read feature statuses from `docs/STATE.md`.

---

## Step 2: Load Feature Context

Once the user picks a feature, read:
1. `docs/STATE.md` — check that all prerequisite features for this feature are done
2. `docs/features/<name>.md` — the complete product spec
3. `docs/techstack.md` — project-wide skills

**Prerequisite check:** Before loading anything else, scan the feature file for dependencies on other features. Cross-reference with STATE.md. If any prerequisite feature is `not started`, `in progress`, or `blocked`: use the decision gate pattern (`${CLAUDE_PLUGIN_ROOT}/docs/patterns/decision-gate.md`). Enter plan mode and present:

**Option 1 — Build [prerequisite] first**
Safe path. Avoids integration failures mid-build.

**Option 2 — Proceed anyway**
You accept the risk of hitting integration gaps. Can be unblocked later.

**Recommendation: Option 1** — building on an incomplete dependency typically means rework.

Wait for user to click. Do not proceed silently.

**Load project-wide skills now.** Read each skill's SKILL.md from `docs/techstack.md`. Skills matched to specific tasks happen after the task list is generated — see Step 3.5.

---

## Step 3: Mode Selection

Use the decision gate pattern (`${CLAUDE_PLUGIN_ROOT}/docs/patterns/decision-gate.md`). Enter plan mode and present:

**Option 1 — Creative**
You review every diff as it's written. Best for UI, screens, design-sensitive work.

**Option 2 — Systematic**
Claude generates a task list, you approve it, then Claude executes. Best for testing, i18n, accessibility, security, refactoring.

**Recommendation: Creative** if the feature has any UI. Systematic if it's purely backend/infrastructure.

User clicks their choice.

---

## Step 3.5: Skills Matching + Verification

Run this step regardless of mode, after the task list (Mode B) or file map (Mode A) is drafted — before anything executes.

### Match skills to tasks

For each task (or file group in Mode A), identify what technical capabilities it needs. Search the skills.sh marketplace for matching skills:

```bash
npx skills find <topic>   # e.g. npx skills find supabase, npx skills find mapbox, npx skills find testing
```

Build a verification table:

```
## Skills for [Feature Name]

| Task | Skill | Status | Install |
|------|-------|--------|---------|
| [task] | [skill-name] | installed / not installed | [install command] |
| [task] | — | no skill found | rely on docs |
```

If a skill covers multiple tasks, list it once and note which tasks it applies to.

### Verification gate

Present the table to the user. Use the decision gate pattern (`${CLAUDE_PLUGIN_ROOT}/docs/patterns/decision-gate.md`) for any skill where there are multiple options.

For skills not yet installed: tell the user which ones to install before proceeding and wait for confirmation.

```
Skills ready to load: [list]
Skills to install first: [list with install commands]

Install missing skills, then confirm to proceed.
```

**Do not start implementing until the user confirms skills are in order.**

Once confirmed: load each installed skill's SKILL.md before writing any code.

---

## Mode A: Creative Build

### How it works

1. Read the feature file — understand: user flow, states, business rules, must-haves
2. Read relevant existing code (to understand current state before changing anything)
3. Draft file map if >2 files, run Step 3.5 (skills matching), then: "Skills confirmed + file map approved — proceeding."
4. Implement in small chunks that the user can review
5. After each chunk: "done, test it — build passes (0 errors), TS clean"
6. User tests in browser, gives feedback
7. On correction: implement correction → ask "Add to CLAUDE.md Learned Rules?"
8. Atomic commit on approval: `git commit -m "feat: [feature] — [what was built]"`
9. Update STATE.md: increment task count for this feature

### Rules — Mode A

**Banned completion phrases:**
- "should work" → evidence required
- "probably works" → evidence required
- "seems correct" → evidence required
- "looks good" → evidence required

**Required gate function before every "done, test it":**
1. `npm run build` (or equivalent) → must pass with 0 errors
2. `npx tsc --noEmit` → must report 0 TypeScript errors
3. Lint if configured → must pass

If any check fails → fix it. Then run all checks again. Then claim done with: "done, test it — build passes (0 errors), TS clean."

**When stuck or something breaks:**
Switch to systematic debugging. Read `${CLAUDE_PLUGIN_ROOT}/docs/patterns/systematic-debugging.md`. Follow the 4-phase process (OBSERVE → HYPOTHESIZE → TEST → CONCLUDE). Return to build flow after fix is verified.

**When the user makes a correction:**
After implementing: "This is now the expected behavior. Should I add this to CLAUDE.md Learned Rules so it applies to future work?"

---

## Mode B: Systematic Build

### How it works

1. Read the feature file — identify all systematic tasks
2. Generate task list with explicit pass/fail criteria:

```
Task list for [feature] — systematic mode:

1. [Task] — Done when: [grep shows X / tests pass / build clean]
2. [Task] — Done when: [specific verifiable criterion]
3. [Task] — Done when: [...]

Parallelizable: tasks [1, 2] can run simultaneously (no file overlap)
Sequential: task [3] depends on [1]
```

3. **Run Step 3.5 (skills matching).** Match skills to tasks, present verification table, wait for user to confirm skills before proceeding.

4. **User must approve task list + skills before anything executes.** This gate is non-negotiable.

4. Execute tasks — parallelizable ones via subagent implementers:
   - Read `${CLAUDE_PLUGIN_ROOT}/agents/implementer.md` for the implementer agent role
   - Each agent gets: task description, CLAUDE.md content, feature file content, file boundaries, success criteria
   - In systematic mode, dispatch a reviewer agent after each implementer: read `${CLAUDE_PLUGIN_ROOT}/agents/reviewer.md`
   - Reviewer checks: spec compliance, integration safety, convention adherence, regression risk

5. For ≥3 agents or ≥10 files: use worktree isolation (Decision 25)
   - Each agent in its own git worktree
   - Sequential merge after all complete
   - Single wiring pass (shared files, consistency check) after merge

6. Atomic commit per task with evidence: `git commit -m "feat: [task] — build passes, 0 TS errors, 12/12 tests pass"`

7. Mini-verification after each task:
   - `npm run build` → 0 errors
   - `npx tsc --noEmit` → 0 errors
   - Lint if configured → pass
   Fix before committing. Never commit a broken build.

8. Update STATE.md after all tasks complete.

### Parallelization Heuristic

Parallelize when: task → file mapping has no file appearing twice.

**Parallelize:** i18n (per screen), testing (per feature), accessibility audit (per component)
**Don't parallelize:** refactoring (cascades), shared state changes, cross-file dependencies

---

## Step 4: STATE.md Update

After feature is complete (user approved or all systematic tasks done):

Update `docs/STATE.md`:
- Feature status: `in progress` → `done`
- Last updated: today's date

**Phase completion check:** After updating, check if this was the last feature in the current phase (all features in the phase are now `done`).

- **If yes — last feature in phase:**
  ```
  ✓ All features in [Phase N] are done.
  Next: run `/gsr:verify` to verify the full phase before moving to Phase [N+1].
  ```
  Set `Next action` in STATE.md to: "Run `/gsr:verify` — all Phase [N] features done"

- **If no — more features remain:**
  Set `Next action` in STATE.md to: "Run `/gsr:build` → pick next feature from Phase [N]"

---

## Iron Law Enforcement

Red flags — if you're thinking any of these, stop:

| Thought | Reality |
|---------|---------|
| "The build probably passes, I'll skip checking" | Run the gate function. No shortcuts. |
| "This correction is obvious, I don't need to ask about CLAUDE.md" | Ask. The user decides what goes in Learned Rules. |
| "I'll skip skills matching for this simple feature" | Run Step 3.5. Always. Skills prevent the most expensive mistakes. |
| "The user hasn't responded to my completion message, must mean it's fine" | Wait for explicit approval before committing. |
| "I'll combine a few small fixes into one commit" | Atomic commits. One per task. Reviewable, bisectable. |
