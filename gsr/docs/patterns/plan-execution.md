# Plan Execution with Checkpoints

**How plans are created and executed within `/gsr:build`.**

---

## Overview

Plans are created when a build task touches more than 2 files (per Phase 3 build spec). Instead of jumping straight into code, the system produces a structured plan with a file map and task breakdown. The user approves the file map before any code is written. Execution proceeds task-by-task with checkpoints after each one.

---

## Plan Structure

Every plan in `/gsr:build` includes:

### File Map

```
## File Map
Files to CREATE:
- src/components/DashboardCard.tsx (new)
- src/components/DashboardCard.test.tsx (new)

Files to MODIFY:
- src/pages/Dashboard.tsx (add card grid)
- src/styles/dashboard.css (card styles)

Files NOT touched:
- src/router.tsx (no route changes needed)
```

Why the file map matters:
- User sees scope before any code is written
- Prevents creep ("why are you touching the router?")
- Makes rollback scope clear

### Task Breakdown

- Each task is small enough to be one atomic commit
- Tasks have clear done criteria (not "implement dashboard" but "DashboardCard renders with mock data prop")
- Tasks are ordered by dependency (data layer before UI that uses it)
- Each task lists which files from the file map it touches

---

## Checkpoint Protocol

After each task:

1. Run gate function (build passes, 0 TS errors, no lint errors)
2. If gate passes → atomic commit → status update → next task
3. If gate fails → diagnose (use systematic debugging if needed) → fix → re-run gate
4. STATE.md auto-updates with task count

Checkpoint status format (spoken to user):

> "Task 3/7 — DashboardCard renders with mock data. Next: wire up Supabase query."

---

## Rollback Protocol

When a task breaks the build and quick fix isn't obvious:

1. **Revert to last checkpoint:** `git revert` or `git reset` to last passing commit
2. **Re-analyze:** why did it break? What assumption was wrong?
3. **Re-approach:** try a different implementation path
4. **If same task fails twice** → escalate to user with: what was tried, why it failed, what options remain

---

## Red Flags

- **"Let me just fix this one thing before committing"** and it cascades into 5 fixes → STOP. Commit what works, fix separately.
- **Plan has no file map** → STOP. Create the file map first.
- **Task touches files not in the file map** → STOP. Update the map and get user approval.
- **Skipping checkpoint because "the next task is small"** → STOP. Always checkpoint.
