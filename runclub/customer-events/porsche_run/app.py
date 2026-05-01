"""Porsche Run 5K — entry point.

Wires the RulesEngine, registration form, vehicle selector, price
calculator, waivers, exports, and director dashboard together.

Running this file simulates a complete registration flow for three
athletes (one per vehicle) and one partial registration without add-ons,
then writes the partner exports and prints the director summary.
"""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass, field
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from typing import Any

# Add the rules-engine to the import path
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "rules-engine"))
from engine import RulesEngine

from registration.vehicle_selection import VehicleInventory, VehicleSelector
from registration.form import RegistrationForm
from registration.checkout import PriceCalculator
from registration.waivers import WaiverSet
from exports.drive_partner_export import DriveRosterExport
from exports.winery_export import WineryRosterExport
from director.dashboard import DirectorDashboard

HERE = Path(__file__).parent


def load_event_config(path: Path) -> dict[str, Any]:
    with path.open() as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Minimal registration data object
# ---------------------------------------------------------------------------

@dataclass
class Registration:
    athlete_id: str
    bib_number: str
    first_name: str
    last_name: str
    dob: date
    registration_date: date

    # Add-on flags
    opted_into_drive: bool = False
    opted_into_tasting: bool = False

    # Drive fields
    selected_vehicle_id: str = ""
    vehicle_display_name: str = ""
    vehicle_year: int = 0
    vehicle_model: str = ""
    vehicle_rental_price_usd: int = 0
    drivers_license_number: str = ""
    drivers_license_state: str = ""
    insurance_carrier: str = ""
    insurance_policy_number: str = ""
    driver_waiver_signed_at: str = ""

    # Tasting fields
    age_21_attestation_signed_at: str = ""

    # Pricing
    base_price_paid: Decimal = field(default_factory=lambda: Decimal("0"))
    drive_price_paid: Decimal = field(default_factory=lambda: Decimal("0"))
    tasting_price_paid: Decimal = field(default_factory=lambda: Decimal("0"))
    comp_discount_applied: Decimal = field(default_factory=lambda: Decimal("0"))


def make_registration(
    athlete_id: str,
    bib: str,
    first: str,
    last: str,
    dob: date,
    reg_date: date,
    data: dict[str, Any],
    inventory: VehicleInventory,
    calculator: PriceCalculator,
    waiver_set: WaiverSet,
    event_config: dict[str, Any],
) -> Registration:
    opted_drive = bool(data.get("opted_into_drive"))
    opted_tasting = bool(data.get("opted_into_tasting"))

    reg = Registration(
        athlete_id=athlete_id,
        bib_number=bib,
        first_name=first,
        last_name=last,
        dob=dob,
        registration_date=reg_date,
        opted_into_drive=opted_drive,
        opted_into_tasting=opted_tasting,
    )

    if opted_drive:
        vid = data.get("selected_vehicle_id", "")
        vehicle = inventory.get(vid)
        reg.selected_vehicle_id = vid
        reg.vehicle_display_name = vehicle.display_name
        reg.vehicle_year = vehicle.year
        reg.vehicle_model = vehicle.model
        reg.vehicle_rental_price_usd = vehicle.rental_price_usd
        reg.drivers_license_number = data.get("drivers_license_number", "")
        reg.drivers_license_state = data.get("drivers_license_state", "")
        reg.insurance_carrier = data.get("insurance_carrier", "")
        reg.insurance_policy_number = data.get("insurance_policy_number", "")
        reg.driver_waiver_signed_at = datetime.now().isoformat()
        reg.drive_price_paid = Decimal(str(vehicle.rental_price_usd))

    if opted_tasting:
        reg.age_21_attestation_signed_at = datetime.now().isoformat()
        reg.tasting_price_paid = calculator.add_on_price("wine_tasting", data)

    reg.base_price_paid = calculator.base_price(
        reg_date, date.fromisoformat(event_config["race_date"])
    )

    return reg


