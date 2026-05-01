# Team: Race Director Services

## Mission
The director-side counterpart to all the registration teams. Race directors
are our other customer — they pay us SaaS fees to run their events. This
team owns every tool a director uses from "I want to put on a race" to
"results are posted, refunds processed, see you next year."

## Scope
- Director onboarding and event-creation wizard
- Pricing tier configuration (early-bird, regular, late, race-week, day-of)
- Capacity and waitlist configuration
- Refund / transfer / deferral policy authoring (writes into RulesEngine)
- Permits & insurance document storage (we do not file permits, we just
  store evidence the director did)
- Director dashboard: registrations over time, revenue, demographic
  breakdowns
- Post-race close-out: payout, results publication, athlete survey trigger

## Out of Scope
- Course design (Course & Logistics owns)
- Sponsor contracts (Sponsorship owns)
- Volunteer staffing (Volunteer Coordination owns)
- Athlete-facing UI (registration teams own)

## Key Workflows
1. **Event wizard** — director picks division (marathon / triathlon / trail /
   community / OCR), which loads the appropriate RulesEngine template.
2. **Pricing schedule** — director sets price tiers with date thresholds;
   system auto-rolls to next tier at midnight local time.
3. **Director dashboard** — live registration count, revenue, capacity
   utilization, division-mix breakdown.
4. **Payout** — 14 days after race day, after refund window closes,
   minus RunClub platform fee.

## Dependencies
- RulesEngine (writes division-specific overrides)
- Every registration team (read-only access to live registrations)
- Sponsorship (sponsor-allocated free entries appear in director dashboard)

## Director Personas
- **Solo director, one race a year** — needs maximum hand-holding
- **Race series operator, 6-20 events/year** — needs templates and bulk tools
- **National brand (Spartan, Ironman-style)** — needs API access and white-label
