import { useEffect, useRef } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChatBubble } from "../src/components/ui/ChatBubble";
import { ChatInput } from "../src/components/ui/ChatInput";
import { AITypingIndicator } from "../src/components/ui/AITypingIndicator";
import { useAssistant } from "../src/hooks/useAssistant";
import { useVoiceSearch } from "../src/hooks/useVoiceSearch";
import { usePortfolio, useProperties } from "../src/hooks/useBackend";

const suggestions = [
  "I have ₹50,000, what should I invest in?",
  "How is my portfolio performing?",
  "What are the safest properties right now?",
  "Explain fractional real estate to me",
];

export default function AssistantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const {
    data: portfolio,
    isLoading: portfolioLoading,
    isError: portfolioError,
  } = usePortfolio();
  const {
    data: properties,
    isLoading: propertiesLoading,
    isError: propertiesError,
  } = useProperties();

  const investments = portfolio?.investments ?? [];
  const propertyData = properties ?? [];
  const isLoading = portfolioLoading || propertiesLoading;

  const { messages, loading, input, setInput, sendMessage } = useAssistant(
    investments,
    propertyData,
  );
  const {
    isRecording,
    transcript,
    loading: voiceLoading,
    startRecording,
    stopRecording,
  } = useVoiceSearch();

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, loading]);

  const handleVoicePress = async () => {
    if (isRecording) {
      await stopRecording();
      if (transcript) setInput(transcript);
      return;
    }
    await startRecording();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-lg font-semibold text-text">
          Loading assistant data...
        </Text>
      </View>
    );
  }

  if (portfolioError || propertiesError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-lg font-semibold text-text">
          Unable to load assistant context
        </Text>
        <Text className="mt-2 text-sm text-textSecondary text-center">
          Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        className="border-b border-border px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
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

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 ? (
          <View className="gap-3">
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
        {loading && (
          <View className="mt-4">
            <AITypingIndicator />
          </View>
        )}
      </ScrollView>

      <ChatInput
        value={input}
        onChangeText={setInput}
        onSend={sendMessage}
        onVoicePress={handleVoicePress}
        isRecording={isRecording}
        disabled={loading || voiceLoading}
      />
    </KeyboardAvoidingView>
  );
}
