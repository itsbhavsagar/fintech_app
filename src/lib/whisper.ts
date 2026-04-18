import { getToken } from "./auth";
import { getApiUrl } from "./env";

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Unable to read audio file."));
    };

    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to encode audio file."));
        return;
      }

      const [, base64 = ""] = reader.result.split(",", 2);
      resolve(base64);
    };

    reader.readAsDataURL(blob);
  });

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const token = await getToken();
  if (!token) {
    throw new Error("You must be logged in to use voice search.");
  }

  const response = await fetch(`${getApiUrl()}/api/chat/transcribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      audioBase64: await blobToBase64(audioBlob),
      mimeType: audioBlob.type || "audio/wav",
      filename: "audio.wav",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Voice transcription failed: ${errorText}`);
  }

  const data = (await response.json()) as { text?: string };
  return data.text ?? "";
};
