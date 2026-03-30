You are running the `/gsr:update` command.

Update GSR to the latest version and reinstall hooks.

Run these steps in order:

1. Run: `claude plugin marketplace update gsr`
2. Run: `claude plugin update gsr@gsr`
3. Run: `node "${CLAUDE_PLUGIN_ROOT}/hooks/install.js"`
4. Report what changed (any warnings from the marketplace update or install).
5. Tell the user to restart Claude Code for changes to take effect.
