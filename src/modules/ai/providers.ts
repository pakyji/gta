/**
 * AI provider adapters (server only).
 *
 * Priority (first configured wins, unless AI_PROVIDER forces one):
 *  1. GROQ_API_KEY
 *  2. OPENAI_API_KEY
 *  3. OPENROUTER_API_KEY
 *  4. GEMINI_API_KEY
 *  5. TOGETHER_API_KEY
 *  6. FIREWORKS_API_KEY
 *  7. DEEPSEEK_API_KEY
 *  8. MISTRAL_API_KEY
 *  9. HF_TOKEN / HUGGINGFACE_API_KEY
 * 10. POLLINATIONS (always available, no key)  ← free public endpoint
 * 11. local brain (offline fallback)
 *
 * Optional: AI_PROVIDER=pollinations|groq|openai|...  AI_MODEL=<model id>
 */
import "server-only";

export type ProviderId =
  | "groq"
  | "openai"
  | "openrouter"
  | "gemini"
  | "together"
  | "fireworks"
  | "deepseek"
  | "mistral"
  | "huggingface"
  | "pollinations"
  | "local";

export interface ChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

export class ProviderError extends Error {
  status: number;
  retryable: boolean;
  constructor(message: string, status = 502, retryable = true) {
    super(message);
    this.status = status;
    this.retryable = retryable;
  }
}

interface ProviderConfig {
  id: ProviderId;
  label: string;
  apiKey: string | null;
  model: string;
  baseUrl: string;
  kind: "openai" | "gemini" | "pollinations" | "hf";
}

const DEFAULT_MODEL: Record<ProviderId, string> = {
  groq: "llama-3.1-8b-instant",
  openai: "gpt-4o-mini",
  openrouter: "meta-llama/llama-3.1-8b-instruct:free",
  gemini: "gemini-1.5-flash",
  together: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
  fireworks: "accounts/fireworks/models/llama-v3p1-8b-instruct",
  deepseek: "deepseek-chat",
  mistral: "mistral-small-latest",
  huggingface: "meta-llama/Meta-Llama-3-8B-Instruct",
  pollinations: "openai",
  local: "gtac-local",
};

function key(...names: string[]): string | undefined {
  for (const n of names) {
    const v = process.env[n]?.trim();
    if (v) return v;
  }
  return undefined;
}

export function resolveProvider(): ProviderConfig | null {
  const forced = process.env.AI_PROVIDER?.trim().toLowerCase() as ProviderId | undefined;

  const candidates: ProviderConfig[] = [
    {
      id: "groq",
      label: "Groq",
      apiKey: key("GROQ_API_KEY") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.groq,
      baseUrl: "https://api.groq.com/openai/v1",
      kind: "openai",
    },
    {
      id: "openai",
      label: "OpenAI",
      apiKey: key("OPENAI_API_KEY") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.openai,
      baseUrl: process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1",
      kind: "openai",
    },
    {
      id: "openrouter",
      label: "OpenRouter",
      apiKey: key("OPENROUTER_API_KEY") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.openrouter,
      baseUrl: "https://openrouter.ai/api/v1",
      kind: "openai",
    },
    {
      id: "gemini",
      label: "Google Gemini",
      apiKey: key("GEMINI_API_KEY", "GOOGLE_API_KEY") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.gemini,
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      kind: "gemini",
    },
    {
      id: "together",
      label: "Together AI",
      apiKey: key("TOGETHER_API_KEY") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.together,
      baseUrl: "https://api.together.xyz/v1",
      kind: "openai",
    },
    {
      id: "fireworks",
      label: "Fireworks",
      apiKey: key("FIREWORKS_API_KEY") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.fireworks,
      baseUrl: "https://api.fireworks.ai/inference/v1",
      kind: "openai",
    },
    {
      id: "deepseek",
      label: "DeepSeek",
      apiKey: key("DEEPSEEK_API_KEY") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.deepseek,
      baseUrl: "https://api.deepseek.com",
      kind: "openai",
    },
    {
      id: "mistral",
      label: "Mistral",
      apiKey: key("MISTRAL_API_KEY") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.mistral,
      baseUrl: "https://api.mistral.ai/v1",
      kind: "openai",
    },
    {
      id: "huggingface",
      label: "Hugging Face",
      apiKey: key("HF_TOKEN", "HUGGINGFACE_API_KEY", "HUGGINGFACEHUB_API_TOKEN") ?? null,
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL.huggingface,
      baseUrl: "https://api-inference.huggingface.co",
      kind: "hf",
    },
    // Pollinations — free, no key required. Always last before local.
    {
      id: "pollinations",
      label: "Pollinations",
      apiKey: key("POLLINATIONS_API_KEY") ?? null, // optional
      model: process.env.AI_MODEL?.trim() || process.env.POLLINATIONS_MODEL?.trim() || DEFAULT_MODEL.pollinations,
      baseUrl: "https://text.pollinations.ai",
      kind: "pollinations",
    },
  ];

  const ordered = forced ? candidates.filter((c) => c.id === forced) : candidates;

  for (const c of ordered) {
    if (c.id === "pollinations") return c; // always available
    if (c.apiKey) return c;
  }
  // If forced to something missing, still try pollinations
  if (forced && forced !== "local") {
    const p = candidates.find((c) => c.id === "pollinations");
    if (p) return p;
  }
  return null;
}

