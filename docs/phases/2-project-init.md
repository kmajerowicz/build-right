# Phase 2: Project Initialization

**Creates the project tracking infrastructure from the PRD. One-time automated step.**

---

## Access & Credentials Check

Before creating anything, the system asks the user about access to external services required by the stack. Based on `docs/techstack.md` (or PRD if techstack.md doesn't exist yet), identify what needs access:

**Examples:**
- Supabase → project URL, anon key, service role key
- Vercel → account access, project linked?
- Mapbox → API token
- Stripe → API keys (test + prod)
- GitHub → repo created? Push access?
- Domain → DNS configured?
- Any third-party API → keys, accounts, rate limits

**How it works:**
1. Read the stack and identify all external services
2. Ask the user: "Before we start building, I need to verify access. Do you have credentials/access for: [list]?"
3. For each service, explain what's needed and why (following Principle 10 — explain every choice)
4. User confirms or flags blockers
5. Blockers go to BACKLOG.md or block the relevant build phase

This prevents the situation where you're mid-implementation and discover the user doesn't have a Supabase project or Vercel account.

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
