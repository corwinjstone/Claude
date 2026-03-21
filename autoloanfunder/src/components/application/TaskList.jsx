import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Circle } from "lucide-react";
import clsx from "clsx";

const statusConfig = {
  cleared:      { label: "Cleared",      icon: CheckCircle2, color: "text-[#7a9a01]",  bg: "bg-green-50 border-green-200",  badge: "bg-green-100 text-[#7a9a01]" },
  rejected:     { label: "Rejected",     icon: XCircle,      color: "text-[#bf5347]",  bg: "bg-red-50 border-red-200",      badge: "bg-red-100 text-[#bf5347]" },
  needs_review: { label: "Needs Review", icon: AlertCircle,  color: "text-amber-500",  bg: "bg-amber-50 border-amber-200",  badge: "bg-amber-100 text-amber-700" },
  pending:      { label: "Pending",      icon: Circle,       color: "text-[#b5b5b5]",  bg: "bg-white border-[#e9e9e9]",     badge: "bg-[#f7f3eb] text-[#525252]" },
};

const nextStatus = {
  pending: "cleared",
  cleared: "rejected",
  rejected: "needs_review",
  needs_review: "pending",
};

export default function TaskList({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);

  function setTaskStatus(id, status) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  const cleared = tasks.filter((t) => t.status === "cleared").length;
  const total = tasks.length;

  return (
    <div className="flex flex-col gap-3">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
          Stipulations
        </h2>
        <span className="text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
          {cleared} / {total} cleared
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-[#e9e9e9] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#7a9a01] transition-all duration-500"
          style={{ width: `${(cleared / total) * 100}%` }}
        />
      </div>

      {/* Task items */}
      <div className="flex flex-col gap-2 mt-1">
        {tasks.map((task) => {
          const cfg = statusConfig[task.status];
          const Icon = cfg.icon;
          return (
            <div
              key={task.id}
              className={clsx("flex items-center gap-3 px-3 py-3 rounded-lg border", cfg.bg)}
            >
              <Icon size={16} className={clsx("flex-shrink-0", cfg.color)} />
              <span
                className="flex-1 text-sm text-[#00132b] leading-snug"
                style={{ fontFamily: '"Optimist", sans-serif' }}
              >
                {task.label}
              </span>
              {/* Status buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {["cleared", "rejected", "needs_review", "pending"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setTaskStatus(task.id, s)}
                    title={statusConfig[s].label}
                    className={clsx(
                      "w-6 h-6 flex items-center justify-center rounded transition-all",
                      task.status === s
                        ? clsx(statusConfig[s].badge, "ring-1 ring-offset-1", {
                            "ring-[#7a9a01]": s === "cleared",
                            "ring-[#bf5347]": s === "rejected",
                            "ring-amber-500": s === "needs_review",
                            "ring-[#e9e9e9]": s === "pending",
                          })
                        : "hover:bg-[#f7f3eb] text-[#b5b5b5]"
                    )}
                  >
                    {(() => {
                      const I = statusConfig[s].icon;
                      return <I size={13} className={task.status === s ? statusConfig[s].color : undefined} />;
                    })()}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
