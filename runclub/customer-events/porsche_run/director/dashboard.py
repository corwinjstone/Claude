"""Director dashboard for the Porsche Run 5K.

Provides registration counts, revenue breakdown, vehicle inventory status,
and refund eligibility.  Follows the Race Director Services team pattern
(teams/05-race-director-services.md).

Design system: outputs use ink/chalk/volt framing in console output to match
the bold-numeric design language from runclub/designsystem.md.
"""

from __future__ import annotations

from datetime import date, timedelta
from decimal import Decimal
from typing import Any


class DirectorDashboard:
    FULL_REFUND_WINDOW_DAYS = 14

    def __init__(self, registrations: list[Any], event_config: dict[str, Any]):
        self._regs = registrations
        self._cfg = event_config

    def total_registrations(self) -> int:
        return len(self._regs)

    def capacity_remaining(self) -> int:
        return self._cfg["capacity"] - len(self._regs)

    def revenue_breakdown(self) -> dict[str, Decimal]:
        base = Decimal("0")
        drive = Decimal("0")
        tasting = Decimal("0")
        comps = Decimal("0")

        for r in self._regs:
            base += Decimal(str(getattr(r, "base_price_paid", 0)))
            drive += Decimal(str(getattr(r, "drive_price_paid", 0)))
            tasting += Decimal(str(getattr(r, "tasting_price_paid", 0)))
            comps += Decimal(str(getattr(r, "comp_discount_applied", 0)))

        gross = base + drive + tasting
        return {
            "base_5k_revenue": base,
            "drive_addon_revenue": drive,
            "tasting_addon_revenue": tasting,
            "comp_discounts_applied": comps,
            "gross_total": gross,
        }

    def add_on_summary(self) -> dict[str, int]:
        drive_count = sum(1 for r in self._regs if getattr(r, "opted_into_drive", False))
        tasting_count = sum(1 for r in self._regs if getattr(r, "opted_into_tasting", False))
        return {
            "drive_opt_ins": drive_count,
            "tasting_opt_ins": tasting_count,
        }

    def vehicle_inventory_status(self) -> list[dict[str, Any]]:
        """Per-vehicle reservation status for the director view."""
        drive_cfg = self._cfg["add_ons"]["porsche_drive"]
        # Build a map of vehicle_id → bib for reservations
        reserved: dict[str, str] = {}
        for r in self._regs:
            if getattr(r, "opted_into_drive", False):
                vid = getattr(r, "selected_vehicle_id", None)
                if vid:
                    reserved[vid] = getattr(r, "bib_number", "")

        # Load vehicle names/prices from the registrations' denormalized fields
        # (app.py stamps these onto the registration object at creation time)
        vehicles_seen: dict[str, dict[str, Any]] = {}
        for r in self._regs:
            vid = getattr(r, "selected_vehicle_id", None)
            if vid and vid not in vehicles_seen:
                vehicles_seen[vid] = {
                    "vehicle_id": vid,
                    "display_name": getattr(r, "vehicle_display_name", vid),
                    "rental_price_usd": getattr(r, "vehicle_rental_price_usd", 0),
                }

        result = []
        for vid, info in vehicles_seen.items():
            entry = dict(info)
            if vid in reserved:
                entry["status"] = "reserved"
                entry["reserved_by_bib"] = reserved[vid]
            else:
                entry["status"] = "available"
            result.append(entry)
        return result

    def refund_eligible_count(self) -> int:
        cutoff = date.today() - timedelta(days=self.FULL_REFUND_WINDOW_DAYS)
        return sum(
            1 for r in self._regs
            if getattr(r, "registration_date", date.today()) >= cutoff
        )

    def print_summary(self) -> None:
        rev = self.revenue_breakdown()
        add_ons = self.add_on_summary()
        vehicles = self.vehicle_inventory_status()

        print("=" * 60)
        print(f"  {self._cfg['event_name'].upper()}")
        print(f"  RACE DATE: {self._cfg['race_date']}")
        print("=" * 60)

        print(f"\n  REGISTRATIONS")
        print(f"    Total registered : {self.total_registrations()}")
        print(f"    Capacity remaining: {self.capacity_remaining()}")
        print(f"    Refund eligible  : {self.refund_eligible_count()}")

        print(f"\n  REVENUE")
        print(f"    Base 5K          : ${rev['base_5k_revenue']:.2f}")
        print(f"    Porsche drive    : ${rev['drive_addon_revenue']:.2f}")
        print(f"    Wine tasting     : ${rev['tasting_addon_revenue']:.2f}")
        print(f"    Comp discounts   : -${rev['comp_discounts_applied']:.2f}")
        print(f"    GROSS TOTAL      : ${rev['gross_total']:.2f}")

        print(f"\n  ADD-ONS")
        print(f"    Drive opt-ins    : {add_ons['drive_opt_ins']}")
        print(f"    Tasting opt-ins  : {add_ons['tasting_opt_ins']}")

        print(f"\n  VEHICLE INVENTORY")
        if vehicles:
            for v in vehicles:
                status_tag = "RESERVED" if v["status"] == "reserved" else "AVAILABLE"
                bib_note = f"  (bib {v['reserved_by_bib']})" if v["status"] == "reserved" else ""
                print(
                    f"    [{status_tag}] {v['display_name']}"
                    f"  ${v['rental_price_usd']}{bib_note}"
                )
        else:
            print("    No drive reservations yet.")

        safety = self._cfg.get("safety_notes", {})
        if safety.get("no_drive_after_tasting_policy"):
            print(f"\n  SAFETY NOTE")
            print(f"    No Porsche drive after wine tasting — director's responsibility.")
            transport = safety.get("post_race_transport", "")
            if transport:
                print(f"    {transport}")

        print("=" * 60)
