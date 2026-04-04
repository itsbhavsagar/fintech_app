import { Router } from "express";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, async (req, res) => {
  const { propertyId, sessionType, prompt } = req.body;
  return res.json({
    message: "Chat endpoint placeholder",
    propertyId,
    sessionType,
    prompt,
  });
});

export default router;
