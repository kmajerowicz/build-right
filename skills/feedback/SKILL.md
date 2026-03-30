# /gsr:feedback — Feedback Skill

You are executing the `/gsr:feedback` command. Your job is to capture user feedback and write it to `docs/BACKLOG.md`.

---

## Iron Laws

1. **One message, not twenty.** Ask for all missing context in a single follow-up — never ping-pong the user.
2. **Don't interpret, capture.** Write the feedback in the user's words, not a paraphrase. Add your classification alongside it.
3. **Always confirm what was written.** Show the exact entry added to BACKLOG.md after writing it.

---

## Step 1: Intake + Completeness Check

Read the user's feedback. Determine the type and check completeness against the requirements below.

### Bug report — required fields:
- **Area** — which feature, screen, or flow
- **What happened** — the actual behavior observed
- **What should have happened** — the expected behavior
- **Severity** — how bad is it?
  - `critical` — blocks core functionality, no workaround
  - `major` — significantly impacts usability, workaround is painful
  - `minor` — inconvenient but doesn't block anything

### Feature request — required fields:
- **Area** — which part of the product this relates to (or "new" if it doesn't exist yet)
- **What** — description of what the user wants
- **Why** — the problem it solves or the value it adds

### Change request — required fields:
- **Area** — which feature or screen is affected
- **Current behavior** — what happens today
- **Desired behavior** — what should happen instead
- **Why** — reason for the change (UX issue, business need, user confusion, etc.)

---

If the type is ambiguous OR any required field is missing: ask once, combining all questions into a single message. Do not ask field by field.

If everything is clear from the user's message: skip to Step 2 without asking anything.

---

## Step 2: Format the Entry

Use the format matching the type:

### Bug
```
**[Short title]**
Area: [feature/screen/flow]
What happened: [actual behavior]
Expected: [expected behavior]
Severity: [critical / major / minor]
```

### Feature Request
```
**[Short title]**
Area: [part of product, or "new"]
What: [what the user wants]
Why: [problem it solves or value it adds]
```

### Change Request
```
**[Short title]**
Area: [feature/screen affected]
Current: [what happens today]
Desired: [what should happen instead]
Why: [reason for the change]
```

---

## Step 3: Write to BACKLOG.md

Read `docs/BACKLOG.md`. Find the `## Feedback` section. If it doesn't exist, add it at the top of the file:

```markdown
## Feedback

<!-- Entries added via /gsr:feedback -->
```

Append the formatted entry as a block under that section, preceded by the type badge and date:

```
---
🐛 Bug  |  [date]
**[title]**
Area: ...
What happened: ...
Expected: ...
Severity: ...
```

```
---
✨ Feature Request  |  [date]
**[title]**
Area: ...
What: ...
Why: ...
```

```
---
🔧 Change Request  |  [date]
**[title]**
Area: ...
Current: ...
Desired: ...
Why: ...
```

---

## Step 4: Confirm

Show the user the exact block added:

```
Added to BACKLOG.md:

[exact entry]

Run /gsr:feedback again to log more.
```

---

## Iron Law Enforcement

| Thought | Reality |
|---------|---------|
| "I'll ask about each missing field separately" | One message. Ask everything at once. |
| "I'll rewrite this in cleaner language" | Capture what the user said. Don't sanitize their words. |
| "Severity is obvious, I'll just pick one" | Ask the user. They know the impact better than you. |
| "Why is optional for a change request" | It's required. A change without a reason is noise. |
| "I'll skip the confirmation" | Always show the exact entry added. |
