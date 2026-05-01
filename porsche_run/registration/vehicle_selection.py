"""Vehicle inventory and exclusive reservation for the Porsche drive add-on.

Each vehicle in the inventory can be reserved by exactly one registrant
(capacity_model = exclusive_per_vehicle).  VehicleSelector is the single
owner of availability state; all other modules read through it.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


class UnknownVehicle(KeyError):
    pass


class VehicleAlreadyReserved(Exception):
    def __init__(self, vehicle_id: str):
        super().__init__(f"Vehicle {vehicle_id!r} is already reserved")
        self.vehicle_id = vehicle_id


@dataclass(frozen=True)
class Vehicle:
    id: str
    display_name: str
    year: int
    model: str
    rental_price_usd: int
    tagline: str
    description: str
    specs: dict[str, Any]
    images: list[str]

    def gallery_payload(self) -> dict[str, Any]:
        """Shape consumed by the vehicle picker UI."""
        return {
            "id": self.id,
            "display_name": self.display_name,
            "year": self.year,
            "model": self.model,
            "rental_price_usd": self.rental_price_usd,
            "tagline": self.tagline,
            "description": self.description,
            "specs": self.specs,
            "images": self.images,
        }


@dataclass
class Reservation:
    vehicle_id: str
    athlete_id: str


class VehicleInventory:
    def __init__(self, inventory_path: Path):
        with inventory_path.open() as f:
            data = json.load(f)
        self._vehicles: dict[str, Vehicle] = {}
        for v in data["vehicles"]:
            vehicle = Vehicle(
                id=v["id"],
                display_name=v["display_name"],
                year=v["year"],
                model=v["model"],
                rental_price_usd=v["rental_price_usd"],
                tagline=v["tagline"],
                description=v["description"],
                specs=v.get("specs", {}),
                images=v.get("images", []),
            )
            self._vehicles[vehicle.id] = vehicle

    def all_vehicles(self) -> list[Vehicle]:
        return list(self._vehicles.values())

    def get(self, vehicle_id: str) -> Vehicle:
        try:
            return self._vehicles[vehicle_id]
        except KeyError:
            raise UnknownVehicle(vehicle_id) from None

    def available(self, reserved_ids: set[str]) -> list[Vehicle]:
        return [v for v in self._vehicles.values() if v.id not in reserved_ids]


class VehicleSelector:
    def __init__(self, inventory: VehicleInventory, registrations: list[Any]):
        self._inventory = inventory
        self._reservations: dict[str, str] = {}  # vehicle_id → athlete_id
        for reg in registrations:
            vid = getattr(reg, "selected_vehicle_id", None)
            if vid and getattr(reg, "opted_into_drive", False):
                self._reservations[vid] = getattr(reg, "athlete_id", "")

    def reserved_vehicle_ids(self) -> set[str]:
        return set(self._reservations.keys())

    def is_available(self, vehicle_id: str) -> bool:
        self._inventory.get(vehicle_id)  # raises UnknownVehicle if bad id
        return vehicle_id not in self._reservations

    def reserve(self, vehicle_id: str, athlete_id: str) -> Reservation:
        if not self.is_available(vehicle_id):
            raise VehicleAlreadyReserved(vehicle_id)
        self._reservations[vehicle_id] = athlete_id
        return Reservation(vehicle_id=vehicle_id, athlete_id=athlete_id)

    def release(self, vehicle_id: str) -> None:
        self._reservations.pop(vehicle_id, None)

    def available_vehicles(self) -> list[Vehicle]:
        return self._inventory.available(self.reserved_vehicle_ids())
