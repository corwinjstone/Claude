# Team: Timing & Results

## Mission
Capture every athlete's time on race day and publish accurate, fast,
shareable results. We integrate with chip-timing hardware vendors and
own the canonical results record for every RunClub-hosted race.

## Scope
- Chip-timing integrations (RFID, BibTag, ChronoTrack, MyLaps)
- Manual / bib-tear timing for small community races
- Live results page (athlete tracking during the race)
- Final results publication (gun time, chip time, age-group rank,
  overall rank, division rank)
- Split-time capture (5K splits in a marathon, swim/T1/bike/T2/run in
  triathlon, aid-station splits in ultras)
- Results corrections and dispute resolution
- Qualifying-time certification stamps (e.g., "BQ-eligible" badge)
- Anti-cheating: course-cutting detection via expected-split heuristics

## Out of Scope
- Generating official Boston Marathon qualifier certificates (BAA owns)
- Doping/PED testing (sanctioning bodies own)

## Key Workflows
1. **Pre-race chip assignment** — bib number ↔ chip ID mapping handed off
   from registration team.
2. **Race-day live tracking** — chip reads stream into results pipeline,
   athlete-tracker pages update <30 seconds after read.
3. **Final results** — within 2 hours of last finisher, results are
   locked, published, and pushed to Athlete Membership PR registry.
4. **Disputes** — athletes can flag a result; team reviews chip log,
   video (if available), and either corrects or upholds.

## Dependencies
- Hardware vendors (third-party)
- RulesEngine (cutoff times per division, qualifying thresholds)
- Athlete Membership (push verified PRs back into registry)

## Design System

Results pages are the single highest-stakes surface for the design system —
this is the moment the athlete sees their finish. Follow `../designsystem.md`
strictly:

- **Result reveal pattern** (designsystem.md §6.3): `meta` label "YOUR
  FINISH", then `display-mega` italic finish time `H:MM:SS`, then
  `headline-m` italic delta vs. previous PR.
- **Numbers tick up.** Counters animate from 0 to the final value over
  800ms — they never fade in. Snap to value when `prefers-reduced-motion`.
- **Tabular figures only.** Chip time / gun time / splits all render with
  `font-variant-numeric: tabular-nums` so columns don't shift.
- **PR badge** uses `volt`. **DNF / cut-off** uses `ember`. Never reverse.
- **BQ-eligible stamp** is a hero element, not a footnote — `display-l`
  italic, `volt` on `ink`.
- **Live tracking page** centers the live split as `display-mega` italic,
  with the next-split countdown in `display-xl` below.
- **Share cards** generate using the same type system at 1080×1080 — same
  italic display tokens, same accent from `rules.display.accent`.
