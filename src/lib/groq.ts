import { getGroqApiKey } from "./env";

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function parseSSEText(raw: string): string {
  const lines = raw.split("\n");
  let result = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;

    const data = trimmed.slice(5).trim();
    if (data === "[DONE]") break;

    try {
      const parsed = JSON.parse(data);
      const delta = parsed?.choices?.[0]?.delta?.content;
      if (delta) result += delta;
    } catch {}
  }

  return result;
}

export const streamChat = async (
  messages: GroqMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void,
  onDone: () => void,
): Promise<void> => {
  const apiKey = getGroqApiKey();

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: 250,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${errorText}`);
  }

  const raw = await response.text();
  const fullText = parseSSEText(raw);

  if (!fullText) {
    onDone();
    return;
  }

  const words = fullText.split(" ");
  const chunkSize = 3;

  for (let i = 0; i < words.length; i += chunkSize) {
    const group = words.slice(i, i + chunkSize).join(" ");

    onChunk(i === 0 ? group : " " + group);

    await new Promise((r) => setTimeout(r, 30));
  }

  onDone();
};
