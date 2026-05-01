# Timing & Results — Constitution

## Article 1 — Chip time is canonical

The chip time, captured from sanctioned hardware, is the official
finish. Gun time is published alongside but is never the basis for
qualifying-time submissions, age-group ranks, or PR-registry writes.

## Article 2 — No silent corrections

Every results correction is logged: original value, corrected value,
operator, reason, timestamp. We do not ship admin paths that mutate
results without an audit row.

## Article 3 — Results are locked within 2 hours

Within 2 hours of the last finisher, results are locked and pushed to
the PR registry. The dispute window opens at lock; corrections during
the window create amended-result rows, not silent edits.

## Article 4 — Anti-cheating is heuristic, not editorial

Course-cutting flags come from expected-split heuristics. Manual review
of a flag may resolve it as legitimate (medical detour, course marshal
direction) — but the heuristic itself is not curated by editors. We
do not ship "blacklists" or "whitelists" of athletes.

## Article 5 — Live tracking respects privacy

Live tracking publishes splits per the event's privacy settings. An
athlete who opts out of live tracking is not visible on the tracker,
not in the API, not on social-share previews.

## Article 6 — Amendment process

Amendments require a PR with at least one Timing & Results reviewer.
Article 1 requires additional product-leadership sign-off.
