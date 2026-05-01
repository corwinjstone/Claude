# Team: Community Races (5K / 10K)

## Mission
Make it dead simple to put on a small community race. 5K and 10K events are
the entry point to the sport for most athletes — registration must be fast,
cheap to operate, and forgiving (walk-up entries, kids' fun-run add-ons,
charity-driven pricing).

## Scope
- 5K and 10K road races
- Kids' fun runs (1K, half-mile, dash distances)
- Turkey trots, jingle bell runs, and other holiday events
- Color runs, glow runs, themed events
- Corporate / company-team events
- Memorial and charity-cause races
- Walk-up / day-of registration

## Out of Scope
- Anything timed for qualifying purposes (Marathon owns BQ-eligible 5K/10Ks)
- Trail 5K/10K with technical terrain (Trail & Ultra owns)

## Key Workflows
1. **One-page registration** — name, age, email, t-shirt size, emergency
   contact. Done.
2. **Family bundle** — single payer registers up to 6 athletes; kid races
   stack with parent's adult race.
3. **Walk-up flow** — director iPad app accepts cash/card on race morning,
   prints bib on the spot.
4. **Corporate team** — company admin uploads a roster CSV, receives a
   coupon code; athletes self-register against the code.

## Dependencies
- RulesEngine division: `community`
- Merchandise & Swag (t-shirt sizing, packet-pickup add-ons)
- Timing & Results (chip vs. bib-tear timing decision)

## Design Principles
- Optimize for first-time racers. Never use jargon like "corral," "PR," or
  "negative split" in the registration UI for this division.
- Mobile-first. 80% of community-race registrations come from a phone.
