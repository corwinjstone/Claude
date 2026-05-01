# RunClub

RunClub is a race registration and event operations platform. We exist for one
purpose: helping athletes sign up for races, and helping race directors plan
and run those races.

We are NOT a general fitness app, social network, training plan provider,
nutrition tracker, or e-commerce platform. Every line of business below maps
back to either:

1. **Athlete-side**: discovering, registering for, and competing in races.
2. **Director-side**: planning, staffing, timing, and operating races.

## Scope of Events

RunClub supports the following event categories only:

- Road running (5K, 10K, half marathon, marathon)
- Trail running and ultramarathons (50K, 50M, 100K, 100M)
- Triathlons (sprint, Olympic, 70.3, 140.6)
- Duathlons and aquathlons
- Relay races (road and trail)
- Obstacle course races (OCR) — Spartan-style and similar
- Virtual versions of the above

Athlete classifications supported: open, age-group, elite, masters, para-athlete
(handcycle, wheelchair, visually-impaired guided), youth (with guardian),
adaptive divisions, military/first-responder.

## Lines of Business (Teams)

Each line of business is owned by a team with a folder under `teams/`.
Every team folder is a self-contained contract:

| File              | Purpose                                                         |
|-------------------|-----------------------------------------------------------------|
| `README.md`       | Team charter — mission, scope, dependencies                     |
| `constitution.md` | Non-negotiable principles, amendment process                    |
| `design.md`       | Team-specific design rules (layered on the global Design System)|
| `ai-agents.md`    | Explicit constraints on AI agents working in the team's surfaces|

| Team folder                            | Business line                              |
|----------------------------------------|--------------------------------------------|
| `00-design-system/`                    | Visual & verbal language (canonical)       |
| `01-marathon-registration/`            | Road marathon, half-marathon, BQ flows     |
| `02-triathlon-registration/`           | Tri & duathlon registration                |
| `03-trail-ultra/`                      | Trail and ultramarathon                    |
| `04-community-races/`                  | 5K/10K, kids' races, walk-up registration  |
| `05-race-director-services/`           | Director console, per-event overrides      |
| `06-athlete-membership/`               | Profiles, identity, PR registry            |
| `07-timing-results/`                   | Chip timing, results, share cards          |
| `08-course-logistics/`                 | Course design, aid stations, drop-bags     |
| `09-sponsorship-partnerships/`         | Sponsor surfaces, sanctioning bodies       |
| `10-volunteer-coordination/`           | Volunteer roster, shifts, lottery credit   |
| `11-safety-medical/`                   | WBGT, attestations, cutoffs (overrides all)|
| `12-merchandise-swag/`                 | Race shirts, bibs, medals                  |

Each team manages their folder via the GitHub PR workflow. See
`GOVERNANCE.md` for the change process, review counts, and authority
hierarchy.

## RulesEngine

Each division has its own rules file under `rules-engine/divisions/`. The
RulesEngine is the **runtime enforcement layer** — registration flows and
director tools route through it for eligibility, refund windows,
qualifying times, equipment requirements, medical clearance, and the
`display` block that drives UI rendering.

The runtime layer enforces what the governance layer (team folders)
requires. See `GOVERNANCE.md` for the relationship between layers.

## Design System

See `designsystem.md` for the visual and verbal language used across every
athlete- and director-facing surface. The system is Nike Run Club / Nike
Training inspired: oversized bold italic typography, big-numeric heroes
for distance, price, and finish times, high-energy athlete imagery, and
imperative second-person motivational copy ("YOU TRAINED FOR THIS").

The Design System team (`teams/00-design-system/`) is the canonical owner.
Their `design.md` is the authoritative allowlist for fonts and colors —
anything not on the allowlist fails CI lint rules.

Each RulesEngine division carries a `display` block that tells the UI how
to render its distance, accent color, and motivational copy bank. UI
surfaces read `rules.display` — they never hardcode division strings.

## Governance

See `GOVERNANCE.md` for the PR-based change process, the two-layer
(runtime + governance) model, the authority hierarchy when team rules
conflict, and the AI-agent constraint framework. CODEOWNERS routes PR
reviews to the right team automatically.
