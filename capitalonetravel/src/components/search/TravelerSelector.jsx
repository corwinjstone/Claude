import { useState, useRef, useEffect } from "react";
import { Users, ChevronDown, Plus, Minus } from "lucide-react";

export default function TravelerSelector({ label = "Travelers" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState({ adults: 1, children: 0, infants: 0 });
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const total = counts.adults + counts.children + counts.infants;

  function adjust(key, delta) {
    setCounts((prev) => {
      const next = prev[key] + delta;
      if (key === "adults" && next < 1) return prev;
      if (next < 0) return prev;
      return { ...prev, [key]: next };
    });
  }

  const categories = [
    { key: "adults", label: "Adults", sub: "Age 18+" },
    { key: "children", label: "Children", sub: "Age 2–17" },
    { key: "infants", label: "Infants", sub: "Under 2" },
  ];

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white hover:border-brand-blue transition-colors text-left"
      >
        <Users size={15} className="text-gray-400 flex-shrink-0" />
        <span className="flex-1">{total} {total === 1 ? "Traveler" : "Travelers"}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-widget z-20 p-4">
          {categories.map(({ key, label: catLabel, sub }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-800">{catLabel}</div>
                <div className="text-xs text-gray-500">{sub}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjust(key, -1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand-blue hover:text-brand-blue transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold w-4 text-center">{counts[key]}</span>
                <button
                  type="button"
                  onClick={() => adjust(key, 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand-blue hover:text-brand-blue transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 w-full bg-brand-blue text-white text-sm font-semibold rounded-full py-2 hover:bg-brand-blue-dark transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
