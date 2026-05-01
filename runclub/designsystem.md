# RunClub Design System

The RunClub Design System is the visual and verbal language for every athlete-
and director-facing surface. It exists so that a marathon registration page,
a trail-ultra results screen, and a charity-bib confirmation email all feel
like the same product — loud, fast, and built for people who race.

The system is inspired by the **Nike Run Club** and **Nike Training Club**
visual languages: oversized bold italic typography, brutal contrast, hero
imagery of athletes mid-effort, and motivational copy that talks to the
athlete in second person.

> **Voice in one line:** "You. Can. Do. This."

---

## 1. Design Principles

1. **Big or go home.** Distances, prices, dates, finish times, and bib
   numbers are the heroes of the page. Treat them like billboards.
2. **Italics mean motion.** Bold italic is the default for any number,
   verb, or call to action. Upright type is for body and metadata only.
3. **High contrast, no gray zones.** Black on white, white on black,
   white on a hero photo. No subtle pastels.
4. **Athletes, not products.** Every hero image shows a human in motion —
   sweat, stride, finish-line emotion. No flat-lay gear shots, no
   stock-photo smiling.
5. **Talk to the athlete.** Copy uses second person ("YOU"), present
   tense, imperative verbs. Never marketing-speak.
6. **Earn every word.** If a line of copy doesn't push the athlete toward
   the start line, cut it.

---

## 2. Typography

### 2.1 Type families

| Role            | Family                        | Weight        | Style           |
|-----------------|-------------------------------|---------------|-----------------|
| Display         | `Futura Condensed Extra Bold` | 800           | **Italic**      |
| Headline        | `Futura Condensed Bold`       | 700           | **Italic**      |
| Numerics (XL)   | `Futura Condensed Extra Bold` | 800           | **Italic**      |
| Body            | `Inter`                       | 400 / 600     | Upright         |
| Metadata / UI   | `Inter`                       | 500           | Upright UPPER   |

Fallback stack: `"Futura PT Condensed", "Helvetica Neue Condensed", Impact, sans-serif`.

### 2.2 Scale

The scale is intentionally aggressive. There is no "small heading."

| Token              | Size (px) | Line height | Usage                                  |
|--------------------|-----------|-------------|----------------------------------------|
| `display-mega`     | 160       | 0.9         | Race name on hero, finish-time reveal  |
| `display-xl`       | 112       | 0.92        | Distance, price, countdown number      |
| `display-l`        | 80        | 0.95        | Section openers, bib number            |
| `headline-xl`      | 56        | 1.0         | Page titles                            |
| `headline-l`       | 40        | 1.05        | Card titles                            |
| `headline-m`       | 28        | 1.1         | Subsection                             |
| `body-l`           | 18        | 1.45        | Long-form description                  |
| `body-m`           | 16        | 1.5         | Default body                           |
| `meta`             | 12        | 1.3         | Labels, timestamps, division tags      |

Display tokens are **always italic, always bold, always uppercase** unless
the type is a proper name or a numeric value.

### 2.3 Numerics

Numbers are the loudest thing on the page. Render them with these rules:

- **Distances:** integer kilometers/miles in `display-xl`, unit in `meta`
  baseline-aligned. `26.2 MI`, `42.195 KM`, `100K`.
- **Prices:** integer dollars in `display-xl`, cents (if any) in `headline-m`
  superscript. `$95` not `$95.00`. Currency code in `meta`.
- **Dates:** day in `display-l`, month abbreviation in `headline-m` UPPER,
  year in `meta`. Stack vertically when there's room.
- **Finish times:** `H:MM:SS` in `display-mega`, no leading zero on hours.
- **Countdown:** `DD : HH : MM` in `display-xl`, separators in 30% opacity.

Use **tabular figures** (`font-variant-numeric: tabular-nums`) so digits don't
shift on update.

---

## 3. Color

| Token              | Hex        | Use                                       |
|--------------------|------------|-------------------------------------------|
| `volt`             | `#D7FF1E`  | Primary accent — CTAs, PRs, podium        |
| `ink`              | `#0A0A0A`  | Default text, default surfaces            |
| `chalk`            | `#FFFFFF`  | Inverse text, default light surface       |
| `ember`            | `#FF3B1F`  | Race-day urgency, cutoffs, red flags      |
| `track`            | `#1F1F1F`  | Secondary surface on dark                 |
| `mist`             | `#E5E5E5`  | Dividers, low-emphasis surfaces           |
| `flag-yellow`      | `#F5C518`  | WBGT yellow flag                          |
| `flag-red`         | `#E11900`  | WBGT red flag                             |
| `flag-black`       | `#000000`  | WBGT black flag (race canceled)           |

Default surface is `ink`. Default page is **dark** unless the surface needs
to print or be read in bright sun (e.g., race-day bib lookup).

---

## 4. Imagery

### 4.1 What we shoot

- **Athletes mid-stride**, not posed. Motion blur welcome.
- **Sweat, breath, grit.** Faces that look like effort.
- **Finish-line emotion.** Tears, fists, hugs, collapses.
- **Course environment.** Wet pavement at 5am, switchbacks, transition
  zones, aid stations.

