export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_GROQ_API_KEY");
  }

  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");
  formData.append("model", "whisper-large-v3-turbo");

  const response = await fetch("https://api.groq.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Whisper API error: ${errorText}`);
  }

  const data = await response.json();
  return data?.text ?? "";
};
