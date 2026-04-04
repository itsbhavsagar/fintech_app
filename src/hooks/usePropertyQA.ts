import { useCallback, useState } from "react";
import { GroqMessage, streamChat } from "../lib/groq";
import type { Property } from "../constants/mockData";

export type QAEntry = {
  role: "user" | "assistant";
  content: string;
};

export const usePropertyQA = (property: Property) => {
  const [messages, setMessages] = useState<QAEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const sendMessage = useCallback(async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage: QAEntry = { role: "user", content: input.trim() };
    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    setInput("");

    const systemPrompt = `You are a real estate investment advisor for BrickShare. Answer questions about this property only using the provided data. Property: ${JSON.stringify(
      property,
    )}`;

    const groqMessages: GroqMessage[] = [
      { role: "user", content: userMessage.content },
    ];

    try {
      const stream = await streamChat(groqMessages, systemPrompt);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        if (value) {
          assistantText += decoder.decode(value, { stream: true });
          setMessages((current) => {
            const previous = current.filter(
              (entry) => entry.role !== "assistant",
            );
            return [...previous, { role: "assistant", content: assistantText }];
          });
        }
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Unable to answer right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, property]);

  return {
    messages,
    loading,
    input,
    setInput,
    sendMessage,
  };
};
