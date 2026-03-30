You are running the `/gsr:prd` command.

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
