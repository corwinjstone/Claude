"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Bet, FeedItem, Stake, User } from "@/lib/types";
import { Lock, Globe2, Check, Plus, Minus, Sparkles, ChevronRight } from "lucide-react";
import { SideToggle } from "@/components/SideToggle";

type OppRow = { user: User; stake: Stake; side: "a" | "b" };

export function BetDetailClient({
  bet,
  feed,
  oppData,
  mySide,
}: {
  bet: Bet;
  feed: FeedItem[];
  oppData: OppRow[];
  mySide?: "a" | "b";
}) {
  const router = useRouter();
  const [side, setSide] = useState<"a" | "b">(mySide ?? "a");
  const [isPublic, setIsPublic] = useState(bet.visibility === "public");
  const [spread, setSpread] = useState<number>(bet.spread ?? 0);
  const [stakeAmount, setStakeAmount] = useState<number>(10);
  const [stakeKind, setStakeKind] = useState<Stake["kind"]>("cash");
  const [stakeDesc, setStakeDesc] = useState("");
  const [isPending, startTransition] = useTransition();

  const [odds, setOdds] = useState<{ probA: number; probB: number; impliedOddsA: string; impliedOddsB: string; rationale: string; confidence: string } | null>(null);
  const [oddsLoading, setOddsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setOddsLoading(true);
    fetch("/api/ai/odds", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: bet.title,
        sideA: `${bet.sideA.label}${bet.sideA.sublabel ? " " + bet.sideA.sublabel : ""}${spread ? ` -${spread}` : ""}`,
        sideB: `${bet.sideB.label}${bet.sideB.sublabel ? " " + bet.sideB.sublabel : ""}`,
        context: bet.context,
      }),
    })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setOdds(data); })
      .finally(() => { if (!cancelled) setOddsLoading(false); });
    return () => { cancelled = true; };
  }, [bet.id, spread, bet.title, bet.sideA.label, bet.sideA.sublabel, bet.sideB.label, bet.sideB.sublabel, bet.context]);

  function saveOrAccept() {
    startTransition(async () => {
      const stake: Stake =
        stakeKind === "cash" || stakeKind === "crypto"
          ? { kind: stakeKind, amountUsd: stakeAmount }
          : { kind: stakeKind, description: stakeDesc || stakeKind };
      const res = await fetch(`/api/bets/${bet.id}/accept`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ side, stake }),
      });
      if (res.ok) {
        router.refresh();
      }
    });
  }

  return (
    <>
      {/* Header strip: lock + name + public toggle */}
      <section className="px-5 mt-2 flex items-start justify-between">
        <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
          {isPublic ? <Globe2 className="w-5 h-5 text-accent" /> : <Lock className="w-4 h-4 text-accent" strokeWidth={2.5} />}
        </div>
        <div className="text-center px-3">
          <div className="text-xs text-white/65 mb-1">Name of bet — Sidebet</div>
          <div className="text-xl font-semibold leading-tight">{bet.title}</div>
        </div>
        <button
          type="button"
          onClick={() => setIsPublic(!isPublic)}
          className="flex flex-col items-end gap-1"
          aria-pressed={isPublic}
        >
          <span className="text-xs text-white/80">Make bet public</span>
          <span className={`w-6 h-6 rounded-md flex items-center justify-center ${isPublic ? "bg-accent" : "border-2 border-white/40"}`}>
            {isPublic && <Check className="w-4 h-4 text-surface" strokeWidth={3} />}
          </span>
        </button>
      </section>

      <div className="border-b border-white/10 mt-4" />

      {/* Score row */}
      <section className="px-5 pt-5">
        <div className="text-center text-sm text-white/80 mb-4">
          {bet.eventAt
            ? new Date(bet.eventAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
            : "Live"}{" "}
          — <span className="font-semibold">{bet.status === "active" ? "In progress" : "Pending"}</span>
        </div>

        <div className="flex items-center justify-around">
          <div className="text-center w-24">
            <div className="text-4xl">{bet.sideA.emoji ?? bet.sideA.logo ?? "🎲"}</div>
            <div className={`mt-2 text-lg font-semibold ${side === "a" ? "text-white" : "text-white/55"}`}>
              {bet.sideA.label}
            </div>
            {bet.sideA.sublabel && (
              <div className={`text-xs ${side === "a" ? "text-white/80" : "text-white/40"}`}>{bet.sideA.sublabel}</div>
            )}
          </div>

          <SideToggle value={side} onChange={setSide} />

          <div className="text-center w-24">
            <div className="text-4xl">{bet.sideB.emoji ?? bet.sideB.logo ?? "🎲"}</div>
            <div className={`mt-2 text-lg font-semibold ${side === "b" ? "text-white" : "text-white/55"}`}>
              {bet.sideB.label}
            </div>
            {bet.sideB.sublabel && (
              <div className={`text-xs ${side === "b" ? "text-white/80" : "text-white/40"}`}>{bet.sideB.sublabel}</div>
            )}
          </div>
        </div>
      </section>

      <div className="border-b border-white/10 mt-6" />

      {/* Spread editor (sports only) */}
      {bet.category === "sports" && (
        <section className="px-5 pt-5 text-center">
          <div className="text-sm text-white/85">
            Your team must win by <span className="font-bold">{spread}</span> {spread === 1 ? "point" : "points"}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={() => setSpread((s) => Math.max(0, s - 1))}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
              aria-label="Decrease spread"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-light text-accent w-10 text-center tabular-nums">{spread}</span>
            <button
              onClick={() => setSpread((s) => s + 1)}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
              aria-label="Increase spread"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}

      {/* Fable 5 odds card */}
      <section className="px-4 mt-5">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-accent uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Fable 5 fair odds
            {oddsLoading && <span className="text-white/60 normal-case tracking-normal">estimating…</span>}
          </div>
          {odds ? (
            <>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-center">
                  <div className="text-xs text-white/60">{bet.sideA.label}</div>
                  <div className="text-2xl font-semibold tabular-nums">{Math.round(odds.probA * 100)}%</div>
                  <div className="text-xs text-accent tabular-nums">{odds.impliedOddsA}</div>
                </div>
                <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="bg-accent" style={{ width: `${odds.probA * 100}%` }} />
                  <div className="bg-white/30" style={{ width: `${odds.probB * 100}%` }} />
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/60">{bet.sideB.label}</div>
                  <div className="text-2xl font-semibold tabular-nums">{Math.round(odds.probB * 100)}%</div>
                  <div className="text-xs text-white/80 tabular-nums">{odds.impliedOddsB}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-white/80 leading-snug">{odds.rationale}</div>
              <div className="mt-1 text-xs text-white/45">Confidence: {odds.confidence}</div>
            </>
          ) : (
            <div className="mt-3 text-sm text-white/60">Pulling estimate…</div>
          )}
        </div>
      </section>

      {/* Stake selector */}
      <section className="px-4 mt-4">
        <div className="card p-4">
          <div className="text-sm text-white/85 mb-3">Your stake</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {(["cash", "crypto", "dinner", "favor", "custom"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setStakeKind(k)}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition ${
                  stakeKind === k
                    ? "bg-accent text-surface font-medium"
                    : "bg-white/5 border border-white/15 text-white/80"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          {stakeKind === "cash" || stakeKind === "crypto" ? (
            <div className="flex items-center gap-2">
              <span className="text-white/70">$</span>
              <input
                type="number"
                min={1}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="input-base"
              />
            </div>
          ) : (
            <input
              placeholder={
                stakeKind === "dinner"
                  ? "Loser buys dinner at…"
                  : stakeKind === "favor"
                  ? "Loser does the dishes for a week"
                  : "Describe the stake"
              }
              value={stakeDesc}
              onChange={(e) => setStakeDesc(e.target.value)}
              className="input-base"
            />
          )}
        </div>
      </section>

      {/* Opposing positions */}
      <section className="px-4 mt-4">
        <div className="card p-4">
          <div className="text-center text-sm text-white/80 mb-3">Betting against</div>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <div className="text-center shrink-0">
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' rx='40' fill='#4ADE80'/><text x='50%' y='54%' text-anchor='middle' font-family='sans-serif' font-size='30' font-weight='700' fill='white' dominant-baseline='middle'>ME</text></svg>`,
                )}`}
                alt="Me"
                className="avatar"
                style={{ width: 56, height: 56 }}
              />
              <div className="mt-1 text-sm">Me</div>
            </div>
            <div className="h-12 w-px bg-white/15 mx-1" />
            {oppData.length === 0 && (
              <div className="text-white/60 text-sm italic">Be the first — invite friends or list publicly.</div>
            )}
            {oppData.map((r, i) => (
              <div key={r.user.id + i} className="text-center shrink-0">
                <img src={r.user.avatarUrl} alt={r.user.name} className="avatar" style={{ width: 56, height: 56 }} />
                <div className="mt-1 text-sm text-white tabular-nums">{shortStake(r.stake)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest news / context feed (for sports-style bets) */}
      {feed.length > 0 && bet.category === "sports" && (
        <section className="px-4 mt-5">
          <div className="text-xs uppercase tracking-wider text-white/70 mb-2 px-2">Latest news</div>
          <div className="bg-white rounded-2xl text-bg overflow-hidden">
            {feed.map((f, i) => (
              <article key={f.id} className={`p-4 flex gap-3 ${i < feed.length - 1 ? "border-b border-black/10" : ""}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-bg to-cta rounded-lg shrink-0 flex items-center justify-center text-3xl">
                  🏀
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-bg leading-snug">{f.title}</div>
                  <div className="text-xs text-bg/60 italic mt-1">{f.date}</div>
                  <p className="text-sm text-bg/80 mt-1 line-clamp-2">{f.body}</p>
                  {f.tags && (
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-bold bg-bg text-white px-1.5 py-0.5 rounded">TAGS</span>
                      {f.tags.map((t) => (
                        <span key={t} className="text-xs text-cta">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <button onClick={saveOrAccept} disabled={isPending} className="cta-bar disabled:opacity-60">
        {isPending ? "Saving…" : mySide ? "Update my position" : "Save this bet"}
      </button>
    </>
  );
}

function shortStake(s: Stake) {
  if (s.kind === "cash" || s.kind === "crypto") return `$${(s.amountUsd ?? 0).toFixed(0)}`;
  return s.description ?? s.kind;
}
