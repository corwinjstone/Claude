import { Header } from "@/components/Header";
import { BetCard } from "@/components/BetCard";
import { currentUser, listPublicMarketplace } from "@/lib/store";
import { TrendingUp } from "lucide-react";

export default function DiscoverPage() {
  const me = currentUser();
  const bets = listPublicMarketplace();
  return (
    <main className="max-w-md md:max-w-2xl mx-auto pb-28">
      <Header showBack walletAmount={me.walletUsd} />
      <section className="px-5 mt-2">
        <h1 className="text-3xl font-semibold">Find a Sidebet</h1>
        <p className="text-white/65 text-sm mt-1">Public bets from the community. Copy any one for you and your friends, or take a solo position.</p>
      </section>

      <section className="px-5 mt-5 flex items-center gap-2 text-xs text-white/70">
        <TrendingUp className="w-4 h-4 text-accent" /> Trending now
      </section>

      <section className="px-4 mt-3 flex flex-col gap-3">
        {bets.length === 0 && (
          <div className="card p-6 text-center text-white/65">
            Nothing public yet. Be the first — flip a bet to public from its detail page.
          </div>
        )}
        {bets.map((b) => (
          <BetCard key={b.id} bet={b} />
        ))}
      </section>
    </main>
  );
}
