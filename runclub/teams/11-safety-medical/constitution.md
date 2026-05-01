# Safety & Medical — Constitution

These articles override every other team's articles where there is
conflict. This team is the highest-stakes team in RunClub.

## Article 1 — Medical rules are not director-overridable

`rules.medical.*` paths and `rules.weather_protocols.*` paths are
governed by Safety & Medical, not by individual race directors.
Per-event overrides on these paths require Safety & Medical co-approval
on the override PR or the override is rejected at runtime.

## Article 2 — WBGT protocols are mandatory

WBGT flag thresholds (`yellow`, `red`, `black`) trigger automatic
race-day protocol changes. Surfaces and director tools that allow
"continue anyway" past a black-flag threshold are violations.

## Article 3 — Medical attestation versions are immutable

Once a waiver/attestation version is published, its content cannot be
edited. New language requires a new version number and re-attestation
by athletes at next registration.

## Article 4 — Aid-station medical staffing minimums are floors

`rules.medical.medical_personnel_at_every_aid_station` and similar
ratios are floors, not targets. Director events that publish below
these floors fail rules-engine validation.

## Article 5 — Lightning 30/30 is an absolute rule

`rules.weather_protocols.lightning_30_30_rule_enforced` cannot be
overridden by a director once the rule applies. The race pauses or
the race ends.

## Article 6 — Amendment process

Amendments require a PR with at least two Safety & Medical reviewers.
This is the only team-level constitution requiring two reviewers.
