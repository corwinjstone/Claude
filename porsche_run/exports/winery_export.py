"""Wine tasting roster export for Ridgeline Winery.

Generates a minimum-data CSV for winery compliance and pour-count planning.
Only 21+-confirmed registrants are included.  No license or insurance data
is included — winery receives only what is needed for compliance.
"""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Any


_COLUMNS = [
    "bib_number",
    "first_name",
    "last_name",
    "dob",
    "age_21_attestation_signed_at",
]


class WineryRosterExport:
    def __init__(self, registrations: list[Any]):
        self._registrations = registrations

    def filter_tasting_registrants(self) -> list[Any]:
        return [
            r for r in self._registrations
            if getattr(r, "opted_into_tasting", False)
            and getattr(r, "age_21_attestation_signed_at", None)
        ]

    def to_csv(self, output_path: Path) -> int:
        """Write winery roster CSV.  Returns number of rows written."""
        rows = self.filter_tasting_registrants()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with output_path.open("w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=_COLUMNS, extrasaction="ignore")
            writer.writeheader()
            for r in rows:
                writer.writerow({
                    "bib_number": getattr(r, "bib_number", ""),
                    "first_name": getattr(r, "first_name", ""),
                    "last_name": getattr(r, "last_name", ""),
                    "dob": getattr(r, "dob", ""),
                    "age_21_attestation_signed_at": getattr(
                        r, "age_21_attestation_signed_at", ""
                    ),
                })
        return len(rows)
