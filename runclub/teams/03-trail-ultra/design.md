# Trail & Ultra — Design Rules

Inherits global Design System.

## Accent

`ember`. Trail-ultra explicitly overrides `volt`. Use the value from
`rules.display.accent` — never hardcode.

## Distance hero

Subdistance label from `rules.display.subdistance_labels`. Examples:

```
100              50             100
MI               MI             K
```

All `display-mega` italic. Cutoff renders below in `display-l` italic:
`36:00 CUTOFF`.

## Mandatory-gear checklist

Each item from `rules.mandatory_gear` renders as a row:

```
[✓]  HEADLAMP + SPARE BATTERIES        ← headline-l italic UPPER
[✓]  EMERGENCY THERMAL BLANKET
[✓]  WATERPROOF JACKET (TAPED SEAMS)
```

No long-form descriptions. The item names are the spec.

## Qualifier surface

Qualifier requirement renders in `display-xl` italic, no decoration:

```
100K SUB-14
OR ITRA 600+
OR UTMB 600+
```

## Aid-station cutoff page

Each cutoff renders as a row with cutoff time in `display-l` italic
tabular and aid-station name in `headline-m` italic:

```
12:00:00     MILE 50 — DEEP CREEK
18:00:00     MILE 75 — RIDGE CAMP
```

`ember` row background when an athlete is within 30 minutes of a cutoff.

## Copy bank

Mandatory: `trail_ultra`. Examples:
- "THE TRAIL DOESN'T NEGOTIATE. NEITHER DO YOU."
- "BRING YOUR OWN LIGHT."
- "FINISH IS A VERB."
- "100 MILES STARTS WITH ONE."

## Imagery

Switchbacks at dawn. Headlamps in fog. Aid-station ladles. Mud-caked
shoes. No road, no smiling-finisher photos, no wellness aesthetics.
