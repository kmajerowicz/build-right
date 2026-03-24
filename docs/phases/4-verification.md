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

## The Verification Ladder

Try the strongest tier you can reach. Escalate only when you can't verify at a given level.

1. **Static** — Files exist, exports present, imports connected, not stubs. (grep, file checks)
2. **Command** — Tests pass, build succeeds, lint clean, no TS errors. (run commands)
3. **Behavioral** — Flows work in browser, API responses correct. (Claude can check via dev server)
4. **Human** — Only when Claude genuinely can't verify. ("open /dashboard on mobile, verify pull-to-refresh")

**The rule:** "All tasks done" is NOT verification. Check the actual outcomes.

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
