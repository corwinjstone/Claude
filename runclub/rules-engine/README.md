# RunClub RulesEngine

The RulesEngine is the single source of truth for all division-specific rules
that govern registration, eligibility, and race-day operations.

## Why this exists

Every team in RunClub touches "rules" — refund windows, qualifying times,
mandatory gear, medical staffing ratios, cutoff times, etc. Before the
RulesEngine, each team encoded its own copy of these rules and they drifted
out of sync. The RulesEngine centralizes them, scoped per division.

## Divisions

Each division has its own JSON file in `divisions/`. A division is a
top-level event category — the registration team that owns it, the
RulesEngine division name, and the rules file are 1:1:1.

| Division          | File                          | Owning Team               |
|-------------------|-------------------------------|---------------------------|
| `marathon`        | `divisions/marathon.json`     | Marathon Registration     |
| `half_marathon`   | `divisions/half_marathon.json`| Marathon Registration     |
| `triathlon`       | `divisions/triathlon.json`    | Triathlon Registration    |
| `trail_ultra`     | `divisions/trail_ultra.json`  | Trail & Ultra             |
| `community`       | `divisions/community.json`    | Community Races           |
| `ocr`             | `divisions/ocr.json`          | Community Races           |
| `duathlon`        | `divisions/duathlon.json`     | Triathlon Registration    |
| `relay`           | `divisions/relay.json`        | Marathon Registration     |
| `virtual`         | `divisions/virtual.json`      | Community Races           |

## Rule schema (per division)

```jsonc
{
  "division": "marathon",
  "display_name": "Road Marathon",
  "eligibility": { ... },         // who can enter
  "registration_required_fields": [...],
  "pricing": { ... },             // tier defaults
  "refund_policy": { ... },
  "transfer_policy": { ... },
  "deferral_policy": { ... },
  "qualifying": { ... },          // BQ-style standards if any
  "mandatory_gear": [...],
  "medical": { ... },             // staffing, attestation, cutoffs
  "course": { ... },              // aid spacing, certification reqs
  "weather_protocols": { ... },
  "display": { ... }              // design-system hints (see designsystem.md)
}
```

### `display` block

Every division must declare a `display` block. It is the contract between
the RulesEngine and the Design System (`../designsystem.md`).

```jsonc
"display": {
  "distance_primary": "26.2",       // hero numeric, rendered display-xl italic
  "distance_unit": "MI",            // unit, rendered as meta UPPER baseline-aligned
  "distance_secondary": "42.195",   // optional alternate (km vs mi)
  "distance_secondary_unit": "KM",
  "accent": "volt",                 // design-system color token
  "copy_bank": "road_marathon",     // motivational copy bank tag
  "tagline": "26.2 MILES. ONE START LINE. NO EXCUSES.",
  "hero_imagery_tag": "road_finish_line"
}
```

UI surfaces read this via `rules.display` — they never hardcode division
strings or pick their own accent color.

## How teams consume the engine

```python
from runclub.rules_engine import RulesEngine

engine = RulesEngine.load()
rules = engine.for_division("marathon")

# At registration:
if not rules.eligibility.athlete_meets_age_minimum(athlete.dob, race.date):
    raise IneligibleAthlete(rules.eligibility.age_minimum)

# At checkout:
required_fields = rules.registration_required_fields
```

Race directors can override specific rules per event via the Race Director
Services event-wizard (e.g., a charity marathon waiving the qualifying-time
requirement). Overrides are stored on the event and stack on top of the
division defaults; the engine resolves them at query time.

## What the engine does NOT do

- It is not a feature-flag system. Use the platform feature-flag service.
- It is not a pricing engine. It defines tier *defaults*; per-event prices
  are set by the director.
- It is not a CMS. Athlete-facing copy lives elsewhere — but the
  `display.copy_bank` tag tells the CMS *which* motivational copy bank
  to draw from for that division.
- It does not enforce anything outside the racing domain. RunClub's product
  surface is racing — registration, planning, operations. Rules belong here
  only if they govern those activities.
