import { mockQueue } from "../data/mockQueue";
import StatusBadge from "../components/ui/StatusBadge";
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "In My Queue",      value: 6,  icon: Clock,        color: "text-[#013d5b]",  bg: "bg-[#d6e8ea]" },
  { label: "Ready to Fund",    value: 3,  icon: CheckCircle2, color: "text-[#7a9a01]",  bg: "bg-green-50" },
  { label: "Pending Stips",    value: 2,  icon: AlertCircle,  color: "text-amber-600",  bg: "bg-amber-50" },
  { label: "Funded Today",     value: 8,  icon: TrendingUp,   color: "text-[#00132b]",  bg: "bg-[#f7f3eb]" },
];

export default function DashboardPage() {
  const recent = mockQueue.slice(0, 5);

  return (
    <div className="p-6 max-w-[1440px] mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
          Good morning, J. Martinez
        </h1>
        <p className="text-sm text-[#525252] mt-1" style={{ fontFamily: '"Optimist", sans-serif' }}>
          Here's your funding activity for today, March 21, 2026.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className={`rounded-lg border border-[#e9e9e9] p-4 flex items-center gap-4 bg-white`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                {value}
              </div>
              <div className="text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg border border-[#e9e9e9] overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid #e9e9e9" }}
        >
          <h2 className="text-sm font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
            Recent Applications
          </h2>
          <Link
            to="/queue"
            className="text-xs text-[#16597a] hover:underline"
            style={{ fontFamily: '"Optimist", sans-serif' }}
          >
            View all →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-[#525252]" style={{ borderBottom: "1px solid #e9e9e9" }}>
              {["App ID", "Applicant", "Dealership", "Vehicle", "Status"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((app) => (
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
                <td className="px-4 py-3 text-xs text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {app.applicant}
                </td>
                <td className="px-4 py-3 text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {app.dealership}
                </td>
                <td className="px-4 py-3 text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
                  {app.vehicle}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
