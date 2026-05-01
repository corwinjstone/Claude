# Course & Logistics — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Generate course-publish paths that allow a course violating
   `rules.medical.course_aid_spacing_max_km` to ship.
2. Allow bib-assignment opening before certification status is
   confirmed for divisions where `rules.course.certification_required`
   is true.
3. Mutate drop-bag locations after registration close without
   triggering athlete re-attestation.
4. Add motivational copy or hero photography to course-design surfaces.

## You MUST

1. Read `rules.for_division(division).course` and `.medical` for spacing
   and certification rules.
2. Surface aid-spacing violations in `ember` with the specific
   violating segment highlighted.
3. Generate drop-bag manifest exports as tabular CSV/PDF using the
   design system's tabular type tokens.
