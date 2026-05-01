# Team: Athlete Membership & Profiles

## Mission
Own the athlete identity. One athlete, one profile, regardless of how many
RunClub-hosted races they enter. Profiles carry the data registration teams
need (DOB, gender division, emergency contact, medical attestations,
qualifying-time history) so athletes don't re-enter it for every race.

## Scope
- Athlete account creation, login, SSO (Apple, Google, Strava)
- Profile fields required by every division (per RulesEngine)
- Medical attestation and waiver signature capture
- Governing-body memberships: USATF, USAT, RRCA, ITRA, UTMB Index
- Qualifying-time / personal-record registry
- Adaptive athlete classifications and accommodations
- Youth athlete profiles with guardian linkage
- Privacy and data-portability (GDPR / CCPA exports)

## Out of Scope
- Training data sync (we read Strava for verified race results only,
  not for workouts — RunClub is not a training platform)
- Social features (no follows, no posts, no DMs — see "Out of Scope" in
  RunClub README)

## Key Workflows
1. **Account creation** — minimum-viable profile to register for a community
   5K; additional fields prompted as athlete enters higher-division races.
2. **Sanctioning-body membership lookup** — at registration time, check
   active membership; offer one-day license if not active.
3. **Waiver signing** — versioned waivers per division; new waiver version
   forces re-sign at next registration.
4. **PR registry** — finishes from RunClub-timed events auto-populate;
   external results can be self-attested but flagged "unverified."

## Dependencies
- All registration teams (consumers of profile data)
- RulesEngine (which fields are required per division)
- Timing & Results (PR auto-population)
- Safety & Medical (medical attestation versioning)
