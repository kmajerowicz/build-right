# Phase 1 — Reliability Core

**Date:** 2026-04-17
**Status:** planned, not started
**Owner:** Kacper
**Target version:** 0.3.0 (after tickets 1+2 ship); 0.3.x patches thereafter

---

## Why this exists

GSR's biggest failure mode today is context loss. When `/clear` fires or a session crashes mid-work, in-chat state dies:
- Debug investigations — hypotheses, evidence, eliminated causes (build skill currently points at `gsr/docs/patterns/systematic-debugging.md`, but that's process-only; no file persistence).
- Systematic-mode task lists — generated in chat, never written down (`gsr/skills/build/SKILL.md:230-278`).
- Reviewer output — single-pass, 4-dimension review can bury spec misses under minor convention noise.

Research (April 2026) validated:
- Superpowers persists plans to `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`. Same pattern is cheap to adopt.
- Superpowers' `systematic-debugging` SKILL.md is process-only — **no persistence**. GSR has the same gap. This is the biggest real differentiator opportunity.
- Superpowers' `subagent-driven-development` runs spec-compliance review first as a gate, then code quality. GSR folds them into one pass.
- Context loss is a widely documented Claude Code pain point (multiple community tools exist to work around it).

Anchor principle for Phase 1: **every important step in GSR should survive context loss.**

---

## Decisions locked (from 2026-04-17 planning conversation)

- **Debug file structure:** one file per investigation, flat directory (`docs/debug/<YYYY-MM-DD>-<slug>.md`). Status lives in frontmatter, not in path. No nested `active/`/`resolved/` dirs.
- **Reviewer split:** two separate agent files (`reviewer-spec.md` + `reviewer-quality.md`), not one file with a mode flag.
- **Feature-sketch gate:** Design C — heuristic decides when to fire; user can override with a flag to force it. Silent when heuristic doesn't fire.
- **Creative mode (A) stays untouched by Ticket 2 persistence.** Mode A is conversational by contract; a plan file would ossify something that changes every turn.
- **Creative mode stays untouched by Ticket 3 two-stage review** for now. Revisit after Ticket 4 lands.

---

## Ticket 1 — `/gsr:debug` with persistent debug session file

### Goal
Every active debug investigation writes to a file on disk that survives `/clear` and session end. A fresh Claude can resume by reading that file.

### Files to add
- `gsr/commands/debug.md` — new command entry point, mirrors shape of `gsr/commands/build.md`
- `gsr/skills/debug/SKILL.md` — full 4-phase protocol with file writes at each phase
- `gsr/templates/debug-md.md` — template the skill writes into `docs/debug/`

### Files to edit
- `gsr/skills/build/SKILL.md:222-223` — Mode A "when stuck" path currently tells Claude to inline the systematic-debugging pattern. Change to: check for an active debug file for this feature; resume if one exists, else invoke `/gsr:debug` flow.
- `gsr/docs/patterns/systematic-debugging.md` — keep the 4-phase mental model, add pointer to the skill for the on-disk protocol. No content removal; this pattern doc stays canonical for the *thinking*.

### File format — `docs/debug/<YYYY-MM-DD>-<slug>.md`

Frontmatter:
```yaml
---
status: active | paused | resolved
feature: <feature-name or "general">
created: <ISO date>
updated: <ISO date>
---
```

Sections (in order):
1. **Symptom** — user-observable bug, one paragraph
2. **Reproduction** — exact steps, numbered
3. **Current Focus** — exactly ONE hypothesis under test (Iron Law: one hypothesis at a time, matches systematic-debugging.md:31-33)
4. **Evidence** — append-only list, each entry dated, grouped by observation
5. **Eliminated** — append-only list of disproved hypotheses with why
6. **Next Step** — single concrete action (the thing Claude will do next turn)
7. **Timeline** — append-only phase transition log (OBSERVE → HYPOTHESIZE → TEST → CONCLUDE)

### Flow
- `/gsr:debug` with no argument: list active sessions in `docs/debug/` filtered by `status: active`. If none, prompt for symptom and create a new file.
- `/gsr:debug resume <slug>`: load that file, continue from Current Focus + Next Step.
- Each phase transition ends with a file write.
- On CONCLUDE + verified fix: set `status: resolved`. Keep the file as an incident record. Ask user: "Add to CLAUDE.md Learned Rules?" — same pattern as Mode A corrections.

### Build-skill integration
`gsr/skills/build/SKILL.md:222-223` currently reads:
> **When stuck or something breaks:**
> Switch to systematic debugging. Read `${CLAUDE_PLUGIN_ROOT}/docs/patterns/systematic-debugging.md`. Follow the 4-phase process...

Change to: check if `docs/debug/*.md` contains an active file for the current feature. If yes, resume. If no, invoke `/gsr:debug` to start a new session. After fix is verified (status: resolved), return to build flow.

### Acceptance
- File appears at `docs/debug/<date>-<slug>.md` when `/gsr:debug` is run.
- After `/clear`, running `/gsr:debug` lists active sessions and offers resume.
- Template enforces Current Focus = exactly one hypothesis.
- Build skill hands off cleanly instead of inlining the 4-phase.
- Resolved files stay on disk; "Add to Learned Rules?" prompt fires on resolve.

### Still open
- Sub-investigation handling (rare): if a hypothesis branches, create a new sibling file referencing the parent. Not a v1 concern — document the pattern, don't build tooling.

---

## Ticket 2 — Persistent systematic-mode plans

### Goal
Every Mode B task list is written to disk before execution starts and updated as tasks complete. Resumption is a file read away.

### Files to add
- `gsr/templates/plan-md.md` — template for the written plan

### Files to edit
- `gsr/skills/build/SKILL.md:230-278` — Mode B section:
  - Step 3 (task list generation): write the plan file before the "User must approve task list" gate.
  - Execution loop: after each task completes, update that task's row with status + commit SHA + gate output.
  - Step 1 or Step 2: on entry, if an in-progress plan exists for the selected feature, offer resume.
- `gsr/agents/implementer.md` — add 2-3 lines to the status protocol: on DONE, report the commit SHA so the controller can update the plan file.

### File path
`docs/plans/<YYYY-MM-DD>-<feature-slug>.md` — matches Superpowers' validated pattern (minus the vendor-prefixed dir).

### File contents
- Frontmatter: `feature`, `mode` (systematic), `status` (in_progress | complete | abandoned), `created`, `updated`
- Link to `docs/features/<name>.md`
- Skills confirmed list (from Step 3.5 output)
- Task table with columns: ID, description, done-when, file boundaries, status (pending/in-progress/done/failed), evidence (commit SHA + gate output)
- Parallelization map: which tasks are batched in which agent dispatch

### Flow
1. Step 3 drafts task list in chat as today.
2. Before approval gate, write plan file.
3. Approval message becomes: "Task list + plan saved to `docs/plans/...`. Approve to execute?"
4. After each implementer+reviewer cycle, controller updates the task row.
5. On completion, set `status: complete`.
6. On `/gsr:build` entry with a feature that has `status: in_progress` plan: offer resume.

### Scope boundaries
- **Mode A (Creative) does NOT get a plan file.** Conversational by design.
- Plan files stay on disk forever as audit trail. No auto-deletion on verify PASS.

### Acceptance
- Mode B writes a file before execution starts.
- Task status visibly updates as work progresses.
- `/clear` mid-build then `/gsr:build` same feature offers resume from last incomplete task.
- Completed plans remain on disk.

### Dependency
**Independent of Ticket 1.** Can run in parallel. Same target version (0.3.0).

---

## Ticket 3 — Sequenced two-stage review

### Goal
Split the single-pass reviewer into two sequenced stages. Stage 1 (spec compliance) gates Stage 2 (quality/integration/regression).

### Files to add
- `gsr/agents/reviewer-spec.md` — only §1 (Spec Compliance) from current `reviewer.md`. 3 statuses: SPEC_PASS / SPEC_FAIL / NEEDS_INFO.
- `gsr/agents/reviewer-quality.md` — §2-4 (Integration / Convention / Regression) from current `reviewer.md`. Keeps today's 4 statuses.

### Files to edit
- `gsr/agents/reviewer.md` — **delete**, or keep as a redirect stub pointing at the two new files. Recommend delete for cleanliness; the two new files share only ~10 lines of context-handoff boilerplate.
- `gsr/skills/build/SKILL.md:255` — Mode B dispatch loop: after each implementer, dispatch `reviewer-spec` first. If SPEC_PASS, dispatch `reviewer-quality`. If SPEC_FAIL, fail the task back to the implementer (or user, if it's a product decision).
- `gsr/docs/patterns/code-review.md` — document the two-stage protocol.

### Rationale (from planning conversation)
Role clarity beats code reuse for agent prompts. Each agent file is a focused role description; no "am I in stage 1 or stage 2" branching logic inside the prompt. Loading cost drops (each stage loads only what it needs). Status protocols differ between stages anyway — jamming both into one file means conditional protocol docs.

### Acceptance
- Mode B dispatches spec reviewer before quality reviewer.
- A diff that passes quality checks but misses the spec is caught at Stage 1 and never reaches Stage 2.
- Controller output shows two distinct review steps per task.
- Creative mode (A) unaffected.

### Dependency
Independent of 1 and 2. Target: 0.3.x patch.

### Overlap note
The existing backlog item "Superpowers-Inspired: Requesting and Receiving Code Review as Skills" (in `gsr/docs/backlog.md`) is a larger reshape. This ticket is the minimal fix. The backlog item stays deferred.

---

## Ticket 4 — Feature-sketch gate for ambiguous features (Design C)

### Goal
Between Step 2 (Load Feature Context) and Step 3 (Mode Selection) in `/gsr:build`, insert an auto-triggered sketch gate for ambiguous features. Heuristic decides; user can override with a flag.

### Files to add
- `gsr/docs/patterns/feature-sketch.md` — pattern doc: what a sketch contains, when to propose it, the heuristic.

### Files to edit
- `gsr/skills/build/SKILL.md` — insert new **Step 2.5: Design Sketch Gate** between current Step 2 (line ~97) and current Step 3 (line ~99).
- `gsr/commands/build.md` — accept an optional `--sketch` flag to force the gate.

### Heuristic (auto-trigger logic)
Scan the selected feature file. Fire the sketch gate if **any** of:
- Fewer than 3 concrete states (empty / loading / error / success)
- No acceptance criteria or done-when in the must-haves section
- Explicit `TBD`, `?`, or `decide during build` markers in the file
- Feature declares dependencies on >3 other features (cross-cutting)

If none trigger **and** user did not pass `--sketch` → skip the gate silently, go to Step 3.

### Override (Design C)
`--sketch` forces the gate regardless of heuristic. Use case: user knows a "clean-looking" feature is conceptually risky in ways the heuristic can't see.

### Sketch contents (~15-25 lines, kept short)
- One-paragraph approach summary
- File map (what to add / change)
- Data shape if feature handles data
- One "what could break" line
- Out of scope (explicit)

### Flow
1. Heuristic fires (or `--sketch` passed) → Claude proposes the sketch inline.
2. User reviews: approve, edit inline ("add X to out-of-scope"), or decline ("skip, I know what I'm building" — one-click escape).
3. On approve: append sketch to the feature file itself as `## Build Sketch — <date>` section. **Do not** create a separate file — keeps feature docs canonical.
4. Proceed to Step 3 (Mode Selection).

### Acceptance
- Feature files with TBD markers trigger the gate automatically.
- Clean feature files skip silently (no prompt).
- `/gsr:build --sketch` forces the gate even on clean files.
- Sketch is appended to the feature file on approval (visible diff).
- "Skip, I know what I'm building" exits the gate in one click.
- Build flow unchanged for features that don't trigger.

### Dependency
Independent. Target: 0.3.x minor after tickets 1-3 ship.

---

## Execution order

1. **Tickets 1 + 2 in parallel** — both are "durable artifact" patterns using the same `docs/<kind>/` convention. Compound each other. Target version 0.3.0.
2. **Ticket 3** — isolated reviewer reshape. Target 0.3.x patch.
3. **Ticket 4** — design-phase change, higher judgment. Target 0.3.x minor.

---

## Version bumps

- Tickets 1+2 shipping together: bump `plugin.json` to **0.3.0** (minor — two new user-visible features + new `/gsr:debug` command).
- Ticket 3: bump to **0.3.1** (patch — behavior change, no new surface).
- Ticket 4: bump to **0.4.0** (minor — new gate, new flag).

Per user memory: always bump version on main push.

---

## Out of scope for Phase 1

Explicitly NOT in this plan:
- Mandatory brainstorming before every task (Superpowers pattern — too heavy).
- Mandatory TDD.
- Full worktree-first execution.
- Cross-project learned memory.
- Visual/TUI polish (see backlog item "Terminal Visual Polish").
- Updating backlog items: "Deep Scope Mode," "Plan Self-Review Before Handoff," "Finishing a Branch Skill," "Writing Skills Framework." Keep deferred.

---

## Open questions for later

- Ticket 1: should resolved debug files auto-index into CLAUDE.md Learned Rules? Current answer: **no**, manual via the resolve-time prompt. Revisit if users ask.
- Ticket 2: do plan files get deleted on verify PASS? Current answer: **no**, keep as audit trail. Revisit if `docs/plans/` gets noisy.
- Ticket 3: does Creative mode (A) ever get a two-stage review? Current answer: **defer**. Re-open after Ticket 4.
- Ticket 4: does the sketch section get pruned on feature PASS? Current answer: **keep** as historical record.

---

## Notes for the implementing session

- **Plan before editing.** The user's standing rule is never edit files before discussing and getting approval. For each ticket, read the files-to-edit list, present the concrete diff plan, get explicit approval, then edit.
- **No commits without explicit user instruction.** Implement the change, show the diff, wait.
- **On main push: bump `plugin.json` version** per the version-bump table above.
- **This plan file itself dogfoods Ticket 2's pattern** — the path `gsr/docs/plans/YYYY-MM-DD-<slug>.md` is the canonical location Ticket 2 will enforce for project plans.
