#!/usr/bin/env node
// Claude Code Statusline — GSR Edition
// Shows: model | phase/task | directory | context usage
//
// Reads GSR state from docs/STATE.md to show current phase and focus.
// Writes context metrics to a bridge file for the context-monitor hook.

const fs = require('fs');
const path = require('path');
const os = require('os');

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const session = data.session_id || '';
    const remaining = data.context_window?.remaining_percentage;

    // ── Context usage bar ──────────────────────────────────────────────
    // Claude Code reserves ~16.5% for autocompact buffer. We normalize
    // to show 100% at the point where compaction would trigger.
    const AUTO_COMPACT_BUFFER_PCT = 16.5;
    let ctx = '';
    if (remaining != null) {
      const usableRemaining = Math.max(0, ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100);
      const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

      // Write bridge file for context-monitor hook
      if (session) {
        try {
          const bridgePath = path.join(os.tmpdir(), `claude-ctx-${session}.json`);
          fs.writeFileSync(bridgePath, JSON.stringify({
            session_id: session,
            remaining_percentage: remaining,
            used_pct: used,
            timestamp: Math.floor(Date.now() / 1000)
          }));
        } catch (e) { /* best-effort */ }
      }

      const filled = Math.floor(used / 10);
      const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled);

      if (used < 50) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 65) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 80) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m\u{1F480} ${bar} ${used}%\x1b[0m`;
      }
    }

    // ── Current focus from GSR STATE.md ────────────────────────────────
    let focus = '';
    const cwd = data.workspace?.current_dir || process.cwd();
    const statePath = path.join(cwd, 'docs', 'STATE.md');
    if (fs.existsSync(statePath)) {
      try {
        const stateContent = fs.readFileSync(statePath, 'utf8');

        // Try "Current focus:" line first
        const focusMatch = stateContent.match(/\*\*?Current focus\*?\*?:?\s*(.+)/i);
        if (focusMatch) {
          focus = focusMatch[1].trim().replace(/\*+/g, '');
        }

        // Fallback: try "Next action:" if no focus found
        if (!focus) {
          const nextMatch = stateContent.match(/\*\*?Next action\*?\*?:?\s*(.+)/i);
          if (nextMatch) {
            focus = nextMatch[1].trim().replace(/\*+/g, '');
          }
        }

        // Truncate if too long
        if (focus.length > 40) {
          focus = focus.substring(0, 37) + '...';
        }
      } catch (e) { /* silent */ }
    }

    // Fallback: check Claude Code todos for in_progress task
    if (!focus) {
      const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
      const todosDir = path.join(claudeDir, 'todos');
      if (session && fs.existsSync(todosDir)) {
        try {
          const files = fs.readdirSync(todosDir)
            .filter(f => f.startsWith(session) && f.includes('-agent-') && f.endsWith('.json'))
            .map(f => ({ name: f, mtime: fs.statSync(path.join(todosDir, f)).mtime }))
            .sort((a, b) => b.mtime - a.mtime);

          if (files.length > 0) {
            const todos = JSON.parse(fs.readFileSync(path.join(todosDir, files[0].name), 'utf8'));
            const inProgress = todos.find(t => t.status === 'in_progress');
            if (inProgress) focus = inProgress.activeForm || '';
          }
        } catch (e) { /* silent */ }
      }
    }

    // ── Output ─────────────────────────────────────────────────────────
    const dirname = path.basename(dir);
    const parts = [`\x1b[2m${model}\x1b[0m`];
    if (focus) parts.push(`\x1b[1m${focus}\x1b[0m`);
    parts.push(`\x1b[2m${dirname}\x1b[0m`);

    process.stdout.write(parts.join(' \x1b[2m\u2502\x1b[0m ') + ctx);
  } catch (e) {
    // Silent fail
  }
});
