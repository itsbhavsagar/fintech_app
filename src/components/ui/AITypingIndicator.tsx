import { useEffect } from "react";
import { View } from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type TypingDotProps = {
  delay: number;
};

const TypingDot = ({ delay }: TypingDotProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withDelay(delay, withTiming(1, { duration: 600 })),
      -1,
      true,
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value === 0 ? 0.4 : 1,
    transform: [{ scale: progress.value === 0 ? 0.9 : 1 }],
  }));

  return (
    <Reanimated.View
      className="h-2.5 w-2.5 rounded-full bg-primary"
      style={animatedStyle}
    />
  );
};

export const AITypingIndicator = () => {
  return (
    <View className="flex-row items-center gap-2 rounded-full bg-surface px-4 py-3">
      <TypingDot delay={0} />
      <TypingDot delay={150} />
      <TypingDot delay={300} />
    </View>
  );
};
