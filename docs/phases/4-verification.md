# Phase 4: Verification

**Verifies a completed build phase against its must-haves — structured, evidence-based, mechanically checkable.**

---

## How It Works

1. Claude reads the phase's must-haves (from PRD build phases) and the demo sentence
2. Runs the **verification ladder** — strongest automated check first, human only when necessary
3. Generates a structured verification report (Truths, Artifacts, Key Links, Anti-Patterns)
4. Demo sentence becomes the first human verification item
5. User does manual checks, marks pass/fail

---

## Gate Function — 5-Step Verification Protocol

Before ANY completion claim (in both build and verify phases), Claude follows this exact sequence:

1. **IDENTIFY** — Name the command that proves the claim
2. **RUN** — Execute the command
3. **READ** — Read the full output
4. **VERIFY** — Confirm the output supports the claim
5. **CLAIM** — Only then state the claim with evidence

No shortcuts. No skipping steps. No claiming based on "I just wrote the code so it should be fine."

### Examples

**Claim: "Build passes"**
```
IDENTIFY: npm run build
RUN:      npm run build
READ:     "Compiled successfully. 0 errors, 0 warnings."
VERIFY:   Output explicitly says 0 errors → claim supported
CLAIM:    "Build passes (0 errors, 0 warnings)"
```

**Claim: "No hardcoded API keys"**
```
IDENTIFY: grep -r "sk-\|AKIA\|ghp_\|api_key\s*=" src/
RUN:      grep -r "sk-\|AKIA\|ghp_\|api_key\s*=" src/
READ:     0 matches
VERIFY:   No matches for common key patterns → claim supported
CLAIM:    "grep confirms no hardcoded API keys (0 matches for sk-, AKIA, ghp_, api_key= patterns)"
```

**Claim: "All tests pass"**
```
IDENTIFY: npm test
RUN:      npm test
READ:     "Tests: 12 passed, 12 total. Suites: 4 passed, 4 total."
VERIFY:   All tests pass, none skipped → claim supported
CLAIM:    "Test suite: 12/12 pass across 4 suites"
```

---

## Banned Words in Completion Claims

These phrases are **never allowed** in completion claims. They signal guessing, not verifying.

| Banned Phrase | Replace With |
|---------------|-------------|
| "should work" | "build passes (0 errors)" |
| "probably works" | "test suite: 12/12 pass" |
| "seems correct" | "grep confirms pattern X present in 3/3 files" |
| "looks good" | "TypeScript: 0 errors, lint: 0 warnings" |
| "I believe this is correct" | "verified: command output confirms [specific thing]" |
| "this should fix it" | "build passes after change; test X now passes" |

**The rule:** Every completion claim must reference a specific command output or observable result. If you cannot point to evidence, you are not done.

---

## Verification Ladder — 4 Tiers of Evidence

Always start at Tier 1 and exhaust each tier before moving to the next. Never ask a human to verify something a machine can check.

### Tier 1: AUTOMATED (cheapest — machine says pass/fail)
- `npm run build` — compiles without errors
- `npx tsc --noEmit` — no TypeScript errors
- `npm run lint` — no lint violations
- CI pipeline green

**Use for:** Every completion claim, minimum bar.

### Tier 2: GREP (pattern search — anti-patterns absent, expected patterns present)
- `grep -r "TODO\|FIXME\|HACK" src/` — no leftover markers
- `grep -r "console.log" src/` — no debug logging
- `grep -r "hardcoded-string" src/` — no untranslated strings (i18n)
- `grep -rL "import.*test" src/components/` — find files missing test imports
- Verify expected patterns ARE present: `grep -r "aria-label" src/components/` — accessibility attributes exist

**Use for:** Checking code patterns, anti-patterns, completeness.

### Tier 3: TEST (test suite execution — pass/fail with output)
- `npm test` — full suite
- `npm test -- --coverage` — coverage thresholds
- `npm run e2e` — end-to-end tests
- Specific test files: `npm test -- dashboard.test.ts`

