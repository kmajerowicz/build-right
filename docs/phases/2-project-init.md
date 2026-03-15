# Phase 2: Project Initialization

**Creates the project tracking infrastructure from the PRD. One-time automated step.**

---

## What It Creates

- `CLAUDE.md` — living instruction manual (conventions, code references, empty Learned Rules section)
- `docs/techstack.md` — stack, versions, tech decisions, project-wide skills
- `docs/STATE.md` — progress tracker (~30 lines, never >50)
- `docs/BACKLOG.md` — deferred work (from scope v2 section + captured during build)

---

## What It Does NOT Create

- No config.json with 30 toggles
- No separate ROADMAP.md (build phases are in PRD.md)
- No .planning/ directory with nested phase folders
- No skills mapping table (skills live in feature files)

---

## CLAUDE.md Content

Starts at ~30-40 lines. Grows to ~80-120 over the project life (mostly Learned Rules).

- Project name + one-line description
- **References** — where things live:
  - "Tech stack: `docs/techstack.md`"
  - "Product context: `docs/PRD.md`"
  - "Schema: `supabase/migrations/`" (project-specific)
  - "Routes: `src/router.tsx`" (project-specific)
- Code conventions (naming, folder structure, patterns)
- **Learned Rules** section (empty at init, grows with every `/gsr:learn` correction, each dated)

---

## docs/techstack.md Content

- Stack + versions
- Why each choice was made (decision rationale)
- Key patterns per technology
- **Project-wide skills** (skills that apply to every feature, e.g. `responsive-design` for mobile-first apps)

---

## docs/STATE.md Content (~30 lines)

- Current focus (phase + status)
- Phase progress table (# | Phase | Type | Status | Tasks done/total)
- Recent decisions (date + what + which file updated)
- Deferred items (captured during build)
- Phase verification records (appended when phases complete)
- Last session / next action

---

## docs/BACKLOG.md Content

- Deferred from Scope (with why deferred + revisit trigger)
- Captured During Build (with context where it came up + priority)