export function listAvailableProviders(): Array<{ id: ProviderId; label: string; ready: boolean }> {
  return [
    { id: "groq", label: "Groq", ready: !!key("GROQ_API_KEY") },
    { id: "openai", label: "OpenAI", ready: !!key("OPENAI_API_KEY") },
    { id: "openrouter", label: "OpenRouter", ready: !!key("OPENROUTER_API_KEY") },
    { id: "gemini", label: "Gemini", ready: !!key("GEMINI_API_KEY", "GOOGLE_API_KEY") },
    { id: "together", label: "Together", ready: !!key("TOGETHER_API_KEY") },
    { id: "fireworks", label: "Fireworks", ready: !!key("FIREWORKS_API_KEY") },
    { id: "deepseek", label: "DeepSeek", ready: !!key("DEEPSEEK_API_KEY") },
    { id: "mistral", label: "Mistral", ready: !!key("MISTRAL_API_KEY") },
    { id: "huggingface", label: "Hugging Face", ready: !!key("HF_TOKEN", "HUGGINGFACE_API_KEY", "HUGGINGFACEHUB_API_TOKEN") },
    { id: "pollinations", label: "Pollinations", ready: true },
    { id: "local", label: "Built-in advisor", ready: true },
  ];
}

export function providerStatus() {
  const p = resolveProvider();
  const available = listAvailableProviders().filter((x) => x.ready);
  if (p) {
    return {
      configured: p.id !== "pollinations" && p.id !== "local" ? (true as const) : (false as const),
      provider: p.id,
      label: p.label,
      model: p.model,
      localFallback: p.id === "pollinations" || p.id === "local",
      available,
      help:
        p.id === "pollinations"
          ? "Using free Pollinations LLM. Optional cloud keys (GROQ_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY, …) upgrade the model."
          : undefined,
    };
  }
  return {
    configured: false as const,
    provider: "local" as const,
    label: "Built-in advisor",
    model: "gtac-local",
    localFallback: true as const,
    available,
    help: "Using built-in GTA advisor. Add GROQ_API_KEY / GEMINI_API_KEY or rely on free Pollinations.",
  };
}

async function withTimeout<T>(p: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    return await p(c.signal);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ProviderError("The AI provider took too long to answer. Please retry.", 504, true);
    }
    throw err;
  } finally {
    clearTimeout(t);
  }
}

function mapHttpError(status: number, label: string, detail: string): ProviderError {
  if (status === 401 || status === 403) return new ProviderError(`${label} rejected the API key.`, 502, false);
  if (status === 429) return new ProviderError(`${label} rate limit reached. Wait a moment and retry.`, 429, true);
  if (status === 404) return new ProviderError(`${label} model not found. Check AI_MODEL.`, 502, false);
  if (status >= 500) return new ProviderError(`${label} is unavailable (${status}).`, 502, true);
  return new ProviderError(`${label} error ${status}: ${detail.slice(0, 140)}`, 502, true);
}

export async function complete(
  turns: ChatTurn[],
  timeoutMs = 20_000,
): Promise<{ text: string; provider: ProviderId; model: string }> {
  const primary = resolveProvider();
  if (!primary) throw new ProviderError("No AI provider available.", 503, false);

  const chain: ProviderConfig[] = [primary];
  // If primary isn't pollinations, add pollinations as soft fallback
  if (primary.id !== "pollinations") {
    chain.push({
      id: "pollinations",
      label: "Pollinations",
      apiKey: null,
      model: DEFAULT_MODEL.pollinations,
      baseUrl: "https://text.pollinations.ai",
      kind: "pollinations",
    });
  }

  let lastErr: unknown;
  for (const p of chain) {
    try {
      const text = await withTimeout(async (signal) => {
        if (p.kind === "pollinations") return pollinationsComplete(p, turns, signal);
        if (p.kind === "gemini") return geminiComplete(p, turns, signal);
        if (p.kind === "hf") return hfComplete(p, turns, signal);
        return openAiCompatibleComplete(p, turns, signal);
      }, timeoutMs);
      if (!text.trim()) throw new ProviderError(`${p.label} returned an empty response.`, 502, true);
      return { text: text.trim(), provider: p.id, model: p.model };
    } catch (err) {
      lastErr = err;
      console.error(`[ai] ${p.id} failed`, err instanceof Error ? err.message : err);
    }
  }
  if (lastErr instanceof ProviderError) throw lastErr;
  throw new ProviderError("All AI providers failed. Please retry.", 502, true);
}

