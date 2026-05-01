# Community Races — AI Agent Constraints

This document binds AI agents producing code, copy, or designs for any
community-races surface. It layers on top of the global
`teams/00-design-system/ai-agents.md`. Where it is stricter, it wins.

---

## 1. Hard prohibitions

You **MUST NOT**:

1. Build any registration flow longer than one page for a community
   distance. If the data model seems to require more, stop and ask —
   do not paginate to satisfy it.

2. Use any banned word from `constitution.md` Article 2 in athlete-facing
   copy. CI runs a wordlist check on copy strings; suppressing that
   check is itself a violation.

3. Generate copy for the `community_first_timer` bank. Suggest lines
   in a PR description; commit them only via an approved Community Races
   PR.

4. Use the `ember` accent on community surfaces. Pull `accent` from
   `rules.for_division("community").display.accent` and trust it.

5. Add power-user features (corral lookup, pacing splits, BQ projection,
   age-graded percentile, race-strategy widgets) to community surfaces.
   These belong on Marathon, Trail/Ultra, or Triathlon surfaces — not
   here.

6. Default the registration flow to credit-card-only. The walk-up cash
   path is a first-class flow per `constitution.md` Article 4.

7. Generate copy aimed at elite or experienced runners ("crush your PR",
   "podium awaits", "BQ this fall"). Even motivational lines must be
   first-timer-safe.

---

## 2. Required behaviors

You **MUST**:

1. Read `rules.for_division("community").display` for distance labels,
   accent, copy bank, and tagline. Never hardcode these.

2. Render the `5K` / `10K` distance numerically in `display-xl` italic
   minimum, even though the audience is first-timers.

3. Default to mobile-first layouts. Desktop is the wider variant.

4. Treat the family-bundle and kids'-dash components as primary paths,
   not edge cases.

5. When generating walk-up iPad flow code, reuse the web component
   library — do not produce a parallel "lite" variant.

6. Surface clear, jargon-free help text for every form field. "What's
   your t-shirt size?" not "Apparel sizing per athlete."

---

## 3. Copy review hook

Any PR that adds or modifies an athlete-facing string under
`runclub/community/` triggers a copy review checklist:

- [ ] No words from `constitution.md` Article 2.
- [ ] Reading level ≤ Grade 6 (Flesch-Kincaid).
- [ ] No comparative claims ("faster than other apps", "the best 5K").
- [ ] No fear or urgency framing ("don't miss out", "spots running out").

AI-authored PRs check these boxes themselves and cite each line in the
PR description. A reviewer overrides only with a written rationale.

---

## 4. Conflict resolution

If a user prompt asks for something this file forbids, refuse the
specific instruction, cite the article, and offer the compliant
alternative. Do not silently comply.
