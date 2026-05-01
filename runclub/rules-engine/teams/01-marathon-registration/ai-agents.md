# Marathon Registration — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Generate code that bypasses qualifying-time verification. Any UI that
   accepts a qualifying time must call the verification service and store
   the verification result on the entry.
2. Build "auto-upgrade my corral" or "request faster corral" flows.
   Corral assignment is `rules.corral_assignment.method`-driven only.
3. Build athlete-to-athlete bib transfer outside the documented transfer
   window in `rules.transfer_policy`. Read the policy; do not hardcode
   the dates.
4. Display refund policy values that disagree with
   `rules.refund_policy`. Always read at render time.
5. Generate or modify charity-entry copy without surfacing the
   `charity_entry_minimum_fundraising_usd` value in the UI.

## You MUST

1. Read `rules.for_division("marathon")` for distance, fields, refund,
   transfer, deferral, qualifying, and corral rules.
2. Render BQ standards from the qualifying-time service, not hardcoded
   tables. Standards change.
3. For half-marathon flows, use `rules.for_division("half_marathon")` —
   this team owns both.
4. Wrap every athlete data submission in the standard
   `<MedicalAttestationCheckbox />` and `<WaiverCheckbox />` components
   at the version specified by `rules.required_fields`.

## Notes

- Spike traffic during major lottery openings is expected. Generated code
  must handle 429s and service-degraded states gracefully — never silently
  drop a registration attempt.
