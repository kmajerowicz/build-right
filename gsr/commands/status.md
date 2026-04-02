You are running the `/gsr:status` command.

**Working directory check:** If `.gsr-session.json` exists and `project_dir` points to a different directory than `pwd`, `cd` there first.

Look for `docs/STATE.md` in the current working directory.

## If STATE.md does not exist

Also check if `docs/scope.md` exists — if it does, suggest `/gsr:prd`. Otherwise:

> No STATE.md found. Run `/gsr:scope` to start a new project, or `/gsr:learn` if you have an existing codebase.

Stop here — do not continue.

## If STATE.md exists

Parse it and output a structured status report using this exact format:

---

**Project:** [project name from STATE.md header]
**Status:** [Project Status value]
**Last Updated:** [Last Updated value]

### Phase Progress
[Reproduce the phase table from STATE.md, or "No phases defined yet." if missing]

### Current Feature Progress
[Reproduce the active feature table (the one for the current/most-recent phase), or "No features in progress." if missing]

### Next Action
[Next Action value from STATE.md]

### Blockers
[List any features with status BLOCKED, or phases with status BLOCKED. If none, write "None."]

### Deferred to Backlog
[List items from the Deferred section, or "None." if empty]

### Suggested Command
[Derive from STATE.md using this logic:]
- If all phases show PASS and backlog is triaged → "Project complete. Nothing to do."
- If any phase shows VERIFYING → `/gsr:verify`
- If any phase shows BUILDING or any feature is in progress → `/gsr:build`
- If phases exist but all are NOT STARTED → `/gsr:build` (pick first feature from Phase 1)
- If no phases exist but scope.md exists → `/gsr:prd`
- If no scope.md exists → `/gsr:scope`

---

Keep the output tight — no extra commentary. If a section is missing from STATE.md, show the fallback text for that section and move on.
