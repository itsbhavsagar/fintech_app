import { useCallback, useState } from "react";
import { streamChat } from "../lib/groq";
import type { Property } from "../constants/mockData";

export const usePropertySummary = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateSummary = useCallback(
    async (property: Property) => {
      // Lock — once generated, never regenerate
      // until user navigates away and comes back
      if (generated || loading) return;

      setLoading(true);
      setSummary("");

      const systemPrompt = `You are a senior real estate investment advisor for BrickShare.
Write a concise investment summary for this property.
Cover: expected returns, risk level, tenant quality, location advantage.
Write in plain English. No markdown. No bullet points. No bold text.
Maximum 80 words. Sound like a trusted advisor, not a report.`;

      const userPrompt = `Summarise this property for an investor:
Title: ${property.title}
Location: ${property.location}, ${property.city}
Type: ${property.type}
Expected Return: ${property.expectedReturn}
Occupancy: ${property.occupancy}%
Risk Level: ${property.riskLevel}
Tenants: ${property.tenants.join(", ")}
Lease Term: ${property.leaseTerm}
Highlights: ${property.highlights.join(", ")}`;

      try {
        await streamChat(
          [{ role: "user", content: userPrompt }],
          systemPrompt,
          // onChunk — append streaming text
          (chunk) => {
            setSummary((prev) => (prev ?? "") + chunk);
          },
          // onDone
          () => {
            setLoading(false);
            setGenerated(true);
          },
        );
      } catch (error) {
        console.error("usePropertySummary error", error);
        setSummary(
          "Unable to generate summary at this time. Please try again.",
        );
        setLoading(false);
      }
    },
    [generated, loading],
  );

  return {
    summary,
    loading,
    generated,
    generateSummary,
  };
};
