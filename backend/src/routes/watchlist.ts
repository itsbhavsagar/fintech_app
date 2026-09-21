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

    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      include: { property: true },
    });

    res.json(watchlist);
  } catch (error) {
    next(error);
  }
});

router.post("/:propertyId", authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { propertyId } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }

    const watchlistEntry = await prisma.watchlist.upsert({
      where: { userId_propertyId: { userId, propertyId } },
      create: { userId, propertyId },
      update: {},
    });

    res.status(201).json(watchlistEntry);
  } catch (error) {
    next(error);
  }
});

router.delete("/:propertyId", authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { propertyId } = req.params;
    await prisma.watchlist.deleteMany({ where: { userId, propertyId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
