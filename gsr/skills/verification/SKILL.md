# /gsr:verify — Verification Skill

You are executing the `/gsr:verify` command. Your job is to verify a completed feature or build phase against its must-haves and produce an evidence-based report.

---

## Iron Laws

1. **"All tasks done" is not verification.** Check actual outcomes. Run commands. Read output. Verify with evidence.
2. **Always exhaust lower tiers before escalating to human.** Never ask a human to verify something a grep or build command can answer.
3. **Blockers block. Minors don't.** A Blocker means the feature is not done. A Minor goes to BACKLOG.md and the phase can still PASS.

---

## Step 0: Detect Project State

Read `docs/STATE.md`. Check the phase progress table.

**If all phases are NOT STARTED** → the project has no built code to verify. Switch to **PRD Review Mode** (see section below). Do not proceed with Steps 1–5.

**Otherwise** → continue to Step 1 (build verification).

---

## PRD Review Mode

The project has no built phases yet. Instead of verifying code, verify the spec — catch problems now before they become expensive to fix mid-build.

Run all 5 checks below. For each: fix what you can directly in `docs/PRD.md` and `docs/features/*.md`, surface what needs a user decision as a decision gate.

### Check 1: Cross-Phase Dependency

For every feature in every phase, ask: does this feature depend on something only delivered in a later phase?

Common traps:
- UI component references a service built in a later phase
- Phase N demo sentence requires data only available after Phase N+2
- Shared infrastructure (auth, caching, service workers) used before it's scaffolded

For each conflict found: either move the dependency earlier, swap phase order, or add a "scaffold in Phase X, complete in Phase Y" note. Fix directly if unambiguous; use a decision gate if trade-offs exist.

### Check 2: Internal Consistency

- Auth type — consistent across architecture diagram, data model, onboarding flow, feature descriptions?
- Screen/step counts — do counts in headers match the actual list of screens?
- Data model — does every feature have the entities it needs? Does any feature reference a field that doesn't exist in the model?
- Out-of-scope list — does anything in "explicitly out" contradict something required by an in-scope feature?

### Check 3: Open Decisions

Scan PRD.md and all feature files for anything ambiguous, assumed, or marked ⚠️. List them. Surface each as a decision gate — one at a time.

### Check 4: Completeness

For every feature in the feature index:
- Does it have a demo sentence or verifiable user story? If not, the feature is too abstract.
- Does it have at least one observable truth verifiable at build time?
- Are there undefined terms — entities or concepts used but never defined in the PRD or data model?

For each feature file, also check:
- **Must-haves are testable** — every Truth uses "User can [action]" or "System does [behavior] when [condition]", not vague descriptions
- **States covered** — empty, loading, partial, full, error states present where relevant
- **Business rules are concrete** — no "appropriate validation" or "proper error handling"; specify what validation, what error message

Fix what you can; flag what needs user input.

### Check 5: Edge Case and Gap Sweep

Re-read the PRD as if you are a developer about to implement Phase 1 tomorrow:
- What would you need to ask before starting? Those are gaps.
- What states are missing? (empty states, error states, loading states, offline states, first-time-user states)
- What happens at the boundaries? (max items, zero items, concurrent users, expired sessions)

Only add edge cases that would cause a developer to make a wrong assumption. Don't pad the PRD.

---

### PRD Review Report

After running all 5 checks, present a structured report:

```
## PRD Review — [date]

### Issues Found and Fixed
- [what was wrong → what was changed]
- "Review passed clean" if nothing found

### Open Decisions
[Each surfaced as a decision gate, one at a time]

### Gaps Requiring Input
[Anything that needs user clarification before building]

### Summary
Spec quality: READY TO BUILD / NEEDS DECISIONS / HAS GAPS
```

If **READY TO BUILD**: "Spec looks solid. Run `/gsr:build` to start Phase 1."
If **NEEDS DECISIONS** or **HAS GAPS**: work through them before declaring ready.

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

Dispatch parallel verification checks (use implementer agents for independent checks). Each Agent tool call must pass `model: "claude-sonnet-4-6"` (see `${CLAUDE_PLUGIN_ROOT}/agents/implementer.md` — Recommended Model):

### Check 1: Build & TypeScript (Tier 1 — Automated)
```bash
npm run build      # must pass with 0 errors
npx tsc --noEmit   # must report 0 TypeScript errors
npm run lint       # must pass if configured
```
Report using evidence format (see Evidence Format below).

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

## Evidence Format

Every verification claim must follow the evidence format: show the command, the actual output, then the verdict. This makes results scannable and trustworthy.

