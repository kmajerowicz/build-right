# Decision Gate Pattern

**Use this whenever you present the user with multiple options to choose from.**

---

## When to use

Any time you need the user to pick between 2 or more options before you can proceed. Examples:
- Feature prioritization (MVP vs v2)
- Phase ordering conflicts
- Architecture tradeoffs
- Mode selection (creative vs systematic)
- Prerequisite warnings ("proceed anyway?")
- Backlog triage

Do NOT use for simple yes/no confirmations — those stay conversational.

---

## Protocol

1. Enter plan mode (`EnterPlanMode`)
2. Present the decision block (see format below)
3. User clicks their choice — no typing required
4. Exit plan mode and proceed with chosen option

---

## Format

```
**[Decision: short topic label]**

**Option 1 — [name]**
[One sentence on what this means + the key tradeoff]

**Option 2 — [name]**
[One sentence on what this means + the key tradeoff]

**Option 3 — [name]** *(if applicable)*
[One sentence on what this means + the key tradeoff]

---
**Recommendation: Option [N]**
[One sentence explaining why — the concrete reason, not "it's simpler"]
```

---

## Rules

- Always include a recommendation. Never present options without one.
- Recommendation must have a reason — "because it avoids a Phase 2 blocker" not "because it's cleaner."
- Maximum 3 options. If you have more, collapse the weakest ones.
- One decision per plan mode entry. Don't stack multiple decisions in one block.
- After the user picks: exit plan mode, confirm the choice in one line, then execute.
