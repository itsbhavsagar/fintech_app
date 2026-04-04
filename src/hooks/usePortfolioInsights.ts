import { useCallback, useState } from "react";
import { GroqMessage, streamChat } from "../lib/groq";
import type { PortfolioInvestment } from "../constants/mockData";

export const usePortfolioInsights = (portfolio: PortfolioInvestment[]) => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);

  const generateInsights = useCallback(async () => {
    setLoading(true);
    setInsights("");

    const systemPrompt = `You are a real estate investment advisor for BrickShare. Provide portfolio insights, diversification advice, and suggestions based on the portfolio holdings.`;
    const userPrompt = `Portfolio investments: ${JSON.stringify(portfolio)}`;

    const groqMessages: GroqMessage[] = [{ role: "user", content: userPrompt }];

    try {
      const stream = await streamChat(groqMessages, systemPrompt);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let insightText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        if (value) {
          insightText += decoder.decode(value, { stream: true });
          setInsights(insightText);
        }
      }
    } catch (error) {
      setInsights("Unable to generate portfolio insights at this time.");
    } finally {
      setLoading(false);
    }
  }, [portfolio]);

  return {
    insights,
    loading,
    generateInsights,
  };
};
