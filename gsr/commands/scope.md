You are running the `/gsr:scope` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), stop and ask the user to confirm the correct directory before proceeding.

Load and execute the scope-shaping skill: read `${CLAUDE_PLUGIN_ROOT}/skills/scope-shaping/SKILL.md` in full, then follow its instructions exactly.

Your output from this session will be `docs/scope.md` in the user's project.

When scope shaping is complete, tell the user:
> Scope complete. Clear context (`/clear`) and run `/gsr:prd` to generate the PRD and project files.
