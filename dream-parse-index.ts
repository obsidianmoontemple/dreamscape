// Dream Walker's Atlas — the model proxy (Groq).
// Keeps the Groq key on the server, where no browser can see it.
//
// Two secrets, set in Edge Functions > Secrets:
//   GROQ_API_KEY     your Groq key (begins gsk_)
//   ALLOWED_ORIGINS  the address your site is served from, exactly as the
//                    browser shows it, with no path and no trailing slash,
//                    e.g. https://obsidianmoontemple.com — separate several
//                    with commas.
//
// This stops other websites from spending your credits. It cannot stop
// someone determined who calls it directly outside a browser, so keep a
// spending limit on the Groq account. When dreamer accounts arrive, this moves
// behind sign-in.

const GROQ = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const MODELS = /^(openai\/gpt-oss-(120b|20b)|qwen\/[a-z0-9.\-]{1,40}|llama-[a-z0-9.\-]{1,40})$/;
const MAX_BODY = 60_000;
const MAX_TOKENS = 4000;

function json(status: number, body: unknown, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin);
  const cors: Record<string, string> = {
    "Access-Control-Allow-Origin": ok ? origin : "null",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!ok) return json(403, { error: "This address is not allowed to use the proxy." }, cors);
  if (req.method !== "POST") return json(405, { error: "POST only." }, cors);

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json(413, { error: "Too large." }, cors);

  let body: any;
  try { body = JSON.parse(raw); } catch { return json(400, { error: "Not JSON." }, cors); }

  const messages = Array.isArray(body?.messages) ? body.messages : null;
  if (!messages || messages.length === 0 || messages.length > 40) return json(400, { error: "Bad messages." }, cors);
  for (const m of messages) {
    if (!m || !["system", "user", "assistant"].includes(m.role) || typeof m.content !== "string") {
      return json(400, { error: "Bad message." }, cors);
    }
  }

  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) return json(500, { error: "The proxy has no Groq key set." }, cors);

  // only what the app uses goes through: no tools, no streaming, nothing else
  const model = MODELS.test(body.model ?? "") ? body.model : DEFAULT_MODEL;
  const out: Record<string, unknown> = {
    model,
    messages,
    temperature: typeof body.temperature === "number" ? Math.max(0, Math.min(1.5, body.temperature)) : 0.4,
    max_tokens: Math.min(Number(body.max_tokens) || 1200, MAX_TOKENS),
  };
  // reasoning models: think briefly, and send back only the answer
  if (/gpt-oss|qwen/.test(model)) { out.reasoning_effort = "low"; out.include_reasoning = false; }

  const r = await fetch(GROQ, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify(out),
  });
  return new Response(await r.text(), { status: r.status, headers: { ...cors, "Content-Type": "application/json" } });
});
