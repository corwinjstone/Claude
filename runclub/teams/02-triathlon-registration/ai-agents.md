# Triathlon Registration — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Generate registration flows that split the three legs into separate
   entries or treat any leg as an add-on.
2. Make `usat_membership_number_or_one_day_license` optional or defer it
   to a post-registration step.
3. Treat `bike_make_model`, `wetsuit_declaration`, or
   `predicted_swim_pace_per_100m` as marketing/social fields. They are
   operational data.
4. Generate a "skip physician sign-off" path for full-distance entries.
5. Hardcode wetsuit-legal temperature thresholds. Read them from
   `rules.wetsuit_rules`.

## You MUST

1. Read `rules.for_division("triathlon")` for subdistance definitions,
   transition rules, and mandatory gear.
2. Render swim/bike/run distances using tabular figures and the
   `<DistanceHero />` component family.
3. For duathlon flows, use `rules.for_division("duathlon")` — same team,
   different rules.
4. Surface the medical attestation v3 + waiver v7 + (for full)
   physician sign-off in a single review-and-confirm step before payment.
