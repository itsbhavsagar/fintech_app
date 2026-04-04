import { useEffect } from "react";
import { View } from "react-native";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className={className ?? "h-4 w-full rounded-2xl bg-surface"}>
      <Reanimated.View
        className="h-full w-full rounded-2xl bg-surfaceRaised"
        style={animatedStyle}
      />
    </View>
  );
};
