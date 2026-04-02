You are running the `/gsr:build` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), check `.gsr-session.json` in the current directory — it records the last known project directory. If it exists and points elsewhere, `cd` there. Otherwise, stop and ask the user to confirm the correct directory before proceeding.

**Session manifest:** After confirming the working directory, write `.gsr-session.json` in the project root:
```json
{ "project_dir": "<absolute path>", "project_name": "<from CLAUDE.md or scope>", "last_command": "gsr:build", "timestamp": "<ISO 8601>" }
```
Update this file (don't recreate) if it already exists — preserve `project_dir` and `project_name`, update `last_command` and `timestamp`.

Load and execute the build skill: read `${CLAUDE_PLUGIN_ROOT}/skills/build/SKILL.md` in full, then follow its instructions exactly.

When a feature build is complete, tell the user:
> Feature complete. Run `/gsr:verify` to verify it, or `/gsr:build` again to build the next feature.
