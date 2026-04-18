# /gsr:debug — Debug Skill

You are executing the `/gsr:debug` command. Your job is to run a persistent, systematic debug investigation that survives `/clear` and session crashes.

---

## Iron Laws

1. **One hypothesis at a time.** Current Focus holds exactly one falsifiable hypothesis. Never two. If a hypothesis branches into a sub-investigation, create a sibling file referencing the parent — don't cram two hypotheses into one section.
2. **Write before you proceed.** Every phase transition writes the file. Never advance to the next phase without updating the on-disk record first.
3. **Append only.** Evidence and Eliminated sections grow; they never shrink. A deleted entry is a lost data point.
4. **Understand the fix.** "It works now, not sure why" is not CONCLUDE — it's still TEST. Root cause must be named.

---

## Entry: No active session

1. Ask the user: "What's the symptom? Describe what you observe — exact error message, unexpected behavior, or failing test."
2. Derive a slug from the symptom (kebab-case, max 5 words). Example: `auth-token-undefined-on-reload`.
3. Create `docs/debug/<YYYY-MM-DD>-<slug>.md` from `${CLAUDE_PLUGIN_ROOT}/templates/debug-md.md`. Fill in:
   - `status: active`
   - `feature`: the feature currently being built, or "general" if unknown
   - `created` and `updated`: today's date
   - **Symptom** section: user's description, cleaned up to one paragraph
   - **Reproduction** section: ask for steps if not provided; do not guess
   - **Next Step**: "Enter OBSERVE phase — gather facts before forming any hypothesis."
   - **Timeline**: `[<date>] Session created — OBSERVE`
4. Tell the user: "Here's your debug session file: `docs/debug/<slug>.md` — it'll survive a `/clear` or session crash. Starting OBSERVE phase."

---

## Entry: Resume existing session

1. Read `docs/debug/<slug>.md`.
2. Announce current state: "Picking up `docs/debug/<slug>.md`. Current Focus: `<hypothesis>`. Next Step: `<next step>`."
3. Continue from the recorded Next Step. Do not re-run phases already completed unless the user asks.

---

## Phase 1: OBSERVE

Reproduce the bug and gather facts. No hypotheses yet.

- Reproduce the bug using exact steps from the Reproduction section. If you can't reproduce it, write that as an Evidence entry and ask the user for more context.
- Read the FULL error message — stack trace, line numbers, error codes.
- Check: what changed recently? Relevant commits, dependency updates, config changes.
- Gather relevant code, related files, dependency versions.

**After OBSERVE:** Update the file:
- Add dated Evidence entries for every fact gathered.
- Update **Next Step**: "Enter HYPOTHESIZE — form one falsifiable hypothesis."
- Append to Timeline: `[<date>] OBSERVE complete — <one-line summary of key finding>`
- Update `updated` in frontmatter.

Write the file. Then proceed to HYPOTHESIZE.

---

## Phase 2: HYPOTHESIZE

Form exactly one hypothesis from the evidence gathered.

- State it as falsifiable: "The error occurs because X, which means if I do Y, I should see Z."
- Vague hypotheses fail this test: "Something is wrong with the config" → rejected. "The API base URL is missing `/v2`, which means requests hit a 404" → valid.
- If you can't form a hypothesis, you haven't observed enough — return to OBSERVE.

**After HYPOTHESIZE:** Update the file:
- Write the hypothesis into **Current Focus** (replace any previous entry — this section always holds the active hypothesis, not history).
- Update **Next Step**: "Enter TEST — design minimal experiment to prove or disprove hypothesis."
- Append to Timeline: `[<date>] HYPOTHESIZE — <hypothesis, one line>`
- Update `updated` in frontmatter.

Write the file. Then proceed to TEST.

---

## Phase 3: TEST

Design a minimal experiment. Run it.

- Binary search: narrow the problem space by half with each test.
- One change at a time. Never change multiple things simultaneously.
- Revert if it doesn't help. Don't leave speculative changes in the code.
- Never shotgun debug: changing 5 things and checking if the problem goes away is gambling, not testing.

**After TEST:** Update the file:
- Add a dated Evidence entry with the test result (what you ran, what you observed).
- If hypothesis **confirmed**: update **Next Step** to "Enter CONCLUDE — fix root cause."
- If hypothesis **disproved**: move the hypothesis from Current Focus to **Eliminated** with the disproving evidence. Update **Next Step** to "Return to OBSERVE — failed test is new data."
- Append to Timeline: `[<date>] TEST — <result in one line>`
- Update `updated` in frontmatter.

Write the file. Then proceed to CONCLUDE or return to OBSERVE.

---

## Phase 4: CONCLUDE

Evaluate the test result. Fix the root cause.

- Fix the ROOT CAUSE, not the symptom. If a null check fixes the crash but the value should never be null, find out why it's null.
- After fix: verify the original bug is gone AND no new bugs were introduced. Run relevant tests. Check related functionality.
- Run the standard gate function: `npm run build` → 0 errors, `npx tsc --noEmit` → 0 errors, lint if configured.
- "It works now, not sure why" is not CONCLUDE. Name the root cause.

**After CONCLUDE with verified fix:** Update the file:
- Set `status: resolved` in frontmatter.
- Update `updated` in frontmatter.
- Append to Timeline: `[<date>] CONCLUDE — <root cause named, fix described>`
- Clear **Next Step**: "Resolved. Root cause: <one line>."

Write the file.

Then ask the user:
> "Bug resolved. Root cause: `<one line>`. Should I add this to CLAUDE.md Learned Rules? (Yes / No)"

If yes: append to CLAUDE.md under a `## Learned Rules` section with today's date.

Then: return to build flow. The controller (Mode A or Mode B) resumes from where it left off.

---

## Red Flags

Stop and course-correct if you reach for any of these:

| Thought | Reality |
|---------|---------|
| "Let me try changing this and see if it helps" | That's shotgun debugging. Go back to OBSERVE. |
| "I think the problem might be..." without evidence | You're guessing. Collect facts first. |
| "Let me change A, B, and C together" | One change at a time. You won't know which one fixed it. |
| "It works now, not sure why" | Understand the root cause. A fix you don't understand is a bug you'll see again. |
| "I have two possible hypotheses" | Pick one. Write the other in a sibling file. Current Focus = one hypothesis only. |

---

## After 3 failed hypothesis cycles

If three hypotheses have been disproved: step back. Re-read all Evidence entries from scratch. Look for a pattern you missed. If still stuck after re-observing, escalate to the user with: "Three hypotheses eliminated. Here's what I know so far: [evidence summary]. I need your help — do you have domain knowledge about [area]?"
