import { Router } from "express";
import { authenticate } from "../middleware/auth";
import prisma from "../prisma";

const router = Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized." });
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
      currentValue:
        investment.currentValue > 0 ? investment.currentValue : investment.amount,
      returnPercent:
        investment.returnPercent && investment.returnPercent !== "0%"
          ? investment.returnPercent
          : "0.0%",
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
