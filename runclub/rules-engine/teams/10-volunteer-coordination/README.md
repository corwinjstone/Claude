# Team: Volunteer Coordination

## Mission
Race day doesn't happen without volunteers. This team owns the systems
that recruit, schedule, brief, and check-in volunteers — and that
recognize them after the race so they come back.

## Scope
- Volunteer signup portal (per event)
- Shift definition and capacity (4hr aid station, 2hr finish line, etc.)
- Group/club volunteer registrations (e.g., a high school cross-country
  team signs up to staff one aid station)
- Volunteer waiver and minor-volunteer guardian flow
- T-shirt and meal allocation
- Race-day check-in and shift coverage tracking
- Post-race thank-you and "credit" toward future race entries (some
  directors offer a free entry for X hours volunteered)

## Out of Scope
- Paid race-day staff (race director payroll, not our problem)
- Course/aid-station design (Course & Logistics owns; we staff what
  they design)

## Key Workflows
1. **Shift catalog import** — Course & Logistics ships an aid-station
   plan; we generate volunteer shifts from it.
2. **Volunteer signup** — public page, shifts shown with remaining
   capacity, waiver signed at signup.
3. **Group signup** — group leader claims a block of shifts, distributes
   to their roster.
4. **Race-morning check-in** — QR-coded volunteer pass; check-in unlocks
   t-shirt/meal pickup.
5. **Volunteer credit** — completed shifts roll up into athlete profile;
   redeemable per the originating event's RulesEngine setting.

## Dependencies
- Course & Logistics (aid-station plan drives shift creation)
- Race Director Services (volunteer-credit policy lives in event config)
- Athlete Membership (volunteer hours tracked on athlete profile)
