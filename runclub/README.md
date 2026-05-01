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

See `teams/` for the full team-level charter for each business line. Each team
owns one slice of the registration-or-operations stack.

## RulesEngine

Each division has its own rules file under `rules-engine/divisions/`. The
RulesEngine is the single source of truth for division-specific constraints
(eligibility, refund windows, qualifying times, equipment requirements,
medical clearance, etc.). All registration flows and director tools route
through it.

## Design System

See `designsystem.md` for the visual and verbal language used across every
athlete- and director-facing surface. The system is Nike Run Club / Nike
Training inspired: oversized bold italic typography, big-numeric heroes
for distance, price, and finish times, high-energy athlete imagery, and
imperative second-person motivational copy ("YOU TRAINED FOR THIS").

Each RulesEngine division carries a `display` block that tells the UI how
to render its distance, accent color, and motivational copy bank. UI
surfaces read `rules.display` — they never hardcode division strings.
