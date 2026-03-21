import { useState } from "react";
import DatePicker from "react-datepicker";
import { MapPin, Calendar } from "lucide-react";
import Button from "../ui/Button";
import TravelerSelector from "./TravelerSelector";

export default function HotelSearch() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Destination */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Destination</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City, hotel, or area"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Check-in</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              placeholderText="Add date"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Check-out</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              placeholderText="Add date"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        {/* Guests */}
        <TravelerSelector label="Guests" />
      </div>

      <Button variant="primary" size="lg" className="w-full sm:w-auto">
        Search Hotels
      </Button>
    </div>
  );
}
