import { useState } from "react";
import SearchTabs from "./SearchTabs";
import FlightSearch from "./FlightSearch";
import HotelSearch from "./HotelSearch";
import PackageSearch from "./PackageSearch";
import CarSearch from "./CarSearch";

const panels = {
  flights: FlightSearch,
  hotels: HotelSearch,
  packages: PackageSearch,
  cars: CarSearch,
};

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState("flights");
  const Panel = panels[activeTab];

  return (
    <div className="w-full max-w-4xl mx-4 bg-white rounded-widget shadow-widget overflow-hidden">
      <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <Panel />
    </div>
  );
}
