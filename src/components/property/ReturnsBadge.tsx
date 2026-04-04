import { Text } from "react-native";

export type ReturnsBadgeProps = {
  value: string;
  className?: string;
};

export const ReturnsBadge = ({ value, className }: ReturnsBadgeProps) => {
  const classes = [`rounded-full bg-goldLight px-3 py-1`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Text className={`${classes} text-sm font-semibold text-gold`}>
      {value} p.a.
    </Text>
  );
};
