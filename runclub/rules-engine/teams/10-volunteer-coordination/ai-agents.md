# Volunteer Coordination — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Generate "approved provisionally" or "background check pending but
   slotted" paths for gated roles.
2. Build shift-swap flows that skip role-requirement re-attestation.
3. Generate flows that grant lottery-weighting credit without
   verifying volunteer hours from the timing/clock-in system.
4. Use the athlete copy banks on volunteer surfaces. Use `volunteer`.

## You MUST

1. Render background-check status pills on every volunteer profile and
   shift assignment surface.
2. Surface lottery-weighting credit numerically and link it to the
   relevant division's lottery rules.
3. Treat volunteers and athletes as distinct identities even when the
   underlying user record is the same human.
