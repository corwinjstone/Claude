#!/usr/bin/env python3
"""Build the self-contained Artifact page from index.html.

A published Artifact is one file and its CSP blocks external images, so this
does two things index.html cannot do for itself:

  1. strips the document wrapper (the Artifact host supplies <html>/<head>/<body>)
  2. inlines every asset listed in the IMG map as a data URI, when the file exists

Missing files are left as relative paths; the page falls back to its built-in
marks for those, so this is safe to run with an empty images/ folder.

    python3 build-artifact.py            -> dist/buying-box-desk.html
"""

import base64
import mimetypes
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "index.html"
OUT = HERE / "dist" / "buying-box-desk.html"

# tags the Artifact host supplies itself
WRAPPER = [
    "<!doctype html>\n",
    '<html lang="en">\n',
    "<head>\n",
    '<meta charset="utf-8">\n',
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n',
    "</head>\n",
    "<body>\n",
    "</body>\n",
    "</html>\n",
]


def data_uri(path: pathlib.Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return "data:%s;base64,%s" % (mime, base64.b64encode(path.read_bytes()).decode("ascii"))


def main() -> int:
    if not SRC.exists():
        print("missing %s" % SRC, file=sys.stderr)
        return 1

    html = SRC.read_text()

    for tag in WRAPPER:
        if tag not in html:
            print("unexpected document shape: %r not found" % tag.strip(), file=sys.stderr)
            return 1
        html = html.replace(tag, "", 1)
    html = html.lstrip()

    # rewrite each IMG map entry whose file is on disk
    block = re.search(r"var IMG = \{(.*?)\n\};", html, re.S)
    if not block:
        print("could not find the IMG map in index.html", file=sys.stderr)
        return 1

    inlined, missing, total = [], [], 0
    body = block.group(1)
    for key, rel in re.findall(r"(\w+):\s*'([^']+)'", body):
        path = HERE / rel
        if path.exists():
            uri = data_uri(path)
            body = body.replace("'%s'" % rel, "'%s'" % uri, 1)
            inlined.append("%s (%s, %.0f KB)" % (key, path.name, len(uri) / 1024))
            total += len(uri)
        else:
            missing.append("%s (%s)" % (key, rel))

    html = html[: block.start(1)] + body + html[block.end(1) :]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html)

    print("wrote %s  (%.0f KB)" % (OUT.relative_to(HERE), len(html) / 1024))
    for line in inlined:
        print("  inlined  %s" % line)
    for line in missing:
        print("  no file  %s — falls back to its built-in mark" % line)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
