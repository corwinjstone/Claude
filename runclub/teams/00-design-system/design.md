# Design System — Design Rules

This file is the **authoritative allowlist** for fonts, colors, type
tokens, and motion tokens used anywhere in RunClub product code.

The allowlist is a **closed set**. Adding to it requires a PR against
this file, reviewed by the Design System team. Code that uses anything
outside this allowlist fails review.

> See `runclub/designsystem.md` for the visual rationale and component
> patterns. This file is the machine-checkable contract derived from it.

---

## 1. Authorized fonts

These are the **only** font families that may appear in any product
codebase, design file, generated CSS, or AI-agent output.

| Family                        | Weights allowed | Styles allowed |
|-------------------------------|-----------------|----------------|
| `Futura PT Condensed`         | 700, 800        | Italic only    |
| `Futura Condensed Extra Bold` | 800             | Italic only    |
| `Inter`                       | 400, 500, 600   | Upright only   |

### Fallback stacks

```css
/* Display */
font-family: "Futura PT Condensed", "Futura Condensed Extra Bold",
             "Helvetica Neue Condensed", Impact, sans-serif;

/* Body / UI */
font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
```

### Forbidden fonts (non-exhaustive — anything not in §1 is forbidden)

- ❌ Helvetica (non-condensed), Arial, Roboto, Open Sans, Lato, Poppins
- ❌ Any serif family (no Georgia, no Times, no Playfair)
- ❌ Any monospace family in athlete-facing surfaces (engineering tooling
  may use a monospace; product surfaces may not)
- ❌ Any handwriting / display-novelty / "fun" font
- ❌ Variable fonts that expose weights outside the allowed range

---

## 2. Authorized colors

These are the **only** color values that may appear in product code.
Reference them by token name; never paste the hex.

| Token             | Hex        | Allowed surfaces                         |
|-------------------|------------|------------------------------------------|
| `--color-volt`    | `#D7FF1E`  | CTAs, PRs, podium, accents on `--ink`    |
| `--color-ink`     | `#0A0A0A`  | Default text, default dark surface       |
| `--color-chalk`   | `#FFFFFF`  | Inverse text, default light surface      |
| `--color-ember`   | `#FF3B1F`  | Race-day urgency, cutoffs, DNF, red flag |
| `--color-track`   | `#1F1F1F`  | Secondary surface on dark                |
| `--color-mist`    | `#E5E5E5`  | Dividers, low-emphasis surfaces          |
| `--flag-yellow`   | `#F5C518`  | WBGT yellow flag (medical surfaces only) |
| `--flag-red`      | `#E11900`  | WBGT red flag (medical surfaces only)    |
| `--flag-black`    | `#000000`  | WBGT black flag (medical surfaces only)  |

### Forbidden colors

- ❌ Any hex value not in the table above.
- ❌ Tailwind default palette (`text-blue-500`, `bg-gray-100`, etc.) —
  the project's Tailwind config exposes only these tokens.
- ❌ Inline `style="color: #..."` — hardcoded hex fails the lint rule
  `no-hardcoded-color`.
- ❌ Volt on chalk for body copy (fails contrast). Volt is allowed on
  ink, or on display-sized text ≥24px on chalk.

---

## 3. Type tokens

```css
--display-mega:   160px / 0.9   "Futura PT Condensed" 800 italic;
--display-xl:     112px / 0.92  "Futura PT Condensed" 800 italic;
--display-l:       80px / 0.95  "Futura PT Condensed" 800 italic;
--headline-xl:     56px / 1.0   "Futura PT Condensed" 700 italic;
--headline-l:      40px / 1.05  "Futura PT Condensed" 700 italic;
--headline-m:      28px / 1.1   "Futura PT Condensed" 700 italic;
--body-l:          18px / 1.45  "Inter" 400 upright;
--body-m:          16px / 1.5   "Inter" 400 upright;
--meta:            12px / 1.3   "Inter" 500 upright UPPER tracking 0.06em;
```

Surfaces use these tokens via the design-system CSS variables or the
matching Tailwind classes (`text-display-mega`, `text-headline-xl`, etc.).
Custom font sizes outside this scale fail lint.

---

## 4. Motion tokens

```css
--ease-default: cubic-bezier(0.2, 0.9, 0.1, 1);
--dur-ui:       200ms;
--dur-hero:     600ms;
--dur-counter:  800ms;
```

Custom durations outside these tokens require a Design System PR.

---

## 5. Component reference (must use, not reimplement)

When implementing any of the below, use the canonical component from
`@runclub/design-system`. Reimplementing is a violation.

- `<RaceCard />`
- `<Countdown />`
- `<ResultReveal />`
- `<MotivationalModule />`
- `<DistanceHero />`
- `<PriceHero />`
- `<DateStack />`
- `<ButtonPrimary />` / `<ButtonSecondary />` / `<ButtonDestructive />`

---

## 6. Lint rules enforced in CI

The following lint rules block merge:

- `no-hardcoded-color` — forbids hex literals in product code.
- `no-unauthorized-font` — forbids `font-family` declarations not in §1.
- `no-italic-body` — forbids italic on body-sized text.
- `no-raw-pixel-font-size` — forbids `font-size` outside the token scale.
- `requires-display-token-on-numerics` — distance/price/date/time elements
  must carry a display token class.
- `requires-alt-text-with-action-verb` — hero image alt text must contain
  an action verb (run, sprint, climb, finish, etc.).

These lint rules are owned by the Design System team. Disabling them in a
PR is itself a violation requiring Design System review.
