import Link from "next/link";
import { currentUser, listBetsForUser } from "@/lib/store";
import { Header } from "@/components/Header";
import { BetCard } from "@/components/BetCard";
import { PlusCircle, ScrollText, ChevronRight } from "lucide-react";

export default function HomePage() {
  const me = currentUser();
  const myBets = listBetsForUser(me.id);

  return (
    <main className="max-w-md md:max-w-2xl mx-auto pb-24">
      <Header notifications={2} />

      {/* Action row */}
      <section className="mt-2 grid grid-cols-2 gap-3 px-6 py-5 border-y border-white/10">
        <Link href="/bet/new" className="icon-action">
          <PlusCircle className="w-9 h-9" strokeWidth={1.5} />
          <span className="text-base">Make a bet</span>
        </Link>
        <Link href="/discover" className="icon-action">
          <ScrollText className="w-9 h-9" strokeWidth={1.5} />
          <span className="text-base">Find a Sidebet</span>
        </Link>
      </section>

      {/* Wallet */}
      <Link href="/wallet" className="block px-6 py-6 border-b border-white/10">
        <div className="text-center text-white/85 text-base">Your wallet balance</div>
        <div className="flex items-center justify-between mt-1">
          <div className="w-6" />
          <div className="text-5xl font-light tracking-tight tabular-nums">
            ${me.walletUsd.toFixed(2)}
          </div>
          <ChevronRight className="w-6 h-6 text-white/80" />
        </div>
      </Link>

      {/* Current bets */}
      <section className="px-4 pt-5">
        <div className="px-2 mb-3 text-sm font-semibold tracking-wide">Current bets</div>
        <div className="flex flex-col gap-3">
          {myBets.length === 0 && (
            <div className="card p-6 text-center text-white/70">
              No bets yet. <Link className="text-accent underline" href="/bet/new">Make your first one</Link>.
            </div>
          )}
          {myBets.map((b) => (
            <BetCard key={b.id} bet={b} />
          ))}
        </div>
      </section>
    </main>
  );
}
