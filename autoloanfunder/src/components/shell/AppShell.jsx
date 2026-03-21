import { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftNav from "./LeftNav";
import TopHeader from "./TopHeader";
import RightRail from "./RightRail";

export default function AppShell() {
  const [navExpanded, setNavExpanded] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null);

  function handleDrawerToggle(id) {
    setActiveDrawer((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f3eb]">
      {/* Left navigation */}
      <LeftNav expanded={navExpanded} onToggle={() => setNavExpanded((v) => !v)} />

      {/* Right side: header + content + right rail */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top header (fixed, spans full width) */}
        <TopHeader />

        {/* Main content area — offset for header (56px) and right rail (48px) */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ marginTop: 56, marginRight: 48 }}
        >
          <Outlet />
        </main>
      </div>

      {/* Right rail + drawers */}
      <RightRail activeDrawer={activeDrawer} onDrawerToggle={handleDrawerToggle} />
    </div>
  );
}
