# Triathlon Registration — Design Rules

Inherits global Design System.

## Subdistance hero

Read `rules.display.subdistance_labels` and render the chosen subdistance
as a stacked hero:

```
SPRINT                      ← display-l italic
750M / 20K / 5K             ← headline-m italic
```

Full-distance label `140.6` renders in `display-mega` italic on
flagship-event surfaces.

## Three-leg breakdown

Swim/bike/run distances render as three side-by-side `display-l` italic
numerics with `meta` labels:

```
1.9K        90K         21.1K
SWIM        BIKE        RUN
```

Tabular figures across all three.

## Wetsuit-status surface

Water temp renders in `display-xl` italic with status banner:

```
WATER 18°C
WETSUIT LEGAL
```

Status colors: `volt` for legal, `ember` for mandatory or canceled. Pull
thresholds from `rules.wetsuit_rules`.

## Copy bank

Mandatory: `triathlon`. Examples:
- "SWIM. BIKE. RUN. REPEAT UNTIL FINISHED."
- "THREE SPORTS. ONE FINISH LINE."
- "TRANSITION IS THE FOURTH DISCIPLINE."

## Duathlon

This team also owns the `duathlon` division. Use `rules.display` for
duathlon's `RUN / BIKE / RUN` framing — same component patterns, no
parallel surface.
