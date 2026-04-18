import { Router } from "express";
import { authenticate } from "../middleware/auth";
import prisma from "../prisma";

const router = Router();

router.get("/:sessionId", authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { sessionId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        sessionId,
        session: {
          userId,
        },
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

export default router;
