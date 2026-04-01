You are running the `/gsr:verify` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), stop and ask the user to confirm the correct directory before proceeding.

Load and execute the verification skill: read `${CLAUDE_PLUGIN_ROOT}/skills/verification/SKILL.md` in full, then follow its instructions exactly.

When verification is complete, tell the user:
> Verification complete. If all phases PASS and backlog is triaged, the project is done. Otherwise, run `/gsr:build` to continue.
