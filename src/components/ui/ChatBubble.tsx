import { View, Text } from "react-native";

export type ChatBubbleProps = {
  message: string;
  role: "user" | "assistant";
  timestamp?: string;
};

function parseMarkdown(text: string): { bold: boolean; text: string }[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return { bold: true, text: part.slice(2, -2) };
    }
    return { bold: false, text: part };
  });
}

function RenderLine({ line, isUser }: { line: string; isUser: boolean }) {
  const segments = parseMarkdown(line);
  return (
    <Text
      className={
        isUser
          ? "text-white text-base leading-6"
          : "text-text text-base leading-6"
      }
    >
      {segments.map((seg, i) =>
        seg.bold ? (
          <Text
            key={i}
            className={isUser ? "text-white font-bold" : "text-text font-bold"}
          >
            {seg.text}
          </Text>
        ) : (
          <Text key={i}>{seg.text}</Text>
        ),
      )}
    </Text>
  );
}

export const ChatBubble = ({ message, role, timestamp }: ChatBubbleProps) => {
  const isUser = role === "user";

  const lines = message.split("\n").filter((l) => l.trim() !== "");

  return (
    <View
      className={`mb-4 w-full ${isUser ? "items-end self-end" : "items-start self-start"}`}
    >
      {!isUser && (
        <View className="mb-2 h-9 w-9 items-center justify-center rounded-full bg-primaryLight border border-border">
          <Text className="text-base font-bold text-primary">🤖</Text>
        </View>
      )}

      <View
        className={
          isUser
            ? "bg-primary rounded-3xl rounded-br-none px-4 py-3 max-w-xs"
            : "bg-surface rounded-3xl rounded-bl-none px-4 py-3 max-w-xs border border-border"
        }
      >
        {lines.map((line, index) => {
          const trimmed = line.trim();

          const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numberedMatch) {
            return (
              <View key={index} className="flex-row mb-1" style={{ gap: 6 }}>
                <Text
                  className={
                    isUser
                      ? "text-white text-base font-semibold w-5"
                      : "text-primary text-base font-semibold w-5"
                  }
                >
                  {numberedMatch[1]}.
                </Text>
                <View className="flex-1">
                  <RenderLine line={numberedMatch[2]} isUser={isUser} />
                </View>
              </View>
            );
          }

          const bulletMatch = trimmed.match(/^[-•*]\s+(.*)/);
          if (bulletMatch) {
            return (
              <View key={index} className="flex-row mb-1" style={{ gap: 6 }}>
                <View
                  className={`mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                    isUser ? "bg-white" : "bg-primary"
                  }`}
                />
                <View className="flex-1">
                  <RenderLine line={bulletMatch[1]} isUser={isUser} />
                </View>
              </View>
            );
          }

          const headingMatch = trimmed.match(/^#{1,3}\s+(.*)/);
          if (headingMatch) {
            return (
              <Text
                key={index}
                className={`text-base font-bold mb-1 mt-2 ${
                  isUser ? "text-white" : "text-text"
                }`}
              >
                {headingMatch[1]}
              </Text>
            );
          }

          return (
            <View key={index} className="mb-1">
              <RenderLine line={trimmed} isUser={isUser} />
            </View>
          );
        })}
      </View>

      {timestamp && (
        <Text className="mt-1 text-xs text-textSecondary">{timestamp}</Text>
      )}
    </View>
  );
};
