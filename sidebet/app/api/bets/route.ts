import { NextResponse } from "next/server";
import { z } from "zod";
import { createBet, listBets, ME } from "@/lib/store";

const StakeSchema = z.object({
  kind: z.enum(["cash", "crypto", "dinner", "favor", "custom"]),
  amountUsd: z.number().optional(),
  description: z.string().optional(),
});

const CreateBetSchema = z.object({
  title: z.string().min(2).max(120),
  category: z.enum(["sports", "stocks", "news", "weather", "goofy", "prediction", "other"]),
  description: z.string().max(500).optional(),
  sideA: z.object({ label: z.string(), sublabel: z.string().optional(), emoji: z.string().optional() }),
  sideB: z.object({ label: z.string(), sublabel: z.string().optional(), emoji: z.string().optional() }),
  spread: z.number().optional(),
  visibility: z.enum(["private", "public"]),
  takeSide: z.enum(["a", "b"]),
  initialStake: StakeSchema,
});

export async function GET() {
  return NextResponse.json({ bets: listBets() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateBetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const bet = createBet({
    ...parsed.data,
    creatorId: ME,
  });
  return NextResponse.json({ bet }, { status: 201 });
}
