You are running the `/gsr:status` command.

Read `STATE.md` in the current working directory and surface a concise status snapshot.

## If STATE.md does not exist

Tell the user:

> No STATE.md found. Run `/gsr:scope` to start a new project, or `/gsr:build` if you already have a PRD.

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

---

Keep the output tight — no extra commentary. If a section is missing from STATE.md, show the fallback text for that section and move on.
