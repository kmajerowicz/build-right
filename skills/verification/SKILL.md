# /gsr:verify — Verification Skill

You are executing the `/gsr:verify` command. Your job is to verify a completed feature or build phase against its must-haves and produce an evidence-based report.

---

## Iron Laws

1. **"All tasks done" is not verification.** Check actual outcomes. Run commands. Read output. Verify with evidence.
2. **Always exhaust lower tiers before escalating to human.** Never ask a human to verify something a grep or build command can answer.
3. **Blockers block. Minors don't.** A Blocker means the feature is not done. A Minor goes to BACKLOG.md and the phase can still PASS.

---

## Step 0: Determine Scope

Ask the user: "Verify a specific feature, or a full build phase?"

- **Feature verification** → read that feature file's must-haves
- **Phase verification** → read all feature files in that phase + PRD build phase must-haves

---

## Step 1: Read the Must-Haves

From the feature file(s) and/or PRD build phase:
- **Truths** — observable behaviors that must be true
- **Artifacts** — files that must exist with real (non-stub) implementation
- **Key Links** — critical connections between parts
- **Demo sentence** — what the user can do after this phase (from PRD)

These were defined at spec time. You are now checking that they are actually true.

---

## Step 2: Run Verification in Parallel

Dispatch parallel verification checks (use implementer agents for independent checks):

### Check 1: Build & TypeScript (Tier 1 — Automated)
```bash
npm run build      # must pass with 0 errors
npx tsc --noEmit   # must report 0 TypeScript errors
npm run lint       # must pass if configured
```
Report: pass/fail with actual output.

### Check 2: Anti-Pattern Sweep (Tier 2 — Grep)
Standard patterns:
```bash
grep -r "console.log" src/ --include="*.ts" --include="*.tsx" | grep -v "test\|spec"
grep -r "TODO\|FIXME\|HACK" src/
grep -r "mock\|fake\|dummy\|placeholder" src/ --include="*.ts" --include="*.tsx" | grep -v "test\|spec"
grep -r "\"\"" src/ --include="*.ts" --include="*.tsx"  # empty string placeholders
```

Project-specific patterns from CLAUDE.md Learned Rules (check for any additional anti-pattern rules).

Classify each finding as Blocker or Minor:
- **Blocker:** `console.log` as stub for real functionality, mock data in production code, empty function bodies
- **Minor:** debug logs in non-critical paths, TODO comments, commented-out code

### Check 3: Artifact Verification (Tier 1/2 — Static)
For each Artifact in must-haves:
1. Does the file exist?
2. Is it substantive (not a stub)? Check: file size >10 lines, exports present, no placeholder returns
3. Are expected exports/functions present? (grep for function/export names)

Report each as: SUBSTANTIVE / STUB / MISSING

### Check 4: Key Links (Tier 2 — Grep)
For each Key Link in must-haves:
```bash
grep -r "[import/function name]" [source file path]  # verify wiring
```
Report each as: WIRED / NOT WIRED

### Check 5: Truth Verification (Tier 2/3 — Command + Behavioral)
For each Truth in must-haves:
- Try to verify with a command or grep
- If needs manual check → mark as HUMAN

```bash
npm test               # if tests cover this truth
# grep for key patterns that prove the truth
```

---

## Step 3: Compile Verification Report

Format the report per `docs/phases/4-verification.md`:

```markdown
## [Feature/Phase] Verification — [date]

### Demo Check
> After this phase: [demo sentence from PRD]
- [ ] manual: open app, verify the above

### Observable Truths
| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | [Truth] | PASS / FAIL / HUMAN | [command output or grep result] |

### Artifacts
| File | Expected | Status | Evidence |
|------|----------|--------|----------|
| [path] | [what it should do] | SUBSTANTIVE / STUB / MISSING | [line count, exports found] |

### Key Links
| From | To | Via | Status |
|------|----|-----|--------|
| [file] | [file] | [import/call] | WIRED / NOT WIRED |

### Anti-Patterns
| File | Pattern | Severity |
|------|---------|----------|
| [file] | [pattern] | Blocker / Minor |

### Summary
Evidence: [build status, TS errors, test results]
Blockers: [list or "none"]
Human checks needed: [list or "none"]
```

---

## Step 4: Present Report + Human Checks

Show the full verification report.

If there are **Blockers**:
```
BLOCKED — [N] blockers must be resolved before this [feature/phase] can PASS:

1. [Blocker description] — in [file]
2. [Blocker description]

These become tasks in the current phase. Fix them, then re-run /gsr:verify.
```

If there are **Human checks**:
Present them as a numbered list:
```
Human verification needed (Claude can't verify these):

1. [ ] Open app → [specific action] → expect: [specific outcome]
2. [ ] [Demo sentence check]

Mark each as pass or fail.
```

Wait for the user to complete human checks.

---

## Step 5: Update STATE.md

Based on outcome:

**If PASS (no blockers, human checks complete):**
- Append verification report to STATE.md
- Update feature/phase status to PASS with date
- Move Minor anti-patterns to BACKLOG.md

**If BLOCKED:**
- Update feature/phase status to BLOCKED
- List blockers in STATE.md
- Don't append full report yet — it gets appended after re-verification

**Phase PASS flow:**
Check if all features in the phase are PASS → if yes, phase is PASS.

Check project done conditions:
1. All phases PASS?
2. If yes → tell user: "All phases PASS. Time for backlog triage. Review BACKLOG.md — categorize each item: 'must before launch' / 'v2' / 'won't do'."
3. If any 'must before launch' items → "These become a new build phase. Run `/gsr:build` to continue."
4. If nothing 'must before launch' → "Project is DONE."

---

## Iron Law Enforcement

Red flags:

| Thought | Reality |
|---------|---------|
| "The tests pass, that means everything works" | Tests cover what you tested. Run the full verification ladder. |
| "This console.log is just debug, not a stub" | Check if it's replacing real functionality. If replacing → Blocker. If debug → Minor. |
| "I'll mark this as PASS and let the user find issues in testing" | PASS means verified, not hoped-for. Run the checks. |
| "The anti-pattern sweep found nothing, must be clean" | Did you add project-specific patterns from CLAUDE.md Learned Rules? |
| "I'll ask the human to verify the build passes" | Run `npm run build`. You can do this yourself. |
