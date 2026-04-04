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

    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      include: { property: true },
    });

    res.json(watchlist);
  } catch (error) {
    next(error);
  }
});

router.post("/:propertyId", async (req, res, next) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(404).json({ error: "User not found." });
    }

    const { propertyId } = req.params;
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

router.delete("/:propertyId", async (req, res, next) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(404).json({ error: "User not found." });
    }

    const { propertyId } = req.params;
    await prisma.watchlist.deleteMany({ where: { userId, propertyId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
