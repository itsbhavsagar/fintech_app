import { useCallback, useState } from "react";
import { GroqMessage, streamChat } from "../lib/groq";
import type { PortfolioInvestment } from "../types/api";

type Insights = {
  insight: string;
  risk: string;
  opportunity: string;
  action: string;
};

export const usePortfolioInsights = (portfolio: PortfolioInvestment[]) => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateInsights = useCallback(async () => {
    if (loading || hasGenerated) return;

    setLoading(true);
    setInsights(null);

    const systemPrompt = `
You are a sharp real estate investment advisor.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- Max 1 sentence per field

Format:
{
  "insight": "...",
  "risk": "...",
  "opportunity": "...",
  "action": "..."
}
`;

    const userPrompt = `Portfolio: ${JSON.stringify(portfolio)}`;

    const groqMessages: GroqMessage[] = [{ role: "user", content: userPrompt }];

    try {
      let fullText = "";

      await streamChat(
        groqMessages,
        systemPrompt,
        (chunk: string) => {
          fullText += chunk;
        },
        () => {
          try {
            const parsed = JSON.parse(fullText.trim());

            setInsights({
              insight: parsed.insight ?? "",
              risk: parsed.risk ?? "",
              opportunity: parsed.opportunity ?? "",
              action: parsed.action ?? "",
            });

            setHasGenerated(true);
          } catch (error) {
            console.error("Insights parse error:", fullText);

            setInsights({
              insight: "Unable to generate insights right now.",
              risk: "",
              opportunity: "",
              action: "",
            });
          }
        },
      );
    } catch (error) {
      console.error("Insights error:", error);

      setInsights({
        insight: "Something went wrong while generating insights.",
        risk: "",
        opportunity: "",
        action: "",
      });
    } finally {
      setLoading(false);
    }
  }, [portfolio, loading, hasGenerated]);

  return {
    insights,
    loading,
    hasGenerated,
    generateInsights,
  };
};
