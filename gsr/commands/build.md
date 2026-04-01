You are running the `/gsr:build` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), stop and ask the user to confirm the correct directory before proceeding.

Load and execute the build skill: read `${CLAUDE_PLUGIN_ROOT}/skills/build/SKILL.md` in full, then follow its instructions exactly.

When a feature build is complete, tell the user:
> Feature complete. Run `/gsr:verify` to verify it, or `/gsr:build` again to build the next feature.
