# Studio Sessions — Workshops site

A static, no-build site for live product design, UX and AI workshops.

- `index.html`: the workshop listing, with a featured hero and topic filters
- `workshop.html?id=…`: workshop details, pricing, instructor intro and signup
- `data.js`: **edit this file** to change workshops, session dates, seats, pricing and instructor bios
- `styles.css`: the design tokens (plum and leaf green, 40px card radius, Avenir Next)

Open `index.html` in a browser, or serve the folder with any static host.

## To do before launch
- **Payment:** set `SITE.checkoutUrl` in `data.js` to a Stripe Payment Link. Without it, signups are only confirmed on the page and saved in the visitor's own browser, so you never receive them.
- **Intro video:** set `introVideoUrl` on the instructor (a YouTube or Vimeo *embed* URL).
- **Bio and contact:** replace the placeholder bio and `contactEmail`.
- **Hero photo (optional):** set `--hero-image: url("assets/hero.jpg")` in `styles.css` to use a photo instead of the illustrated dusk skyline.
