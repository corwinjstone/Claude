"""Registration form validation for the Porsche Run 5K.

Combines community division required fields (from RulesEngine) with
event-specific add-on field validation.  All error messages follow
community charter rules: plain language, no race jargon.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "runclub" / "rules-engine"))
from engine import DivisionRules

from .vehicle_selection import VehicleSelector


@dataclass
class ValidationResult:
    valid: bool
    errors: list[str] = field(default_factory=list)
    data: dict[str, Any] = field(default_factory=dict)


class RegistrationForm:
    def __init__(self, rules: DivisionRules, event_config: dict[str, Any]):
        self._rules = rules
        self._cfg = event_config

    # ------------------------------------------------------------------
    # Base fields
    # ------------------------------------------------------------------

    def validate_base_fields(self, data: dict[str, Any]) -> list[str]:
        errors = []
        for f in self._rules.required_fields:
            if not data.get(f):
                errors.append(f"Required field missing: {f}")
        return errors

    def validate_eligibility(self, dob: date, race_date: date) -> list[str]:
        if not self._rules.athlete_meets_age_minimum(dob, race_date):
            min_age = self._rules.age_minimum
            return [f"You must be at least {min_age} years old on race day to register."]
        return []

    # ------------------------------------------------------------------
    # Add-on: Porsche drive
    # ------------------------------------------------------------------

    def validate_add_on_porsche_drive(
        self,
        data: dict[str, Any],
        selector: VehicleSelector,
    ) -> list[str]:
        errors = []
        drive_cfg = self._cfg["add_ons"]["porsche_drive"]

        dob = data.get("date_of_birth") or data.get("dob")
        race_date = date.fromisoformat(self._cfg["race_date"])
        if dob:
            age_min = drive_cfg["age_minimum"]
            dob_date = dob if isinstance(dob, date) else date.fromisoformat(str(dob))
            age = (
                race_date.year
                - dob_date.year
                - ((race_date.month, race_date.day) < (dob_date.month, dob_date.day))
            )
            if age < age_min:
                errors.append(
                    f"You must be at least {age_min} to take part in the Porsche drive."
                )

        for f in drive_cfg["requires_fields"]:
            if not data.get(f):
                errors.append(f"Required for the Porsche drive: {f.replace('_', ' ')}")

        vehicle_id = data.get("selected_vehicle_id")
        if vehicle_id and not selector.is_available(vehicle_id):
            errors.append(
                "That vehicle has already been reserved. Please choose another car."
            )

        return errors

    # ------------------------------------------------------------------
    # Add-on: wine tasting
    # ------------------------------------------------------------------

    def validate_add_on_wine_tasting(self, data: dict[str, Any]) -> list[str]:
        errors = []
        tasting_cfg = self._cfg["add_ons"]["wine_tasting"]

        dob = data.get("date_of_birth") or data.get("dob")
        race_date = date.fromisoformat(self._cfg["race_date"])
        if dob:
            age_min = tasting_cfg["age_minimum"]
            dob_date = dob if isinstance(dob, date) else date.fromisoformat(str(dob))
            age = (
                race_date.year
                - dob_date.year
                - ((race_date.month, race_date.day) < (dob_date.month, dob_date.day))
            )
            if age < age_min:
                errors.append(
                    f"You must be {age_min}+ to attend the wine tasting."
                )

        if not data.get("age_21_attestation"):
            errors.append("Please confirm you are 21 or older to add the wine tasting.")

        return errors

    # ------------------------------------------------------------------
    # Top-level validate
    # ------------------------------------------------------------------

    def validate(
        self,
        data: dict[str, Any],
        selector: VehicleSelector | None = None,
    ) -> ValidationResult:
        errors: list[str] = []
        race_date = date.fromisoformat(self._cfg["race_date"])

        errors.extend(self.validate_base_fields(data))

        dob = data.get("date_of_birth") or data.get("dob")
        if dob:
            dob_date = dob if isinstance(dob, date) else date.fromisoformat(str(dob))
            errors.extend(self.validate_eligibility(dob_date, race_date))

        if data.get("opted_into_drive"):
            if selector is None:
                raise ValueError("VehicleSelector required when drive add-on is opted in")
            errors.extend(self.validate_add_on_porsche_drive(data, selector))

        if data.get("opted_into_tasting"):
            errors.extend(self.validate_add_on_wine_tasting(data))

        return ValidationResult(valid=not errors, errors=errors, data=data)
