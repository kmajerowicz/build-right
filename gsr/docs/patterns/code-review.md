# Code Review Pattern

**A unified review checklist for both build modes — subagent reviewer (systematic) and human review highlights (creative).**

---

## Overview

Code review happens after implementation, before commit — in both modes. The review covers 4 dimensions that together catch spec gaps, integration breaks, convention drift, and regression risk.

---

## The 4 Review Dimensions

### 1. Spec Compliance

- Does the implementation match the feature file's user flow?
- Are all states handled (empty, partial, full, error, loading)?
- Are business rules correctly implemented?
- Are edge cases from the feature file covered?

### 2. Integration Safety (especially important for Start C)

- Does the new code affect existing features?
- Are shared components/utilities modified? If so, do all consumers still work?
- Are existing API contracts preserved?
- Does the data model change affect existing queries/views?
- Are there implicit dependencies that the feature file doesn't cover?
- Run existing tests — do they still pass?

### 3. Convention Adherence

- Does the code follow CLAUDE.md conventions (naming, folder structure, patterns)?
- Are learned rules respected (especially recent corrections)?
- Are project-wide skills patterns followed (e.g., responsive-design if mobile-first)?
- Is the code consistent with existing codebase style?

### 4. Regression Risk

- What could this change break that isn't obvious?
- Are there shared state/stores that multiple features read?
- Are there event listeners, subscriptions, or side effects that might conflict?
- Is the test coverage sufficient for the interaction points?

---

## How It Works in Each Mode

### Creative mode (human-in-the-loop)

- After implementation, before commit
- Claude highlights key review points from dimensions 1-4
- Focus on what the USER should check (visual, interaction, integration with existing flows)
- Not a full formal review — lightweight, focused on high-risk areas
- Example: "Before committing: this changes the shared UserContext — verify that Profile page still loads correctly"

### Systematic mode (two-stage subagent review)

Review runs in two sequenced stages. Stage 1 gates Stage 2 — a diff that misses the spec never reaches quality review.

**Stage 1 — Spec Compliance** (`reviewer-spec.md`):
- Checks dimension 1 only: user flow, states, business rules, must-haves
- Statuses: SPEC_PASS / SPEC_FAIL / NEEDS_INFO
- SPEC_FAIL → task fails back to implementer; Stage 2 does not run
- NEEDS_INFO → controller surfaces question to user, then re-runs Stage 1

**Stage 2 — Quality** (`reviewer-quality.md`):
- Runs only after SPEC_PASS
- Checks dimensions 2-4: integration safety, convention adherence, regression risk
- Statuses: APPROVED / APPROVED_WITH_CONCERNS / CHANGES_REQUESTED / NEEDS_MORE_INFO
- Integration safety dimension gets extra weight for Start C projects
- Reviewer flags but doesn't fix — issues go back to implementer

---

## Start C — Extra Integration Checks

When working on an existing product (Start C), the integration safety dimension expands:

- Check that existing user flows still work end-to-end
- Verify that the new feature's data model changes don't break existing migrations
- Test existing API endpoints that the new feature touches
- Check for CSS/styling conflicts with existing components
- Verify that the new feature respects existing auth/permission patterns

---

## Red Flags (Iron Law enforcement)

- "This change is isolated, no need to check integration" → STOP. In existing products, nothing is truly isolated.
- "Tests pass, so integration is fine" → STOP. Tests don't cover all integration points. Check manually.
- "I only changed one file" → STOP. One file can have many consumers. Check them.
- "The feature file doesn't mention existing features" → STOP. Feature files describe what to build, not what might break.
