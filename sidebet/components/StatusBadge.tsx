import { Lock, ShieldCheck, FileEdit, Globe2, CircleDot } from "lucide-react";
import type { BetStatus, BetVisibility } from "@/lib/types";

export function StatusBadge({
  status,
  visibility,
}: {
  status: BetStatus;
  visibility: BetVisibility;
}) {
  // Mirrors the icon family in the reference screens:
  //   resolved → green shield
  //   draft    → "Draft" green text
  //   private/open → green lock
  //   public   → globe
  if (status === "resolved") {
    return (
      <div className="w-9 h-11 bg-accent rounded-md flex items-center justify-center shadow-md">
        <ShieldCheck className="w-5 h-5 text-surface" strokeWidth={2.5} />
      </div>
    );
  }
  if (status === "draft") {
    return (
      <div className="flex flex-col items-center text-accent">
        <FileEdit className="w-5 h-5" strokeWidth={2} />
        <span className="text-xs font-semibold mt-0.5">Draft</span>
      </div>
    );
  }
  if (visibility === "public") {
    return (
      <div className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center">
        <Globe2 className="w-5 h-5 text-accent" strokeWidth={2} />
      </div>
    );
  }
  // private / open
  return (
    <div className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center">
      <Lock className="w-4 h-4 text-accent" strokeWidth={2.5} />
    </div>
  );
}

export function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-accent">
      <CircleDot className="w-3 h-3 animate-pulse" /> live
    </span>
  );
}
