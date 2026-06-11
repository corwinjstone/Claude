import { NextResponse } from "next/server";
import { callFableJson } from "@/lib/anthropic";

export const runtime = "nodejs";

const schema = {
  type: "object",
  properties: {
    suggestions: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Punchy bet name" },
          category: {
            type: "string",
            enum: ["sports", "stocks", "news", "weather", "goofy", "prediction", "other"],
          },
          sideA: { type: "string" },
          sideB: { type: "string" },
          stakeIdea: { type: "string", description: "Fun non-cash stake idea, e.g. 'loser does laundry'" },
          why: { type: "string", description: "One line of why this is fun or interesting" },
        },
        required: ["title", "category", "sideA", "sideB", "stakeIdea", "why"],
        additionalProperties: false,
      },
    },
  },
  required: ["suggestions"],
  additionalProperties: false,
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const vibe: string = body.vibe || "anything fun";

  const result = await callFableJson<{ suggestions: Array<Record<string, string>> }>({
    system:
      "You generate creative side-bet ideas for friends. Mix serious bets (sports, stocks, news) with goofy in-person dares (puddle jumps, marshmallow stuffing, fastest text reply). Keep titles punchy and concrete. Avoid anything involving minors, harm, or gambling addictions.",
    user: `Generate 5 side-bet ideas. Vibe: ${vibe}. Make at least 2 of them goofy in-person dares and at least 2 tied to real-world events (sports, stocks, weather).`,
    schema,
    maxTokens: 1200,
  });

  if (!result.ok) {
    // Graceful fallback — keep the UI working without an API key.
    return NextResponse.json({
      ok: false,
      reason: result.reason,
      suggestions: fallbackSuggestions(),
    });
  }
  return NextResponse.json({ ok: true, suggestions: result.data.suggestions });
}

function fallbackSuggestions() {
  return [
    { title: "Most marshmallows in 60s", category: "goofy", sideA: "Over 15", sideB: "Under 15", stakeIdea: "Loser buys boba", why: "Cheap, fast, hilarious." },
    { title: "Lakers cover -4.5 tonight", category: "sports", sideA: "Lakers -4.5", sideB: "Field +4.5", stakeIdea: "$10", why: "Live game, settles in 3h." },
    { title: "Will it rain tomorrow?", category: "weather", sideA: "Yes", sideB: "No", stakeIdea: "Loser walks the dog", why: "Easy to settle from a weather app." },
    { title: "NVDA closes green Friday", category: "stocks", sideA: "Green", sideB: "Red", stakeIdea: "Coffee for a week", why: "Clear, tradeable, time-boxed." },
    { title: "Can you clear that puddle?", category: "goofy", sideA: "Clears it", sideB: "Splash", stakeIdea: "Piggyback ride home", why: "Crowd favorite." },
  ];
}
