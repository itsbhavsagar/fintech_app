import { useCallback, useState } from "react";
import { GroqMessage, streamChat } from "../lib/groq";
import type { Property } from "../types/api";

export type QAEntry = {
  role: "user" | "assistant";
  content: string;
};

export const usePropertyQA = (property: Property) => {
  const [messages, setMessages] = useState<QAEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: QAEntry = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setLoading(true);
    setInput("");

    const systemPrompt = `You are a real estate investment advisor for BrickShare.
Answer questions about this property using only the data provided.
Keep answers under 100 words.
Use plain conversational sentences.
No markdown, no bullet points, no bold text.
Property data: ${JSON.stringify({
      title: property.title,
      location: property.location,
      type: property.type,
      expectedReturn: property.expectedReturn,
      occupancy: property.occupancy,
      tenants: property.tenants,
      leaseTerm: property.leaseTerm,
      riskLevel: property.riskLevel,
      minimumInvestment: property.minimumInvestment,
      highlights: property.highlights,
      description: property.description,
    })}`;

    const groqMessages: GroqMessage[] = [
      {
        role: "user",
        content: userMessage.content,
      },
    ];

    try {
      await streamChat(
        groqMessages,
        systemPrompt,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
            return updated;
          });
        },
        () => {
          setLoading(false);
        },
      );
    } catch (error) {
      console.error("usePropertyQA error", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: "Something went wrong. Please try again.",
        };
        return updated;
      });
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
