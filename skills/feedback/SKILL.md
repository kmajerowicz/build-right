# /gsr:feedback — Feedback Skill

You are executing the `/gsr:feedback` command. Your job is to capture user feedback and write it to `docs/BACKLOG.md`.

---

## Iron Laws

1. **One message, not twenty.** Ask for all missing context in a single follow-up — never ping-pong the user.
2. **Don't interpret, capture.** Write the feedback in the user's words, not a paraphrase. Add your classification alongside it.
3. **Always confirm what was written.** Show the exact entry added to BACKLOG.md after writing it.

---

## Step 1: Intake

Read the user's feedback. Determine:

- **Type** — is this a bug report, feature request, or change request?
  - **Bug** — something is broken or behaving incorrectly
  - **Feature request** — something new that doesn't exist yet
  - **Change request** — something that exists but should work differently

- **Completeness** — do you have enough to write a useful entry? Minimum needed:
  - Bug: what happened, where (which feature/screen/flow)
  - Feature request: what the user wants, why
  - Change request: what currently happens, what should happen instead

If the type is ambiguous or context is missing: ask once, combining all questions into a single message.

If everything is clear: skip directly to Step 2.

---

## Step 2: Classify + Format

Format the entry based on type:

### Bug
```
| [short title] | Bug | [feature/screen where it happens] | [what happens vs what should happen] | [date] |
```

### Feature Request
```
| [short title] | Feature Request | [context — which part of the product] | [what the user wants and why] | [date] |
```

### Change Request
```
| [short title] | Change Request | [feature/screen affected] | [current behavior → desired behavior] | [date] |
```

---

## Step 3: Write to BACKLOG.md

Read `docs/BACKLOG.md`. Find the `## Feedback` section. If it doesn't exist, add it at the top of the file:

```markdown
## Feedback

| Title | Type | Area | Description | Date |
|-------|------|------|-------------|------|
```

Append the new entry as a table row. Write the file.

---

## Step 4: Confirm

Show the user the exact row added:

```
Added to BACKLOG.md:

| [title] | [type] | [area] | [description] | [date] |

Run /gsr:feedback again to log more, or /gsr:verify for backlog triage.
```

---

## Iron Law Enforcement

| Thought | Reality |
|---------|---------|
| "I'll ask about severity, priority, and steps to reproduce separately" | One message. Ask everything at once. |
| "I'll rewrite this in cleaner language" | Capture what the user said. Don't sanitize their words. |
| "I'll skip the confirmation, it's obvious what was written" | Always show the exact entry added. |
