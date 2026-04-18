import { useState } from "react";
import { Audio } from "expo-av";
import { transcribeAudio } from "../lib/whisper";

export const useVoiceSearch = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscript("");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        setError("Microphone permission is required.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch {
      setError("Unable to start recording.");
    }
  };

  const stopRecording = async (): Promise<string> => {
    if (!recording) {
      return "";
    }

    try {
      setLoading(true);
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      const uri = recording.getURI();

      if (!uri) {
        setError("Recording failed to save.");
        return "";
      }

      const response = await fetch(uri);
      const audioBlob = await response.blob();
      const text = await transcribeAudio(audioBlob);
      setTranscript(text);
      return text;
    } catch {
      setError("Unable to transcribe audio.");
      return "";
    } finally {
      setLoading(false);
      setRecording(null);
    }
  };

  return {
    isRecording,
    transcript,
    loading,
    error,
    startRecording,
    stopRecording,
  };
};
