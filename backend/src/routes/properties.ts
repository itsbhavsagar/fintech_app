import { Router } from "express";
import { demoProperties, getDemoPropertyById, handleOrFallback } from "../demo";
import prisma from "../prisma";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(properties);
  } catch (error) {
    handleOrFallback(error, next, () => {
      res.json(demoProperties);
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: { chunks: true },
    });
    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }
    res.json(property);
  } catch (error) {
    handleOrFallback(error, next, () => {
      const property = getDemoPropertyById(req.params.id);
      if (!property) {
        res.status(404).json({ error: "Property not found." });
        return;
      }

      res.json({ ...property, chunks: [] });
    });
  }
});

export default router;
