import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Files,
  Building2,
  Settings,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/queue", icon: ListChecks, label: "My Queue" },
  { to: "/applications", icon: Files, label: "All Applications" },
  { to: "/dealerships", icon: Building2, label: "Dealerships" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function LeftNav({ expanded, onToggle }) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 h-full bg-[#00132b] transition-all duration-300 overflow-hidden"
      style={{ width: expanded ? 240 : 64 }}
    >
      {/* Logo area */}
      <div
        className="flex items-center h-14 border-b flex-shrink-0 px-4"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm" style={{ fontFamily: '"Optimist", sans-serif' }}>
            AL
          </span>
        </div>
        {expanded && (
          <span
            className="ml-3 text-white text-sm font-bold whitespace-nowrap overflow-hidden"
            style={{ fontFamily: '"Optimist", sans-serif' }}
          >
            Auto Loan Funder
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 overflow-hidden">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap overflow-hidden",
                isActive
                  ? "bg-white/15 text-white border-l-2 border-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )
            }
            style={{ fontFamily: '"Optimist", sans-serif', fontWeight: 700 }}
          >
            <Icon size={18} className="flex-shrink-0" />
            {expanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t text-white/50 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
        aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
      >
        <ChevronRight
          size={16}
          className={clsx("transition-transform duration-300", expanded && "rotate-180")}
        />
      </button>
    </aside>
  );
}
