import { Header } from "@/components/Header";
import { currentUser, listBetsForUser } from "@/lib/store";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

export default function WalletPage() {
  const me = currentUser();
  const bets = listBetsForUser(me.id);
  const resolved = bets.filter((b) => b.status === "resolved");
  const wins = resolved.filter((b) => {
    const myPos = b.positions.find((p) => p.userId === me.id);
    return myPos && b.resolution?.winningSide === myPos.side;
  }).length;
  const losses = resolved.length - wins;

  return (
    <main className="max-w-md md:max-w-2xl mx-auto pb-12">
      <Header showBack />
      <section className="px-6 mt-3 text-center">
        <Wallet className="w-7 h-7 text-white/80 mx-auto" />
        <div className="text-sm text-white/70 mt-1">Wallet balance</div>
        <div className="text-6xl font-light tabular-nums mt-1">${me.walletUsd.toFixed(2)}</div>
      </section>

      <section className="px-4 mt-6 grid grid-cols-2 gap-3">
        <div className="card p-4 text-center">
          <ArrowDownLeft className="w-5 h-5 mx-auto text-accent" />
          <div className="text-2xl mt-1 tabular-nums">{wins}</div>
          <div className="text-xs text-white/60">Wins</div>
        </div>
        <div className="card p-4 text-center">
          <ArrowUpRight className="w-5 h-5 mx-auto text-lose" />
          <div className="text-2xl mt-1 tabular-nums">{losses}</div>
          <div className="text-xs text-white/60">Losses</div>
        </div>
      </section>

      <section className="px-4 mt-6">
        <button className="w-full bg-accent text-surface font-medium py-3 rounded-xl">
          Add funds
        </button>
        <button className="w-full mt-2 bg-white/5 border border-white/15 py-3 rounded-xl">
          Withdraw
        </button>
      </section>
    </main>
  );
}
