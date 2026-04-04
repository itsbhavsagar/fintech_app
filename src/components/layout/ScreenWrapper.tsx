import { ReactNode } from "react";
import { ScrollView, View } from "react-native";

export type ScreenWrapperProps = {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  contentContainerClassName?: string;
};

export const ScreenWrapper = ({
  children,
  className,
  scrollable = false,
  contentContainerClassName,
}: ScreenWrapperProps) => {
  if (scrollable) {
    return (
      <View className={`flex-1 bg-background ${className ?? ""}`}>
        <ScrollView
          className="flex-1"
          contentContainerClassName={`px-4 py-4 pb-0 ${contentContainerClassName ?? ""}`}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={`flex-1 bg-background ${className ?? ""}`}>
      <View className="flex-1 px-4 py-4">{children}</View>
    </View>
  );
};
