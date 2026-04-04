// Groq client used by BrickShare AI hooks to stream chat responses.
export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const GROQ_API_URL = "https://api.groq.com/v1/chat/completions";

const getGroqApiKey = (): string => {
  if (!process.env.EXPO_PUBLIC_GROQ_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
  }
  return process.env.EXPO_PUBLIC_GROQ_API_KEY;
};

export const streamChat = async (
  messages: GroqMessage[],
  systemPrompt: string,
): Promise<ReadableStream<Uint8Array>> => {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getGroqApiKey()}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${errorText}`);
  }

  if (response.body) {
    return response.body;
  }

  const text = await response.text();

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
};
