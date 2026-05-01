# Course & Logistics — Design Rules

Operational density, like Race Director Services. Inherits global
Design System tokens; no motivational modules, no athlete-facing copy.

## Course-design surface

- Course distance renders in `display-l` italic at top of canvas.
- Aid-station spacing renders as a horizontal scale with `headline-m`
  italic kilometer markers. Violations of `course_aid_spacing_max_km`
  highlight in `ember`.
- Elevation profile renders as a single hairline graph beneath the
  scale. No marketing color gradients.

## Drop-bag manifest

- Manifest is a dense table. Tabular figures.
- Athlete count per drop location renders as `display-l` italic in the
  table header (`MILE 50: 412 BAGS`).

## Certification status

- `volt` "USATF CERTIFIED" pill or `ember` "PENDING CERTIFICATION" pill
  in `headline-l` italic UPPER. No middle-state colors.

## Mandatory-checklist patterns

Reuse the trail-ultra mandatory-gear checklist component (`<Checklist />`)
for course-marking, reflective-marking, and certification checklists.
