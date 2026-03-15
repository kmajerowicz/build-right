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

## Evidence Format

Verification is evidence-based, not "it probably works":

```markdown
## Phase 2 Verification — 2026-03-15
Criteria from PRD build phase 2:
- [x] Dashboard renders with real data (grep: no mock data in /dashboard)
- [x] WeatherCard shows 5-day forecast (manual: verified in browser)
- [ ] Pull-to-refresh works on mobile (manual: not tested yet)
Evidence: build passes, 0 TS errors, 0 console.errors in dev
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
