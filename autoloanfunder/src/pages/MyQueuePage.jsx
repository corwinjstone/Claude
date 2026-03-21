import { useState } from "react";
import { Link } from "react-router-dom";
import { mockQueue } from "../data/mockQueue";
import StatusBadge from "../components/ui/StatusBadge";
import { ChevronUp, ChevronDown } from "lucide-react";

const statusOrder = { "Pending Stips": 0, "Ready to Fund": 1, Returned: 2 };

export default function MyQueuePage() {
  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState("submittedAt");
  const [sortDir, setSortDir] = useState("desc");

  const statuses = ["All", "Pending Stips", "Ready to Fund", "Returned"];

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = mockQueue
    .filter((a) => filter === "All" || a.status === filter)
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "status") { va = statusOrder[va]; vb = statusOrder[vb]; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  function fmt(n) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
  }

  function SortIcon({ col }) {
    if (sortKey !== col) return <ChevronUp size={10} className="text-[#b5b5b5]" />;
    return sortDir === "asc"
      ? <ChevronUp size={10} className="text-[#00132b]" />
      : <ChevronDown size={10} className="text-[#00132b]" />;
  }

  const cols = [
    { key: "id", label: "App ID" },
    { key: "applicant", label: "Applicant" },
    { key: "dealership", label: "Dealership" },
    { key: "vehicle", label: "Vehicle" },
    { key: "amountFinanced", label: "Amount" },
    { key: "fico", label: "FICO" },
    { key: "status", label: "Status" },
    { key: "submittedAt", label: "Submitted" },
  ];

  return (
    <div className="p-6 max-w-[1440px] mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
          My Queue
        </h1>
        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-[#e9e9e9]">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-md font-bold transition-colors ${
                filter === s ? "bg-white text-[#00132b] shadow-sm" : "text-[#525252] hover:text-[#00132b]"
              }`}
              style={{ fontFamily: '"Optimist", sans-serif' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e9e9e9] overflow-hidden">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-xs text-[#525252]" style={{ borderBottom: "1px solid #e9e9e9" }}>
              {cols.map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-[#00132b] select-none"
                  style={{ fontFamily: '"Optimist", sans-serif' }}
                  onClick={() => handleSort(key)}
                >
                  <span className="flex items-center gap-1">
                    {label} <SortIcon col={key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-[#f7f3eb] transition-colors"
                style={{ borderBottom: "1px solid #f7f3eb" }}
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/applications/${app.id}`}
                    className="text-[#16597a] hover:underline font-semibold text-xs"
                    style={{ fontFamily: '"Optimist", sans-serif' }}
                  >
                    {app.id}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-[#00132b] font-semibold" style={{ fontFamily: '"Optimist", sans-serif' }}>
                    {app.applicant}
                  </div>
                  {app.coBuyer && (
                    <div className="text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                      + {app.coBuyer}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {app.dealership}
                </td>
                <td className="px-4 py-3 text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {app.vehicle}
                </td>
                <td className="px-4 py-3 text-xs text-[#00132b] font-semibold" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {fmt(app.amountFinanced)}
                </td>
                <td className="px-4 py-3 text-xs text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {app.fico}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} size="sm" />
                </td>
                <td className="px-4 py-3 text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {new Date(app.submittedAt).toLocaleString("en-US", {
                    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
