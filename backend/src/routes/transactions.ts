import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { formatTransaction } from "../lib/transactions";
import prisma from "../prisma";

const router = Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { property: true },
    });

    res.json(transactions.map(formatTransaction));
  } catch (error) {
    next(error);
  }
});

export default router;
