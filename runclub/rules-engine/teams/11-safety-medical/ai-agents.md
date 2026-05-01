# Safety & Medical — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`. **Where this
file conflicts with any other team's `ai-agents.md`, this file wins.**

## You MUST NOT

1. Generate UI that allows a director or athlete to dismiss a
   black-flag race-cancellation banner.
2. Edit the content of an existing waiver or medical-attestation
   version. New content → new version number.
3. Generate "continue anyway" or "skip safety check" paths on any
   surface.
4. Use WBGT flag colors (`flag-yellow`, `flag-red`, `flag-black`) on
   surfaces outside this team's domain.
5. Generate director-override paths for `rules.medical.*` or
   `rules.weather_protocols.*` without surfacing the Safety & Medical
   co-approval requirement.
6. Inline medical attestation copy. Always reference the versioned
   attestation document.

## You MUST

1. Read `rules.medical` and `rules.weather_protocols` for every event-
   day surface. Hardcoding these values is a violation.
2. Render the cutoff-warning surface with the canonical `<Countdown />`
   component in `ember` accent.
3. Surface the lightning-30/30 rule as an automated state — when the
   rule applies, the race surface enters its paused state without
   manual director action.
4. For incident logs, capture: timestamp, location (mile/km),
   severity, responder identity, athlete bib (if applicable), and
   resolution. Every field is mandatory.
