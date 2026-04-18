import { getToken } from "./auth";
import { getApiUrl } from "./env";

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type StreamChatOptions = {
  maxTokens?: number;
  temperature?: number;
  responseFormat?: "json";
};

export const streamChat = async (
  messages: GroqMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  options?: StreamChatOptions,
): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error("You must be logged in to use AI features.");
  }

  const response = await fetch(`${getApiUrl()}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages,
      systemPrompt,
      maxTokens: options?.maxTokens,
      temperature: options?.temperature,
      responseFormat: options?.responseFormat,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed: ${errorText}`);
  }

  const data = (await response.json()) as { content?: string };
  const fullText = data.content?.trim();

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
