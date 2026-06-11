import { notFound } from "next/navigation";
import { getBet, currentUser, listFeed, getUser } from "@/lib/store";
import { Header } from "@/components/Header";
import { BetDetailClient } from "./BetDetailClient";

export default async function BetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bet = getBet(id);
  if (!bet) return notFound();
  const me = currentUser();
  const feed = listFeed();

  // My position (if any)
  const myPos = bet.positions.find((p) => p.userId === me.id);

  // Opposing positions (everyone not on my side, or all if I have no position)
  const opposing = myPos
    ? bet.positions.filter((p) => p.side !== myPos.side)
    : bet.positions;

  const oppData = opposing
    .map((p) => ({ user: getUser(p.userId)!, stake: p.stake, side: p.side }))
    .filter((x) => x.user);

  // Resolved view
  if (bet.status === "resolved") {
    const won = myPos && bet.resolution?.winningSide === myPos.side;
    const myCashWinnings = won
      ? bet.positions
          .filter((p) => p.side !== myPos!.side && p.stake.kind === "cash")
          .reduce((sum, p) => sum + (p.stake.amountUsd ?? 0), 0)
      : 0;
    const losers = bet.positions.filter((p) => p.side !== bet.resolution!.winningSide);
    return (
      <main className="max-w-md md:max-w-2xl mx-auto pb-28">
        <Header showBack walletAmount={me.walletUsd} />
        <section className="px-6 text-center mt-4">
          <div className="w-12 h-14 bg-accent rounded-md flex items-center justify-center mx-auto shadow-lg">
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="mt-5 text-lg text-white/90">
            Congratulations, <span className="font-semibold">{won ? "you have won" : "you didn't win this one"}</span>
          </div>
          {won && (
            <div className="mt-2 text-6xl font-light tabular-nums">${myCashWinnings.toFixed(2)}</div>
          )}
        </section>

        <section className="mt-6 px-4">
          <div className="card p-5">
            <div className="text-center text-white/70 text-sm">
              {new Date(bet.resolution!.resolvedAt).toLocaleDateString()} — <span className="font-semibold">Final</span>
            </div>
            <div className="mt-4 flex items-center justify-around">
              <div className="text-center">
                <div className="text-4xl">{bet.sideA.emoji ?? bet.sideA.logo ?? "🎲"}</div>
                <div className={`mt-2 text-lg font-semibold ${bet.resolution!.winningSide === "a" ? "text-accent" : "text-white/55"}`}>
                  {bet.sideA.label}
                </div>
                <div className={`text-xs ${bet.resolution!.winningSide === "a" ? "text-accent/80" : "text-white/45"}`}>
                  {bet.sideA.sublabel}
                </div>
              </div>
              <div className="w-16 h-9 bg-white/10 border border-white/20 rounded-full relative">
                <span
                  className={`absolute top-1 w-7 h-7 rounded-full bg-white ${
                    bet.resolution!.winningSide === "a" ? "left-1" : "left-8"
                  }`}
                />
              </div>
              <div className="text-center">
                <div className="text-4xl">{bet.sideB.emoji ?? bet.sideB.logo ?? "🎲"}</div>
                <div className={`mt-2 text-lg font-semibold ${bet.resolution!.winningSide === "b" ? "text-accent" : "text-white/55"}`}>
                  {bet.sideB.label}
                </div>
                <div className={`text-xs ${bet.resolution!.winningSide === "b" ? "text-accent/80" : "text-white/45"}`}>
                  {bet.sideB.sublabel}
                </div>
              </div>
            </div>

            {bet.resolution?.rationale && (
              <div className="mt-5 text-center text-sm text-white/80">{bet.resolution.rationale}</div>
            )}
          </div>

          {losers.length > 0 && (
            <div className="card p-5 mt-3">
              <div className="text-center text-white/70 mb-3">Losers</div>
              <div className="flex flex-col gap-3">
                {losers.map((p) => {
                  const u = getUser(p.userId)!;
                  return (
                    <div key={p.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={u.avatarUrl} alt={u.name} className="avatar" style={{ width: 36, height: 36 }} />
                        <span className="text-white">{u.name}</span>
                      </div>
                      <div className="px-4 py-1 rounded-md border border-accent text-accent text-sm">
                        {stakeLabel(p.stake)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <button className="cta-bar">Collect winnings and trashtalk</button>
      </main>
    );
  }

  return (
    <main className="max-w-md md:max-w-2xl mx-auto pb-28">
      <Header showBack walletAmount={me.walletUsd} />
      <BetDetailClient bet={bet} feed={feed} oppData={oppData as any} mySide={myPos?.side as "a" | "b" | undefined} />
    </main>
  );
}

function stakeLabel(stake: import("@/lib/types").Stake) {
  if (stake.kind === "cash") return `$${(stake.amountUsd ?? 0).toFixed(0)}`;
  if (stake.kind === "crypto") return stake.description ?? `$${(stake.amountUsd ?? 0).toFixed(0)} crypto`;
  return stake.description ?? stake.kind;
}
