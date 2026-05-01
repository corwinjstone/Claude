"""RunClub RulesEngine.

Loads per-division rule files from `divisions/` and exposes a typed
interface that registration, race-director, timing, and safety teams
consume.

Rules are read-only at runtime. Per-event overrides are passed in
explicitly; they layer on top of division defaults.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Any

DIVISIONS_DIR = Path(__file__).parent / "divisions"

KNOWN_DIVISIONS = {
    "marathon",
    "half_marathon",
    "triathlon",
    "trail_ultra",
    "community",
    "ocr",
    "duathlon",
    "relay",
    "virtual",
}


class UnknownDivision(KeyError):
    pass


class IneligibleAthlete(Exception):
    def __init__(self, reason: str, detail: dict[str, Any] | None = None):
        super().__init__(reason)
        self.detail = detail or {}


@dataclass(frozen=True)
class DivisionRules:
    division: str
    raw: dict[str, Any]

    @property
    def display_name(self) -> str:
        return self.raw["display_name"]

    @property
    def required_fields(self) -> list[str]:
        return list(self.raw.get("registration_required_fields", []))

    @property
    def age_minimum(self) -> int | None:
        return self.raw.get("eligibility", {}).get("age_minimum_years")

    @property
    def refund_policy(self) -> dict[str, Any]:
        return self.raw.get("refund_policy", {})

    def qualifying_time_required(self) -> bool:
        return bool(self.raw.get("qualifying", {}).get("required", False))

    def athlete_meets_age_minimum(self, dob: date, race_date: date) -> bool:
        minimum = self.age_minimum
        if minimum is None:
            return True
        age_on_race_day = (
            race_date.year
            - dob.year
            - ((race_date.month, race_date.day) < (dob.month, dob.day))
        )
        return age_on_race_day >= minimum

    def with_event_overrides(self, overrides: dict[str, Any]) -> "DivisionRules":
        merged = _deep_merge(self.raw, overrides)
        return DivisionRules(division=self.division, raw=merged)


class RulesEngine:
    def __init__(self, divisions: dict[str, DivisionRules]):
        self._divisions = divisions

    @classmethod
    def load(cls, path: Path = DIVISIONS_DIR) -> "RulesEngine":
        divisions: dict[str, DivisionRules] = {}
        for json_path in sorted(path.glob("*.json")):
            with json_path.open() as f:
                data = json.load(f)
            name = data["division"]
            if name not in KNOWN_DIVISIONS:
                raise ValueError(
                    f"{json_path.name} declares unknown division {name!r}"
                )
            divisions[name] = DivisionRules(division=name, raw=data)
        missing = KNOWN_DIVISIONS - divisions.keys()
        if missing:
            raise ValueError(f"Missing rules for divisions: {sorted(missing)}")
        return cls(divisions)

    def for_division(self, name: str) -> DivisionRules:
        try:
            return self._divisions[name]
        except KeyError:
            raise UnknownDivision(name) from None

    def divisions(self) -> list[str]:
        return sorted(self._divisions)


def _deep_merge(base: dict[str, Any], overlay: dict[str, Any]) -> dict[str, Any]:
    out = dict(base)
    for key, value in overlay.items():
        if (
            key in out
            and isinstance(out[key], dict)
            and isinstance(value, dict)
        ):
            out[key] = _deep_merge(out[key], value)
        else:
            out[key] = value
    return out


if __name__ == "__main__":
    engine = RulesEngine.load()
    for name in engine.divisions():
        rules = engine.for_division(name)
        print(
            f"{name:16s} {rules.display_name:30s} "
            f"min_age={rules.age_minimum} "
            f"qualifying_required={rules.qualifying_time_required()}"
        )
