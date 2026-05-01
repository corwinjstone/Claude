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
