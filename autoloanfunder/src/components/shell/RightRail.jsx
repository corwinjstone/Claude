import { FileText, Calculator, MessageSquare, ClipboardList, X } from "lucide-react";
import clsx from "clsx";
import DocumentViewer from "../drawers/DocumentViewer";
import AmortizationCalc from "../drawers/AmortizationCalc";
import DealerChat from "../drawers/DealerChat";
import DecisionLog from "../drawers/DecisionLog";

const tools = [
  { id: "documents",    icon: FileText,        label: "Documents",    Component: DocumentViewer },
  { id: "calculator",   icon: Calculator,      label: "Calculator",   Component: AmortizationCalc },
  { id: "chat",         icon: MessageSquare,   label: "Dealer Chat",  Component: DealerChat },
  { id: "log",          icon: ClipboardList,   label: "Decision Log", Component: DecisionLog },
];

export default function RightRail({ activeDrawer, onDrawerToggle }) {
  const active = tools.find((t) => t.id === activeDrawer);

  return (
    <>
      {/* 48px icon strip */}
      <aside
        className="fixed top-14 right-0 bottom-0 w-12 z-10 bg-white flex flex-col items-center py-3 gap-1"
        style={{ borderLeft: "1px solid #e9e9e9" }}
      >
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onDrawerToggle(id)}
            title={label}
            aria-label={label}
            className={clsx(
              "w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
              activeDrawer === id
                ? "bg-[#00132b] text-white"
                : "text-[#525252] hover:bg-[#f7f3eb] hover:text-[#00132b]"
            )}
          >
            <Icon size={17} />
          </button>
        ))}
      </aside>

      {/* Slide-out drawer */}
      <div
        className={clsx(
          "fixed top-14 bottom-0 z-20 bg-white flex flex-col transition-transform duration-300",
          activeDrawer ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          right: 48,
          width: 380,
          boxShadow: "-4px 0 20px rgba(0,0,0,0.12)",
          borderLeft: "1px solid #e9e9e9",
        }}
      >
        {active && (
          <>
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-4 h-12 flex-shrink-0"
              style={{ borderBottom: "1px solid #e9e9e9" }}
            >
              <span className="text-sm font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                {active.label}
              </span>
              <button
                onClick={() => onDrawerToggle(null)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#525252] hover:bg-[#f7f3eb] hover:text-[#00132b] transition-colors"
                aria-label="Close drawer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto">
              <active.Component />
            </div>
          </>
        )}
      </div>
    </>
  );
}
