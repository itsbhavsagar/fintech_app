import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const {
      q = "",
      type = "All",
      city = "All",
      returns = "Any",
      page = "1",
      limit = "10",
    } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const where: any = {};

    if (type !== "All") {
      where.type = type;
    }

    if (city !== "All") {
      where.city = city;
    }

    if (q) {
      const searchString = String(q).trim();
      where.OR = [
        { title: { contains: searchString, mode: "insensitive" } },
        { location: { contains: searchString, mode: "insensitive" } },
        { city: { contains: searchString, mode: "insensitive" } },
        { type: { contains: searchString, mode: "insensitive" } },
      ];
    }

    // Fetch from DB
    let properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (returns !== "Any") {
      properties = properties.filter((property) => {
        const returnsValue = Number(property.expectedReturn.replace("%", ""));
        if (returns === "8%+") return returnsValue >= 8;
        if (returns === "10%+") return returnsValue >= 10;
        if (returns === "12%+") return returnsValue >= 12;
        return true;
      });
    }

    const total = properties.length;
    const paginatedProperties = properties.slice(skip, skip + limitNumber);
    const hasNextPage = skip + limitNumber < total;

    res.json({
      data: paginatedProperties,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      total,
    });
  } catch (error) {
    next(error);
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
    next(error);
  }
});

export default router;
