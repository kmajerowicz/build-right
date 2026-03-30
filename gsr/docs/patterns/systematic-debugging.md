# Systematic Debugging

**On-demand debugging methodology for GSR builds. Activates when something breaks — not a mandatory flow step.**

---

## Overview

Switch to this process when:
- An error occurs during build (compile error, runtime error, test failure)
- A test fails unexpectedly
- Behavior doesn't match what the feature file specifies

Exit this process when the bug is fixed, verified, and you understand why it happened.

---

## The 4 Phases

### Phase 1: OBSERVE

Reproduce the bug and gather facts. No hypotheses yet — just data.

- **Reproduce the bug** — exact steps, every time. If you can't reproduce it, you can't verify a fix.
- **Read the FULL error message** — not just the first line. Stack traces, line numbers, error codes.
- **Check: when did this last work?** What changed since then? Recent commits, dependency updates, config changes.
- **Gather context** — relevant code, related files, recent modifications, dependency versions.
- **DO NOT form theories yet** — just collect facts. The urge to jump to "I bet it's X" is the enemy of systematic debugging.

### Phase 2: HYPOTHESIZE

Form exactly ONE hypothesis based on your observations. Not three. One.

- State it as falsifiable: "The error occurs because X, which means if I do Y, I should see Z."
- The hypothesis must be specific enough to test. "Something is wrong with the config" is not a hypothesis. "The API base URL is missing the /v2 prefix, which means requests hit a 404" is.
- If you can't form a hypothesis, you haven't observed enough — go back to Phase 1.

### Phase 3: TEST

Design a minimal test that proves or disproves the hypothesis. Run it.

- **Binary search** — narrow the problem space by half with each test. Not shotgun.
- **One change at a time** — never change multiple things simultaneously.
- **Revert if it doesn't help** — don't leave speculative changes in the code.
- **NEVER shotgun debug** — changing 5 things and checking if the problem goes away is not debugging, it's gambling.

### Phase 4: CONCLUDE

Evaluate the test result and act.

- **Hypothesis confirmed** → fix the ROOT CAUSE, not the symptom. If a null check fixes the crash but the value should never be null, find out why it's null.
- **Hypothesis disproved** → return to Phase 1 (OBSERVE) with what you learned. The failed test is new data.
- **After fix** — verify the original bug is gone AND no new bugs were introduced. Run the relevant tests. Check related functionality.

---

## Red Flags (Iron Law enforcement)

These patterns indicate you've left the systematic process. Stop and course-correct.

- **"Let me try changing this and see if it helps"** → STOP. That's shotgun debugging. Go back to OBSERVE.
- **"I think the problem might be..." without evidence** → STOP. You're guessing. Go collect facts.
- **"Let me change A, B, and C together"** → STOP. One change at a time. You won't know which one fixed it.
- **"It works now, not sure why"** → STOP. Understand the root cause. A fix you don't understand is a bug you'll see again.

---

## When to Escalate to Human

- **After 3 failed hypothesis cycles** — if three hypotheses have been disproved, step back and re-observe from scratch. If still stuck, escalate.
- **When the bug requires domain knowledge you don't have** — business logic edge cases, third-party API behavior, platform-specific quirks.
- **When the fix requires a product decision** — e.g., "should we handle this edge case or prevent it?" That's a product question, not a debugging question.
