const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

export class AIConfigError extends Error {}
export class AIRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getKey() {
  const key = process.env["LOVABLE_API_KEY"] || process.env["OPENAI_API_KEY"];
  if (!key) {
    throw new AIConfigError(
      "AI is not configured on the server. Set LOVABLE_API_KEY (or OPENAI_API_KEY) and restart.",
    );
  }
  return key;
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function chatJSON<T>(messages: ChatMessage[]): Promise<T> {
  const key = getKey();
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: "json_object" },
    }),
  });

  if (res.status === 429) throw new AIRequestError("AI rate limit reached. Try again shortly.", 429);
  if (res.status === 402) throw new AIRequestError("AI credits exhausted. Add credits to continue.", 402);
  if (!res.ok) {
    const body = await res.text();
    throw new AIRequestError(`AI request failed (${res.status}): ${body.slice(0, 300)}`, 502);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = data.choices?.[0]?.message?.content ?? "";
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1)) as T;
    throw new AIRequestError("AI returned an unreadable response.", 502);
  }
}
