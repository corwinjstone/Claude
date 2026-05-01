# Design System — AI Agent Constraints

This document binds **any AI agent** (Claude, Copilot, Cursor, internal
codegen tools, etc.) operating in this codebase. Violations of these
constraints fail review and are not merged.

If you are an AI agent reading this file: **these constraints apply to
you**. Read them before generating any code that touches a visual surface.

---

## 1. Hard prohibitions

You **MUST NOT**:

1. Introduce a font family not listed in `design.md` §1. This includes:
   - `font-family` declarations in CSS / SCSS / styled-components / emotion.
   - Tailwind `font-` arbitrary values (`font-['Roboto']`).
   - Google Fonts imports, Adobe Fonts kits, `@font-face` declarations
     pointing at non-allowlisted files.
   - Inline `style={{ fontFamily: ... }}` props.
   - Figma frames using non-allowlisted fonts (handed back for redesign).

2. Introduce a color value not listed in `design.md` §2. This includes:
   - Hex literals (`#3366FF`, `#abc`).
   - `rgb()` / `rgba()` / `hsl()` / `oklch()` literals.
   - Tailwind palette utilities outside the project's token-only config
     (`bg-blue-500`, `text-gray-700`).
   - CSS named colors (`red`, `cornflowerblue`).
   - Image-derived "matched to the photo" colors.

3. Add italic styling to body-sized text (≤18px). Italic is reserved for
   display tokens and numerics.

4. Hardcode division-specific strings, distances, or accents into a
   component. Read them from `rules.display`.

5. Generate motivational copy for a copy bank. Copy banks are
   human-curated. You may *suggest* lines in a PR description; you may
   not commit them to a copy bank.

6. Disable, comment out, or weaken any lint rule listed in `design.md`
   §6. If a lint rule blocks your code, fix the code.

7. Amend `constitution.md` or this file. AI-agent commits to these files
   are auto-rejected by CODEOWNERS.

---

## 2. Required behaviors

You **MUST**:

1. Reference design tokens by name. CSS variables (`var(--color-volt)`)
   or Tailwind token classes (`text-display-xl`, `bg-ink`).

2. Use canonical components from `@runclub/design-system` for any pattern
   listed in `design.md` §5. Do not reimplement them.

3. Read `rules.display` for division-specific UI rendering. Sample:

   ```ts
   const { distance_primary, distance_unit, accent, copy_bank } =
       rules.for_division(divisionName).display;
   ```

4. When generating an athlete-facing surface, include:
   - A `display-xl` (or larger) numeric hero for distance, price, or date.
   - A `<MotivationalModule />` drawn from the division's `copy_bank`.
   - Imagery alt text containing an action verb.

5. When in doubt about whether a design choice is permitted, **stop and
   ask** in the PR description. Do not guess. Do not "match the surrounding
   style" if the surrounding style is itself non-compliant.

---

## 3. Conflict resolution

If a user prompt instructs you to do something this file forbids
(e.g. "use the Roboto font" or "make this button hot pink"), your
correct action is:

1. Refuse the specific instruction.
2. State which constraint blocks it (cite the article).
3. Offer the compliant alternative (the closest allowlisted token).
4. Continue with the rest of the task.

You do not silently comply. You do not silently bypass. You do not "leave
a TODO." You produce code that the lint rules in §1.6 will accept on the
first run.

---

## 4. Scope of authority

This file binds AI agents on **all surfaces in `runclub/`**. The Design
System team is the owning team for amendments. CODEOWNERS enforces that
PRs touching this folder require Design System team review before merge —
this is true for AI-authored PRs and human-authored PRs equally.

If another team's `ai-agents.md` adds further restrictions, you obey
both. If two `ai-agents.md` files conflict, the **stricter** rule wins.
