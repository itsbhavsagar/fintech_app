import { useState } from "react";
import { streamChat, GroqMessage } from "../lib/groq";
import type { PortfolioInvestment, Property } from "../types/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function useAssistant(
  portfolio: PortfolioInvestment[],
  properties: Property[],
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const systemPrompt = `You are BrickShare's investment assistant.
Help users make smart fractional real estate investment decisions.

User Portfolio:
${JSON.stringify(portfolio, null, 2)}

Available Properties:
${JSON.stringify(
  properties.map((p) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    type: p.type,
    expectedReturn: p.expectedReturn,
    riskLevel: p.riskLevel,
    minimumInvestment: p.minimumInvestment,
    occupancy: p.occupancy,
  })),
  null,
  2,
)}

Answer clearly and concisely. Use INR formatting.
If asked about portfolio performance — analyse the mock data above.
Keep responses under 150 words.`;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const groqMessages: GroqMessage[] = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

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
      console.error("Assistant sendMessage failed", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    input,
    setInput,
    sendMessage,
  };
}
