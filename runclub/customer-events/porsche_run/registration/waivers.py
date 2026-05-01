"""Waiver collection for the Porsche Run 5K.

Determines required waivers based on the athlete's registration choices
and records signature timestamps.  Waiver version changes require
re-attestation at bib pickup.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class WaiverRecord:
    athlete_id: str
    signatures: dict[str, datetime] = field(default_factory=dict)


class WaiverSet:
    # Base race waiver version — bump this when terms change
    RACE_WAIVER = "waiver_v7"

    def __init__(
        self,
        event_config: dict[str, Any],
        opted_into_drive: bool = False,
        opted_into_tasting: bool = False,
    ):
        self._cfg = event_config
        self._drive = opted_into_drive
        self._tasting = opted_into_tasting

    def required_waivers(self) -> list[str]:
        waivers = [self.RACE_WAIVER]
        if self._drive:
            drive_waivers = self._cfg["add_ons"]["porsche_drive"].get(
                "requires_waivers", []
            )
            waivers.extend(drive_waivers)
        if self._tasting:
            waivers.append("age_21_attestation")
        return waivers

    def record_signatures(
        self,
        athlete_id: str,
        signatures: dict[str, datetime],
    ) -> WaiverRecord:
        return WaiverRecord(athlete_id=athlete_id, signatures=dict(signatures))

    def all_signed(self, record: WaiverRecord) -> bool:
        return all(w in record.signatures for w in self.required_waivers())