```
✅ npm run build → Exit 0, 0 errors → "Build passes"
✅ npx tsc --noEmit → Exit 0, 0 errors → "TypeScript clean"
✅ npm run lint → Exit 0, 0 warnings → "Lint passes"
❌ grep -r "console.log" src/ → 3 matches (auth.ts:12, api.ts:45, utils.ts:8) → BLOCKER: debug logs in production code
⚠️ grep -r "TODO" src/ → 1 match (config.ts:22) → MINOR: moved to BACKLOG.md
```

Rules:
- `✅` = check passed with evidence
- `❌` = check failed — blocker
- `⚠️` = check found minor issue — not blocking
- Always show the actual command, actual output summary, then the claim
- Never write "should pass", "probably works", "seems correct", or "looks good" — these are red flag phrases that signal skipped verification (see Red Flag Language below)

---

## Red Flag Language

The following phrases are **banned** in verification output. If you catch yourself writing any of them, stop — you haven't actually verified:

| Banned Phrase | What To Do Instead |
|---------------|-------------------|
| "should work" | Run the command. Show the output. |
| "should pass" | Run the command. Show the output. |
| "probably works" | Run the command. Show the output. |
| "seems correct" | Run the command. Show the output. |
| "looks good" | Run the command. Show the output. |
| "seems to work" | Run the command. Show the output. |
| "I believe this passes" | Run the command. Show the output. |
| "likely fine" | Run the command. Show the output. |
| "Done!" / "All done!" | Show evidence, then state completion. |
| "It works" | Show what command proved it works. |

If you find yourself using hedging language, it means you haven't run the verification. Go back to Step 2 and actually execute the checks.

---

## Step 3: Compile Verification Report

Format the report per `docs/phases/4-verification.md`:

```markdown
## [Feature/Phase] Verification — [date]

### Evidence Summary
✅ npm run build → Exit 0, 0 errors → "Build passes"
✅ npx tsc --noEmit → Exit 0 → "TypeScript clean"
✅ npm run lint → Exit 0 → "Lint passes"
✅ npm test → 24/24 pass → "All tests pass"

### Demo Check
> After this phase: [demo sentence from PRD]
- [ ] manual: open app, verify the above

### Observable Truths
| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | [Truth] | PASS / FAIL / HUMAN | [command → output → claim] |

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
If any human check requires opening the app in a browser, start the dev server first:
```bash
npm run dev &
```
Wait 2–3 seconds, then confirm it started (look for "ready" or "localhost" in output). If it fails to start, report the error before presenting checks.

Then present the checklist:
```
Human verification needed:

1. Open [localhost URL] → [specific action] → expect: [specific outcome]
2. [Next check]

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
2. If yes → run backlog triage (below) before declaring done.

### Backlog Triage (Claude-led)

Read `docs/BACKLOG.md` in full. For each item, classify it:

- **Must before launch** — the product is broken, misleading, or incomplete without this. A user would notice immediately.
- **v2** — genuinely useful, but the product ships and works without it.
- **Won't do** — no longer relevant, superseded by something built, or not worth the complexity.

Present the triage as a table:

```
## Backlog Triage

| Item | Recommendation | Reason |
|------|---------------|--------|
| [item] | Must before launch | [why it blocks launch] |
| [item] | v2 | [why it's post-launch] |
| [item] | Won't do | [why it's no longer needed] |
```

For any item where the categorization is non-obvious or you're uncertain: use the decision gate pattern (`${CLAUDE_PLUGIN_ROOT}/docs/patterns/decision-gate.md`). Enter plan mode, present the options with your recommendation, user clicks.

For items where the categorization is clear: include them in the table without a decision gate — just present and ask for confirmation at the end: "Does this look right? Adjust any categorizations before we finalize."

After user confirms:
3. If any 'must before launch' items → "These become a new build phase. Run `/gsr:build` to continue."
4. If nothing 'must before launch' → run the Deployment Check below before declaring done.

### Deployment Check

Read `docs/techstack.md`. If it mentions a hosting provider (Vercel, Netlify, Railway, Fly.io, Render, etc.):

Check for deployment signals:
- `vercel.json` exists, or `.vercel/` directory exists → likely configured
- `netlify.toml` exists → likely configured
- Ask the user directly:

```
One last thing — your stack uses [host]. Is it deployed?

1. Yes — live at [URL]
2. Not yet — I'll deploy now

Deploying now means the project is actually live, not just built.
```

If the user says "not yet": walk them through the deployment steps for their specific host (e.g. for Vercel: `vercel --prod`, confirm env vars are set, smoke test the live URL). Do not declare DONE until they confirm it's live.

If the stack has no hosting provider, or the user confirms it's already live → "Project is DONE."

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
| "This should pass" / "Looks good" / "Probably works" | Red flag language. You haven't verified. Run the command, show the output, then claim. See Red Flag Language section above. |
