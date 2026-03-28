# Iron Law Enforcement Pattern

A reference for skill authors writing GSR skills. This pattern prevents Claude from rationalizing its way past critical rules.

---

## Why This Exists

GSR has good rules. "User reviews every diff." "Never say should work." "Corrections go to Learned Rules." But rules alone aren't enough — Claude can rationalize skipping any rule when under pressure (long context, complex task, user seems impatient).

The superpowers plugin proved that **explicit rationalization tables** dramatically reduce rule violations. When Claude encounters a thought like "this is too simple to need review," having a table that maps that exact thought to "STOP — this is a red flag" is far more effective than a general instruction to "always follow the rules."

The pattern costs zero user friction. It's instructions for Claude, invisible to the user.

---

## The Three-Layer Structure

Every critical rule gets three layers:

### Layer 1: The Rule
State the rule clearly. Non-negotiable. No hedging.

### Layer 2: Red Flags Table
A table of thoughts or impulses that mean STOP. These are the internal rationalizations Claude might generate that signal the rule is about to be violated.

### Layer 3: Common Rationalizations Table
Maps specific excuses to reality. Two columns: what Claude might think, and why that thinking is wrong.

---

## When to Apply

- **Apply to:** Rules that Claude is likely to skip under pressure — rules involving human review, rules that slow down execution, rules requiring extra steps
- **Don't apply to:** Trivial or mechanical rules (file naming conventions, import ordering), rules that are enforced by tooling (linting, type checking), rules where skipping has low impact

A skill with 10 rules might have enforcement blocks for 3-4 of them. Over-enforcement dilutes the signal.

---

## Concrete Examples

### Example 1: "User reviews every diff" (build creative mode)

```
IRON LAW: User reviews every diff before proceeding.

RED FLAGS — if you think any of these, STOP:
| Thought                                    | What it means              |
|--------------------------------------------|----------------------------|
| "This change is too small to review"       | Small changes cause bugs   |
| "I'll batch these and show them together"  | You're skipping review     |
| "The user seems busy, I'll keep going"     | Not your call to make      |
| "This is just a refactor, no behavior change" | Refactors break things  |

COMMON RATIONALIZATIONS:
| Excuse                                     | Reality                                  |
|--------------------------------------------|------------------------------------------|
| "It's only a one-line change"              | One-line changes have caused production outages. Show it. |
| "I already showed something similar"       | Similar is not identical. Show it.       |
| "The user approved the plan, this follows it" | Plans and diffs are different. Show the diff. |
```

### Example 2: "Never say 'should work'" (build both modes)

```
IRON LAW: Never tell the user something "should work," "ought to work," or "I believe this works." Verify or say you haven't verified.

RED FLAGS — if you think any of these, STOP:
| Thought                                    | What it means              |
|--------------------------------------------|----------------------------|
| "I'm pretty confident this is correct"     | Confidence is not evidence |
| "The logic looks right to me"              | You're about to say 'should work' |
| "This follows the pattern from earlier"    | Patterns can be misapplied |

COMMON RATIONALIZATIONS:
| Excuse                                     | Reality                                  |
|--------------------------------------------|------------------------------------------|
| "Running the test would take too long"     | Say 'I haven't verified this yet' instead of 'should work.' |
| "It's obvious that this works"             | If it's obvious, verification is fast. Do it. |
| "I don't want to seem uncertain"           | False confidence is worse than honest uncertainty. |
```

### Example 3: "Corrections go to CLAUDE.md Learned Rules" (build creative mode)

```
IRON LAW: When the user corrects you, add the lesson to CLAUDE.md Learned Rules immediately. Not after the task. Now.

RED FLAGS — if you think any of these, STOP:
| Thought                                    | What it means              |
|--------------------------------------------|----------------------------|
| "I'll remember this for next time"         | You won't. You have no persistent memory. |
| "This correction is too specific to generalize" | Write it specific. Generalize later. |
| "I'm in the middle of something"           | Corrections are higher priority than flow. |

COMMON RATIONALIZATIONS:
| Excuse                                     | Reality                                  |
|--------------------------------------------|------------------------------------------|
| "I'll add it after I finish this task"     | You won't. Do it now.                    |
| "CLAUDE.md is already long enough"         | A long CLAUDE.md that prevents mistakes is better than a short one that doesn't. |
| "This is a one-off, not a pattern"         | If the user corrected you, it matters. Write it down. |
```

### Example 4: "Evidence before claims" (verification)

```
IRON LAW: Every verification claim must cite specific evidence — file path, line number, grep output, test result. No claim without evidence.

RED FLAGS — if you think any of these, STOP:
| Thought                                    | What it means              |
|--------------------------------------------|----------------------------|
| "I checked this earlier"                   | Earlier is not now. Re-verify. |
| "The code clearly handles this case"       | Show the code, don't describe it. |
| "All tests pass so this must be correct"   | Tests can miss the thing you're verifying. |

COMMON RATIONALIZATIONS:
| Excuse                                     | Reality                                  |
|--------------------------------------------|------------------------------------------|
| "Citing evidence for every claim is tedious" | Tedious for you, essential for the user. |
| "The user can see the code themselves"     | Verification that requires the user to re-check is not verification. |
| "I'm confident this works based on the implementation" | Confidence is not evidence. Show output. |
```

---

## Guidelines for Skill Authors

- **Keep enforcement blocks concise** — aim for ~10-15 lines each (rule + 3-4 red flags + 3 rationalizations)
- **Use Claude's actual voice** — the red flags should sound like things Claude would genuinely think, not strawmen
- **Be specific** — "this is too small to review" is better than "I want to skip this step"
- **Update based on real failures** — when Claude violates a rule in practice, add the exact rationalization it used
- **Place enforcement blocks inline** in the skill file, right after the rule they enforce — not in a separate section