**Use for:** Behavioral verification, regression checks, feature correctness.

### Tier 4: HUMAN (most expensive — requires manual check)
- "Open /dashboard, verify cards render with correct spacing"
- "Test pull-to-refresh on mobile device"
- "Verify dark mode contrast is readable"
- "Check that animation feels smooth, not janky"

**Use for:** Visual quality, feel, taste, device-specific behavior — things no command can verify. Only after Tiers 1-3 are exhausted.

---

## Evidence Format

Verification evidence must be structured and traceable:

---

## Verification Report Format

Appended to STATE.md as phase completion record.

```markdown
## Phase 2 Verification — 2026-03-15

### Demo Check
> After this phase: user can sign up, log in, and see a protected dashboard with real data.
- [ ] manual: open app, verify the above

### Observable Truths
| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can sign up with email | PASS | POST /api/auth/signup returns 201 |
| 2 | Dashboard renders with real data | PASS | grep: no mock data in /dashboard |
| 3 | Pull-to-refresh works on mobile | HUMAN | needs manual test on device |

### Artifacts
| File | Expected | Status | Evidence |
|------|----------|--------|----------|
| src/lib/auth.ts | JWT helpers, exports generateToken, verifyToken | SUBSTANTIVE | 87 lines, both exports present |
| src/app/dashboard/page.tsx | Dashboard with data fetching | SUBSTANTIVE | 142 lines, fetches from API |
| src/lib/email.ts | Email sending via Resend | STUB | 8 lines, console.log instead of sending |

### Key Links
| From | To | Via | Status |
|------|----|-----|--------|
| dashboard/page.tsx | auth.ts | import verifyToken | WIRED |
| login/route.ts | auth.ts | import generateToken | WIRED |
| email.ts | Resend API | resend.emails.send() | NOT WIRED |

### Anti-Patterns
| File | Pattern | Severity |
|------|---------|----------|
| src/lib/email.ts | console.log stub replacing real implementation | Blocker |
| src/components/Card.tsx | hardcoded string "TODO: add description" | Minor |

### Summary
Evidence: build passes, 0 TS errors, 12/14 tests pass
Blockers: email.ts is a stub, needs real Resend integration
Human checks needed: mobile pull-to-refresh, demo sentence
```

---

## What Each Section Catches

| Section | What it catches | How |
|---------|----------------|-----|
| **Truths** | "Does it actually work?" — observable behaviors | Run commands, check API responses, grep for evidence |
| **Artifacts** | "Is it real or a stub?" — files exist with substantive implementation | Check file exists, line count, exports present |
| **Key Links** | "Is it wired together?" — components actually connected | Grep for imports, check function calls chain |
| **Anti-Patterns** | "Are there shortcuts hiding?" — stubs, TODOs, hardcoded values | Grep for console.log stubs, TODO, hardcoded strings, mock data |

---

## Anti-Pattern Sweep

Standard grep patterns to run on every verification:

- `console.log` used as placeholder for real functionality
- `TODO`, `FIXME`, `HACK` in production code
- Hardcoded strings that should be dynamic (API URLs, credentials)
- Mock/fake data in non-test files
- Empty catch blocks
- Commented-out code blocks

The sweep is additive — CLAUDE.md Learned Rules may add project-specific anti-patterns over time.

---

## Must-Haves Come From Two Places

1. **PRD build phases** — each phase defines must-haves at planning time (Phase 1)
2. **Feature files** — each feature's must-haves section, checked when that feature is built

Both use the same Truths / Artifacts / Key Links structure. Verification reads both.

---

## Parallelization

Verification checks are independent and can run in parallel:
- Anti-pattern sweep (grep-based)
- Artifact checks (file existence, line counts, exports)
- Key link checks (import grep)
- Test suite execution
- Build verification
- TypeScript error check
