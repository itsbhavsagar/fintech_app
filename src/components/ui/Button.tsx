import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary rounded-2xl",
  secondary: "bg-surface border border-border rounded-2xl",
  ghost: "bg-transparent",
  destructive: "bg-error rounded-2xl",
};

const textStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-primary",
  ghost: "text-primary",
  destructive: "text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2",
  md: "px-5 py-3",
  lg: "px-6 py-4",
};

export type ButtonProps = Omit<PressableProps, "style" | "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  className,
  onPress,
  ...rest
}: ButtonProps) => {
  const pressedScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressedScale.value }],
  }));

  const handlePressIn = () => {
    pressedScale.value = withSpring(0.97, { stiffness: 300, damping: 20 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    pressedScale.value = withSpring(1, { stiffness: 300, damping: 20 });
  };

  const buttonClasses = [
    `${variantStyles[variant]}`,
    `${sizeStyles[size]}`,
    "items-center justify-center",
    disabled || loading ? "opacity-60" : "opacity-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textClass = [
    textStyles[variant],
    "font-semibold",
    size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg",
  ].join(" ");

  const indicatorColor =
    variant === "primary" || variant === "destructive" ? "#FFFFFF" : "#4F46E5";

  return (
    <Reanimated.View style={animatedStyle}>
      <Pressable
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        className={buttonClasses}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={indicatorColor} />
        ) : (
          <Text className={textClass}>{children}</Text>
        )}
      </Pressable>
    </Reanimated.View>
  );
};
