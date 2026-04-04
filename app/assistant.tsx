import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChatBubble } from "../src/components/ui/ChatBubble";
import { ChatInput } from "../src/components/ui/ChatInput";
import { AITypingIndicator } from "../src/components/ui/AITypingIndicator";
import { useAssistant } from "../src/hooks/useAssistant";
import { useVoiceSearch } from "../src/hooks/useVoiceSearch";
import { portfolioInvestments, properties } from "../src/constants/mockData";

const suggestions = [
  "I have ₹50,000, what should I invest in?",
  "How is my portfolio performing?",
  "What are the safest properties right now?",
  "Explain fractional real estate to me",
];

export default function AssistantScreen() {
  const router = useRouter();
  const { messages, loading, input, setInput, sendMessage } = useAssistant(
    portfolioInvestments,
    properties,
  );
  const {
    isRecording,
    transcript,
    loading: voiceLoading,
    startRecording,
    stopRecording,
  } = useVoiceSearch();

  const handleVoicePress = async () => {
    if (isRecording) {
      await stopRecording();
      if (transcript) {
        setInput(transcript);
      }
      return;
    }
    await startRecording();
  };

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-border px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-text">
              Investment Assistant
            </Text>
            <Text className="mt-1 text-sm text-textSecondary">
              Ask anything about your portfolio and properties.
            </Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="rounded-full bg-primaryLight p-3"
          >
            <Ionicons name="close" size={20} color="#4F46E5" />
          </Pressable>
        </View>
      </View>
      <View className="flex-1 px-4 py-4">
        {messages.length === 0 ? (
          <View className="mb-8 space-y-4">
            {suggestions.map((prompt) => (
              <Pressable
                key={prompt}
                onPress={() => setInput(prompt)}
                className="rounded-3xl border border-border bg-white px-4 py-4"
              >
                <Text className="text-base text-text">{prompt}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          messages.map((message, index) => (
            <ChatBubble
              key={`${message.role}-${index}`}
              role={message.role}
              message={message.content}
            />
          ))
        )}
        {loading ? (
          <View className="mt-4">
            <AITypingIndicator />
          </View>
        ) : null}
      </View>
      <ChatInput
        value={input}
        onChangeText={setInput}
        onSend={sendMessage}
        onVoicePress={handleVoicePress}
        isRecording={isRecording}
        disabled={loading || voiceLoading}
      />
    </View>
  );
}
