import { FileText, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

const docs = [
  { id: 1, label: "Paystub — Jane Doe (Mar 2026)", pages: 1, flagged: false },
  { id: 2, label: "Insurance Binder", pages: 2, flagged: true },
  { id: 3, label: "Driver's License — Primary", pages: 1, flagged: false },
  { id: 4, label: "Driver's License — Co-Buyer", pages: 1, flagged: false },
  { id: 5, label: "GAP Enrollment Form", pages: 3, flagged: false },
  { id: 6, label: "Odometer Statement", pages: 1, flagged: false },
];

export default function DocumentViewer() {
  const [selected, setSelected] = useState(docs[0]);
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col h-full">
      {/* Document list */}
      <div className="p-3 border-b border-[#e9e9e9] flex flex-col gap-1">
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelected(doc)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors w-full ${
              selected.id === doc.id
                ? "bg-[#00132b] text-white"
                : "hover:bg-[#f7f3eb] text-[#00132b]"
            }`}
          >
            <FileText size={14} className="flex-shrink-0" />
            <span className="flex-1 text-xs truncate" style={{ fontFamily: '"Optimist", sans-serif' }}>
              {doc.label}
            </span>
            {doc.flagged && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold flex-shrink-0">
                Flagged
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Viewer controls */}
      <div
        className="flex items-center justify-between px-3 py-2 text-xs text-[#525252]"
        style={{ borderBottom: "1px solid #e9e9e9" }}
      >
        <span style={{ fontFamily: '"Optimist", sans-serif' }}>
          {selected.pages} page{selected.pages > 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f7f3eb] transition-colors"
          >
            <ZoomOut size={12} />
          </button>
          <span className="w-10 text-center" style={{ fontFamily: '"Optimist", sans-serif' }}>
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f7f3eb] transition-colors"
          >
            <ZoomIn size={12} />
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f7f3eb] transition-colors ml-1">
            <Download size={12} />
          </button>
        </div>
      </div>

      {/* Document placeholder */}
      <div className="flex-1 bg-[#525252]/10 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-card flex flex-col items-center justify-center gap-3 text-center p-8 w-full"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", minHeight: 280 }}
        >
          <FileText size={40} className="text-[#e9e9e9]" />
          <p className="text-sm font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
            {selected.label}
          </p>
          <p className="text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
            Document preview would render here
          </p>
          {selected.flagged && (
            <div className="mt-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800" style={{ fontFamily: '"Optimist", sans-serif' }}>
              AI flagged: Deductible exceeds $500 threshold
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
