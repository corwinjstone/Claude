import { Sparkles } from "lucide-react";

function SummaryCard({ title, text, timestamp }) {
  return (
    <div className="rounded-lg border border-[#e9e9e9] overflow-hidden">
      <div
        className="flex items-center gap-2 px-4 py-2.5 bg-[#f7f3eb]"
        style={{ borderBottom: "1px solid #e9e9e9" }}
      >
        <Sparkles size={13} className="text-[#016d9b] flex-shrink-0" />
        <span
          className="text-xs font-bold text-[#00132b] flex-1"
          style={{ fontFamily: '"Optimist", sans-serif' }}
        >
          {title}
        </span>
        <span className="text-xs text-[#b5b5b5]" style={{ fontFamily: '"Optimist", sans-serif' }}>
          {timestamp}
        </span>
      </div>
      <div className="bg-white px-4 py-3">
        <p
          className="text-sm text-[#525252] leading-relaxed italic"
          style={{ fontFamily: '"Optimist", sans-serif' }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export default function AISummaries({ summaries }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
        AI Summaries
      </h2>
      <SummaryCard
        title="Document Analysis"
        text={summaries.documents}
        timestamp="9:15 AM"
      />
      <SummaryCard
        title="Deal Risk Narrative"
        text={summaries.deal}
        timestamp="9:15 AM"
      />
    </div>
  );
}
