import { useCallback, useState } from "react";
import type { Property } from "../constants/mockData";

export type PropertySummary = {
  overview: string;
  returnAnalysis: string;
  riskAssessment: string;
  locationInsight: string;
};

export const usePropertySummary = () => {
  const [summary, setSummary] = useState<PropertySummary | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSummary = useCallback(async (property: Property) => {
    setLoading(true);
    setSummary(null);

    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
    }

    const systemPrompt = `You are a real estate investment advisor for BrickShare. Provide a concise property summary covering returns analysis, risk, location insight, and tenant quality.`;
    const userPrompt = `Property data: ${JSON.stringify(property)}`;

    try {
      const response = await fetch("https://api.groq.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${errorText}`);
      }

      const result = await response.json();
      const content = result?.choices?.[0]?.message?.content ?? "";

      setSummary({
        overview: content,
        returnAnalysis: content,
        riskAssessment: content,
        locationInsight: content,
      });
    } catch (error) {
      setSummary({
        overview: "Unable to generate summary at this time.",
        returnAnalysis: "Unable to generate summary at this time.",
        riskAssessment: "Unable to generate summary at this time.",
        locationInsight: "Unable to generate summary at this time.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    summary,
    loading,
    generateSummary,
  };
};
