import Anthropic from "@anthropic-ai/sdk";

// Centralized Anthropic client. Uses Claude Fable 5 — Anthropic's most capable
// model, ideal for grading rubric-style bet resolution and creative idea generation.
//
// IMPORTANT: Fable 5 has different API behavior than Opus-tier:
//   - Thinking is always on; omit the `thinking` parameter entirely (an explicit
//     {type:"disabled"} returns 400; {type:"adaptive"} is accepted but unnecessary).
//   - `temperature`, `top_p`, `top_k` are removed (400 if sent).
//   - No assistant prefill.
//   - Requires 30-day data retention (not available under ZDR).
//   - Safety classifiers may return stop_reason "refusal" — check before reading content.
//   - New tokenizer; ~30% more tokens than Opus-tier for the same content.

export const FABLE_MODEL = "claude-fable-5";

export function getClient() {
  // Resolves credentials from ANTHROPIC_API_KEY env var.
  return new Anthropic();
}

export type FableResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "refusal" | "parse_error" | "no_key" | "api_error"; detail?: string };

/**
 * Call Fable 5 with JSON-schema-constrained output and parse the first text block.
 * Returns a tagged union so callers can render graceful fallbacks (refusals,
 * missing API keys in local dev, etc.) without crashing the UI.
 */
export async function callFableJson<T>(opts: {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<FableResult<T>> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, reason: "no_key", detail: "ANTHROPIC_API_KEY not set" };
  }
  const client = getClient();
  try {
    // `output_config` is supported by the API but not yet in the SDK's
    // generated TS types — cast through unknown to keep type safety elsewhere.
    const response = (await client.messages.create({
      model: FABLE_MODEL,
      max_tokens: opts.maxTokens ?? 1500,
      system: opts.system,
      messages: [{ role: "user", content: opts.user }],
      output_config: {
        format: { type: "json_schema", schema: opts.schema },
      },
    } as unknown as Parameters<typeof client.messages.create>[0])) as Anthropic.Message;

    // Always check stop_reason before reading content — Fable 5 may refuse.
    if ((response.stop_reason as string) === "refusal") {
      return { ok: false, reason: "refusal", detail: "Request declined by safety classifier." };
    }

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { ok: false, reason: "parse_error", detail: "No text block in response." };
    }
    const parsed = JSON.parse(textBlock.text) as T;
    return { ok: true, data: parsed };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: "api_error", detail: msg };
  }
}
