# Image assets

Drop the five files below in this folder and they are picked up automatically —
no code change. Until a file exists, the page falls back to its built-in mark
(a brand-coloured monogram for lenders, a hatched placeholder for the vehicle).

| Filename            | Used for                    | Recommended                                |
|---------------------|-----------------------------|--------------------------------------------|
| `camry.jpg`         | Vehicle thumbnail           | 16:9, ~1000px wide, JPEG                    |
| `capital-one.png`   | Capital One Auto Finance    | ~220px wide, transparent or white ground    |
| `ally.png`          | Ally Financial              | ~220px wide, transparent or white ground    |
| `santander.png`     | Santander Consumer          | ~220px wide, transparent or white ground    |
| `wells-fargo.png`   | Wells Fargo Dealer Services | ~220px wide, transparent or white ground    |

SVG works too — change the extension in the `IMG` map at the top of the script
in `../index.html`.

## How they reach each build

`index.html` references these by relative path, so opening it from a checkout or
serving the folder works as-is.

A published Artifact is a single self-contained file and its CSP blocks external
images, so `../build-artifact.py` inlines whatever is in this folder as data URIs
and writes `../dist/buying-box-desk.html`. Run it before publishing:

    python3 build-artifact.py

Viewers can also attach their own images from the Logos button and the vehicle
tile's Add photo button; those are stored per-browser and override these files.

## Provenance

These files are not committed here. The four lender logos are third-party
trademarks, included only to identify each lender in the callback list — supply
copies you are licensed to use. The vehicle photo should likewise be one you
hold rights to.
