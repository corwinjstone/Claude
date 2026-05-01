# Safety & Medical — Design Rules

This team's surfaces are the **only** surfaces that may use the WBGT
flag colors (`flag-yellow`, `flag-red`, `flag-black`) outside their
operational meaning. Everywhere else, those tokens are reserved.

## WBGT flag surface

Current flag renders as a full-bleed color block with `display-mega`
italic label:

```
[ flag-yellow background ]
YELLOW FLAG
RACE CONTINUES — INCREASED MONITORING
```

Black-flag surfaces add an `ember` "RACE CANCELED" stripe across the
top.

## Medical incident surfaces

Incident logs are operational, dense, and use `chalk` surfaces. No
hero photography, no motivational copy, no athlete-facing language.

## Cutoff-warning surface (athlete-facing)

When an athlete is within 30 minutes of an aid-station cutoff, the
race-day app shows:

```
30 : 00                          ← display-mega italic, ember
TO MILE 50 CUTOFF
```

Pulse animation (subtle, scale 1.00 → 1.02) every second. Snap when
`prefers-reduced-motion`.

## Attestation versioning

Attestation version numbers (`v3`, `v7`) render in `meta` UPPER on the
attestation surface and in the athlete's profile audit log. Athletes
who haven't re-attested at the current version see an `ember` banner
on next registration.
