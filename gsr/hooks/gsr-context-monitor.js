#!/usr/bin/env node
// Context Monitor — PostToolUse hook
//
// Reads context metrics from the statusline bridge file and injects
// warnings when context usage is high. The statusline shows the USER
// how much context remains. This hook tells the AGENT.
//
// Flow:
//   1. gsr-statusline.js writes metrics to /tmp/claude-ctx-{session}.json
//   2. This hook reads those metrics after each tool use
//   3. When remaining context drops below thresholds, it injects a warning
//      as additionalContext — the agent sees it in its conversation
//
// Thresholds:
//   WARNING  (remaining <= 35%): Agent should wrap up current task
//   CRITICAL (remaining <= 25%): Agent should stop and inform user
//
// Debounce: 5 tool uses between warnings to avoid spam
// Severity escalation (WARNING -> CRITICAL) bypasses debounce

const fs = require('fs');
const os = require('os');
const path = require('path');

const WARNING_THRESHOLD = 35;
const CRITICAL_THRESHOLD = 25;
const STALE_SECONDS = 60;
const DEBOUNCE_CALLS = 5;

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const sessionId = data.session_id;

    if (!sessionId) process.exit(0);

    const metricsPath = path.join(os.tmpdir(), `claude-ctx-${sessionId}.json`);
    if (!fs.existsSync(metricsPath)) process.exit(0);

    const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
    const now = Math.floor(Date.now() / 1000);

    // Ignore stale metrics
    if (metrics.timestamp && (now - metrics.timestamp) > STALE_SECONDS) {
      process.exit(0);
    }

    const remaining = metrics.remaining_percentage;
    const usedPct = metrics.used_pct;

    // No warning needed
    if (remaining > WARNING_THRESHOLD) process.exit(0);

    // ── Debounce ───────────────────────────────────────────────────────
    const warnPath = path.join(os.tmpdir(), `claude-ctx-${sessionId}-warned.json`);
    let warnData = { callsSinceWarn: 0, lastLevel: null };
    let firstWarn = true;

    if (fs.existsSync(warnPath)) {
      try {
        warnData = JSON.parse(fs.readFileSync(warnPath, 'utf8'));
        firstWarn = false;
      } catch (e) { /* reset */ }
    }

    warnData.callsSinceWarn = (warnData.callsSinceWarn || 0) + 1;

    const isCritical = remaining <= CRITICAL_THRESHOLD;
    const currentLevel = isCritical ? 'critical' : 'warning';
    const severityEscalated = currentLevel === 'critical' && warnData.lastLevel === 'warning';

    if (!firstWarn && warnData.callsSinceWarn < DEBOUNCE_CALLS && !severityEscalated) {
      fs.writeFileSync(warnPath, JSON.stringify(warnData));
      process.exit(0);
    }

    // Reset debounce
    warnData.callsSinceWarn = 0;
    warnData.lastLevel = currentLevel;
    fs.writeFileSync(warnPath, JSON.stringify(warnData));

    // ── Detect GSR project ─────────────────────────────────────────────
    const cwd = data.cwd || process.cwd();
    const isGsrActive = fs.existsSync(path.join(cwd, 'docs', 'STATE.md'));

    // ── Build warning message ──────────────────────────────────────────
    let message;
    if (isCritical) {
      message = isGsrActive
        ? `CONTEXT CRITICAL: Usage at ${usedPct}%. Remaining: ${remaining}%. `
          + 'Context is nearly exhausted. Inform the user that context is low. '
          + 'Do NOT start new tasks. Current progress is tracked in docs/STATE.md '
          + '— the user can resume in a fresh session.'
        : `CONTEXT CRITICAL: Usage at ${usedPct}%. Remaining: ${remaining}%. `
          + 'Context is nearly exhausted. Inform the user that context is low '
          + 'and ask how they want to proceed.';
    } else {
      message = isGsrActive
        ? `CONTEXT WARNING: Usage at ${usedPct}%. Remaining: ${remaining}%. `
          + 'Context is getting limited. Finish the current task if possible, '
          + 'then inform the user. Avoid starting new complex work.'
        : `CONTEXT WARNING: Usage at ${usedPct}%. Remaining: ${remaining}%. `
          + 'Be aware that context is getting limited. Avoid unnecessary '
          + 'exploration or starting new complex work.';
    }

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: message
      }
    }));
  } catch (e) {
    process.exit(0);
  }
});
