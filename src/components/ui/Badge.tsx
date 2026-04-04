import { Text } from "react-native";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "gold";
export type BadgeSize = "sm" | "md";

const badgeClasses: Record<BadgeVariant, string> = {
  success: "bg-successLight text-success",
  warning: "bg-warningLight text-warning",
  error: "bg-errorLight text-error",
  info: "bg-surface text-textSecondary",
  gold: "bg-goldLight text-gold",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

export type BadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  label: string;
  className?: string;
};

export const Badge = ({
  variant = "info",
  size = "md",
  label,
  className,
}: BadgeProps) => {
  const classes = [
    `rounded-full font-semibold`,
    badgeClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Text className={classes}>{label}</Text>;
};
