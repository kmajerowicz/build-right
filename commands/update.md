You are running the `/gsr:update` command.

Update GSR to the latest version and reinstall hooks.

Run these steps in order:

1. Run: `claude plugin marketplace update gsr`
2. Run: `node "$HOME/.claude/plugins/marketplaces/gsr/hooks/install.js"`
3. Report what changed (any warnings from the marketplace update or install).
4. Tell the user to restart Claude Code for changes to take effect.
