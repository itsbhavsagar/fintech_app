import { useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChatBubble } from "../../../src/components/ui/ChatBubble";
import { ChatInput } from "../../../src/components/ui/ChatInput";
import { AITypingIndicator } from "../../../src/components/ui/AITypingIndicator";
import { usePropertyQA } from "../../../src/hooks/usePropertyQA";
import { useVoiceSearch } from "../../../src/hooks/useVoiceSearch";
import { properties } from "../../../src/constants/mockData";

export default function PropertyQA() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const property = useMemo(
    () => properties.find((item) => item.id === params.id),
    [params.id],
  );
  const { messages, loading, input, setInput, sendMessage } = usePropertyQA(
    property ?? properties[0],
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

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-text">Property not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-border px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-text">
              {property.title}
            </Text>
            <Text className="mt-1 text-sm text-textSecondary">
              AI Assistant
            </Text>
          </View>
          <Ionicons name="chatbubbles" size={24} color="#4F46E5" />
        </View>
      </View>
      <View className="flex-1 px-4 py-4">
        {messages.map((message, index) => (
          <ChatBubble
            key={`${message.role}-${index}`}
            role={message.role}
            message={message.content}
          />
        ))}
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
