# Team: Design System

## Mission
Own the visual and verbal language of RunClub. Every athlete- and director-
facing surface — registration, results, race-day, email, share cards — is
built on this team's tokens, type system, components, and copy banks.

We are the **canonical owner of `runclub/designsystem.md`**. No team ships
a surface that contradicts it. No AI agent generates code that introduces
unsanctioned fonts, colors, or copy.

## Scope
- The design system itself (`runclub/designsystem.md`)
- Type tokens, color tokens, spacing scale, motion tokens
- Component patterns (race card, result reveal, countdown, button styles)
- Motivational copy banks (one per division)
- Hero imagery direction and treatment
- The `display` block schema in every RulesEngine division JSON
- Accessibility floor for all athlete-facing surfaces
- Brand-marketing extension points (handed off to Sponsorship & Partnerships)

## Out of Scope
- Marketing-site campaigns (Sponsorship & Partnerships extends our system)
- Per-event director skinning (handled by Race Director Services within
  our token set)
- Internal admin tools that no athlete ever sees (loose conformance only)

## Key Workflows
1. **Token change request** — any new font, color, or motion token requires
   a PR against this folder, reviewed by the Design System team.
2. **Component PR review** — every component PR from another team must link
   to the design-system component pattern it implements.
3. **Copy bank curation** — motivational copy lines are added by PR; no
   machine-generated copy is merged into a copy bank.
4. **Quarterly drift audit** — sweep the codebase for hardcoded hex values,
   non-Futura type, and copy outside the banks. File issues against owning
   teams.

## Dependencies
- All registration, results, and race-day teams (consumers)
- RulesEngine (`display` block schema)
- Sponsorship & Partnerships (brand-extension consumer)

## Authority

This team has **veto power** on any PR — across any team — that:
- Introduces a new font family.
- Introduces a new color hex outside the token set.
- Adds upright italic body copy (italic is reserved for display/numerics).
- Ships an athlete-facing surface without a motivational module.
- Hardcodes division-specific strings that should come from `rules.display`.

Veto is exercised via PR review. Other teams cannot self-merge over a
Design System veto; the resolution path is a follow-up PR that addresses
the veto, not a force-merge.
