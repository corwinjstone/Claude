"""Drive roster export for Countryside Classic Cars LLC.

Generates a CSV of all registrants who opted into the Porsche drive,
including the vehicle they selected.  RunClub's role ends at export —
the rental partner operates the actual drive experience.
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
    "vehicle_id",
    "vehicle_display_name",
    "vehicle_year",
    "vehicle_model",
    "rental_price_usd",
    "drivers_license_number",
    "drivers_license_state",
    "insurance_carrier",
    "insurance_policy_number",
    "driver_waiver_signed_at",
]


class DriveRosterExport:
    def __init__(self, registrations: list[Any]):
        self._registrations = registrations

    def filter_drive_registrants(self) -> list[Any]:
        return [r for r in self._registrations if getattr(r, "opted_into_drive", False)]

    def to_csv(self, output_path: Path) -> int:
        """Write drive roster CSV.  Returns number of rows written."""
        rows = self.filter_drive_registrants()
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
                    "vehicle_id": getattr(r, "selected_vehicle_id", ""),
                    "vehicle_display_name": getattr(r, "vehicle_display_name", ""),
                    "vehicle_year": getattr(r, "vehicle_year", ""),
                    "vehicle_model": getattr(r, "vehicle_model", ""),
                    "rental_price_usd": getattr(r, "vehicle_rental_price_usd", ""),
                    "drivers_license_number": getattr(r, "drivers_license_number", ""),
                    "drivers_license_state": getattr(r, "drivers_license_state", ""),
                    "insurance_carrier": getattr(r, "insurance_carrier", ""),
                    "insurance_policy_number": getattr(r, "insurance_policy_number", ""),
                    "driver_waiver_signed_at": getattr(r, "driver_waiver_signed_at", ""),
                })
        return len(rows)
