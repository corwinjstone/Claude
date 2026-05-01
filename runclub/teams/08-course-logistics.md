# Team: Course & Logistics

## Mission
Everything that happens on the physical ground on race day except people:
the course itself, aid stations, transition areas, start/finish lines,
drop bags, gear check, and the operational map.

## Scope
- Course design tools (GPX upload, mile marker placement, certified
  measurement workflow per USATF / AIMS)
- Aid station planning (location, supplies, staffing slots)
- Triathlon transition setup (rack assignments, aisle layout)
- Drop-bag manifest for ultras and point-to-point races
- Start corral physical layout
- Permit document storage (we do not file permits, just store evidence)
- Course closure schedule and sweep-vehicle routing
- Weather contingency plans (heat-index modifications, lightning protocol
  triggers — actual go/no-go owned by Safety & Medical)

## Out of Scope
- Permit filing (race director's responsibility, we just store the PDF)
- Medical staffing (Safety & Medical owns)
- Volunteer recruitment (Volunteer Coordination owns)

## Key Workflows
1. **Course certification** — director uploads GPX, system computes
   distance, identifies mile markers, generates certification packet.
2. **Aid station plan** — director places aid stations on course map;
   system computes supply estimates from registration count and
   division-specific needs (per RulesEngine).
3. **Transition layout** (triathlon) — auto-generated from registration
   count and age-group distribution.
4. **Drop-bag manifest** — athletes declare drop-bag locations at
   registration; team prints manifests for race-morning loading.

## Dependencies
- RulesEngine (per-mile aid spacing, mandatory aid contents per division)
- Triathlon Registration (age-group counts for transition)
- Trail & Ultra (drop-bag declarations)
- Safety & Medical (medical-tent placement)
