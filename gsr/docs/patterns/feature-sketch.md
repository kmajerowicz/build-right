# Feature Sketch Pattern

**A lightweight design checkpoint that fires before mode selection when a feature is ambiguous. Keeps the build from starting on a shaky foundation.**

---

## Overview

A sketch is not a PRD and not a task list. It is a 15-25 line alignment artifact that answers: "Do we agree on what we're building and how?" It lives in the feature file, not in a separate doc.

The sketch gate fires automatically when the heuristic detects ambiguity, or unconditionally when `--sketch` is passed. If neither condition applies, it is silent — the build proceeds to Step 3 without any prompt.

---

## Heuristic — When to Fire

Fire the sketch gate if **any** of these are true in the feature file:

1. **Fewer than 3 concrete states** — the feature file mentions fewer than 3 of: empty, loading, error, success, offline, partial
2. **No acceptance criteria** — no done-when language, no explicit acceptance criteria, no verifiable must-haves
3. **Explicit ambiguity markers** — `TBD`, `?`, or `decide during build` appear anywhere in the file
4. **High cross-feature coupling** — feature declares dependencies on more than 3 other features

If none trigger and `--sketch` was not passed: skip silently. Do not prompt. Do not mention the gate.

---

## Override

`/gsr:build --sketch` forces the gate regardless of what the heuristic finds. Use case: the feature file looks clean but the builder knows it's conceptually risky in ways the heuristic can't see.

---

## Sketch Contents

Keep it to 15-25 lines. Every element is mandatory:

**Approach** — one paragraph. What is being built and how. The key design decision in plain language.

**File map** — what files to add and what files to change. Not exhaustive — just the load-bearing ones.

**Data shape** — only if the feature handles data (reads/writes state, calls an API, transforms input). Skip if purely presentational.

**What could break** — one line. The single most likely integration failure or regression risk.

**Out of scope** — explicit list. What a reasonable person might expect this feature to include but won't. Prevents scope creep mid-build.

---

## Flow

1. Gate fires (heuristic or `--sketch`) → Claude proposes sketch inline
2. User reviews:
   - **Approve** → sketch appended to feature file, proceed to Step 3
   - **Edit** → user says what to change, Claude revises, loop back to step 2
   - **Skip** → proceed to Step 3, no file written (one-click escape, no friction)
3. On Approve: append to `docs/features/<name>.md` as:
   ```markdown
   ## Build Sketch — <YYYY-MM-DD>
   <sketch content>
   ```
   The feature file is the canonical home. Do not create a separate sketch file.

---

## Why the Feature File

Keeping the sketch in the feature file means there is one place to read the full context of a feature: its requirements AND the design decisions made before building it. A separate file creates a two-file lookup problem and tends to get forgotten after the build.