def main() -> None:
    event_config = load_event_config(HERE / "event_config.json")
    inventory_path = HERE / "vehicle_inventory.json"

    engine = RulesEngine.load()
    base_rules = engine.for_division(event_config["division"])
    rules = base_rules.with_event_overrides(event_config["rule_overrides"])

    display = rules.display
    print(f"\nDivision   : {rules.display_name}")
    print(f"Accent     : {display.get('accent', '?')}")
    print(f"Copy bank  : {display.get('copy_bank', '?')}")
    print(f"Tagline    : {display.get('tagline', '?')}\n")

    inventory = VehicleInventory(inventory_path)
    calculator = PriceCalculator(rules, event_config)

    print("Vehicle inventory:")
    for v in inventory.all_vehicles():
        print(f"  {v.display_name}  ${v.rental_price_usd}  — {v.tagline}")
    print()

    # ---------------------------------------------------------------------------
    # Simulate 4 registrations
    # ---------------------------------------------------------------------------
    registrations: list[Registration] = []
    selector = VehicleSelector(inventory, registrations)

    reg_date_early = date(2026, 7, 1)   # early bird (>12 weeks before Oct 4)
    reg_date_regular = date(2026, 8, 15) # regular tier

    def _base(first: str, last: str, dob: date, email: str) -> dict[str, Any]:
        return {
            "first_name": first,
            "last_name": last,
            "date_of_birth": dob,
            "email": email,
            "shirt_size": "M",
            "emergency_contact_name": "Emergency Contact",
            "emergency_contact_phone": "555-000-0000",
            "waiver_v7": True,
        }

    athletes = [
        {
            "athlete_id": "A001", "bib": "001",
            "first": "Jordan", "last": "Rivera",
            "dob": date(1988, 3, 15), "reg_date": reg_date_early,
            "data": {
                **_base("Jordan", "Rivera", date(1988, 3, 15), "jordan@example.com"),
                "opted_into_drive": True,
                "opted_into_tasting": True,
                "selected_vehicle_id": "v1_911_carrera_rs_1973",
                "drivers_license_number": "R1234567",
                "drivers_license_state": "CA",
                "insurance_carrier": "State Farm",
                "insurance_policy_number": "SF-99012",
                "age_21_attestation": True,
            },
        },
        {
            "athlete_id": "A002", "bib": "002",
            "first": "Sam", "last": "Chen",
            "dob": date(1992, 9, 22), "reg_date": reg_date_early,
            "data": {
                **_base("Sam", "Chen", date(1992, 9, 22), "sam@example.com"),
                "opted_into_drive": True,
                "opted_into_tasting": False,
                "selected_vehicle_id": "v2_356_speedster_1958",
                "drivers_license_number": "C7654321",
                "drivers_license_state": "TX",
                "insurance_carrier": "Geico",
                "insurance_policy_number": "GC-44521",
            },
        },
        {
            "athlete_id": "A003", "bib": "003",
            "first": "Alex", "last": "Patel",
            "dob": date(1985, 12, 1), "reg_date": reg_date_regular,
            "data": {
                **_base("Alex", "Patel", date(1985, 12, 1), "alex@example.com"),
                "opted_into_drive": True,
                "opted_into_tasting": True,
                "selected_vehicle_id": "v3_944_turbo_1986",
                "drivers_license_number": "P2223334",
                "drivers_license_state": "NY",
                "insurance_carrier": "Allstate",
                "insurance_policy_number": "AL-77831",
                "age_21_attestation": True,
            },
        },
        {
            "athlete_id": "A004", "bib": "004",
            "first": "Morgan", "last": "Lee",
            "dob": date(1999, 6, 10), "reg_date": reg_date_regular,
            "data": {
                **_base("Morgan", "Lee", date(1999, 6, 10), "morgan@example.com"),
                "opted_into_drive": False,
                "opted_into_tasting": True,
                "age_21_attestation": True,
            },
        },
    ]

    form = RegistrationForm(rules, event_config)

    for a in athletes:
        data = dict(a["data"])
        data["dob"] = a["dob"]

        waiver_set = WaiverSet(
            event_config,
            opted_into_drive=data.get("opted_into_drive", False),
            opted_into_tasting=data.get("opted_into_tasting", False),
        )
        result = form.validate(data, selector=selector)
        if not result.valid:
            print(f"[VALIDATION ERRORS] {a['first']} {a['last']}: {result.errors}")
            continue

        reg = make_registration(
            athlete_id=a["athlete_id"],
            bib=a["bib"],
            first=a["first"],
            last=a["last"],
            dob=a["dob"],
            reg_date=a["reg_date"],
            data=data,
            inventory=inventory,
            calculator=calculator,
            waiver_set=waiver_set,
            event_config=event_config,
        )

        if data.get("opted_into_drive"):
            selector.reserve(data["selected_vehicle_id"], a["athlete_id"])

        registrations.append(reg)
        total = reg.base_price_paid + reg.drive_price_paid + reg.tasting_price_paid
        print(
            f"Registered {reg.first_name} {reg.last_name}  bib={reg.bib_number}"
            f"  total=${total:.2f}"
            + (f"  car={reg.vehicle_display_name}" if reg.opted_into_drive else "")
        )

    # ---------------------------------------------------------------------------
    # Exports
    # ---------------------------------------------------------------------------
    exports_dir = HERE / "exports_output"
    drive_path = exports_dir / "drive_roster.csv"
    winery_path = exports_dir / "winery_roster.csv"

    drive_count = DriveRosterExport(registrations).to_csv(drive_path)
    winery_count = WineryRosterExport(registrations).to_csv(winery_path)

    print(f"\nExports written:")
    print(f"  {drive_path}  ({drive_count} rows)")
    print(f"  {winery_path}  ({winery_count} rows)")

    # ---------------------------------------------------------------------------
    # Director dashboard
    # ---------------------------------------------------------------------------
    DirectorDashboard(registrations, event_config).print_summary()


if __name__ == "__main__":
    main()
