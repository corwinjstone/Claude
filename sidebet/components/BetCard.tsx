import Link from "next/link";
import type { Bet } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { AvatarStack } from "./AvatarStack";

export function BetCard({ bet }: { bet: Bet }) {
  const subline =
    bet.status === "resolved"
      ? bet.resolution?.winningSide === "a"
        ? `Congratulations, you won!`
        : bet.resolution?.rationale ?? "Resolved"
      : bet.description ??
        (bet.spread ? `${bet.sideA.label} -${bet.spread}` : "To win outright");

  const userIds = Array.from(new Set(bet.positions.map((p) => p.userId)));

  return (
    <Link
      href={`/bet/${bet.id}`}
      className="card-elevated p-4 flex items-center gap-4 hover:bg-elevated/80 transition active:scale-[0.99]"
    >
      <StatusBadge status={bet.status} visibility={bet.visibility} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="text-3xl leading-none">{bet.sideA.emoji ?? bet.sideA.logo ?? "🎲"}</div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-white truncate">{bet.title}</div>
            <div
              className={`text-sm truncate ${
                bet.status === "resolved" ? "text-accent" : "text-white/65"
              }`}
            >
              {subline}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <AvatarStack userIds={userIds} />
        <div className="text-white/80 text-sm whitespace-nowrap">
          {bet.positions.length} {bet.positions.length === 1 ? "bet" : "bets"}
        </div>
      </div>
    </Link>
  );
}
