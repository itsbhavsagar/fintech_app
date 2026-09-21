import { useState } from "react";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { transcribeAudio } from "../lib/whisper";

export const useVoiceSearch = () => {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscript("");
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setError("Microphone permission is required.");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      setError("Unable to start recording.");
    }
  };

  const stopRecording = async (): Promise<string> => {
    if (!recorderState.isRecording && !recorder.isRecording) {
      return "";
    }

    try {
      setLoading(true);
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
      const uri = recorder.uri;

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
    }
  };

  return {
    isRecording: recorderState.isRecording || recorder.isRecording,
    transcript,
    loading,
    error,
    startRecording,
    stopRecording,
  };
};
