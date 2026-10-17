# Colored by Design — Workshops site

A static, no-build site for live product design, UX and AI workshops.

- `index.html`: a full-width plum hero of floating cards and a reaching hand (click any card to expand it), then the workshop listing with topic filters
- `workshop.html?id=…`: workshop details, pricing, instructor intro and signup
- `data.js`: **edit this file** to change workshops, session dates (US Central), seats, pricing, instructor bios and the in-person event card
- `styles.css`: the design tokens (plum and leaf green, 40px card radius, Avenir Next)

Open `index.html` in a browser, or serve the folder with any static host.

## To do before launch
- **Payment:** set `SITE.checkoutUrl` in `data.js` to a Stripe Payment Link. Without it, signups are only confirmed on the page and saved in the visitor's own browser, so you never receive them.
- **Intro video:** set `introVideoUrl` on the instructor (a YouTube or Vimeo *embed* URL).
- **Bio and contact:** replace the placeholder bio and `contactEmail`.
- **Event card:** the Dallas event copy in `EVENTS` is a placeholder; add a ticket link as `url` to show a "Get tickets" button.
- **Hero hand:** `assets/hand.webp` is the reaching hand on the home page; its size and position are set by `.l-hand` in `styles.css`.
