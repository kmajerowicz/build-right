#!/usr/bin/env node
// GSR Hooks Installer
// Copies hooks to ~/.claude/hooks/ and configures settings.json

const fs = require('fs');
const path = require('path');
const os = require('os');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const hooksDir = path.join(claudeDir, 'hooks');
const settingsPath = path.join(claudeDir, 'settings.json');
const srcDir = __dirname;

// ── Helpers ────────────────────────────────────────────────────────────────

function log(msg) { console.log(`  ${msg}`); }
function ok(msg) { console.log(`  \x1b[32m✓\x1b[0m ${msg}`); }
function warn(msg) { console.log(`  \x1b[33m!\x1b[0m ${msg}`); }
function err(msg) { console.log(`  \x1b[31m✗\x1b[0m ${msg}`); }

// ── Ensure directories ────────────────────────────────────────────────────

console.log('\n\x1b[1mGSR Hooks Installer\x1b[0m\n');

if (!fs.existsSync(claudeDir)) {
  err(`Claude config directory not found: ${claudeDir}`);
  err('Is Claude Code installed?');
  process.exit(1);
}

if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
  ok(`Created ${hooksDir}`);
}

// ── Copy hook files ───────────────────────────────────────────────────────

const hookFiles = ['gsr-statusline.js', 'gsr-context-monitor.js'];

for (const file of hookFiles) {
  const src = path.join(srcDir, file);
  const dst = path.join(hooksDir, file);

  if (!fs.existsSync(src)) {
    err(`Source not found: ${src}`);
    process.exit(1);
  }

  // Check if GSD version exists — don't overwrite, coexist
  const gsdEquiv = file.replace('gsr-', 'gsd-');
  if (fs.existsSync(path.join(hooksDir, gsdEquiv))) {
    warn(`GSD hook found (${gsdEquiv}) — GSR hook will be installed alongside it`);
  }

  fs.copyFileSync(src, dst);
  ok(`Copied ${file} → ${dst}`);
}

// ── Update settings.json ──────────────────────────────────────────────────

let settings = {};
if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    err(`Failed to parse ${settingsPath}: ${e.message}`);
    process.exit(1);
  }
}

// Statusline
const statuslineCmd = `node "${path.join(hooksDir, 'gsr-statusline.js')}"`;
const existingStatusline = settings.statusLine?.command || '';

if (existingStatusline.includes('gsr-statusline')) {
  ok('Status line already configured for GSR');
} else if (existingStatusline.includes('gsd-statusline')) {
  warn('Status line is configured for GSD — replacing with GSR');
  settings.statusLine = { type: 'command', command: statuslineCmd };
} else {
  settings.statusLine = { type: 'command', command: statuslineCmd };
  ok('Status line configured');
}

// Context monitor hook
const monitorCmd = `node "${path.join(hooksDir, 'gsr-context-monitor.js')}"`;
if (!settings.hooks) settings.hooks = {};
if (!settings.hooks.PostToolUse) settings.hooks.PostToolUse = [];

const postToolHooks = settings.hooks.PostToolUse;
const gsrMonitorExists = postToolHooks.some(entry =>
  entry.hooks?.some(h => h.command?.includes('gsr-context-monitor'))
);
const gsdMonitorExists = postToolHooks.some(entry =>
  entry.hooks?.some(h => h.command?.includes('gsd-context-monitor'))
);

if (gsrMonitorExists) {
  ok('Context monitor already configured for GSR');
} else {
  if (gsdMonitorExists) {
    warn('GSD context monitor found — GSR monitor will replace it');
    // Remove GSD monitor
    settings.hooks.PostToolUse = postToolHooks.filter(entry =>
      !entry.hooks?.some(h => h.command?.includes('gsd-context-monitor'))
    );
  }

  settings.hooks.PostToolUse.push({
    hooks: [{
      type: 'command',
      command: monitorCmd
    }]
  });
  ok('Context monitor configured');
}

// Write settings
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
ok(`Updated ${settingsPath}`);

// ── Done ──────────────────────────────────────────────────────────────────

console.log('\n\x1b[32m\x1b[1mDone!\x1b[0m Restart Claude Code to activate.\n');
console.log('  Status line: model │ current focus │ directory │ context bar');
console.log('  Context monitor: warns agent at 65% and 75% context usage');
console.log('');
