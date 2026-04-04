import { View, Text } from "react-native";

export type ChatBubbleProps = {
  message: string;
  role: "user" | "assistant";
  timestamp?: string;
};

export const ChatBubble = ({ message, role, timestamp }: ChatBubbleProps) => {
  const isUser = role === "user";
  const containerClass = isUser
    ? "items-end self-end"
    : "items-start self-start";
  const bubbleClass = isUser
    ? "bg-primary rounded-3xl rounded-br-none px-4 py-3"
    : "bg-surface rounded-3xl rounded-bl-none px-4 py-3";
  const textClass = isUser ? "text-white text-base" : "text-text text-base";

  return (
    <View className={`mb-4 w-full ${containerClass}`}>
      {!isUser ? (
        <View className="mb-2 h-9 w-9 items-center justify-center rounded-full bg-surface border border-border">
          <Text className="text-base font-bold text-primary">B</Text>
        </View>
      ) : null}
      <View className={bubbleClass}>
        <Text className={textClass}>{message}</Text>
      </View>
      {timestamp ? (
        <Text className="mt-2 text-xs text-textSecondary">{timestamp}</Text>
      ) : null}
    </View>
  );
};
