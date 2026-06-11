import { NextResponse } from "next/server";
import { addPosition, getBet, ME } from "@/lib/store";
import { z } from "zod";

const Body = z.object({
  side: z.enum(["a", "b"]),
  stake: z.object({
    kind: z.enum(["cash", "crypto", "dinner", "favor", "custom"]),
    amountUsd: z.number().optional(),
    description: z.string().optional(),
  }),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const bet = getBet(id);
  if (!bet) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = addPosition(id, {
    userId: ME,
    side: parsed.data.side,
    stake: parsed.data.stake,
    createdAt: Date.now(),
  });
  return NextResponse.json({ bet: updated });
}
