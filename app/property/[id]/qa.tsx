import { useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChatBubble } from "../../../src/components/ui/ChatBubble";
import { ChatInput } from "../../../src/components/ui/ChatInput";
import { AITypingIndicator } from "../../../src/components/ui/AITypingIndicator";
import { usePropertyQA } from "../../../src/hooks/usePropertyQA";
import { useVoiceSearch } from "../../../src/hooks/useVoiceSearch";
import { useProperty } from "../../../src/hooks/useBackend";
import type { Property } from "../../../src/types/api";

const SUGGESTED_QUESTIONS = [
  "Is this good for long term?",
  "What are the risks?",
  "Tell me about the tenants",
  "How does this compare to FD returns?",
];

export default function PropertyQA() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const id = typeof params.id === "string" ? params.id : "";
  const { data: property, isLoading, isError, error } = useProperty(id);
  const propertyForQA = property ?? ({} as Property);

  const { messages, loading, input, setInput, sendMessage } =
    usePropertyQA(propertyForQA);

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

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg font-semibold text-text">
          Loading property assistant...
        </Text>
      </View>
    );
  }

  if (isError || !property) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-base font-semibold text-text">
          Property not found.
        </Text>
        <Text className="mt-2 text-sm text-textSecondary text-center">
          {(error as Error)?.message ?? "Please try again later."}
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
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-9 w-9 items-center justify-center rounded-full bg-surface border border-border"
          >
            <Ionicons name="arrow-back" size={18} color="#111827" />
          </Pressable>

          <View className="flex-1">
            <Text
              className="text-base font-semibold text-text"
              numberOfLines={1}
            >
              {property.title}
            </Text>
            <Text className="text-xs text-textSecondary">
              AI Property Assistant
            </Text>
          </View>

          <View className="h-9 w-9 items-center justify-center rounded-full bg-primaryLight">
            <Ionicons name="chatbubbles" size={16} color="#4F46E5" />
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingVertical: 16,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 && (
          <View className="flex-1 justify-end pb-4">
            <Text className="mb-4 text-sm font-medium text-textSecondary">
              Suggested questions
            </Text>
            <View className="gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <Pressable
                  key={question}
                  onPress={() => handleSuggestion(question)}
                  className="rounded-2xl border border-border bg-surface px-4 py-3"
                >
                  <Text className="text-sm text-text">{question}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {messages.map((message, index) => (
          <ChatBubble
            key={`${message.role}-${index}`}
            role={message.role}
            message={message.content}
          />
        ))}

        {loading && (
          <View className="mt-2 mb-2">
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
