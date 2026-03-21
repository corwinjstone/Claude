import clsx from "clsx";
import { Plane, Hotel, Package, Car } from "lucide-react";

const tabs = [
  { id: "flights", label: "Flights", Icon: Plane },
  { id: "hotels", label: "Hotels", Icon: Hotel },
  { id: "packages", label: "Packages", Icon: Package },
  { id: "cars", label: "Rental Cars", Icon: Car },
];

export default function SearchTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-200 overflow-x-auto" role="tablist">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(id)}
            className={clsx(
              "flex items-center gap-2 px-4 md:px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px",
              isActive
                ? "text-brand-blue border-brand-coral font-semibold"
                : "text-gray-500 border-transparent hover:text-brand-blue hover:border-gray-300"
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
