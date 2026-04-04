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

    const investments = await prisma.investment.findMany({
      where: { userId },
      include: { property: true },
    });

    const formatted = investments.map((investment) => ({
      id: investment.id,
      propertyId: investment.propertyId,
      title: investment.property.title,
      city: investment.property.city,
      units: investment.units,
      invested: investment.amount,
      currentValue: investment.currentValue,
      returnPercent: investment.returnPercent,
    }));

    const totalInvested = formatted.reduce(
      (sum, investment) => sum + investment.invested,
      0,
    );
    res.json({ investments: formatted, totalInvested });
  } catch (error) {
    next(error);
  }
});

export default router;
