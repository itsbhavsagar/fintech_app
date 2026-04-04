import { useEffect } from "react";
import { Pressable, TextInput, View } from "react-native";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

export type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onVoicePress: () => void;
  isRecording?: boolean;
  disabled?: boolean;
};

export const ChatInput = ({
  value,
  onChangeText,
  onSend,
  onVoicePress,
  isRecording = false,
  disabled = false,
}: ChatInputProps) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(isRecording ? 1.05 : 1, { duration: 600 }),
      isRecording ? -1 : 1,
      true,
    );
  }, [isRecording, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const canSend = Boolean(value.trim()) && !disabled;

  return (
    <View className="flex-row items-center gap-3 bg-white px-4 py-3 border-t border-border">
      <View className="flex-1 rounded-2xl border border-border bg-surface px-4">
        <TextInput
          className="h-12 text-base text-text"
          placeholder="Ask a question..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="send"
          onSubmitEditing={() => {
            if (canSend) onSend();
          }}
          editable={!disabled}
        />
      </View>
      <Pressable
        onPress={onVoicePress}
        className="items-center justify-center rounded-full bg-surface border border-border h-12 w-12"
      >
        <Reanimated.View
          style={pulseStyle}
          className="items-center justify-center"
        >
          <Ionicons
            name={isRecording ? "mic" : "mic-outline"}
            size={22}
            color="#4F46E5"
          />
        </Reanimated.View>
      </Pressable>
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        className={`items-center justify-center rounded-full h-12 w-12 ${canSend ? "bg-primary" : "bg-border"}`}
      >
        <Ionicons
          name="send"
          size={20}
          color={canSend ? "#FFFFFF" : "#9CA3AF"}
        />
      </Pressable>
    </View>
  );
};
