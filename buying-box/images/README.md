# Image assets

Drop the five files below in this folder and they are picked up automatically —
no code change. Until a file exists, the page falls back to its built-in mark
(a brand-coloured monogram for lenders, a hatched placeholder for the vehicle).

| Filename    | Used for          | Recommended              |
|-------------|-------------------|--------------------------|
| `camry.jpg` | Vehicle thumbnail | 16:9, ~1000px wide, JPEG |

To add another asset, put the file here and add an entry to the `IMG` map at the
top of the script in `../index.html`; the build step picks it up from there.

Lender logos were removed — they crowded the callback rows and the structure
headers out of alignment. Lenders are identified by name alone.

## How they reach each build

`index.html` references these by relative path, so opening it from a checkout or
serving the folder works as-is.

A published Artifact is a single self-contained file and its CSP blocks external
images, so `../build-artifact.py` inlines whatever is in this folder as data URIs
and writes `../dist/buying-box-desk.html`. Run it before publishing:

    python3 build-artifact.py

Viewers can also attach their own photo from the vehicle tile's Add photo
button; it is stored per-browser and overrides the file here.

## Provenance

The vehicle photo is not committed here — supply one you hold rights to.
