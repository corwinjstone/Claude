# Timing & Results — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Generate admin paths that mutate result rows without writing an
   audit entry.
2. Use gun time as the basis for PR-registry writes, qualifying-time
   submissions, or age-group ranks. Chip time only.
3. Build "blacklist", "whitelist", or per-athlete heuristic-suppression
   features. Course-cutting heuristics apply uniformly.
4. Generate live-tracking surfaces that ignore the athlete's
   `live_tracking_opt_out` flag. The flag is binding across web, API,
   and share previews.
5. Generate share-card layouts that omit chip time, distance, or race
   name.
6. Use any color other than tokens for split-pace deltas. Negative
   split is the system's positive-affordance color (volt-adjacent),
   positive split is `ember`.

## You MUST

1. Render every numeric in tabular figures.
2. Use `<ResultReveal />` for finish reveals. Do not reimplement the
   counter animation.
3. Push verified PRs to Athlete Membership at results-lock, with the
   `verified_by_runclub_timing` flag set.
4. Render BQ-eligible stamps only after the time has been compared
   against the qualifying-standard service. Do not infer eligibility
   client-side.
