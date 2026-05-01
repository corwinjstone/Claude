# Race Director Services — Constitution

## Article 1 — Directors override defaults; they do not bypass divisions

Per-event overrides layer on top of division defaults via the documented
override mechanism in `rules-engine/engine.py` (`with_event_overrides`).
Directors cannot reach into raw rule fields they have no authority over
(e.g. minimum medical staffing).

## Article 2 — The override audit trail is permanent

Every per-event override is logged with the director's identity, a
timestamp, and a reason. We do not ship "silent" override paths.

## Article 3 — Templates are starting points, not contracts

Event templates accelerate setup; they do not relieve directors of
responsibility for the resulting event. We do not ship "one-click" event
launch flows that skip the rules-review step.

## Article 4 — Director surfaces are operational, not aspirational

The director console is a tool for running races, not a marketing
canvas. Hero modules, motivational copy, and athlete-side imagery do
not appear in the director console. We follow the design system's type
hierarchy with utilitarian density.

## Article 5 — Amendment process

Amendments require a PR with at least one Race Director Services
reviewer. Articles 1 and 2 require additional Safety & Medical review.
