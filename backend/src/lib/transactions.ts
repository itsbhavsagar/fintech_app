export type NormalizedTransactionType =
  | "Investment"
  | "Return"
  | "Withdrawal";

type PropertyRef = {
  title: string;
} | null;

type TransactionRecord = {
  id: string;
  type: string;
  amount: number;
  createdAt: Date;
  property: PropertyRef;
};

export const normalizeTransactionType = (
  type: string,
): NormalizedTransactionType => {
  switch (type.trim().toLowerCase()) {
    case "return":
    case "returns":
      return "Return";
    case "withdrawal":
    case "withdraw":
      return "Withdrawal";
    case "investment":
    default:
      return "Investment";
  }
};

export const formatTransactionDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatNotificationDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

export const formatTransaction = (transaction: TransactionRecord) => {
  const normalizedType = normalizeTransactionType(transaction.type);

  return {
    id: transaction.id,
    type: normalizedType,
    property: transaction.property?.title ?? "BrickShare",
    amount: transaction.amount,
    date: formatTransactionDate(transaction.createdAt),
    status: "Completed" as const,
  };
};
