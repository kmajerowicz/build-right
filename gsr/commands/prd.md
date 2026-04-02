You are running the `/gsr:prd` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), check `.gsr-session.json` in the current directory — it records the last known project directory. If it exists and points elsewhere, `cd` there. Otherwise, stop and ask the user to confirm the correct directory before proceeding.

**Session manifest:** After confirming the working directory, write `.gsr-session.json` in the project root:
```json
{ "project_dir": "<absolute path>", "project_name": "<from CLAUDE.md or scope>", "last_command": "gsr:prd", "timestamp": "<ISO 8601>" }
```
Update this file (don't recreate) if it already exists — preserve `project_dir` and `project_name`, update `last_command` and `timestamp`.

Load and execute the PRD generation skill: read `${CLAUDE_PLUGIN_ROOT}/skills/prd-generation/SKILL.md` in full, then follow its instructions exactly.

Your output from this session will be:
- `docs/PRD.md` — condensed product knowledge
- `docs/features/*.md` — one file per feature
- `CLAUDE.md` — technical instruction manual
- `docs/STATE.md` — progress tracker
- `docs/BACKLOG.md` — deferred work
- `docs/techstack.md` — stack and tech decisions

When PRD generation and project init are complete, tell the user:
> Project initialized. Clear context (`/clear`) and run `/gsr:build` to start building.
