import { useEffect } from "react";
import { View } from "react-native";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const dotStyle = (delay: number) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withDelay(delay, withTiming(1, { duration: 600 })),
      -1,
      true,
    );
  }, [delay, progress]);

  return useAnimatedStyle(() => ({
    opacity: progress.value === 0 ? 0.4 : 1,
    transform: [{ scale: progress.value === 0 ? 0.9 : 1 }],
  }));
};

export const AITypingIndicator = () => {
  const style1 = dotStyle(0);
  const style2 = dotStyle(150);
  const style3 = dotStyle(300);

  return (
    <View className="flex-row items-center rounded-full bg-surface px-4 py-3">
      <Reanimated.View
        className="mr-2 h-2.5 w-2.5 rounded-full bg-primary"
        style={style1}
      />
      <Reanimated.View
        className="mr-2 h-2.5 w-2.5 rounded-full bg-primary"
        style={style2}
      />
      <Reanimated.View
        className="h-2.5 w-2.5 rounded-full bg-primary"
        style={style3}
      />
    </View>
  );
};
