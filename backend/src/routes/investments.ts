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

router.post("/", async (req, res, next) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(404).json({ error: "User not found." });
    }

    const { propertyId, units, amount } = req.body;

    if (!propertyId || !units || !amount) {
      return res
        .status(400)
        .json({ error: "propertyId, units, and amount are required." });
    }

    const investment = await prisma.investment.create({
      data: {
        userId,
        propertyId,
        units,
        amount,
      },
    });

    await prisma.transaction.create({
      data: {
        userId,
        propertyId,
        type: "investment",
        amount,
      },
    });

    res.status(201).json(investment);
  } catch (error) {
    next(error);
  }
});

export default router;
