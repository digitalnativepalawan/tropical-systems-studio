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

function getOllamaUrl() {
  return process.env.OLLAMA_URL || "http://localhost:11434";
}

function getModel() {
  return process.env.AI_MODEL || "llama3.2:3b";
}

/**
 * Send a chat message to the AI and get a reply.
 * Uses Ollama locally; swap to Cloudflare Workers AI for production.
 */
export const chatWithAgent = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Message[] }) => {
    if (!input?.messages?.length) throw new Error("Messages required");
    return input;
  })
  .handler(async ({ data }) => {
    const ollamaUrl = getOllamaUrl();

    // Trim conversation to last 10 messages to keep context manageable
    const recentMessages = data.messages.slice(-10);

    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: getModel(),
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

      // Graceful fallback when Ollama isn't running
      if (message.includes("connect") || message.includes("ECONN") || message.includes("fetch")) {
        return {
          content:
            "⚠️ AI not available — Ollama isn't running locally. Start it with `ollama serve` or configure a production AI provider.",
          ok: true,
        };
      }

      return { content: `Error: ${message}`, ok: false };
    }
  });
