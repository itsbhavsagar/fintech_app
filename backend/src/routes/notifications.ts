import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  formatNotificationDate,
  normalizeTransactionType,
} from "../lib/transactions";
import prisma from "../prisma";

const router = Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const [transactions, watchlist] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { property: true },
      }),
      prisma.watchlist.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 2,
        include: { property: true },
      }),
    ]);

    const notifications = [
      ...transactions.map((transaction) => ({
        id: `transaction-${transaction.id}`,
        title: (() => {
          const transactionType = normalizeTransactionType(transaction.type);
          if (transactionType === "Investment") {
            return "Investment completed";
          }
          if (transactionType === "Return") {
            return "Return received";
          }
          return "Withdrawal processed";
        })(),
        description: transaction.property
          ? `${normalizeTransactionType(transaction.type)} of ₹${transaction.amount.toLocaleString("en-IN")} for ${transaction.property.title}`
          : `${normalizeTransactionType(transaction.type)} of ₹${transaction.amount.toLocaleString("en-IN")}`,
        type: (() => {
          const transactionType = normalizeTransactionType(transaction.type);
          if (transactionType === "Investment") {
            return "investment";
          }
          if (transactionType === "Return") {
            return "returns";
          }
          return "withdrawal";
        })(),
        date: formatNotificationDate(transaction.createdAt),
        unread: normalizeTransactionType(transaction.type) !== "Return",
      })),
      ...watchlist.map((item) => ({
        id: `watchlist-${item.id}`,
        title: `Watchlist update: ${item.property.title}`,
        description: `This property is trending and may have limited availability.`,
        type: "property",
        date: formatNotificationDate(item.createdAt),
        unread: true,
      })),
    ];

    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

export default router;
