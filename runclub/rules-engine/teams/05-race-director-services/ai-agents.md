# Race Director Services — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Generate override flows that skip the audit trail. Every override
   call to `with_event_overrides` must persist actor identity, timestamp,
   and reason.
2. Build "one-click event launch" paths that don't surface a final
   rules-review step.
3. Add `<MotivationalModule />`, hero photography, or athlete-facing
   copy to director surfaces.
4. Allow directors to override Safety & Medical-owned rule paths
   (`medical.physician_signoff_required_for_full`,
   `medical.cutoff_enforced_at_every_aid_station`,
   `medical.weight_loss_disqualification_percent`, etc.) without
   Safety & Medical co-approval. CODEOWNERS enforces this in code; the
   UI must enforce it at runtime.

## You MUST

1. Read division defaults via `rules.for_division(name)`; render
   overrides via `rules.with_event_overrides(event.overrides)`.
2. Surface every override side-by-side with the default, with diff
   highlighting in `ember`.
3. Require a free-text reason on the override-save action; do not
   pre-fill it.
4. Default director surfaces to the `chalk` (light) palette.
