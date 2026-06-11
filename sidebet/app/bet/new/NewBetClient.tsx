"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, RefreshCw } from "lucide-react";

type Suggestion = {
  title: string;
  category: "sports" | "stocks" | "news" | "weather" | "goofy" | "prediction" | "other";
  sideA: string;
  sideB: string;
  stakeIdea: string;
  why: string;
};

export function NewBetClient() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Suggestion["category"]>("goofy");
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");
  const [description, setDescription] = useState("");
  const [stakeKind, setStakeKind] = useState<"cash" | "crypto" | "dinner" | "favor" | "custom">("cash");
  const [amount, setAmount] = useState(10);
  const [stakeDesc, setStakeDesc] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [takeSide, setTakeSide] = useState<"a" | "b">("a");

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [vibe, setVibe] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => { fetchSuggestions(""); }, []);

  function fetchSuggestions(v: string) {
    setAiLoading(true);
    fetch("/api/ai/suggest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vibe: v || "anything fun" }),
    })
      .then((r) => r.json())
      .then((d) => setSuggestions(d.suggestions ?? []))
      .finally(() => setAiLoading(false));
  }

  function pick(s: Suggestion) {
    setTitle(s.title);
    setCategory(s.category);
    setSideA(s.sideA);
    setSideB(s.sideB);
    setStakeDesc(s.stakeIdea);
    setStakeKind(s.stakeIdea.toLowerCase().includes("$") ? "cash" : "favor");
  }

  function submit() {
    startTransition(async () => {
      const initialStake =
        stakeKind === "cash" || stakeKind === "crypto"
          ? { kind: stakeKind, amountUsd: amount }
          : { kind: stakeKind, description: stakeDesc || stakeKind };
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description: description || undefined,
          sideA: { label: sideA },
          sideB: { label: sideB },
          visibility,
          takeSide,
          initialStake,
        }),
      });
      if (res.ok) {
        const { bet } = await res.json();
        router.push(`/bet/${bet.id}`);
      } else {
        alert("Couldn't create the bet — check the fields.");
      }
    });
  }

  return (
    <div className="px-4 pt-2">
      <h1 className="text-3xl font-semibold text-center">Make a bet</h1>
      <p className="text-center text-white/65 text-sm mt-1">Anything goes — sports, stocks, or marshmallow stuffing.</p>

      {/* AI suggestions */}
      <section className="card p-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Fable 5 ideas
          </div>
          <button onClick={() => fetchSuggestions(vibe)} className="text-white/70 hover:text-white" aria-label="Refresh">
            <RefreshCw className={`w-4 h-4 ${aiLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="vibe? (e.g. tailgate, market, dares)"
            className="input-base"
          />
          <button onClick={() => fetchSuggestions(vibe)} className="px-3 rounded-xl bg-accent text-surface font-medium">
            Go
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => pick(s)} className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.title}</span>
                <span className="text-[10px] uppercase text-accent">{s.category}</span>
              </div>
              <div className="text-xs text-white/70 mt-0.5">{s.sideA} vs {s.sideB} — {s.stakeIdea}</div>
              <div className="text-xs text-white/45 italic mt-0.5">{s.why}</div>
            </button>
          ))}
          {!aiLoading && suggestions.length === 0 && <div className="text-white/60 text-sm">No ideas yet.</div>}
        </div>
      </section>

      {/* Manual form */}
      <section className="card p-4 mt-4 flex flex-col gap-3">
        <label className="block">
          <div className="text-xs text-white/65 mb-1">Title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-base" placeholder="e.g. Trailblazers to win +5" />
        </label>
        <label className="block">
          <div className="text-xs text-white/65 mb-1">Category</div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Suggestion["category"])}
            className="input-base appearance-none"
          >
            {(["sports", "stocks", "news", "weather", "goofy", "prediction", "other"] as const).map((c) => (
              <option key={c} value={c} className="bg-surface">{c}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label>
            <div className="text-xs text-white/65 mb-1">Side A</div>
            <input value={sideA} onChange={(e) => setSideA(e.target.value)} className="input-base" placeholder="Yes / Team A" />
          </label>
          <label>
            <div className="text-xs text-white/65 mb-1">Side B</div>
            <input value={sideB} onChange={(e) => setSideB(e.target.value)} className="input-base" placeholder="No / Team B" />
          </label>
        </div>
        <label className="block">
          <div className="text-xs text-white/65 mb-1">Description (optional)</div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-base min-h-[60px]" placeholder="Any extra rules…" />
        </label>

        <div>
          <div className="text-xs text-white/65 mb-1">I'm taking…</div>
          <div className="flex gap-2">
            <button onClick={() => setTakeSide("a")} className={`flex-1 py-2 rounded-xl border ${takeSide === "a" ? "bg-accent text-surface border-accent" : "border-white/15 bg-white/5"}`}>
              {sideA || "Side A"}
            </button>
            <button onClick={() => setTakeSide("b")} className={`flex-1 py-2 rounded-xl border ${takeSide === "b" ? "bg-accent text-surface border-accent" : "border-white/15 bg-white/5"}`}>
              {sideB || "Side B"}
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs text-white/65 mb-1">Stake</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {(["cash", "crypto", "dinner", "favor", "custom"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setStakeKind(k)}
                className={`px-3 py-1.5 rounded-full text-sm capitalize ${stakeKind === k ? "bg-accent text-surface font-medium" : "bg-white/5 border border-white/15"}`}
              >
                {k}
              </button>
            ))}
          </div>
          {stakeKind === "cash" || stakeKind === "crypto" ? (
            <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="input-base" />
          ) : (
            <input value={stakeDesc} onChange={(e) => setStakeDesc(e.target.value)} placeholder="Loser cleans the kitchen for a week" className="input-base" />
          )}
        </div>

        <label className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={() => setVisibility(visibility === "public" ? "private" : "public")}
            className={`w-6 h-6 rounded-md flex items-center justify-center ${visibility === "public" ? "bg-accent" : "border-2 border-white/40"}`}
          >
            {visibility === "public" && <Check className="w-4 h-4 text-surface" strokeWidth={3} />}
          </button>
          <span className="text-sm text-white/85">Make bet public — let others copy or tail</span>
        </label>
      </section>

      <button
        disabled={pending || !title || !sideA || !sideB}
        onClick={submit}
        className="cta-bar disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Saving…" : "Save this bet"}
      </button>
    </div>
  );
}
