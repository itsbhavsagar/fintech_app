import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  onBackPress?: () => void;
};

export const Header = ({
  title,
  subtitle,
  rightElement,
  onBackPress,
}: HeaderProps) => (
  <View className="mb-6 flex-row items-center justify-between">
    <View className="flex-1">
      <Text className="text-2xl font-semibold text-text">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-sm text-textSecondary">{subtitle}</Text>
      ) : null}
    </View>
    {rightElement ? <View>{rightElement}</View> : null}
  </View>
);
