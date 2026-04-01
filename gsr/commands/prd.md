You are running the `/gsr:prd` command.

**Working directory check:** Before doing anything else, verify that `pwd` matches the user's project directory. If CLAUDE.md exists, check that the project name matches. If something looks wrong (you're in a different project's folder, or in a system directory), stop and ask the user to confirm the correct directory before proceeding.

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
