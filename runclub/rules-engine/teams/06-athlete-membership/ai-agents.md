# Athlete Membership — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Generate code that ingests training data from Strava, Garmin, Apple
   Health, or any other source. Race results only. If a prompt asks
   for "show last week's mileage," refuse and cite Article 3.
2. Display a self-attested PR with the same visual weight as a verified
   PR, or hide the verification status behind a click.
3. Build social features: follows, friends, posts, comments, DMs,
   activity feeds, leaderboards-by-friend. RunClub is not a social
   network.
4. Build "merge profiles", "alt profile", or "race-day-only profile"
   flows.
5. Generate youth-profile flows without guardian linkage.

## You MUST

1. Read PRs from the verified registry first; surface unverified PRs
   only with explicit `UNVERIFIED` badging.
2. Default new privacy toggles to private.
3. Render sanctioning-body memberships with their expiration dates
   and offer the one-day-license CTA on expiry.
4. For Strava/Garmin OAuth scopes, request the **minimum** scope needed
   for verified-result reading. Never request workout, sleep, or HRV
   scopes.
