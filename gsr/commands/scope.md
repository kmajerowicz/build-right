You are running the `/gsr:scope` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), check `.gsr-session.json` in the current directory — it records the last known project directory. If it exists and points elsewhere, `cd` there. Otherwise, stop and ask the user to confirm the correct directory before proceeding.

**Session manifest:** After confirming the working directory, write `.gsr-session.json` in the project root:
```json
{ "project_dir": "<absolute path>", "project_name": "<from CLAUDE.md or scope>", "last_command": "gsr:scope", "timestamp": "<ISO 8601>" }
```
Update this file (don't recreate) if it already exists — preserve `project_dir` and `project_name`, update `last_command` and `timestamp`.

Load and execute the scope-shaping skill: read `${CLAUDE_PLUGIN_ROOT}/skills/scope-shaping/SKILL.md` in full, then follow its instructions exactly.

Your output from this session will be `docs/scope.md` in the user's project.

When scope shaping is complete, tell the user:
> Scope complete. Clear context (`/clear`) and run `/gsr:prd` to generate the PRD and project files.
