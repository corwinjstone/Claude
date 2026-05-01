# Team: Safety & Medical Operations

## Mission
Keep athletes alive and healthy. Own all medical, safety, and emergency
protocols across every division. We are conservative by default — when
in doubt, the race is modified or canceled.

## Scope
- Medical staffing requirements per division (per RulesEngine)
- Heat-index / WBGT monitoring and event modification flags
  (yellow/red/black flag protocols)
- Lightning protocol (30-30 rule for outdoor events)
- Cutoff time enforcement (especially ultras and Ironman-distance tris)
- Medical attestation review at registration
- Race-day medical-tent dispatch and incident logging
- DNF logging with reason codes (medical, mechanical, time-cutoff,
  voluntary)
- Post-race incident review and division rule recommendations

## Out of Scope
- Athlete training/injury history (we are not a sports-medicine app)
- Insurance claims (race director's insurer)

## Key Workflows
1. **Pre-race medical attestation** — athlete signs at registration,
   re-attests at bib pickup if waiver version changed.
2. **Race-day flag system** — automated WBGT monitoring; flag
   transitions trigger SMS to director and Course & Logistics.
3. **Cutoff enforcement** — Timing & Results streams chip reads into
   our cutoff engine; athletes who miss a cutoff are gently pulled at
   the next aid station.
4. **Incident log** — every medical encounter logged; aggregated
   into post-race report.

## Dependencies
- RulesEngine (cutoffs, medical-staff ratios, heat protocols per division)
- Timing & Results (cutoff stream)
- Course & Logistics (medical tent placement)
- Athlete Membership (attestation versioning)

## Operating Principle
We never override a registration team's flow without a documented
RulesEngine entry. If a medical requirement isn't in the rules, it
doesn't get enforced — get it into the rules first.
