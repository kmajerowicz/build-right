# Your Approach vs GSD — Deep Comparison Report

**Author:** Kacper Majerowicz | **Date:** March 2026

---

## Your Approach: "PRD-First, Human-in-the-Loop" (Evolved)

Your method has **three distinct phases**, all in Claude Code, with **you as the architect and quality gatekeeper**:

### Phase 0: Scope Shaping (conversational)
- You use Claude Code as a thinking partner, not a coder
- Iterative product decisions — walk types, registration model, goal optionality, data sources
- You resolve ambiguities and make tradeoffs before any architecture exists
- You identify research areas upfront, at the scope level
- Output: a rich scope document (vision, navigation architecture, data model, empty states, research areas, v2 backlog, competitive positioning)

### Phase 1: PRD Generation (generative)
- Scope.md + design reference fed to Claude Code
- Claude proposes architecture, project structure, per-screen specs, phased implementation plan
- You iterate — edge cases, refinements, missing sections
- Output: PRD.md (~32k tokens) — the single source of truth

### Phase 2: Build (implementation)
- CLAUDE.md as living instruction manual (grows organically with corrections)
- Mandatory skills enforcement (design, responsive, shadcn, Tailwind, React)
- Small, human-scoped tasks ("build WeatherCard" not "build the dashboard")
- Plan mode for anything touching >2 files
- You review every diff, correct aggressively, build memory
- Each correction is an investment for all future sessions

**Result (Vitis):** 98 commits, ~2 days, working MVP you were happy with.

---

## GSD: "Agent-Orchestrated Pipeline"

GSD replaces human judgment with agent orchestration at every step:

1. **`/gsd:new-project`** — agents ask questions, research domain, generate requirements + roadmap
2. **`/gsd:discuss-phase`** — system identifies gray areas and asks you
3. **`/gsd:plan-phase`** — research agent + planner agent + checker agent loop
4. **`/gsd:execute-phase`** — executor agents run in parallel waves, fresh 200k context each
5. **`/gsd:verify-work`** — verifier agent checks against goals
6. Repeat per phase

**Result (pointer-adventure):** 9 phases, 21 plans, ~10 sessions, 8,300 LOC. App worked but you were unhappy with look, feel, and bug density.

---

## The Core Difference

