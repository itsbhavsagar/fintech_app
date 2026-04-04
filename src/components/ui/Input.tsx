import { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

export type InputProps = TextInputProps & {
  label?: string;
  errorMessage?: string;
  rightElement?: React.ReactNode;
  className?: string;
};

export const Input = ({
  label,
  errorMessage,
  rightElement,
  className,
  onFocus,
  onBlur,
  ...rest
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = (event: any) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: any) => {
    setFocused(false);
    onBlur?.(event);
  };

  const borderClass = errorMessage
    ? "border-error"
    : focused
      ? "border-primary"
      : "border-border";

  return (
    <View className={className ?? "w-full"}>
      {label ? (
        <Text className="mb-2 text-sm font-semibold text-textSecondary">
          {label}
        </Text>
      ) : null}
      <View
        className={`flex-row items-center rounded-2xl border ${borderClass} bg-white px-4 py-3`}
      >
        <TextInput
          className="flex-1 text-base text-text"
          placeholderTextColor="#9CA3AF"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {rightElement ? <View className="ml-2">{rightElement}</View> : null}
      </View>
      {errorMessage ? (
        <Text className="mt-2 text-sm text-error">{errorMessage}</Text>
      ) : null}
    </View>
  );
};