async function openAiCompatibleComplete(p: ProviderConfig, turns: ChatTurn[], signal: AbortSignal): Promise<string> {
  if (!p.apiKey) throw new ProviderError(`${p.label} has no API key.`, 503, false);
  let res: Response;
  try {
    res = await fetch(`${p.baseUrl}/chat/completions`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${p.apiKey}`,
        ...(p.id === "openrouter"
          ? { "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000", "X-Title": "GTA Online Community" }
          : {}),
      },
      body: JSON.stringify({
        model: p.model,
        messages: turns,
        temperature: 0.7,
        max_tokens: 900,
      }),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new ProviderError(`Could not reach ${p.label}.`, 502, true);
  }
  const raw = await res.text();
  if (!res.ok) throw mapHttpError(res.status, p.label, raw);
  try {
    const data = JSON.parse(raw) as { choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }> };
    const content = data.choices?.[0]?.message?.content;
    if (Array.isArray(content)) return content.map((c) => c.text ?? "").join("");
    return content ?? "";
  } catch {
    throw new ProviderError(`${p.label} returned an unreadable response.`, 502, true);
  }
}

async function pollinationsComplete(p: ProviderConfig, turns: ChatTurn[], signal: AbortSignal): Promise<string> {
  // Official text API: POST https://text.pollinations.ai/
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (p.apiKey) headers.Authorization = `Bearer ${p.apiKey}`;

  let res: Response;
  try {
    res = await fetch(`${p.baseUrl}/`, {
      method: "POST",
      signal,
      headers,
      body: JSON.stringify({
        messages: turns,
        model: p.model || "openai",
        seed: Math.floor(Math.random() * 1_000_000),
      }),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new ProviderError("Could not reach Pollinations.", 502, true);
  }
  const raw = await res.text();
  if (!res.ok) throw mapHttpError(res.status, p.label, raw);

  // Response may be plain text OR JSON { content } / OpenAI-style
  try {
    const data = JSON.parse(raw) as {
      content?: string;
      text?: string;
      choices?: Array<{ message?: { content?: string } }>;
    };
    if (typeof data.content === "string") return data.content;
    if (typeof data.text === "string") return data.text;
    if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  } catch {
    // plain text body
  }
  return raw;
}

async function geminiComplete(p: ProviderConfig, turns: ChatTurn[], signal: AbortSignal): Promise<string> {
  if (!p.apiKey) throw new ProviderError(`${p.label} has no API key.`, 503, false);
  const system = turns.filter((t) => t.role === "system").map((t) => t.content).join("\n\n");
  const contents = turns
    .filter((t) => t.role !== "system")
    .map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] }));
  let res: Response;
  try {
    res = await fetch(
      `${p.baseUrl}/models/${encodeURIComponent(p.model)}:generateContent?key=${encodeURIComponent(p.apiKey)}`,
      {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 900 },
        }),
      },
    );
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new ProviderError(`Could not reach ${p.label}.`, 502, true);
  }
  const raw = await res.text();
  if (!res.ok) throw mapHttpError(res.status, p.label, raw);
  try {
    const data = JSON.parse(raw) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return (data.candidates?.[0]?.content?.parts ?? []).map((x) => x.text ?? "").join("");
  } catch {
    throw new ProviderError(`${p.label} returned an unreadable response.`, 502, true);
  }
}

async function hfComplete(p: ProviderConfig, turns: ChatTurn[], signal: AbortSignal): Promise<string> {
  if (!p.apiKey) throw new ProviderError(`${p.label} has no API key.`, 503, false);
  // Prefer OpenAI-compatible router when available; fall back to text-generation
  const messages = turns.map((t) => ({ role: t.role, content: t.content }));
  let res: Response;
  try {
    res = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${p.apiKey}`,
      },
      body: JSON.stringify({ model: p.model, messages, max_tokens: 900, temperature: 0.7 }),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new ProviderError(`Could not reach ${p.label}.`, 502, true);
  }
  const raw = await res.text();
  if (!res.ok) {
    // Fallback classic inference API
    try {
      const prompt = turns.map((t) => `${t.role.toUpperCase()}: ${t.content}`).join("\n") + "\nASSISTANT:";
      const res2 = await fetch(`${p.baseUrl}/models/${encodeURIComponent(p.model)}`, {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.apiKey}` },
        body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 700, temperature: 0.7, return_full_text: false } }),
      });
      const raw2 = await res2.text();
      if (!res2.ok) throw mapHttpError(res2.status, p.label, raw2);
      const data = JSON.parse(raw2) as Array<{ generated_text?: string }> | { generated_text?: string };
      if (Array.isArray(data)) return data[0]?.generated_text ?? "";
      return data.generated_text ?? "";
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      throw mapHttpError(res.status, p.label, raw);
    }
  }
  try {
    const data = JSON.parse(raw) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content ?? "";
  } catch {
    throw new ProviderError(`${p.label} returned an unreadable response.`, 502, true);
  }
}