### 4.2 What we don't shoot

- Studio gear flat-lays.
- Smiling-at-camera stock photography.
- Anything that looks like a wellness app.
- Static product shots on white seamless.

### 4.3 Treatment

- **Crop tight.** Faces and feet, not full bodies.
- **Push contrast.** Crush the blacks.
- **Overlay headline in `chalk` or `volt`**, italic, set tight against the
  bottom-left or upper-right corner.
- **Duotone allowed:** `ink + volt` only, when a photo needs to live
  alongside heavy type without competing.

---

## 5. Voice & Copy

### 5.1 Tone

Direct. Imperative. Second person. Confident without being smug.

### 5.2 Default phrasings

- ✅ "YOU SIGN UP. YOU SHOW UP. YOU FINISH."
- ✅ "26.2 MILES. ONE START LINE. NO EXCUSES."
- ✅ "RACE DAY DOESN'T CARE HOW YOU FEEL. SHOW UP ANYWAY."
- ✅ "GO."
- ❌ "Sign up today and join thousands of runners…"
- ❌ "Our marathon experience is designed to…"
- ❌ "Why not give it a try?"

### 5.3 Motivational module

Every primary athlete surface (registration confirmation, race-day brief,
results page) ends with a **motivational module**: a single full-bleed line
of `display-mega` italic copy on a hero image. Examples:

- "THE START LINE IS THE HARDEST MILE."
- "YOU TRAINED FOR THIS."
- "SHOW UP FOR THE VERSION OF YOU WHO SIGNED UP."
- "FINISH."

Rotate from a curated copy bank — never machine-generated.

### 5.4 What we never say

- "Wellness", "journey", "community" (we *are* a club; we don't talk about it).
- "Just do it." (Not ours.)
- "Fun run." If it's a race, it's a race.

---

## 6. Component Patterns

### 6.1 Race Card

```
┌─────────────────────────────────────────┐
│  [hero image, athlete mid-stride]       │
│                                         │
│  CHICAGO MARATHON                       │  ← headline-xl, italic
│                                         │
│  26.2          OCT 12          $185     │  ← display-xl, italic
│   MI            2026           USD       │  ← meta, upright
│                                         │
│  [REGISTER →]                           │  ← volt CTA, italic UPPER
└─────────────────────────────────────────┘
```

### 6.2 Countdown

`DD : HH : MM` in `display-xl`, label `RACE DAY` in `meta` above. Volt on
ink. Pulses every second (subtle scale 1.00 → 1.02).

### 6.3 Result Reveal

Three-line stack:
1. `meta`: "YOUR FINISH"
2. `display-mega` italic: `3:42:18`
3. `headline-m` italic: `NEW PR — 4:11 FASTER`

### 6.4 Buttons

- **Primary:** `volt` background, `ink` text, italic UPPER, square corners,
  no shadow. Hover: invert.
- **Secondary:** ghost — 2px `chalk` border, transparent fill.
- **Destructive (refund/withdraw):** `ember` text, no fill.

---

## 7. Motion

- **Default easing:** `cubic-bezier(0.2, 0.9, 0.1, 1)` — fast out, settle in.
- **Default duration:** 200ms for UI, 600ms for hero entrances.
- **Numbers tick up**, never fade in. Counter components count from 0 to
  target in 800ms (`registered_athletes`, `miles_logged`, etc.).
- **No bounce, no parallax, no decorative animation.** Everything moves
  forward.

---

## 8. Accessibility

The aggressive type and dark surfaces don't get to opt out of accessibility.

- Body text minimum **16px**, contrast ratio ≥ 4.5:1 against its surface.
- Display type allowed at 3.0:1 (it's large).
- **Italic body is banned** — italic is reserved for display/numerics.
  Long-form copy is upright for legibility.
- Every motivational image has alt text describing the athlete and action,
  not the slogan.
- Motion respects `prefers-reduced-motion` — counters snap to value, hero
  pulses disabled.
- Volt-on-chalk fails contrast for body — only use volt on `ink` or as
  a >24px display fill.

---

## 9. How divisions consume the system

The RulesEngine carries a `display` block per division (see
`rules-engine/divisions/*.json`). It tells UI surfaces:

- the canonical distance string and unit (`"26.2"`, `"MI"`),
- the division's accent color (defaults to `volt`, but `trail_ultra` uses
  a forest variant, etc.),
- the motivational copy bank tag for that division.

```python
rules = engine.for_division("marathon")
display = rules.display
# → {"distance_primary": "26.2", "distance_unit": "MI",
#    "accent": "volt", "copy_bank": "road_marathon"}
```

UI components read this via `rules.display` — they never hardcode division
strings or pick their own accent color.

---

## 10. What this system is NOT

- Not a general-purpose web design kit. It's tuned for race surfaces.
- Not a brand-marketing system. Marketing-site work goes through the
  Sponsorship & Partnerships team's brand kit, which extends this system
  but is not the same.
- Not a training-app system. RunClub does not ship workouts, plans,
  or coaching surfaces.
- Not negotiable on typography. The bold-italic hierarchy is the system.
  If a surface needs a "calmer" version, the surface is wrong.
