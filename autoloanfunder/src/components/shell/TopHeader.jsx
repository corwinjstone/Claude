import { useLocation, Link } from "react-router-dom";
import { Bell, Search, ChevronRight } from "lucide-react";

const routeLabels = {
  "": "Home",
  dashboard: "Dashboard",
  queue: "My Queue",
  applications: "All Applications",
  dealerships: "Dealerships",
  settings: "Settings",
};

function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = [{ label: "Home", to: "/" }];
  let path = "";
  for (const part of parts) {
    path += `/${part}`;
    crumbs.push({ label: routeLabels[part] ?? part, to: path });
  }

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={crumb.to} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} className="text-[#b5b5b5]" />}
          {i === crumbs.length - 1 ? (
            <span className="text-[#00132b] font-semibold" style={{ fontFamily: '"Optimist", sans-serif', fontWeight: 700 }}>
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.to}
              className="text-[#525252] hover:text-[#16597a] transition-colors"
              style={{ fontFamily: '"Optimist", sans-serif' }}
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function TopHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 z-20 bg-white flex items-center px-4 gap-4"
      style={{ borderBottom: "1px solid #e9e9e9" }}
    >
      {/* Breadcrumb — left */}
      <div className="flex-shrink-0 min-w-0 hidden ph:block">
        <Breadcrumb />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Global search — center/right */}
      <div className="relative w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b5b5b5] pointer-events-none" />
        <input
          type="search"
          placeholder="Search by name, VIN, App ID, dealership…"
          className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-[#e9e9e9] bg-[#fcf9f4] text-[#00132b] placeholder-[#b5b5b5] outline-none focus:border-[#00132b] focus:ring-1 focus:ring-[#00132b] transition-colors"
          style={{ fontFamily: '"Optimist", sans-serif' }}
        />
      </div>

      {/* Notifications */}
      <button
        className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f7f3eb] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-[#00132b]" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#bf5347]" />
      </button>

      {/* Profile avatar */}
      <button
        className="flex-shrink-0 w-9 h-9 rounded-full bg-[#00132b] flex items-center justify-center hover:bg-[#013d5b] transition-colors"
        aria-label="Profile"
      >
        <span className="text-white text-xs font-bold" style={{ fontFamily: '"Optimist", sans-serif' }}>
          JM
        </span>
      </button>
    </header>
  );
}
