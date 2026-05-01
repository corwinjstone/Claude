# Team: Triathlon Registration

## Mission
Run the registration experience for all multisport events: triathlon, duathlon,
aquathlon, and aquabike. Triathlon registration has more variables than road
running (USAT membership, wetsuit declarations, bike specs, transition setup),
and this team owns all of them.

## Scope
- Sprint (750m / 20km / 5km)
- Olympic / standard (1.5km / 40km / 10km)
- 70.3 half-distance (1.9km / 90km / 21.1km)
- 140.6 full-distance (3.8km / 180km / 42.2km)
- Duathlon (run-bike-run)
- Aquathlon (swim-run)
- Aquabike (swim-bike)
- Relay-team triathlon registrations (3 athletes, one bib pool)

## Out of Scope
- Open-water swim-only events (not offered by RunClub)
- Cycling-only events (not offered by RunClub)
- Run-only events at any distance (other registration teams own these)

## Key Workflows
1. **USAT/governing-body membership check** — verify active sanctioning-body
   membership or sell a one-day license at checkout.
2. **Equipment declaration** — bike make/model, wetsuit declaration
   (water-temp dependent, see RulesEngine).
3. **Relay team formation** — captain creates team, invites swimmer/cyclist/
   runner; team is a single registration record with three athlete records.
4. **Transition assignment** — rack number assigned based on age group and
   bib number per division rules.

## Dependencies
- RulesEngine division: `triathlon`
- Athlete Membership (USAT verification)
- Course & Logistics (transition capacity, water temp readings)
- Safety & Medical (cutoff times, swim-safety roster)

## SLAs
- USAT verification: <2 seconds at checkout
- Wetsuit-legal status must reflect race-morning water temp by T-30min