| Dimension | Your Way | GSD |
|-----------|----------|-----|
| **Philosophy** | Human thinks, AI executes | AI thinks and executes, human approves |
| **Who makes product decisions** | You, in Phase 0, before any code | Agents, during `/gsd:new-project` + `/gsd:discuss-phase` |
| **When research happens** | You identify research needs upfront in scope | Agents research automatically per phase |
| **Quality of input to coding** | Rich scope → rich PRD → precise tasks | Requirements checklist → agent-generated plans |
| **Who drives architecture** | You iterate with Claude on PRD | Agents propose in research phase |
| **Design quality** | Skills + design tokens + your eye | No design context — agents focus on functionality |
| **Feedback loop** | Instant (you see → you correct → memory saves) | Delayed (execute whole phase → verify → maybe fix) |
| **When bugs are caught** | During implementation (you're watching) | After execution (verification phase) |
| **Context accumulation** | CLAUDE.md + memory grow across all sessions | Each executor gets fresh context, no accumulated wisdom |
| **Granularity of control** | One component at a time, you approve each diff | Entire phases with 2-3 plans executing in parallel |
| **Research quality** | You decide what needs research based on domain knowledge | Agents decide what to research based on phase requirements |

---

## Why Your Approach Produces Better Results

### 1. Product decisions are made by the person who understands the user

Your scope document for Psie Wędrówki has decisions like "goals are fully optional — the app works without them" and "the app knows about a walk only if the user enabled tracking — messages ask, don't assume." These are empathy-driven product decisions that no agent can make. In GSD, these decisions either get made by an agent (badly) or surface during `/gsd:discuss-phase` (too late — architecture may already be committed).

### 2. Your scope document is richer than GSD's entire planning stack

Your scope.md already contains navigation architecture, empty states, notification logic, data model with field-level decisions, competitive positioning, and a v2 backlog. GSD's `PROJECT.md` + `REQUIREMENTS.md` + `ROADMAP.md` together contain less product context than your single scope file.

### 3. Research is targeted, not automated

You identified 7 specific research areas (OSM data quality, loop generation, Mapbox offline, iOS push, weather alert thresholds, road exposure heuristics, Polish trail sources). Each one is tied to a real risk you understand. GSD's research agents investigate broadly — 4 parallel agents looking at stack, features, architecture, pitfalls. They may miss domain-specific risks (like "how reliable are OSM water tags near Poznań?") while spending tokens on things you already know.

### 4. The PRD creates a shared language between you and Claude

"Implement Dashboard (section 10.2)" is precise. Every session references the same foundation. In GSD, each executor agent gets a `PLAN.md` with task-level instructions but no holistic product vision. The executor building the filter panel doesn't know that goals are optional, or that the app tone should ask rather than assume.

### 5. Skills enforce quality that agents can't

Your `frontend-design` + `shadcn-ui` + `responsive-design` + `tailwind-design-system` skills mean every UI component gets production-quality treatment. GSD executors write functional code with no design guidance. This is why pointer-adventure looked generic.

### 6. Corrections compound. Agent isolation doesn't

When you correct Claude once ("use `minmax(0, 1fr)` in CSS grids"), every future session benefits. In GSD, each executor runs in a fresh 200k context — it will make the same CSS grid mistake in phase 5 that you corrected in phase 1. CLAUDE.md partially mitigates this, but only if you've already discovered and documented the issue.

### 7. You catch bugs at the moment of creation

You review every diff. If a component looks wrong, you fix it before the next component builds on it. In GSD, an executor might build 3 components with the same bug, and the verifier only checks if the requirement was met — not if the implementation is good.

---

## What GSD Does Better (And You Should Steal)

### 1. Structured progress tracking

GSD's `STATE.md` + `ROADMAP.md` with phase completion percentages, velocity metrics, and decision logs is valuable. Your approach doesn't have explicit progress tracking — you just know where you are because you're doing it.

### 2. Verification with evidence

GSD's `VERIFICATION.md` with grep-based evidence ("0 hardcoded strings found") is rigorous. In your approach, you verify by testing in the browser — effective but undocumented.

### 3. The discuss → research → plan → execute cycle (for systematic tasks)

You proved this yourself — GSD worked well for Vitis's hardening sprint (17 systematic requirements across 4 phases). When tasks are well-defined and don't need design judgment, the agent pipeline adds value.

### 4. Atomic commits per task

GSD commits after every task, making git bisect possible. Worth adopting.

### 5. Deferred work tracking

GSD learned (the hard way) that deferred items need explicit tracking. Your approach relies on your memory — which works when you're in flow but could drop things across sessions.

---

## Where Each Approach Fits

| Situation | Better Approach |
|-----------|----------------|
| Building a new MVP from scratch | **Yours** — product decisions, design quality, and human feedback loop matter most |
| Hardening / polish sprint (many small tasks) | **GSD** — systematic, parallel, verification-driven |
| Design-sensitive UI work | **Yours** — skills + your eye are irreplaceable |
| Backend/infrastructure tasks | **Either** — less design judgment needed |
| Debugging a complex issue | **GSD's debugger** — structured scientific method with state persistence |
| Ongoing feature development | **Yours** — accumulated CLAUDE.md + memory compound over time |

---

## The Opportunity

Your approach is better for building products, but it's undocumented and lives in your head. GSD is worse for products but has structure, tracking, and repeatability. The system you want to build should combine:

- **Your Phase 0 → 1 → 2 pipeline** (scope → PRD → build)
- **Your quality mechanisms** (CLAUDE.md, skills, plan mode, aggressive correction)
- **GSD's tracking and verification** (STATE.md, VERIFICATION.md, atomic commits)
- **GSD's systematic execution** (but only for well-defined, non-creative tasks)
