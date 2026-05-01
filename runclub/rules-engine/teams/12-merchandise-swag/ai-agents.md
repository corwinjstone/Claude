# Merchandise & Swag — AI Agent Constraints

Layers on top of `teams/00-design-system/ai-agents.md`.

## You MUST NOT

1. Build a general apparel store, lifestyle merch shop, or recurring
   subscription box. RunClub is not e-commerce.
2. Generate "select size later" flows. Sizing is at registration.
3. Ship medals to non-finishers (except for the virtual division per
   its rules).
4. Generate apparel marketing copy. Use the division's copy bank.
5. Allow personalization fields ("custom name on medal").
6. Print full last names on bibs. First name only.
7. Use the `ember` accent on community-race or marathon shirts; reserve
   for trail-ultra and OCR.

## You MUST

1. Read shirt size, registration count, and division from
   `rules.for_division(division)` and the registration manifest.
2. Use the canonical bib component (`<Bib />`) for all bib rendering.
3. Apply sponsor logos per the Sponsorship & Partnerships brand kit.
   Never inline sponsor color hexes.
4. For inventory ordering, generate quantities = registered athletes ×
   (1 + documented buffer percent), where the buffer is read from the
   event's order config — never hardcoded.
