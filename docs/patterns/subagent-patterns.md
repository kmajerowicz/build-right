# Subagent Patterns — Role Separation and Status Protocol

**Operational patterns for subagent dispatch in GSR. Completes Decision 18 (subagents for parallelism) with concrete roles, handoff protocol, and status reporting.**

---

## Overview

Subagents are used in GSR when the controller skill needs to dispatch independent units of work:

- **Systematic build tasks** — each task in a systematic sweep can be dispatched to an implementer subagent
- **Parallel research** — multiple research questions investigated simultaneously during scope shaping or PRD generation
- **Verification checks** — independent checks (grep, tests, build, TS errors) run in parallel

Subagents are never used for tasks requiring back-and-forth with the user — that's creative mode, handled by the controller directly.

---

## Roles

### Implementer

The workhorse. Gets a task, does the work, reports status.

- Gets full task context from controller (never navigates to find it)
- Fresh context — no pollution from other tasks
- Reads CLAUDE.md for conventions (controller includes relevant sections in handoff)
- Reports one of 4 statuses (see Status Protocol below)
- Never makes product decisions — escalates via `NEEDS_CONTEXT`
- Atomic commit per completed task

### Reviewer (systematic mode only)

Quality gate. Reviews implementer output against the spec.

- Reviews implementer's output against the feature file requirements
- Checks: does implementation match feature file requirements?
- Checks: code quality — conventions from CLAUDE.md followed?
- Reports: `PASS` / `FAIL` with specific issues
- Reviewer never fixes code — only reports issues for implementer to fix
- In systematic mode, a reviewer checks each implementer's output before the commit

### Researcher

Information gatherer. Returns structured findings, never makes decisions.

- Gathers information (competitive analysis, API capabilities, tech options)
- Returns structured findings to the controller
- Used in: scope shaping (Step 2 — competitive mapping), PRD generation (blocking-PRD research), build (blocking-build research)
- Multiple researchers can run in parallel for independent questions
- Returns findings only — controller and user make decisions based on findings

---

## Status Protocol

Every subagent reports one of exactly 4 statuses. No ambiguity.

| Status | Meaning | Controller action |
|---|---|---|
| `DONE` | Task complete, all checks pass | Accept, move to next task |
| `DONE_WITH_CONCERNS` | Task complete but flagging potential issues | Review concerns, decide if action needed |
| `NEEDS_CONTEXT` | Missing information, returns specific questions | Provide info or escalate to user |
| `BLOCKED` | Cannot proceed, explains why | Investigate, possibly reassign or escalate |

### Status details

**DONE** — the happy path. Task finished, code compiles, tests pass (if applicable), conventions followed. Controller accepts and moves on.

**DONE_WITH_CONCERNS** — task is complete but the subagent noticed something worth flagging. Examples: "This works but the API response time is slow," "Implementation matches spec but the spec might have a gap here." Controller reviews concerns and decides whether to act now, add to BACKLOG.md, or accept as-is.

**NEEDS_CONTEXT** — subagent hit a question it cannot resolve without product knowledge or information not in the handoff. Must return specific questions, not vague "I need more info." Controller either answers from context or escalates to the user.

**BLOCKED** — subagent cannot proceed. Examples: dependency not installed, API key missing, conflicting requirements in spec. Explains the blocker clearly so controller can investigate.

---

## Context Handoff Rules

The controller is responsible for giving each subagent everything it needs. Subagents should not need to go hunting for context.

1. **Full task description** — subagent never reads the plan file itself; controller provides the complete task text
2. **Relevant CLAUDE.md sections** — conventions, learned rules that apply to this task (not the whole file if it's grown large)
3. **Feature file content** — if it's a build task, include the relevant feature file content
4. **Specific success criteria** — not "make it work" but concrete, verifiable criteria
5. **Relevant learned rules** — any corrections from previous tasks that apply to this one

---

## When to Dispatch a Subagent vs Do It Yourself

| Situation | Approach | Why |
|---|---|---|
| Independent task, no conversation context needed | Subagent | Fresh context, parallel execution |
| Task needs back-and-forth with user | Do it yourself (creative mode) | User interaction requires the controller |
| Multiple independent tasks | Parallel subagents | Speed — all run concurrently |
| Task needs output of another task | Sequential subagents, not parallel | Dependency requires ordering |
| Task requires product judgment | Do it yourself | Subagents escalate, not decide |

---

## Red Flags

Stop and reassess if you see any of these:

- **Dispatching a subagent without clear success criteria** — STOP. The subagent will guess what "done" means, and guess wrong.
- **Dispatching a subagent for a task that needs user judgment** — STOP. That's creative mode. The controller handles it directly.
- **Not including learned rules in handoff** — STOP. The subagent will repeat past mistakes that were already corrected.
- **Subagent reporting DONE without evidence** — STOP. Every DONE must be backed by verification (compiles, tests pass, grep confirms).
- **Parallel subagents writing to the same files** — STOP. Parallel means independent. If tasks touch the same files, they must be sequential.
