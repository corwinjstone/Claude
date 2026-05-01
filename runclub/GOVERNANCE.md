# RunClub Governance

This document explains **how rules in RunClub get added, changed, and
removed**. The short version: every team owns a folder, every team
folder is a contract, every change is a PR.

---

## 1. The two layers

RunClub has two distinct rule layers. They serve different purposes and
have different change processes.

### Runtime layer — `rules-engine/`

Machine-readable JSON rules consumed by registration, results, and
director services at runtime. Owned by the team named in each
division's `owning_team` field. Changes here are deployed; tests
must pass; product behavior changes immediately.

### Governance layer — `teams/`

Human-readable team contracts. Each team folder contains:

| File              | Purpose                                                         |
|-------------------|-----------------------------------------------------------------|
| `README.md`       | Team charter — mission, scope, out-of-scope, dependencies.      |
| `constitution.md` | Non-negotiable principles. Amendments require explicit reviews. |
| `design.md`       | Team-specific design rules layered on the global Design System. |
| `ai-agents.md`    | Explicit constraints on AI agents (Claude, Copilot, etc.)       |

The governance layer is the **source of truth for intent**. The
runtime layer enforces what the governance layer requires.

---

## 2. PR-based change management

Every file in `teams/` and `rules-engine/` is governed by CODEOWNERS.
A PR touching a team's folder requires that team's review before it
can merge. The exact review counts are in each team's
`constitution.md`.

### Standard flow

1. Open a branch.
2. Edit the file(s).
3. Open a PR. CODEOWNERS auto-requests reviews from the affected teams.
4. Required reviewers approve (count specified in each
   `constitution.md`; default is one).
5. CI passes (lint rules, rules-engine load tests).
6. Merge.

### Cross-team changes

A PR that modifies multiple teams' folders requires approval from
**each** affected team. There is no "lead team" override.

### Constitution amendments

Amendments to any `constitution.md` require the review counts specified
in that file's amendment article. The Safety & Medical constitution
requires two reviewers; all others require one. Amendments to the
Design System constitution require a written rationale and a migration
plan.

---

## 3. AI-agent rules

Every team folder contains an `ai-agents.md` file. These bind AI agents
operating in this codebase. Specifically:

- AI agents **cannot approve PRs** in any team folder.
- AI agents **cannot amend** `constitution.md` files. CODEOWNERS rejects
  AI-authored commits to these paths.
- AI agents **must read the relevant `ai-agents.md`** before generating
  code or copy that touches that team's surfaces.
- Where two `ai-agents.md` files conflict, the **stricter** rule wins.
  Where Safety & Medical's `ai-agents.md` conflicts with any other,
  Safety & Medical wins.

---

## 4. Authority hierarchy

When team rules conflict, this order resolves them:

1. **Safety & Medical** — overrides all other teams on
   `rules.medical.*` and `rules.weather_protocols.*` paths.
2. **Design System** — overrides all other teams on type, color, and
   component decisions.
3. **Owning team for the division** — overrides on division-specific
   policy (refund windows, qualifier requirements, etc.).
4. **Race Director Services** — exposes per-event override mechanism,
   bounded by the rules above.

A PR that violates this hierarchy is rejected by CODEOWNERS or by the
runtime engine, not "approved with caveats."

---

## 5. What this is NOT

- Not a feature-flag system. Use the platform feature-flag service for
  rollout control.
- Not a project-management system. Roadmaps live elsewhere.
- Not a substitute for legal review. Waivers, attestations, and
  privacy policies follow legal review independent of this process.
- Not an excuse to slow down good work. The PR process exists so that
  changes are durable and reviewable, not so that nothing changes.
