# Phase 4: Verification

**Verifies a completed build phase against PRD success criteria.**

---

## How It Works

1. Claude reads PRD success criteria for the phase
2. Runs automated checks (grep, test suite, build, TypeScript errors)
3. Generates verification evidence
4. Lists items needing human verification ("open /dashboard, verify cards render correctly")
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

```markdown
## Phase 2 Verification — 2026-03-15

Criteria from PRD build phase 2:

### Automated (Tier 1)
- [x] Build: `npm run build` → 0 errors, 0 warnings
- [x] TypeScript: `npx tsc --noEmit` → 0 errors
- [x] Lint: `npm run lint` → 0 warnings

### Grep (Tier 2)
- [x] No mock data in dashboard: `grep -r "mock\|fake\|dummy" src/dashboard/` → 0 matches
- [x] No console.log: `grep -r "console.log" src/` → 0 matches
- [x] Aria labels present: `grep -r "aria-label" src/components/` → 14 matches across 8 files

### Test (Tier 3)
- [x] Test suite: 24/24 pass, 4 suites, 87% coverage
- [x] Dashboard tests: `npm test -- dashboard` → 6/6 pass

### Human (Tier 4)
- [x] Dashboard renders with real data (manual: verified in browser)
- [x] WeatherCard shows 5-day forecast (manual: verified in browser)
- [ ] Pull-to-refresh works on mobile (manual: not tested yet)
```

---

## Where Results Live

Appended to STATE.md as phase completion record. No separate VERIFICATION.md files per phase.

---

## Parallelization

Verification checks are independent and can run in parallel:
- Grep-based checks (anti-patterns, hardcoded strings)
- Test suite execution
- Build verification
- TypeScript error check
