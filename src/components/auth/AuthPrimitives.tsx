import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  PressableProps,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type AuthShellProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
  },
  android: {
    elevation: 4,
  },
  default: {},
});

export function AuthShell({
  eyebrow = "BrickShare",
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  const { width, height } = useWindowDimensions();
  const compact = height < 720;
  const contentWidth = Math.min(width - 32, 440);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: compact ? "flex-start" : "center",
            paddingHorizontal: 16,
            paddingVertical: compact ? 16 : 28,
          }}
        >
          <View style={{ width: contentWidth }} className="gap-y-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-x-3">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary">
                  <Ionicons name="business" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-text">
                    BrickShare
                  </Text>
                  <Text className="text-xs font-medium text-textSecondary">
                    Real estate investing
                  </Text>
                </View>
              </View>

              <View className="rounded-full bg-successLight px-3 py-1.5">
                <Text className="text-xs font-semibold text-success">
                  Secure
                </Text>
              </View>
            </View>

            <View
              className="rounded-3xl border border-border bg-white px-5 py-6"
              style={shadowStyle}
            >
              <Text className="mb-3 text-xs font-bold uppercase text-primary">
                {eyebrow}
              </Text>
              <Text
                className="text-3xl font-semibold text-text"
                numberOfLines={2}
              >
                {title}
              </Text>
              <Text className="mt-2 text-base leading-6 text-textSecondary">
                {subtitle}
              </Text>

              <View className="mt-6">{children}</View>
            </View>

            {footer ? <View>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export type AuthFieldProps = TextInputProps & {
  label: string;
  icon: IoniconName;
  errorMessage?: string;
  rightElement?: React.ReactNode;
};

export function AuthField({
  label,
  icon,
  errorMessage,
  rightElement,
  onFocus,
  onBlur,
  ...rest
}: AuthFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = errorMessage
    ? "border-error"
    : focused
      ? "border-primary"
      : "border-border";

  return (
    <View className="w-full">
      <Text className="mb-2 text-sm font-semibold text-text">{label}</Text>
      <View
        className={`h-14 flex-row items-center rounded-2xl border ${borderColor} bg-surface px-4`}
      >
        <Ionicons
          name={icon}
          size={19}
          color={focused ? "#4F46E5" : "#6B7280"}
        />
        <TextInput
          className="ml-3 flex-1 text-base text-text"
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
        {rightElement ? <View className="ml-2">{rightElement}</View> : null}
      </View>
      {errorMessage ? (
        <Text className="mt-2 text-sm text-error">{errorMessage}</Text>
      ) : null}
    </View>
  );
}

export function AuthErrorBanner({ message }: { message: string }) {
  return (
    <View className="flex-row items-start rounded-2xl bg-errorLight px-4 py-3">
      <Ionicons name="alert-circle" size={18} color="#EF4444" />
      <Text className="ml-2 flex-1 text-sm font-medium leading-5 text-error">
        {message}
      </Text>
    </View>
  );
}

type AuthSecondaryButtonProps = PressableProps & {
  icon: IoniconName;
  label: string;
  className?: string;
};

export function AuthSecondaryButton({
  icon,
  label,
  className,
  ...rest
}: AuthSecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`h-12 flex-1 flex-row items-center justify-center rounded-2xl border border-border bg-white px-3 ${className ?? ""}`}
      {...rest}
    >
      <Ionicons name={icon} size={18} color="#111827" />
      <Text className="ml-2 text-sm font-semibold text-text" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <View className="my-5 flex-row items-center">
      <View className="h-px flex-1 bg-border" />
      <Text className="mx-3 text-xs font-semibold text-textMuted">
        {label}
      </Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}

type AuthStrengthMeterProps = {
  score: 0 | 1 | 2 | 3;
  label: string;
  helper: string;
};

const strengthColors = [
  "bg-border",
  "bg-error",
  "bg-warning",
  "bg-success",
] as const;

const strengthTextColors = [
  "text-textMuted",
  "text-error",
  "text-warning",
  "text-success",
] as const;

export function AuthStrengthMeter({
  score,
  label,
  helper,
}: AuthStrengthMeterProps) {
  return (
    <View className="rounded-2xl bg-surface px-4 py-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-textSecondary">
          Password strength
        </Text>
        <Text className={`text-xs font-bold ${strengthTextColors[score]}`}>
          {label}
        </Text>
      </View>

      <View className="flex-row gap-x-2">
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            className={`h-1.5 flex-1 rounded-full ${
              index < score ? strengthColors[score] : "bg-border"
            }`}
          />
        ))}
      </View>

      <Text className="mt-2 text-xs leading-5 text-textSecondary">
        {helper}
      </Text>
    </View>
  );
}
