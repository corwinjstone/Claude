import { useState } from "react";
import DatePicker from "react-datepicker";
import { PlaneTakeoff, PlaneLanding, Calendar } from "lucide-react";
import Button from "../ui/Button";
import TravelerSelector from "./TravelerSelector";

export default function FlightSearch() {
  const [tripType, setTripType] = useState("roundtrip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [cabinClass, setCabinClass] = useState("economy");

  return (
    <div className="p-4 md:p-6">
      {/* Trip type */}
      <div className="flex gap-4 mb-4">
        {[["roundtrip", "Round Trip"], ["oneway", "One Way"], ["multicity", "Multi-City"]].map(([val, lbl]) => (
          <label key={val} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value={val}
              checked={tripType === val}
              onChange={() => setTripType(val)}
              className="accent-brand-blue"
            />
            <span className="text-sm text-gray-700">{lbl}</span>
          </label>
        ))}
      </div>

      {/* Search fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        {/* Origin */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">From</label>
          <div className="relative">
            <PlaneTakeoff size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="City or airport"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">To</label>
          <div className="relative">
            <PlaneLanding size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City or airport"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Cabin Class */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Cabin Class</label>
          <select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
          >
            <option value="economy">Economy</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {/* Depart date */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Depart</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Select date"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        {/* Return date */}
        {tripType === "roundtrip" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Return</label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="Select date"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        )}

        {/* Travelers */}
        <TravelerSelector label="Travelers" />
      </div>

      <Button variant="primary" size="lg" className="w-full sm:w-auto">
        Search Flights
      </Button>
    </div>
  );
}
