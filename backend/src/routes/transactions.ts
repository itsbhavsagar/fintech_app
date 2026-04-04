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

router.get("/", async (req, res, next) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(404).json({ error: "User not found." });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { property: true },
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

export default router;
