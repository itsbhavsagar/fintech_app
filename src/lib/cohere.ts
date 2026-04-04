import { getCohereApiKey } from "./env";

// Cohere client for generating embeddings used by BrickShare AI features.
export const generateEmbedding = async (text: string): Promise<number[]> => {
  const apiKey = getCohereApiKey();

  const response = await fetch("https://api.cohere.com/v1/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "embed-english-v3.0",
      texts: [text],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cohere API error: ${errorText}`);
  }

  const data = await response.json();
  const embedding = data?.embeddings?.[0]?.embedding;

  if (!Array.isArray(embedding)) {
    throw new Error("Invalid embedding response from Cohere");
  }

  return embedding as number[];
};
