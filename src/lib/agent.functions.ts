import { createServerFn } from "@tanstack/react-start";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const SYSTEM_PROMPT = `You are a Palawan AI Operator — an intelligent assistant for micro-resorts and small businesses in Palawan, Philippines.

Your role:
- Help resort owners with bookings, guest communications, operations, and marketing
- Be friendly, warm, and practical — Palawan hospitality
- Give concise, actionable answers (2-3 paragraphs max)
- Sound like a knowledgeable local who knows hospitality inside out
- If asked about your capabilities, explain: you can help with bookings, guest messages, menu digitization, operations, and marketing

Rules:
- Keep responses under 200 words unless asked for detail
- Don't make up specific pricing or availability — direct users to contact merQato.digital
- Be encouraging — Palawan small business owners are your people
- Use simple, clear English`;

const OPENROUTER_MODEL = "google/gemma-2-2b-it:free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getOllamaUrl() {
  return process.env.OLLAMA_URL || "http://localhost:11434";
}

function getOllamaModel() {
  return process.env.AI_MODEL || "llama3.2:3b";
}

/**
 * Send a chat message to the AI and get a reply.
 * Uses OpenRouter in production, Ollama locally.
 */
export const chatWithAgent = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Message[] }) => {
    if (!input?.messages?.length) throw new Error("Messages required");
    return input;
  })
  .handler(async ({ data }) => {
    // Trim to last 10 messages to keep context manageable
    const recentMessages = data.messages.slice(-10);
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    // ── Production mode: OpenRouter ──
    if (openrouterKey) {
      try {
        const response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openrouterKey}`,
            "HTTP-Referer": "https://tropical-systems-studio.vercel.app",
            "X-Title": "Palawan AI Operators",
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...recentMessages,
            ],
            max_tokens: 500,
          }),
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
        }

        const json = await response.json();
        const content = json.choices?.[0]?.message?.content || "";

        return { content, ok: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: `⚠️ AI temporarily unavailable. ${message}`, ok: false };
      }
    }

    // ── Local dev mode: Ollama ──
    try {
      const ollamaUrl = getOllamaUrl();
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: getOllamaModel(),
          stream: false,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...recentMessages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP ${response.status}`);
      }

      const json = await response.json();
      const content = json.message?.content || "";

      return { content, ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes("connect") || message.includes("ECONN") || message.includes("fetch")) {
        return {
          content:
            "⚠️ AI not available. Start Ollama locally with `ollama serve` or set OPENROUTER_API_KEY for production.",
          ok: true,
        };
      }

      return { content: `Error: ${message}`, ok: false };
    }
  });
