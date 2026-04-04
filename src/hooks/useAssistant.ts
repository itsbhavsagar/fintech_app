import { useCallback, useState } from "react";
import { GroqMessage, streamChat } from "../lib/groq";
import type { PortfolioInvestment, Property } from "../constants/mockData";

export type AssistantEntry = {
  role: "user" | "assistant";
  content: string;
};

export const useAssistant = (
  portfolio: PortfolioInvestment[],
  properties: Property[],
) => {
  const [messages, setMessages] = useState<AssistantEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const sendMessage = useCallback(async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage: AssistantEntry = { role: "user", content: input.trim() };
    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    setInput("");

    const systemPrompt = `You are a real estate investment advisor for BrickShare. Use the following user portfolio and available properties to answer the question: Portfolio ${JSON.stringify(
      portfolio,
    )}; Properties ${JSON.stringify(properties)}`;

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
          content:
            "I am unable to respond right now. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, portfolio, properties]);

  return {
    messages,
    loading,
    input,
    setInput,
    sendMessage,
  };
};
