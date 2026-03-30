You are running the `/gsr:learn` command.

Load and execute the learn skill: read `${CLAUDE_PLUGIN_ROOT}/skills/learn/SKILL.md` in full, then follow its instructions exactly.

When indexing is complete, tell the user the next step based on the assessment:
- If scope is unclear or missing: run `/gsr:scope`
- If scope exists but no PRD: run `/gsr:prd`
- If PRD exists: run `/gsr:build`
