# Team: Marathon Registration

## Mission
Own the end-to-end registration experience for road marathons and half marathons.
From the moment an athlete lands on a race page to the moment their bib number
is assigned, this team owns the funnel.

## Scope
- Marathon (26.2 mi / 42.195 km) registration
- Half marathon (13.1 mi / 21.0975 km) registration
- Boston-style qualifying-time (BQ) verification flows
- Marathon waitlist and lottery systems
- Charity entry / fundraising-bib registration
- Deferral and transfer policies for road events
- Corral assignment based on submitted predicted/qualifying times

## Out of Scope
- Trail marathons (owned by Trail & Ultra)
- Triathlon run legs (owned by Triathlon Registration)
- Training plans, pace coaching (RunClub does not offer these)

## Key Workflows
1. **Lottery entry** — open window, draw, notify, charge.
2. **Qualifying time verification** — athlete submits prior race result;
   we cross-check with the timing partner registry.
3. **Charity entry** — athlete commits to fundraising minimum; entry held
   until 60 days out, then released or confirmed.
4. **Bib assignment** — driven by corral, which is driven by qualifying or
   predicted finish time per the RulesEngine.

## Dependencies
- RulesEngine division: `marathon`
- Timing & Results (for qualifying-time lookup)
- Athlete Membership (for profile + medical attestation)
- Course & Logistics (for corral capacity)

## Design System

All marathon registration surfaces follow `../designsystem.md`. In particular:

- **Distance, price, and date are billboards.** Render `26.2 MI`, `$185`,
  `OCT 12` in `display-xl` italic. Never shrink them to fit copy.
- **Hero copy is imperative.** "REGISTER.", "CHOOSE YOUR CORRAL.", "YOU
  TRAINED FOR THIS."
- **Confirmation page closes with a motivational module** — full-bleed
  hero of an athlete crossing a finish line, `display-mega` italic
  overlay drawn from `display.copy_bank = "road_marathon"`.
- **Accent color** comes from `rules.display.accent` (`volt` for road).
  Never hardcode.
- **Boston-style qualifying-time pages** treat the qualifying time as a
  hero numeric (`3:00:00` in `display-mega`), not a label.

## On-Call
Registration windows for majors are spike events. Team carries pager during
open registration for any event with >5,000 expected entrants.
