import { Router } from "express";
import { authenticate } from "../middleware/auth";
import prisma from "../prisma";

const router = Router();

router.post("/", authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { propertyId, units, amount } = req.body;

    if (!propertyId || !units || !amount) {
      return res
        .status(400)
        .json({ error: "propertyId, units, and amount are required." });
    }

    if (typeof units !== "number" || typeof amount !== "number") {
      return res
        .status(400)
        .json({ error: "units and amount must be numbers." });
    }

    if (units <= 0 || amount <= 0) {
      return res
        .status(400)
        .json({ error: "units and amount must be greater than zero." });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, minimumInvestment: true },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }

    const expectedAmount = units * property.minimumInvestment;
    if (amount !== expectedAmount) {
      return res.status(400).json({
        error: `Amount must match ${units} units at ₹${property.minimumInvestment.toLocaleString("en-IN")} each.`,
      });
    }

    const investment = await prisma.investment.create({
      data: {
        userId,
        propertyId,
        units,
        amount,
        currentValue: amount,
        returnPercent: "0.0%",
      },
    });

    await prisma.transaction.create({
      data: {
        userId,
        propertyId,
        type: "Investment",
        amount,
      },
    });

    res.status(201).json(investment);
  } catch (error) {
    next(error);
  }
});

export default router;
