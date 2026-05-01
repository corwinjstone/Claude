# Athlete Membership — Design Rules

Inherits global Design System.

## Profile hero

The athlete's profile page leads with their **best verified finish** as
a `display-mega` italic finish time, with the race name in `headline-l`
italic UPPER above. Self-attested PRs do not earn the hero slot.

## PR registry

Each PR row renders:

- Distance hero: `display-l` italic from `rules.display.distance_primary`.
- Time: `display-l` italic tabular.
- Verification badge: `volt` "VERIFIED" pill, or `mist` "UNVERIFIED" pill.
- Date: `meta` UPPER.

`UNVERIFIED` pills must always be visible — never collapsed behind a
"show details" toggle.

## Sanctioning-body memberships

Active memberships render as logo + expiration date in `headline-m`
italic. Expired memberships render with `ember` accent and an
"ACTIVATE ONE-DAY LICENSE" CTA.

## Imagery

Athletes use their own race photos as profile imagery. Default avatar
is a high-contrast monogram on `ink`. No stock photography.

## Privacy surfaces

Privacy controls follow the operational density of the director console
— functional, not motivational. No hero modules on settings pages.
