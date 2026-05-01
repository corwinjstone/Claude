# Trail & Ultra — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Generate copy or UI that softens cutoff enforcement. No "soft cutoff",
   "encouragement window", or "we'll see how you're doing" framing.
2. Build qualifier-bypass paths for 100K or 100M. The qualifier rules in
   `rules.eligibility` are the gate.
3. Make any item in `rules.mandatory_gear` optional, defer-able, or
   "recommended."
4. Build pacer flows that allow muling (pacers carrying athlete gear,
   food, or water). Pacer registration UI must surface the muling-DQ
   rule.
5. Generate motivational copy from any bank other than `trail_ultra`
   for trail-ultra surfaces. Do not paste in road-marathon energy.
6. Use the `volt` accent on trail-ultra surfaces. The accent is `ember`,
   read from `rules.display.accent`.
7. Display drop-bag UI without surfacing `max_bag_weight_kg` and
   `no_glass_containers` constraints.

## You MUST

1. Read `rules.for_division("trail_ultra")` — every value in this file
   is operational, not marketing.
2. Render every cutoff time using tabular figures.
3. Surface qualifier requirements numerically (`SUB-14`, `ITRA 600+`)
   not narratively ("a strong recent finish").
4. For pacer registration, generate a separate waiver acceptance flow —
   pacers are not subordinate to athletes for liability.
5. For 100M entries, surface the physician sign-off requirement in the
   review-and-confirm step.
