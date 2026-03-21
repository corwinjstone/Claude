import { mockApplication } from "../../data/mockApp";

function formatTime(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

const actorColor = {
  System: "bg-[#e9e9e9] text-[#525252]",
  "AI Engine": "bg-[#d6e8ea] text-[#013d5b]",
};

export default function DecisionLog() {
  const log = mockApplication.decisionLog;
  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
        Showing all activity for {mockApplication.id}
      </p>
      <ol className="relative border-l-2 border-[#e9e9e9] ml-2 flex flex-col gap-5">
        {log.map((entry) => (
          <li key={entry.id} className="ml-4">
            {/* Dot */}
            <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-white border-2 border-[#00132b] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00132b]" />
            </span>
            <div>
              <p className="text-xs text-[#b5b5b5] mb-0.5" style={{ fontFamily: '"Optimist", sans-serif' }}>
                {formatTime(entry.timestamp)}
              </p>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mb-1 ${
                  actorColor[entry.actor] ?? "bg-[#f7f3eb] text-[#00132b]"
                }`}
                style={{ fontFamily: '"Optimist", sans-serif' }}
              >
                {entry.actor}
              </span>
              <p className="text-sm text-[#00132b] leading-snug" style={{ fontFamily: '"Optimist", sans-serif' }}>
                {entry.action}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
