# Timing & Results — Design Rules

Inherits global Design System. Results pages are the **highest-stakes**
surface for the system — the moment the athlete sees their finish.

## Result reveal pattern (canonical)

```
YOUR FINISH                       ← meta UPPER
3:42:18                           ← display-mega italic, tabular
NEW PR — 4:11 FASTER              ← headline-m italic, volt
```

Numbers tick from 0 to value over 800ms (`--dur-counter`). Snap to
value when `prefers-reduced-motion`.

## Splits

Splits render as a vertical stack of `display-l` italic tabular rows.
Pace deltas in `headline-m` italic to the right (`+0:08 / KM`, `−0:12 / KM`),
green for negative split, `ember` for positive split.

## BQ-eligible stamp

`volt` on `ink` `display-l` italic stamp. Shipped only when the time
clears the relevant standard — never speculative.

## Live tracking surface

Active live split renders in `display-mega` italic. Next-split countdown
in `display-xl` italic below. Athlete's name in `headline-xl` italic UPPER.

## Share cards (1080×1080)

Use the same type tokens at canvas scale:
- Race name: `headline-xl` italic UPPER.
- Finish time: `display-mega` italic tabular.
- Distance hero: `display-xl` italic.
- Background: hero photo or `ink` solid.
- Footer: RunClub logo + division accent strip.

## DNF / cutoff

`ember` accent. Time replaced with "DNF — MILE 47" in `display-l`
italic. We do not hide DNFs or render them apologetically.
