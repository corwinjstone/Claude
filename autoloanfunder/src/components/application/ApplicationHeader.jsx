import { Building2, Clock } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function ApplicationHeader({ app }) {
  return (
    <div
      className="bg-white px-6 py-4 flex flex-wrap items-start gap-4 justify-between"
      style={{ borderBottom: "1px solid #e9e9e9" }}
    >
      {/* Left: title + meta */}
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1
            className="text-xl font-bold text-[#00132b] leading-tight"
            style={{ fontFamily: '"Optimist", sans-serif' }}
          >
            {app.id}: {app.customer.primary.lastName}, {app.customer.primary.firstName}
          </h1>
          <StatusBadge status={app.status} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#525252]">
          <span className="flex items-center gap-1.5" style={{ fontFamily: '"Optimist", sans-serif' }}>
            <Building2 size={12} className="text-[#b5b5b5]" />
            {app.dealership.name} · {app.dealership.city}
          </span>
          <span className="flex items-center gap-1.5" style={{ fontFamily: '"Optimist", sans-serif' }}>
            <Clock size={12} className="text-[#b5b5b5]" />
            Submitted {formatDate(app.submittedAt)}
          </span>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="px-4 py-2 text-sm rounded-md border border-[#00132b] text-[#00132b] hover:bg-[#00132b] hover:text-white transition-colors font-bold"
          style={{ fontFamily: '"Optimist", sans-serif' }}
        >
          Return to Dealer
        </button>
        <button
          className="px-4 py-2 text-sm rounded-md bg-[#7a9a01] text-white hover:bg-[#6a8800] transition-colors font-bold"
          style={{ fontFamily: '"Optimist", sans-serif' }}
        >
          Authorize Funding
        </button>
      </div>
    </div>
  );
}
