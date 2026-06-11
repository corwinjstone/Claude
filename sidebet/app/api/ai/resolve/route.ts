import { NextResponse } from "next/server";
import { getBet, updateBet } from "@/lib/store";
import { callFableJson } from "@/lib/anthropic";

export const runtime = "nodejs";

const schema = {
  type: "object",
  properties: {
    winningSide: { type: "string", enum: ["a", "b", "void"] },
    rationale: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
  },
  required: ["winningSide", "rationale", "confidence"],
  additionalProperties: false,
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { betId, evidence } = body as { betId: string; evidence: string };

  const bet = getBet(betId);
  if (!bet) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });

  const result = await callFableJson<{
    winningSide: "a" | "b" | "void"; rationale: string; confidence: "low" | "medium" | "high";
  }>({
    system:
      "You are an impartial judge for friendly side-bets. Given the bet terms and the evidence the user provides, decide which side won. If the evidence is ambiguous or insufficient, return 'void' with a brief reason. Be concise and concrete.",
    user: [
      `Bet: ${bet.title}`,
      `Side A: ${bet.sideA.label}${bet.sideA.sublabel ? ` ${bet.sideA.sublabel}` : ""}`,
      `Side B: ${bet.sideB.label}${bet.sideB.sublabel ? ` ${bet.sideB.sublabel}` : ""}`,
      bet.spread ? `Spread: side A must win by ${bet.spread}` : "",
      bet.description ? `Description: ${bet.description}` : "",
      `Evidence from user:\n${evidence || "(none provided)"}`,
    ].filter(Boolean).join("\n"),
    schema,
    maxTokens: 600,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason });
  }

  if (result.data.winningSide === "void") {
    updateBet(bet.id, { status: "voided" });
  } else {
    updateBet(bet.id, {
      status: "resolved",
      resolution: {
        winningSide: result.data.winningSide,
        resolvedAt: Date.now(),
        rationale: result.data.rationale,
      },
    });
  }

  return NextResponse.json({ ok: true, ...result.data });
}
