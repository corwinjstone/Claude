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

## Design System

Trail & Ultra surfaces follow `../designsystem.md` with these division
specifics from `rules.display`:

- **Accent is `ember`**, not `volt`. The trail-ultra division explicitly
  overrides the default accent.
- **Race-distance hero** uses the format-specific label (`100 MI`, `100K`,
  `50K`) in `display-mega` italic. Cutoff hours render below in `display-l`
  italic — `36:00 CUTOFF`.
- **Mandatory-gear page is a checklist, not a wall of text.** Each item
  in `headline-l` italic UPPER, with a binary check.
- **Qualifier pages** put the qualifier requirement in `display-xl` italic
  (`100K SUB-14 OR ITRA 600+`). No marketing copy.
- **Motivational copy** comes from `display.copy_bank = "trail_ultra"`,
  which skews darker — "THE TRAIL DOESN'T NEGOTIATE.", not "YOU GOT THIS."
