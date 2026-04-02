You are running the `/gsr:learn` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), check `.gsr-session.json` in the current directory — it records the last known project directory. If it exists and points elsewhere, `cd` there. Otherwise, stop and ask the user to confirm the correct directory before proceeding.

**Session manifest:** After confirming the working directory, write `.gsr-session.json` in the project root:
```json
{ "project_dir": "<absolute path>", "project_name": "<from CLAUDE.md or scope>", "last_command": "gsr:learn", "timestamp": "<ISO 8601>" }
```
Update this file (don't recreate) if it already exists — preserve `project_dir` and `project_name`, update `last_command` and `timestamp`.

Load and execute the learn skill: read `${CLAUDE_PLUGIN_ROOT}/skills/learn/SKILL.md` in full, then follow its instructions exactly.

When indexing is complete, tell the user the next step based on the assessment:
- If scope is unclear or missing: run `/gsr:scope`
- If scope exists but no PRD: run `/gsr:prd`
- If PRD exists: run `/gsr:build`
