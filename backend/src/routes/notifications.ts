import { Router } from "express";
import prisma from "../prisma";

const router = Router();

const resolveUserId = async (req: any) => {
  if (req.user?.id) return req.user.id;
  if (req.query.userId) return String(req.query.userId);
  const demoUser = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
  });
  return demoUser?.id ?? null;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

router.get("/", async (req, res, next) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(404).json({ error: "User not found." });
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
        id: transaction.id,
        title:
          transaction.type === "Investment"
            ? `Investment completed`
            : transaction.type === "Return"
              ? `Return received`
              : "Withdrawal processed",
        description: transaction.property
          ? `${transaction.type} of ₹${transaction.amount.toLocaleString("en-IN")} for ${transaction.property.title}`
          : `${transaction.type} of ₹${transaction.amount.toLocaleString("en-IN")}`,
        type:
          transaction.type === "Investment"
            ? "investment"
            : transaction.type === "Return"
              ? "returns"
              : "price",
        date: formatDate(transaction.createdAt),
        unread: transaction.type !== "Return",
      })),
      ...watchlist.map((item) => ({
        id: `watchlist-${item.id}`,
        title: `Watchlist update: ${item.property.title}`,
        description: `This property is trending and may have limited availability.`,
        type: "property",
        date: formatDate(item.createdAt),
        unread: true,
      })),
    ];

    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

export default router;
