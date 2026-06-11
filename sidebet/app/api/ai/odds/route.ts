import { NextResponse } from "next/server";
import { callFableJson } from "@/lib/anthropic";

export const runtime = "nodejs";

const schema = {
  type: "object",
  properties: {
    probA: { type: "number", description: "Probability side A wins, 0-1" },
    probB: { type: "number", description: "Probability side B wins, 0-1" },
    impliedOddsA: { type: "string", description: "American odds e.g. -150 or +120" },
    impliedOddsB: { type: "string" },
    rationale: { type: "string", description: "1-2 sentences, plain language" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
  },
  required: ["probA", "probB", "impliedOddsA", "impliedOddsB", "rationale", "confidence"],
  additionalProperties: false,
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { title, sideA, sideB, context } = body as {
    title: string; sideA: string; sideB: string; context?: string;
  };

  if (!title || !sideA || !sideB) {
    return NextResponse.json({ ok: false, reason: "missing_fields" }, { status: 400 });
  }

  const result = await callFableJson<{
    probA: number; probB: number; impliedOddsA: string; impliedOddsB: string; rationale: string; confidence: "low" | "medium" | "high";
  }>({
    system:
      "You estimate fair probabilities for friendly side-bets. Be calibrated: if a bet is essentially a coin flip or you have no information, return 50/50 with low confidence. If one side is clearly favored by public information (recent sports record, market trends, weather, etc.), reflect that. Output JSON only.",
    user: `Estimate fair odds.\nBet: ${title}\nSide A: ${sideA}\nSide B: ${sideB}${context ? `\nContext: ${context}` : ""}`,
    schema,
    maxTokens: 500,
  });

  if (!result.ok) {
    return NextResponse.json({
      ok: false,
      reason: result.reason,
      // Coin-flip fallback
      probA: 0.5, probB: 0.5,
      impliedOddsA: "+100", impliedOddsB: "+100",
      rationale: "No live info available — defaulting to even odds.",
      confidence: "low",
    });
  }
  return NextResponse.json({ ok: true, ...result.data });
}
