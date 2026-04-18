import { Router } from "express";
import { authenticate } from "../middleware/auth";

const router = Router();
const GROQ_CHAT_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_TRANSCRIBE_API_URL = "https://api.groq.com/v1/audio/transcriptions";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const clampNumber = (
  value: unknown,
  min: number,
  max: number,
  fallback: number,
) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, value));
};

const isValidChatMessage = (message: unknown): message is ChatMessage => {
  if (!message || typeof message !== "object") {
    return false;
  }

  const { role, content } = message as Record<string, unknown>;
  return (
    (role === "system" || role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.trim().length > 0
  );
};

const getGroqApiKey = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  return apiKey;
};

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { messages, systemPrompt, maxTokens, temperature, responseFormat } =
      req.body;

    if (typeof systemPrompt !== "string" || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "systemPrompt and messages are required.",
      });
    }

    const safeMessages = messages.filter(isValidChatMessage);
    if (safeMessages.length !== messages.length) {
      return res.status(400).json({
        error: "messages must be valid chat entries.",
      });
    }

    const response = await fetch(GROQ_CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getGroqApiKey()}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
        stream: false,
        max_tokens: clampNumber(maxTokens, 1, 500, 250),
        temperature: clampNumber(temperature, 0, 2, 0.7),
        ...(responseFormat === "json"
          ? { response_format: { type: "json_object" } }
          : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({
        error: `Groq API error: ${errorText}`,
      });
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      return res.status(502).json({ error: "Groq returned an empty response." });
    }

    return res.json({ content });
  } catch (error) {
    next(error);
  }
});

router.post("/transcribe", authenticate, async (req, res, next) => {
  try {
    const { audioBase64, mimeType, filename } = req.body;

    if (typeof audioBase64 !== "string" || audioBase64.trim().length === 0) {
      return res.status(400).json({ error: "audioBase64 is required." });
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");
    const audioBlob = new Blob([audioBuffer], {
      type: typeof mimeType === "string" ? mimeType : "audio/wav",
    });
    const formData = new FormData();

    formData.append(
      "file",
      audioBlob,
      typeof filename === "string" && filename.trim()
        ? filename
        : "audio.wav",
    );
    formData.append("model", "whisper-large-v3-turbo");

    const response = await fetch(GROQ_TRANSCRIBE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getGroqApiKey()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({
        error: `Whisper API error: ${errorText}`,
      });
    }

    const data = (await response.json()) as { text?: string };
    return res.json({ text: data.text ?? "" });
  } catch (error) {
    next(error);
  }
});

export default router;
