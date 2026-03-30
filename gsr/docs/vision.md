# Get Shit Right (GSR)

A workflow system for Claude Code that formalizes how to build production apps and features — PRD-first, human-in-the-loop, skills-enforced — into reusable commands anyone can use. Works for new projects from scratch, projects with existing materials, and new features in existing products. Takes the best structural elements from GSD (progress tracking, verification, atomic commits) without the overhead, agent-driven product decisions, or loss of human control.

**One sentence:** GSD's structure with Kacper's soul — the human makes all product decisions, the system tracks progress and enforces quality.

---

## Target Users

- PMs / non-developers building apps with Claude Code
- Developers who want structured workflow without enterprise overhead

---

## Three Entry Points

### Start A: Empty Page
User has nothing but an idea. The system helps shape it into a structured scope, then flows into PRD and build.

**Flow:** Idea → Scope Shaping → scope.md → PRD → Build

### Start B: Something Exists
User has materials (client brief, scope doc, partial spec, existing codebase). The system maps what exists, assesses quality against what's needed, improves gaps or proceeds if ready.

**Flow:** Materials → Map & Assess → Improve or Proceed → PRD → Build

### Start C: Existing Product
User has a running product and wants to build a new feature or develop existing functionality with GSR practices.

**Flow:** Codebase Onboarding → Feature Scope → Feature File → Build → Verify

**After A and B, both paths converge into:** PRD (+ Init) → Build
**Start C joins at:** Feature File → Build → Verify (skips full PRD, works at feature level)

---

## Phases

### New projects (Start A / Start B)

| Phase | Name | What it does | Spec |
|-------|------|-------------|------|
| 0 | Scope Shaping | Idea or materials → structured scope document | [phases/0-scope-shaping.md](phases/0-scope-shaping.md) |
| 1 | PRD Generation | Scope → condensed PRD + feature files | [phases/1-prd-generation.md](phases/1-prd-generation.md) |
| 2 | Project Init | Create CLAUDE.md, STATE.md, BACKLOG.md from PRD | [phases/2-project-init.md](phases/2-project-init.md) |
| 3 | Build | Creative (human-in-the-loop) + Systematic (agent-driven) | [phases/3-build.md](phases/3-build.md) |
| 4 | Verification | Verify phase against PRD success criteria | [phases/4-verification.md](phases/4-verification.md) |

### Existing products (Start C)

| Phase | Name | What it does | Spec |
|-------|------|-------------|------|
| C.1 | Codebase Onboarding | Map codebase, create CLAUDE.md + GSR structure | [phases/0c-existing-product.md](phases/0c-existing-product.md) |
| C.2 | Feature Scope | Scope the feature (goal, vision, user, why) | [phases/0c-existing-product.md](phases/0c-existing-product.md) |
| C.3 | Feature File | Create docs/features/\<name\>.md with spec + skills | [phases/0c-existing-product.md](phases/0c-existing-product.md) |
| C.4 | Build | Same as Phase 3 | [phases/3-build.md](phases/3-build.md) |
| C.5 | Verify | Same as Phase 4 + integration check | [phases/4-verification.md](phases/4-verification.md) |

---

## Commands

GSR is a Claude Code plugin with 5 explicit commands:

| Command | What it does | Phases |
|---------|-------------|--------|
| `/gsr:learn` | Index existing project → populate CLAUDE.md (Start B entry point) | - |
| `/gsr:scope` | Idea or materials → structured scope document | Phase 0 |
| `/gsr:prd` | Scope → condensed PRD + feature files + project init | Phase 1 + 2 |
| `/gsr:build` | Pick feature → pick mode (creative/systematic) → build | Phase 3 |
| `/gsr:verify` | Verify feature against PRD success criteria | Phase 4 |

Each command knows what comes next and tells the user. Context clearing between commands keeps the window fresh.

See [Plugin Design](plans/2026-03-15-gsr-plugin-design.md) for full architecture.

---

## Design Principles

1. **Human thinks, AI executes.** Product decisions are made by the human. Always.
2. **PRD is the constitution.** Every task traces back to a feature file.
3. **Corrections compound.** CLAUDE.md Learned Rules grow with every correction. No fresh-context executors.
4. **Track progress without managing it.** STATE.md updates automatically. Human never updates a spreadsheet.
5. **Two modes, zero config.** Creative = human-in-the-loop. Systematic = agent-driven. Selected by prompt within `/gsr:build`, not toggle.
6. **Parallelize the independent.** Multiple agents for independent research/tasks. Sequential for dependent work.
7. **Adaptive, not prescriptive.** Mapping in Start B adapts to the project. Questions adapt to user's domain expertise. No hardcoded checklists for things that vary per project.
8. **Docs for product, code for implementation.** Documents describe what and why. Code describes how. Docs reference code, never duplicate it.
9. **Skills are boosters, not blockers.** Matched from marketplace per feature, loaded by workflow automatically. System works without them.
10. **Explain every choice.** The user may or may not be technical. May or may not be product-experienced. When presenting a decision, always explain: what are the options, what's the impact from a product perspective (UX, scope, timeline), and what's the impact from a technical perspective (complexity, maintainability, risk). Never assume the user knows — empower them to decide with full context.
11. **Enforce, don't hope.** Critical rules include Red Flags and Common Rationalizations tables — preventing Claude from rationalizing its way past them. Borrowed from superpowers.

---

## Key References

- [plans/2026-03-15-gsr-plugin-design.md](plans/2026-03-15-gsr-plugin-design.md) — Plugin architecture design
- [architecture.md](architecture.md) — How GSR projects are structured (file layout, progressive disclosure, docs vs code)
- [decisions.md](decisions.md) — All decisions made during design, with rationale
- [research/analysis.md](research/analysis.md) — Original comparison: Kacper's approach vs GSD
