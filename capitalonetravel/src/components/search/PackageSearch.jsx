import { useState } from "react";
import DatePicker from "react-datepicker";
import { PlaneTakeoff, MapPin, Calendar } from "lucide-react";
import Button from "../ui/Button";
import TravelerSelector from "./TravelerSelector";

export default function PackageSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Flying From</label>
          <div className="relative">
            <PlaneTakeoff size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="City or airport"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Going To</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City or destination"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Depart</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
              placeholderText="Select date"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Return</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate || new Date()}
              placeholderText="Select date"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <TravelerSelector label="Travelers" />
      </div>

      <Button variant="primary" size="lg" className="w-full sm:w-auto">
        Search Packages
      </Button>
    </div>
  );
}
