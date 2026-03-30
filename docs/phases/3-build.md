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
- Before committing, Claude highlights key review points from the code review checklist (`docs/patterns/code-review.md`) — focusing on integration safety and what the user should manually verify

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
- Reviewer subagent (per D29) follows the code review checklist (`docs/patterns/code-review.md`) covering spec compliance, integration safety, convention adherence, and regression risk

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
