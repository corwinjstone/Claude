# Marathon Registration — Design Rules

Inherits the global Design System. Team-specific rules below.

## Hero numerics

- Distance: `26.2` in `display-xl` italic, `MI` in `meta` baseline-aligned.
  Secondary `42.195 KM` allowed in `headline-m`.
- Price: tier price (e.g. `$185`) in `display-xl` italic. Tier label
  (`RACE WEEK`) in `meta` UPPER above.
- Date: day in `display-l` italic, month abbreviation in `headline-m`
  italic UPPER.

## Qualifying-time surface

- BQ requirement renders as a hero numeric: `3:00:00` in `display-mega`
  italic, age-group label in `meta` above ("MEN 18-34 STANDARD").
- Athlete's own qualifying time renders identically below, with delta in
  `headline-m` italic (`2:54:21 — 5:39 UNDER STANDARD`).
- "BQ-eligible" stamp uses `volt` on `ink`. Never reverse.

## Corral assignment

- Athlete's assigned corral renders as a single letter (`A`, `B`, …) in
  `display-mega` italic on the bib-confirmation surface.
- Corral cap and current fill render in `headline-m` italic
  (`CORRAL B — 1,847 / 2,000`).

## Charity entry

- Fundraising minimum renders as `display-xl` italic (`$1,500`).
- Deadline countdown uses the `<Countdown />` component.

## Copy bank

Mandatory: `road_marathon`. Examples:
- "26.2 MILES. ONE START LINE. NO EXCUSES."
- "YOU TRAINED FOR THIS."
- "THE START LINE IS THE HARDEST MILE."

## Confirmation page

Closes with a full-bleed `<MotivationalModule />` drawn from
`road_marathon`. Hero of an athlete crossing a finish line. Always.
