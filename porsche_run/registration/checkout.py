"""Price calculation for the Porsche Run 5K.

Handles tiered base pricing, vehicle-specific drive add-on pricing,
flat-rate tasting add-on, sponsor comp codes, and family bundle discount.
"""

from __future__ import annotations

import sys
from datetime import date
from decimal import Decimal
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "rules-engine"))
from engine import DivisionRules

from .vehicle_selection import VehicleInventory


class PriceCalculator:
    def __init__(self, rules: DivisionRules, event_config: dict[str, Any]):
        self._rules = rules
        self._cfg = event_config
        # Pricing tiers from event_config overrides; sorted descending by weeks_before
        self._tiers = sorted(
            self._cfg.get("rule_overrides", {}).get("pricing", {}).get("default_tiers", []),
            key=lambda t: t["weeks_before"],
            reverse=True,
        )

    def base_price(self, registration_date: date, race_date: date) -> Decimal:
        weeks_before = (race_date - registration_date).days / 7
        for tier in self._tiers:
            if weeks_before >= tier["weeks_before"]:
                return Decimal(str(tier["default_price_usd"]))
        # Fallback to last tier (race day) if none matched
        if self._tiers:
            return Decimal(str(self._tiers[-1]["default_price_usd"]))
        return Decimal("0")

    def add_on_price(
        self,
        add_on_name: str,
        data: dict[str, Any],
        inventory: VehicleInventory | None = None,
    ) -> Decimal:
        cfg = self._cfg["add_ons"].get(add_on_name, {})
        if add_on_name == "porsche_drive":
            vehicle_id = data.get("selected_vehicle_id")
            if vehicle_id and inventory:
                vehicle = inventory.get(vehicle_id)
                return Decimal(str(vehicle.rental_price_usd))
            return Decimal("0")
        return Decimal(str(cfg.get("price_usd", 0)))

    def apply_comp_code(self, code: str, subtotal: Decimal) -> Decimal:
        """Apply a sponsor comp code.

        Codes starting with 'FULL-' give full entry comp (zeroes the subtotal).
        Codes ending with a digit percentage (e.g. 'WINERY20') give that % off.
        All other unrecognized codes are ignored (no error — invalid codes are
        validated upstream at the Sponsorship integration layer).
        """
        if code.startswith("FULL-"):
            return Decimal("0")
        for pct in range(5, 101, 5):
            if code.endswith(str(pct)):
                discount = subtotal * Decimal(str(pct)) / Decimal("100")
                return max(Decimal("0"), subtotal - discount)
        return subtotal

    def family_bundle_discount(self, athlete_count: int, subtotal: Decimal) -> Decimal:
        """15% off when 2+ athletes register together (community division rule)."""
        if athlete_count >= 2:
            return subtotal * Decimal("0.85")
        return subtotal

    def total(
        self,
        data: dict[str, Any],
        inventory: VehicleInventory | None = None,
        registration_date: date | None = None,
    ) -> Decimal:
        race_date = date.fromisoformat(self._cfg["race_date"])
        reg_date = registration_date or date.today()

        amount = self.base_price(reg_date, race_date)

        if data.get("opted_into_drive"):
            amount += self.add_on_price("porsche_drive", data, inventory)

        if data.get("opted_into_tasting"):
            amount += self.add_on_price("wine_tasting", data, inventory)

        comp_code = data.get("comp_code", "")
        if comp_code:
            amount = self.apply_comp_code(comp_code, amount)

        athlete_count = int(data.get("family_bundle_count", 1))
        amount = self.family_bundle_discount(athlete_count, amount)

        return amount.quantize(Decimal("0.01"))
