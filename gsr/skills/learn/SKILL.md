# /gsr:learn — Learn Skill

You are executing the `/gsr:learn` command. Your job is to index an existing project so that GSR can work with it, then tell the user exactly what to do next.

This skill serves two use cases:
1. **First run** — onboarding a new codebase into GSR (Start B or Start C)
2. **Re-run** — refreshing after significant codebase changes

---

## Iron Law

**Never ask a human to do something a file scan can answer.** Read the code first. Ask only when the code can't tell you.

---

## Step 1: Detect What Exists

Before asking the user anything, scan the project:

```
Read these if they exist:
- CLAUDE.md
- README.md
- docs/PRD.md
- docs/scope.md
- docs/STATE.md
- docs/techstack.md
- docs/features/ (list files)
- package.json or equivalent
- src/ structure (top-level folders)
- Any config files (.env.example, tsconfig.json, next.config.*, etc.)
```

From this scan, determine:
- **What GSR artifacts exist** (CLAUDE.md, STATE.md, PRD.md, feature files)
- **Tech stack** (language, framework, database, auth, hosting — from package.json/config)
- **Code conventions** (naming patterns, folder structure — from src/)
- **Project maturity** (has tests? has docs? has migrations?)

---

## Step 2: Map the Codebase (parallel agents for large codebases)

For each major area of the codebase, understand:

1. **Architecture** — how is the code structured? What are the main modules/layers?
2. **Tech stack** — exact versions, build tools, deployment setup
3. **Conventions** — naming (camelCase/snake_case/kebab-case), file organization, import patterns
4. **Data layer** — where does data live? What's the schema source of truth?
5. **Auth** — how is authentication handled?
6. **External services** — what third-party services are configured?

For large codebases (>50 files in src/), dispatch parallel researcher agents to cover different areas simultaneously. For small projects, do this directly.

---

## Step 3: Partial GSR Setup Handling

Based on what you found in Step 1, handle each scenario:

### No GSR setup (CLAUDE.md missing or no GSR references)
Create from scratch:
- `CLAUDE.md` from `${CLAUDE_PLUGIN_ROOT}/templates/claude-md.md` — fill in project name, stack references, conventions found in Step 2
- `docs/techstack.md` from `${CLAUDE_PLUGIN_ROOT}/templates/techstack-md.md` — fill in stack detected
- `docs/STATE.md` from `${CLAUDE_PLUGIN_ROOT}/templates/state-md.md` — minimal placeholder
- `docs/BACKLOG.md` from `${CLAUDE_PLUGIN_ROOT}/templates/backlog-md.md` — empty
- `docs/features/` — create directory (empty)

### CLAUDE.md exists, no PRD
- Read CLAUDE.md — validate references are accurate (do the paths still exist?)
- Add GSR structure note if missing: references to docs/PRD.md, docs/features/
- Create missing docs/ files as above
- Do NOT overwrite existing content in CLAUDE.md

### CLAUDE.md + PRD exist, no feature files
- Read both, validate they're consistent
- Note which features in the PRD don't have feature files yet
- Do not create feature files — that's `/gsr:prd` work. Just note the gap.

### Full GSR setup exists (CLAUDE.md + PRD + feature files + STATE.md)
- Re-index: check that CLAUDE.md references still point to real paths
- Check STATE.md is current
- Flag any stale references: "CLAUDE.md references `src/router.tsx` but that file doesn't exist"
- Update CLAUDE.md with any new conventions spotted in the codebase

---

## Step 4: Produce the Assessment

After indexing, output a structured assessment:

```
## GSR Assessment — [Project Name]

### What Exists
[List GSR artifacts found and their status]

### Tech Stack Detected
[Framework, language, key libraries, version of node/etc.]

### Conventions Identified
[Naming patterns, folder structure, key patterns]

### Gaps
[What's missing from full GSR setup]

### Stale References (if re-run)
[CLAUDE.md references that no longer point to valid paths]

### Next Step
[Exactly what command to run next, and why]
```

**Next step logic:**

First check which GSR artifacts exist, then read STATE.md to understand actual project progress:

```
No scope, no PRD
  → "Run /gsr:scope to shape your idea into a scope document."

Has scope, no PRD
  → "Run /gsr:prd to generate PRD and feature files."

Has PRD, no STATE.md or STATE.md is empty
  → "Run /gsr:prd to generate feature files and initialize STATE.md."

Has full setup → read docs/STATE.md and determine:
  - Any phase is BLOCKED
      → "Phase [N] is blocked. Blockers: [list from STATE.md]. Resolve these before continuing."
  - Current phase has features in progress
      → "You're mid-phase [N]. [Feature] is in progress. Run /gsr:build to resume it."
  - All features in current phase are done but phase not verified
      → "All Phase [N] features are done but not verified. Run /gsr:verify to verify the phase."
  - Phase is PASS, next phase not started
      → "Phase [N] passed. Run /gsr:build to start Phase [N+1]: [phase name]."
  - All phases PASS
      → "All phases complete. Run /gsr:verify to do backlog triage and wrap up."
```

Never say "run /gsr:build" without telling the user which phase and what feature to pick next.

---

## Step 5: Update CLAUDE.md

After the assessment, update (or create) CLAUDE.md:

1. **References section** — add correct paths for: schema, routes, design tokens, API client (whatever is relevant to this project)
2. **Code Conventions** — fill in what you found: naming, folder structure, patterns
3. **Tech Stack** → update `docs/techstack.md` if it exists, or note it in CLAUDE.md

**Never overwrite existing Learned Rules.** Append only.

---

## Iron Law Enforcement

**Before finishing, verify:**
- Did I read the actual code, not just guess from file names?
- Are all CLAUDE.md references pointing to files that actually exist?
- Did I flag every stale reference?
- Is the "next step" instruction specific and actionable?

Red flags — if you're thinking any of these, stop:
- "I'll approximate the conventions from what I see" → Read more files, don't approximate
- "The user can figure out the next step" → Be specific. Tell them exactly what to run.
- "I don't need to check if references are valid" → Always validate references exist
