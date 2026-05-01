# Race Director Services — Design Rules

The director console is the one place where the design system runs in
**dense / operational mode**. The type hierarchy stays — but density is
higher and motivational modules are absent.

## Differences from athlete-facing surfaces

- Default surface is `chalk` (light), not `ink`. Directors work in
  daylight and at race-day operations tents under bright sun.
- Tables, lists, and dashboards are first-class. Hero numerics appear
  for **counts that matter operationally** (registrations, bibs printed,
  weather alerts) — not for marketing.
- No `<MotivationalModule />`. Ever.
- No hero photography. Director surfaces are functional.

## Where the system stays

- Type tokens are unchanged: Futura Condensed bold italic for display,
  Inter for body and dense data.
- Color tokens are unchanged. `ember` for race-day urgency (cutoffs
  approaching, weather-flag elevation, medical incidents).
- Component primitives are reused (buttons, inputs, modals). No parallel
  director-only design system.

## Override review surface

When a director overrides a division rule, the surface presents the
default value and the override value side by side, both as `display-l`
italic numerics, with the diff highlighted in `ember`. The "save
override" button requires the director to type a reason (free text) —
no preset reason dropdown.
