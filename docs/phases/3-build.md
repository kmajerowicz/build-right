# Phase 3: Build

**Two modes, selected by prompt within `/gsr:build`. User picks a feature to build, then chooses the mode. Features are grouped into build phases defined in the PRD.**

---

## Mode A: Creative Build (human-in-the-loop)

**When:** UI components, screens, interactions, design-sensitive features — anything the user will see and judge.

### How
1. User gives a small, scoped task: "Build the dashboard (see `docs/features/dashboard.md`)"
2. System reads the feature file → loads skills listed in the feature's Skills section + project-wide skills from techstack.md → reads relevant SKILL.md files
3. Claude reads CLAUDE.md (conventions, references, learned rules)
4. Plan mode if >2 files, direct implementation otherwise
5. User reviews every diff, tests in browser
6. User corrects → Claude asks "Add this to CLAUDE.md Learned Rules?"
7. Atomic commit after user approves
8. STATE.md auto-updates (task count incremented)

### Rules
- Claude always says "done, test it" or "still need X" — never "should work"
- Before saying done: code compiles, no TS errors, build passes
- Skills are enforced by the workflow (loaded from feature file), not by Claude remembering a rule

### Mini-verification per task
Before telling the user "done, test it," Claude runs the gate function (see Phase 4) at minimum Tier 1:
1. `npm run build` (or equivalent) — must pass with 0 errors
2. `npx tsc --noEmit` — must report 0 TypeScript errors
3. Lint if configured — must pass

If any check fails, Claude fixes the issue before claiming done. The claim must reference the output: "done, test it — build passes (0 errors), TS clean." Never "done, should work."

---

## Mode B: Systematic Build (agent-driven with verification)

**When:** Testing, i18n, accessibility, security hardening, performance — anything with clear pass/fail criteria and no design judgment.

### How
1. User describes the systematic task
2. Claude generates task list with pass/fail criteria
3. User approves the list (gate — nothing executes without approval)
4. Claude executes tasks (parallelizable where independent)
5. Atomic commit per task
6. Verification report with grep-based evidence
7. User spot-checks results

### Rules
- Agent reads CLAUDE.md and all accumulated corrections before starting
- If agent encounters ambiguity requiring product judgment → stops and asks, never decides autonomously
- Verification is evidence-based: grep results, test output, build status

### Mini-verification per task
As part of each atomic commit cycle, before committing, the agent runs the gate function (see Phase 4) at minimum Tier 1:
1. `npm run build` — must pass with 0 errors
2. `npx tsc --noEmit` — must report 0 TypeScript errors
3. Lint if configured — must pass

If any check fails, the agent fixes before committing. Commit messages include evidence: "feat: add i18n for dashboard — build passes, 0 TS errors, 12/12 tests pass."

---

## Task Classification Heuristic

If the task requires taste, empathy, or design judgment → creative (Mode A).
If it has clear pass/fail criteria and no design judgment → systematic (Mode B).

| Task Type | Mode | Why |
|-----------|------|-----|
| UI components | Creative | Taste, design quality |
| Screen layouts | Creative | Information density, feel |
| New features (first time) | Creative | Product decisions |
| Bug fixes | Creative | Root cause needs context |
| Testing | Systematic | Clear pass/fail |
| i18n | Systematic | Mechanical extraction |
| Accessibility | Systematic | Checklist-based |
| Security hardening | Systematic | Checklist-based |
| Refactoring | Systematic + human review | Pattern-based but verify nothing broke |

---

## Parallelization

Independent systematic tasks can run in parallel via multiple agents. All parallel agents share the same CLAUDE.md context — they run concurrently but with the same instruction manual and accumulated corrections.

Specific parallelization opportunities:
- Independent systematic tasks in sweep mode
- Verification checks (grep, tests, build — all independent)
