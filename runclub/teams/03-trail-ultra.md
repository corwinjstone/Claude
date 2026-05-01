# Team: Trail & Ultra Registration

## Mission
Trail and ultra are not just longer road races — they have qualifier
requirements, mandatory gear, crew/pacer registrations, and cutoff structures
that no other category has. This team owns that complexity.

## Scope
- Trail races up to and including marathon distance
- Ultramarathons: 50K, 50M, 100K, 100M, multi-day stage races
- Mandatory-gear enforcement (headlamp, emergency blanket, whistle, etc.)
- Qualifier verification (UTMB index, ITRA points, prior 50K/100K finishes)
- Pacer registration (for races that allow pacers after a given mile)
- Crew registration and crew-vehicle credentials
- Drop-bag logistics intake at registration

## Out of Scope
- Road marathons (Marathon Registration owns)
- Triathlon trail-run legs (Triathlon Registration owns)

## Key Workflows
1. **Qualifier check** — athlete submits prior ultra finish; verified against
   ITRA / UTMB Index / RunClub timing registry.
2. **Mandatory gear attestation** — checkbox at registration, re-attested at
   bib pickup, spot-checked at aid stations.
3. **Pacer add-on** — primary athlete adds 1-2 pacers; each gets a pacer bib
   tied to the primary athlete's record.
4. **Lottery weighting** — repeat applicants and DNS-from-prior-year may
   receive weighted entries per division rules.

## Dependencies
- RulesEngine division: `trail_ultra`
- Athlete Membership (medical history, especially for 100M)
- Safety & Medical (cutoff enforcement, aid-station medical staffing)
- Course & Logistics (drop-bag manifest)
