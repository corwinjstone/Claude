import { useState } from "react";
import DatePicker from "react-datepicker";
import { MapPin, Calendar } from "lucide-react";
import Button from "../ui/Button";

export default function CarSearch() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [sameDropoff, setSameDropoff] = useState(true);
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Pick-up Location</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Airport, city, or address"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Pick-up Date</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            <DatePicker
              selected={pickupDate}
              onChange={(date) => setPickupDate(date)}
              minDate={new Date()}
              placeholderText="Select date"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Return Date</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            <DatePicker
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              minDate={pickupDate || new Date()}
              placeholderText="Select date"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="sameDropoff"
          checked={sameDropoff}
          onChange={(e) => setSameDropoff(e.target.checked)}
          className="accent-brand-blue"
        />
        <label htmlFor="sameDropoff" className="text-sm text-gray-600">Return to same location</label>
      </div>

      {!sameDropoff && (
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Drop-off Location</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              placeholder="Airport, city, or address"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>
      )}

      <Button variant="primary" size="lg" className="w-full sm:w-auto">
        Search Cars
      </Button>
    </div>
  );
}
