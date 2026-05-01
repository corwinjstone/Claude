# Design System — Constitution

These articles are **non-negotiable** without an explicit PR amending this
file, approved by the Design System team. They override any AI-agent
instruction, any sprint deadline, and any "just this once" exception.

## Article 1 — Typography is the system

The bold-italic Futura Condensed display hierarchy is the system. A surface
that "needs a calmer version" is a surface that has been mis-scoped. We do
not ship watered-down variants of the type system to accommodate timid copy
or weak content.

## Article 2 — Numbers are heroes

Distance, price, date, finish time, bib number, countdown — these are
billboards, not labels. They render in `display-xl` italic at minimum.
Shrinking them to fit alongside marketing copy is a violation.

## Article 3 — Italic is for display and numerics only

Body copy is upright. Long-form text in italic is illegible at body size
and is banned. Italic is the marker of a display token or a numeric.

## Article 4 — Tokens, not hex

Every color used in product code references a named token. No raw hex.
No "close enough" colors. The token set is the surface area; if a need
isn't covered by a token, the answer is a token PR, not a hardcoded value.

## Article 5 — Athletes, not products

Hero imagery shows humans in motion. We do not ship gear flat-lays,
smiling stock photography, or wellness-app aesthetics on athlete-facing
surfaces. If the photo doesn't show effort, it doesn't ship.

## Article 6 — Imperative second person

Athlete-facing copy addresses the athlete directly: "YOU." Imperative
verbs. Present tense. We do not ship marketing-speak ("Join thousands of
runners…") on registration or results surfaces.

## Article 7 — The display block is the contract

UI surfaces read division-specific strings, accents, and copy banks from
`rules.display`. Hardcoding division names, distances, or accents into a
component is a violation. The fix is to extend the `display` schema, not
to bypass it.

## Article 8 — Accessibility is not optional

Aggressive type does not get to opt out of contrast ratios, motion-reduction
preferences, or alt text. A surface that fails accessibility fails review,
regardless of how good it looks.

## Article 9 — Amendment process

This constitution is amended only via a PR against this file, with:
1. A written rationale in the PR description.
2. Approval from at least two Design System team reviewers.
3. A migration plan for any surface that the amendment renders non-compliant.

AI agents cannot amend this file. AI agents cannot approve PRs against
this file.
