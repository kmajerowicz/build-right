# GSR Hooks — Terminal Enhancements

Two hooks that improve the Claude Code terminal experience for GSR users.

## What They Do

### Status Line (`gsr-statusline.js`)
Shows persistent info at the bottom of Claude Code:
```
Claude Opus 4.6 │ Phase 2 — creative │ myproject ████████░░ 72%
```
- **Model** — current model name
- **Focus** — current phase/task from `docs/STATE.md` (falls back to Claude Code todos)
- **Directory** — project folder name
- **Context bar** — visual usage indicator with color thresholds:
  - Green <50% | Yellow <65% | Orange <80% | Red+blinking >80%

### Context Monitor (`gsr-context-monitor.js`)
Invisible hook that warns the **agent** (not you) when context is running low:
- **WARNING at 65% used**: "Finish current task, avoid new complex work"
- **CRITICAL at 75% used**: "Stop, inform user, don't start new tasks"

The status line tells YOU. The context monitor tells CLAUDE. Two channels, two audiences.

## Installation

### Option A: Run the install script
```bash
node hooks/install.js
```

### Option B: Manual setup

Copy hooks to Claude config:
```bash
cp hooks/gsr-statusline.js ~/.claude/hooks/
cp hooks/gsr-context-monitor.js ~/.claude/hooks/
```

Add to `~/.claude/settings.json`:
```json
{
  "statusLine": {
    "type": "command",
    "command": "node \"~/.claude/hooks/gsr-statusline.js\""
  },
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"~/.claude/hooks/gsr-context-monitor.js\""
          }
        ]
      }
    ]
  }
}
```

## How They Work Together

```
Every status line refresh:
  statusline.js → writes metrics to /tmp/claude-ctx-{session}.json
                → renders status bar for user

Every tool use:
  context-monitor.js → reads /tmp/claude-ctx-{session}.json
                     → if context low: injects warning into conversation
                     → agent sees warning, adjusts behavior
```

## GSR-Aware Behavior

Both hooks detect whether the current project uses GSR (checks for `docs/STATE.md`):
- **Status line**: reads current phase/focus from STATE.md
- **Context monitor**: GSR-specific messages referencing STATE.md for session resume
