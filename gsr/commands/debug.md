You are running the `/gsr:debug` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), check `.gsr-session.json` in the current directory — it records the last known project directory. If it exists and points elsewhere, `cd` there. Otherwise, stop and ask the user to confirm the correct directory before proceeding.

**Session manifest:** After confirming the working directory, write `.gsr-session.json` in the project root:
```json
{ "project_dir": "<absolute path>", "project_name": "<from CLAUDE.md or scope>", "last_command": "gsr:debug", "timestamp": "<ISO 8601>" }
```
Update this file (don't recreate) if it already exists — preserve `project_dir` and `project_name`, update `last_command` and `timestamp`.

**Invocation variants:**

- `/gsr:debug` — no argument: scan `docs/debug/` for files with `status: active` in frontmatter. If any exist, list them and ask the user which to resume (or start new). If none exist, prompt for a symptom and start a new session.
- `/gsr:debug resume <slug>` — load `docs/debug/<slug>.md` directly, continue from Current Focus + Next Step.

Load and execute the debug skill: read `${CLAUDE_PLUGIN_ROOT}/skills/debug/SKILL.md` in full, then follow its instructions exactly.

When a debug session is resolved, tell the user:
> Session resolved and saved to `docs/debug/<slug>.md`. Return to build with `/gsr:build`, or start another debug session with `/gsr:debug`.
